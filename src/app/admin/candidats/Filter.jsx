"use client"
import React, { useEffect, useState } from 'react';
import { Table, Select, message, Layout, Card, Input, Tag, Row, Col, Typography, Statistic } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import { CheckCircleOutlined, CloseCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Option } = Select;
const { Search } = Input;
const { Title, Text } = Typography;

const CandidatesManagement = () => {
  const [candidates, setCandidates] = useState([]);
  const [steps, setSteps] = useState([]);
  const [candidateSteps, setCandidateSteps] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchCandidates();
    fetchSteps();
    fetchCandidateSteps();
  }, []);

  useEffect(() => {
    const step = searchParams?.get("step")
    if (step) {
      setSelectedStep(parseInt(step));
    }
  }, [searchParams?.get("step")]);

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
      // 1. Vérifie si le candidat a déjà un enregistrement pour cette étape
      const { data: existingEntry, error: fetchError } = await supabase
        .from('candidats_etapes')
        .select('*')
        .eq('candidat_id', candidatId)
        .eq('etape_id', stepId)
        .single(); // Utilise .single() car il doit y avoir un seul résultat si l'entrée existe
  
      if (fetchError && fetchError.code !== 'PGRST116') {
        // Gérer toute autre erreur (sauf celle de "non trouvé")
        throw fetchError;
      }
  
      let result;
      if (existingEntry) {
        // 2. Si une entrée existe, on la met à jour
        const { data, error } = await supabase
          .from('candidats_etapes')
          .update({ statut })
          .eq('candidat_id', candidatId)
          .eq('etape_id', stepId);
  
        if (error) throw error;
        result = data;
      } else {
        // 3. Si aucune entrée n'existe, on en crée une nouvelle
        const { data, error } = await supabase
          .from('candidats_etapes')
          .insert({ candidat_id: candidatId, etape_id: stepId, statut });
  
        if (error) throw error;
        result = data;
      }
  
      // 4. Mettre à jour l'état local
      setCandidateSteps(prev => {
        const existingIndex = prev.findIndex(cs => cs.candidat_id === candidatId && cs.etape_id === stepId);
        
        if (existingIndex !== -1) {
          // Mise à jour locale si l'entrée existait déjà
          return prev.map((cs, index) => index === existingIndex ? { ...cs, statut } : cs);
        } else {
          // Ajouter une nouvelle entrée locale si elle n'existait pas
          return [...prev, { candidat_id: candidatId, etape_id: stepId, statut }];
        }
      });
  
      message.success('Statut du candidat mis à jour avec succès!');
    } catch (error) {
      console.error('Erreur lors de la mise à jour/création:', error);
      message.error('Erreur lors de la mise à jour du statut du candidat.');
    }
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
    },
    {
      title: 'Email du Candidat',
      dataIndex: 'email',
      key: 'email',
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
    
    // Si aucune étape actuelle n'est trouvée, retourne 0
    if (!currentStep) return 0;
    
    // Si c'est la première étape, tous les candidats sont éligibles
    if (currentStep.ordre === 1) {
      return candidates.length;
    }
    
    // Trouve l'étape précédente
    const previousStep = steps.find(step => step.ordre === currentStep.ordre - 1);
    
    // Si pas d'étape précédente trouvée, retourne 0
    if (!previousStep) {
      return 0; // Retourne 0 dans le cas où il n'y a pas d'étape précédente
    }
    
    // Filtre les candidats qui ont validé l'étape précédente
    return candidates.filter(candidate => 
      getCandidateStatus(candidate.id, previousStep.id) === 'validée'
    ).length;
  };
  

  

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '20px' }}>
        
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
  {steps.map(step => (
    <Col
      key={step.id}
      xs={19} // Full width on extra small screens
      sm={9} // Half width on small screens
      md={5}  // One-third width on medium screens
      lg={4}  // One-fourth width on large screens
    >
      <Card className={step.est_active ? 'bg-green-100' : ''}>
        <Statistic
          title={step.nom}
          value={getCandidatesInPhase(step.id)}
          suffix={`/ ${getTotalCandidatesForStep(step.id)}`} // Change ici
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
      </Content>
    </Layout>
  );
};

export default CandidatesManagement;