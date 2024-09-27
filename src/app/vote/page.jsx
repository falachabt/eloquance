"use client";
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input, Button, Card, Modal, message, Result, Progress } from 'antd';
import useSWR, { mutate } from 'swr';
import { supabase } from "@/lib/supabase";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { creerOuRecupererUtilisateur_OTP, verifierOtpEtEnregistrerVote } from "./vote";
import { VotePaymentUpdater } from "./VoteUpdateComp";

// Fetch active step function
const fetchActiveStep = async () => {
  const { data, error } = await supabase
    .from('etapes_concours')
    .select('*')
    .eq('est_active', true)
    .single();
  
  if (error) throw error;
  return data;
};

// Fetch all candidats
const fetchCandidats = async () => {
  const { data, error } = await supabase
    .from('candidats')
    .select('*');
  
  if (error) throw error;
  return data;
};

// Fetch and process votes
const fetchVotes = async (etapeId) => {
  const { data, error } = await supabase
    .from('votes')
    .select('candidat_id')
    .eq('etape_id', etapeId)
    .eq("vote_ok", true)
  
  if (error) throw error;

  const groupedVotes = data.reduce((acc, vote) => {
    acc[vote.candidat_id] = (acc[vote.candidat_id] || 0) + 1;
    return acc;
  }, {});

  const totalVotes = Object.values(groupedVotes).reduce((sum, count) => sum + count, 0);

  const formattedResults = Object.entries(groupedVotes).map(([candidat_id, nb_votes]) => ({
    candidat_id,
    nb_votes,
    percentage: totalVotes > 0 ? (nb_votes / totalVotes) * 100 : 0
  }));

  return { votes: formattedResults, totalVotes };
};

const PageVotesEloquence = () => {
  const [recherche, setRecherche] = useState('');
  const [etapeVote, setEtapeVote] = useState(0);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [candidatSelectionne, setCandidatSelectionne] = useState(null);
  const [etapeStatus, setEtapeStatus] = useState('loading');
  const [tempsRestant, setTempsRestant] = useState(0);
  const [votes, setVotes] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);

  const { data: activeStep, error: activeStepError } = useSWR('etapes_concours_active', fetchActiveStep, {
    refreshInterval: 10000, // Refresh every 10 seconds
    revalidateOnFocus: true,
    dedupingInterval: 2000,
  });

  const { data: candidats, error: candidatsError } = useSWR('candidats', fetchCandidats, {
    refreshInterval: 10000, // Refresh every 10 seconds
    revalidateOnFocus: true,
    dedupingInterval: 2000,
  });

  useEffect(() => {
    const etapesSubscription = supabase
      .channel('etapes_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'etapes_concours' }, () => {
        mutate('etapes_concours_active');
      })
      .subscribe();

    const candidatsSubscription = supabase
      .channel('candidats_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'candidats' }, () => {
        mutate('candidats');
      })
      .subscribe();

    return () => {
      supabase.removeChannel(etapesSubscription);
      supabase.removeChannel(candidatsSubscription);
    };
  }, []);

  useEffect(() => {
    if (activeStep) {
      updateEtapeStatus(activeStep);
      const subscription = subscribeToVotes(activeStep.id);
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [activeStep]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTempsRestant((prevTemps) => (prevTemps > 0 ? prevTemps - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const updateEtapeStatus = (etape) => {
    const now = new Date();
    const debutDate = new Date(etape.date_debut);
    const finDate = new Date(etape.date_fin);

    if (now < debutDate) {
      setEtapeStatus('before');
      setTempsRestant(Math.max(0, (debutDate - now) / 1000));
    } else if (now >= debutDate && now < finDate) {
      setEtapeStatus('during');
      setTempsRestant(Math.max(0, (finDate - now) / 1000));
    } else {
      setEtapeStatus('after');
      setTempsRestant(0);
    }
  };

  const subscribeToVotes = (etapeId) => {
    const subscription = supabase
      .channel(`votes_${etapeId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes', filter: `etape_id=eq.${etapeId}` }, () => {
        refreshVotes(etapeId);
      })
      .subscribe();

    refreshVotes(etapeId);

    return subscription;
  };

  const refreshVotes = async (etapeId) => {
    const { votes, totalVotes } = await fetchVotes(etapeId);
    setVotes(votes);
    setTotalVotes(totalVotes);
    mutate('votes'); // Trigger a re-render of components using the 'votes' key
  };

  const formatTemps = (temps) => {
    const jours = Math.floor(temps / (3600 * 24));
    const heures = Math.floor((temps % (3600 * 24)) / 3600);
    const minutes = Math.floor((temps % 3600) / 60);
    const secondes = Math.floor(temps % 60);
    return `${jours > 0 ? jours + 'j ' : ''}${heures.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${secondes.toString().padStart(2, '0')}s`;
  };

  const renderEtapeStatus = () => {
    switch (etapeStatus) {
      case 'before':
        return (
          <div className="text-center text-2xl font-bold text-primary-900 mb-8">
           {"L'étape commence dans : "} {formatTemps(tempsRestant)}
          </div>
        );
      case 'during':
        return (
          <div className="text-center text-2xl font-bold text-primary-900 mb-8">
            Temps restant : {formatTemps(tempsRestant)}
          </div>
        );
      case 'after':
        return (
          <Result
            status="info"
            title="Cette étape est terminée."
            subTitle="Les votes ne sont plus acceptés pour cette étape."
          />
        );
      default:
        return <div>Chargement...</div>;
    }
  };

  const filtrerCandidats = candidats ? candidats.filter((candidat) =>
    candidat.name.toLowerCase().includes(recherche.toLowerCase())
  ) : [];

  const getVoteInfo = (candidatId) => {
    const candidatVotes = votes.find((vote) => vote.candidat_id === candidatId);
    return candidatVotes || { nb_votes: 0, percentage: 0 };
  };

  const commencerVote = (candidat) => {
    setCandidatSelectionne(candidat);
    setEtapeVote(1);
  };

  const envoyerEmail = async () => {
    if(activeStep?.votes_payants){
      await verifierOtpEtEnregistrerVote(email, code, activeStep?.id, candidatSelectionne?.id, activeStep?.votes_payants, activeStep?.montant_paiement); 
      setEtapeVote(0);
      setEmail('');
      setCode('');
      setCandidatSelectionne(null);
      message.success("Terminez avec le paiement pour que le vote soit valide")
    } else {
      await creerOuRecupererUtilisateur_OTP(email);
      setEtapeVote(2)
    }
  };

  const confirmerVote = async () => {
    try {
      await verifierOtpEtEnregistrerVote(email, code, activeStep?.id, candidatSelectionne?.id, activeStep?.votes_payants, activeStep?.montant_paiement);
      message.success(`Vote confirmé pour ${candidatSelectionne.name}`);
      refreshVotes(activeStep?.id); // Refresh votes after confirming
    } catch (error) {
      message.error(error.message);
    }
    setEtapeVote(0);
    setEmail('');
    setCode('');
    setCandidatSelectionne(null);
  };

  if (activeStepError) return <div> {"Erreur de chargement de l'étape active"} </div>;
  if (candidatsError) return <div>Erreur de chargement des candidats</div>;
  if (!activeStep || !candidats) return <div>Chargement...</div>;

  return (
    <div className='h-full flex flex-col'>
       <VotePaymentUpdater /> 
      <Header />
      <div className="flex-1 bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-6">
            {activeStep ? activeStep.nom : 'Chargement...'}
          </h1>
          {renderEtapeStatus()}
          {etapeStatus === 'during' && activeStep && activeStep.votes_en_ligne ? (
            <>
              <div className="mb-8 relative">
                <Input
                  placeholder="Rechercher un candidat..."
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="w-full rounded-full border border-gray-300"
                  suffix={<Search className="text-gray-400" />}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filtrerCandidats.map((candidat) => {
                  const { nb_votes, percentage } = getVoteInfo(candidat.id);
                  return (
                    <Card key={candidat.id} className="hover:shadow-lg transition-all rounded-lg">
                      <div className="text-xl font-semibold mb-2">{candidat.name}</div>
                      <div className="text-sm text-gray-600 mb-4">{candidat.description}</div>
                      <div className="text-lg font-bold text-primary-500 mb-2">
                        {nb_votes} vote(s)
                      </div>
                      <Progress percent={percentage} showInfo={false} className="mb-2" />
                      <div className="text-sm text-gray-600 mb-4">
                        {percentage.toFixed(2)}% des votes
                      </div>
                      <Button type="primary" onClick={() => commencerVote(candidat)}>
                        Voter
                      </Button>
                    </Card>
                  );
                })}
              </div>
            </>
          ) : (
            <Result
              status="info"
              title="Le vote en ligne n'est pas disponible pour cette étape."
              subTitle="Veuillez attendre la prochaine étape ou voter sur place."
            />
          )}
        </div>
      </div>
      <Footer />
      <Modal
        title="Confirmation du vote"
        visible={etapeVote > 0}
        onCancel={() => setEtapeVote(0)}
        footer={null}
      >
        {etapeVote === 1 && (
          <>
            <p>Entrez votre email pour voter pour <strong>{candidatSelectionne?.name}</strong></p>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Votre email" />
            <Button type="primary" className="mt-4 w-full" onClick={envoyerEmail}>
               { activeStep?.votes_payants ? "Payer le vote  " + activeStep?.montant_paiement + "FCFA" :   "Envoyer OTP"}
            </Button>
          </>
        )}
        {etapeVote === 2 && (
          <>
            <p>Entrez le code OTP reçu par email pour valider votre vote</p>
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code OTP" />
            <Button type="primary" className="mt-4 w-full" onClick={confirmerVote}>
              Confirmer le vote
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default PageVotesEloquence;