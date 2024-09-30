"use client"
import React, { useEffect, useState } from 'react';
import { Table, Select, message, Card, Input, Tag, Row, Col, Typography, Statistic } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import { CheckCircleOutlined, CloseCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Search } = Input;
const { Text } = Typography;

const CandidatesManagement = () => {
  const [candidates, setCandidates] = useState([]);
  const [steps, setSteps] = useState([]);
  const [candidateSteps, setCandidateSteps] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [votes, setVotes] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchCandidates();
    fetchSteps();
    fetchCandidateSteps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const step = searchParams?.get("step")
    if (step) {
      setSelectedStep(parseInt(step));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.get("step")]);

  useEffect(() => {
    fetchVotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStep]);

  const fetchCandidates = async () => {
    const { data, error } = await supabase.from('candidats').select('*');
    if (error) {
      console.error(error);
      return;
    }
    setCandidates(data);
  };

  const fetchSteps = async () => {
    const { data, error } = await supabase
      .from('etapes_concours')
      .select('*')
      .order('ordre', { ascending: true });
    if (error) {
      console.error(error);
      return;
    }
    setSteps(data);
  };

  const fetchCandidateSteps = async () => {
    const { data, error } = await supabase.from('candidats_etapes').select('*');
    if (error) {
      console.error(error);
      return;
    }
    setCandidateSteps(data);
  };

  const fetchVotes = async () => {
    const stepToFetch = selectedStep || getActiveStep()?.id;
    if (!stepToFetch) return;

    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('etape_id', stepToFetch);

    if (error) {
      console.error(error);
      return;
    }
    setVotes(data);
  };

  const handleStepChange = (value) => {
    setSelectedStep(value);
    router.push(`?step=${value}`, { scroll: false });
  };

  const getActiveStep = () => {
    return steps.find(step => step.est_active);
  };

  const getCandidateStatus = (candidateId, stepId) => {
    const status = candidateSteps.find(
      (cs) => cs.candidat_id === candidateId && cs.etape_id === stepId
    );
    return status ? status.statut : 'Non commencé';
  };

  const handleMoveCandidate = async (candidatId, stepId, statut) => {
    try {
      const { data: existingEntry, error: fetchError } = await supabase
        .from('candidats_etapes')
        .select('*')
        .eq('candidat_id', candidatId)
        .eq('etape_id', stepId)
        .single();
  
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
  
      if (existingEntry) {
        const { error } = await supabase
          .from('candidats_etapes')
          .update({ statut })
          .eq('candidat_id', candidatId)
          .eq('etape_id', stepId);
  
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('candidats_etapes')
          .insert({ candidat_id: candidatId, etape_id: stepId, statut });
  
        if (error) throw error;
      }
  
      setCandidateSteps(prev => {
        const existingIndex = prev.findIndex(cs => cs.candidat_id === candidatId && cs.etape_id === stepId);
        
        if (existingIndex !== -1) {
          return prev.map((cs, index) => index === existingIndex ? { ...cs, statut } : cs);
        } else {
          return [...prev, { candidat_id: candidatId, etape_id: stepId, statut }];
        }
      });
  
      message.success('Statut du candidat mis à jour avec succès!');
    } catch (error) {
      console.error('Erreur lors de la mise à jour/création:', error);
      message.error('Erreur lors de la mise à jour du statut du candidat.');
    }
  };

  const getVotesForCandidate = (candidateId) => {
    const candidateVotes = votes.filter(vote => vote.candidat_id === candidateId);
    const totalVotes = candidateVotes.length;
    const validVotes = candidateVotes.filter(vote => vote.vote_ok).length;
    return { totalVotes, validVotes };
  };

  const filteredCandidates = candidates
    .filter(candidate => {
      if (selectedStep) {
        const selectedStepOrder = steps.find(s => s.id === selectedStep)?.ordre;
        if (!selectedStepOrder) return true;
        
        return steps
          .filter(step => step.ordre < selectedStepOrder)
          .every(step => getCandidateStatus(candidate.id, step.id) === 'validée');
      }
      return true;
    })
    .filter(candidate =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getCandidatesInPhase = (stepId) => {
    return candidates.filter(candidate => 
      getCandidateStatus(candidate.id, stepId) === 'validée'
    ).length;
  };

  const columns = [
    {
      title: 'Nom du Candidat',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email du Candidat',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Telephone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Inscript Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render : (_,record) => {
        const date = new Date(record.created_at);
        return date.toLocaleString('fr-FR');
      }
    },
    {
      title: 'Total Votes',
      key: 'totalVotes',
      render: (_, record) => {
        const { totalVotes } = getVotesForCandidate(record.id);
        return totalVotes;
      },
      sorter: (a, b) => {
        const { totalVotes: votesA } = getVotesForCandidate(a.id);
        const { totalVotes: votesB } = getVotesForCandidate(b.id);
        return votesA - votesB;
      },
    },
    {
      title: 'Valid Votes',
      key: 'validVotes',
      render: (_, record) => {
        const { validVotes } = getVotesForCandidate(record.id);
        return validVotes;
      },
      sorter: (a, b) => {
        const { validVotes: votesA } = getVotesForCandidate(a.id);
        const { validVotes: votesB } = getVotesForCandidate(b.id);
        return votesA - votesB;
      },
    },
    {
      title: 'Progression des Étapes',
      key: 'steps',
      render: (_, record) => (
        <div>
          {steps.map(step => {
            const status = getCandidateStatus(record.id, step.id);
            let icon;
            let color;
            switch(status) {
              case 'validée':
                icon = <CheckCircleOutlined />;
                color = 'success';
                break;
              case 'non validée':
                icon = <CloseCircleOutlined />;
                color = 'error';
                break;
              default:
                icon = <MinusCircleOutlined />;
                color = 'default';
            }
            return (
              <Tag icon={icon} color={color} key={step.id}>
                {step.nom}
              </Tag>
            );
          })}
        </div>
      ),
    },
    {
      title: 'Statut Étape Actuelle',
      key: 'currentStatus',
      render: (_, record) => {
        const activeStep = getActiveStep();
        if (!activeStep) return 'Aucune étape active';
        return (
          <Select
            defaultValue={getCandidateStatus(record.id, activeStep.id)}
            style={{ width: 120 }}
            onChange={(value) => handleMoveCandidate(record.id, activeStep.id, value)}
          >
            <Option value="validée">Validée</Option>
            <Option value="non validée">Non Validée</Option>
          </Select>
        );
      },
    },
  
  ];

  const getTotalCandidatesForStep = (stepId) => {
    const currentStep = steps.find(step => step.id === stepId);
    
    if (!currentStep) return 0;
    
    if (currentStep.ordre === 1) {
      return candidates.length;
    }
    
    const previousStep = steps.find(step => step.ordre === currentStep.ordre - 1);
    
    if (!previousStep) {
      return 0;
    }
    
    return candidates.filter(candidate => 
      getCandidateStatus(candidate.id, previousStep.id) === 'validée'
    ).length;
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        {steps.map(step => (
          <Col
            key={step.id}
            xs={24}
            sm={12}
            md={8}
            lg={6}
          >
            <Card className={step.est_active ? 'bg-green-100' : ''}>
              <Statistic
                title={step.nom}
                value={getCandidatesInPhase(step.id)}
                suffix={`/ ${getTotalCandidatesForStep(step.id)}`}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: '20px' }}>
        <Col xs={24} sm={12} style={{ marginBottom: '10px' }}>
          <Text strong>Étape Sélectionnée : </Text>
          <Select
            style={{ width: '100%', maxWidth: 200, marginLeft: '10px' }}
            placeholder="Filtrer par Étape"
            value={selectedStep}
            onChange={handleStepChange}
          >
            <Option value={null}>Toutes les Étapes</Option>
            {steps.map((step) => (
              <Option key={step.id} value={step.id}>
                {step.nom}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
          <Search
            placeholder="Rechercher un candidat"
            onSearch={value => setSearchTerm(value)}
            style={{ width: '100%', maxWidth: 300 }}
          />
        </Col>
      </Row>

      <Table
        dataSource={filteredCandidates}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default CandidatesManagement;