"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { supabase } from "@/lib/supabase";
import { notchpay } from "@/lib/notchpay";
import { 
  Layout, Menu, Card, Avatar, Statistic, Progress, 
  Timeline, Table, Tag, Spin, Alert, Row, Col, Typography, Anchor, Flex
} from 'antd';
import { 
  UserOutlined, MailOutlined, HomeOutlined, BookOutlined,
  CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined,
  DollarOutlined, TrophyOutlined, LikeOutlined,LogoutOutlined, 
} from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;
const { Link } = Anchor;

async function updateAllCandidatePayments() {
  try {
    const { data: candidates, error } = await supabase
      .from('candidats')
      .select('id, trx_id')
      .eq('payment_status', false)
      .not('trx_id', 'is', null);

    if (error) throw error;

    const updates = candidates.map(async (candidate) => {
      const paymentDetails = await notchpay.payments.verifyAndFetchPayment(candidate.trx_id);
      
      if (paymentDetails?.transaction?.status === "complete") {
        const { error: updateError } = await supabase
          .from('candidats')
          .update({ payment_status: true })
          .eq('id', candidate.id);

        if (updateError) console.error(`Erreur lors de la mise à jour du candidat ${candidate.id}:`, updateError);
        return { id: candidate.id, updated: !updateError };
      }
      return { id: candidate.id, updated: false };
    });

    const results = await Promise.all(updates);
    console.log('Résultats de la mise à jour des paiements:', results);

    return results;
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paiements:', error);
    throw error;
  }
}

const fetcher = async (url) => {
  if (url === 'candidateData') {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("Utilisateur non connecté");

    if (user.user_metadata && user.user_metadata.role === "admin") {
      await supabase.auth.signOut();
      throw new Error("Admin redirect");
    }

    const { data: candidate, error: candidateError } = await supabase
      .from("candidats")
      .select(`
        *,
        candidats_etapes(*),
        votes(id, email, created_at, is_paid_vote)
      `)
      .eq("email", user.email)
      .maybeSingle();

    if (candidateError) throw new Error("Impossible de charger les données du candidat.");

    if (!candidate) return null;

    if (!candidate.payment_status && candidate.trx_id) {
      const paymentDetails = await notchpay.payments.verifyAndFetchPayment(candidate.trx_id);
      if (paymentDetails?.transaction?.status === "complete") {
        await supabase
          .from("candidats")
          .update({ payment_status: true })
          .eq("id", candidate.id);
        candidate.payment_status = true;
      }
    }

    return candidate;
  } else if (url === 'concoursEtapes') {
    const { data: etapes, error: etapesError } = await supabase
      .from("etapes_concours")
      .select("*")
      .order('ordre', { ascending: true });

    if (etapesError) throw new Error("Impossible de charger les étapes du concours.");

    return etapes;
  }
};

const CandidateDashboard = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  const { data: candidateData, error: candidateError, mutate: mutateCandidate, isValidating: isValidatingCandidate } = useSWR('candidateData', fetcher);
  const { data: concoursEtapes, error: etapesError,  isValidating: isValidatingEtapes } = useSWR('concoursEtapes', fetcher);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);

    const candidateSubscription = supabase
      .channel('candidats_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'candidats_etapes' }, () => {
        mutateCandidate();
      })
      .subscribe();

    const votesSubscription = supabase
      .channel('votes_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, () => {
        mutateCandidate();
      })
      .subscribe();

    return () => {
      window.removeEventListener('resize', handleResize);
      supabase.removeChannel(candidateSubscription);
      supabase.removeChannel(votesSubscription);
    };
  }, [mutateCandidate]);

  useEffect(() => {
    const updatePayments = async () => {
      try {
        await updateAllCandidatePayments();
        mutateCandidate();
      } catch (error) {
        console.error('Erreur lors de la mise à jour des paiements:', error);
      }
    };
  
    updatePayments();
    const intervalId = setInterval(updatePayments, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [mutateCandidate]);

  useEffect(() => {
    if (candidateError && candidateError.message === "Admin redirect") {
      router.push('/login');
    }
  }, [candidateError, router]);

  if (candidateError) {
    if (candidateError.message === "Utilisateur non connecté" || candidateError.message === "Admin redirect") {
      router.push('/login');
      return null;
    }
    return <Alert message="Erreur" description={candidateError.message} type="error" showIcon />;
  }

  if (etapesError) {
    return <Alert message="Erreur" description={etapesError.message} type="error" showIcon />;
  }

  const isLoading = isValidatingCandidate || isValidatingEtapes;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (candidateData === null) {
    return <Alert message="Information" description="Aucune donnée de candidat trouvée. Veuillez vous inscrire au concours." type="info" showIcon />;
  }

  if (!concoursEtapes || concoursEtapes.length === 0) {
    return <Alert message="Information" description="Aucune étape de concours n'est actuellement disponible." type="info" showIcon />;
  }

  const { 
    name, email, age, school, city, motivation, payment_status, votes, candidats_etapes 
  } = candidateData;

  const completedSteps = candidats_etapes.filter(e => e.statut === 'validée').length;
  const totalSteps = concoursEtapes.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };


  const renderProfileCard = () => (
    <Card id="profile">
      <Row gutter={16} align="middle">
        <Col xs={24} sm={24} md={8} lg={6}>
          <Avatar 
            size={{ xs: 150, sm: 200, md: 250, lg: 300 }} 
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${name}`} 
            style={{ margin: 'auto', display: 'block' }}
          />
        </Col>
        <Col xs={24} sm={24} md={16} lg={18}>
          <Title level={2}>{name}</Title>
          <Paragraph><MailOutlined /> {email}</Paragraph>
          <Paragraph><UserOutlined /> {age} ans</Paragraph>
          <Paragraph><HomeOutlined /> {city}</Paragraph>
          <Paragraph><BookOutlined /> {school}</Paragraph>
          <Paragraph><strong>Motivation:</strong> {motivation}</Paragraph>
          <Tag color={payment_status ? 'green' : 'red'}>
            {payment_status ? 'Paiement validé' : 'Paiement en attente'}
          </Tag>
        </Col>
      </Row>
    </Card>
  );

  const renderProgressCard = () => (
    <Card title="Progression du concours" id="progress">
      <Progress
        percent={progressPercentage.toFixed(2)}
        status="active"
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
      />
      <Statistic 
        title="Étapes complétées" 
        value={completedSteps} 
        suffix={`/ ${totalSteps}`}
        prefix={<TrophyOutlined />}
      />
    </Card>
  );

  const renderVotesCard = () => (
    <Card title="Statistiques des votes" id="votes">
      <Row gutter={16}>
        <Col span={12}>
          <Statistic
            title="Total des votes"
            value={votes.length}
            prefix={<LikeOutlined />}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Votes payants"
            value={votes.filter(v => v.is_paid_vote).length}
            prefix={<DollarOutlined />}
          />
        </Col>
      </Row>
    </Card>
  );

  const getStepStatus = (etape, index) => {
    const candidatEtape = candidats_etapes.find(ce => ce.etape_id === etape.id);
    const now = new Date();
    const startDate = new Date(etape.date_debut);
    const endDate = new Date(etape.date_fin);

    const allPreviousStepsValidated = concoursEtapes.slice(0, index).every(prevEtape => {
      const prevCandidatEtape = candidats_etapes.find(ce => ce.etape_id === prevEtape.id);
      return prevCandidatEtape?.statut === 'validée';
    });

    if (!allPreviousStepsValidated) return 'blocked';
    if (candidatEtape?.statut === 'validée') return 'finish';
    if (candidatEtape?.statut === 'échouée') return 'error';
    if (now < startDate) return 'wait';
    if (now >= startDate && now <= endDate) return 'process';
    return 'wait';
  };

  const renderTimelineCard = () => (
    <Card title="Chronologie des étapes" id="timeline">
      <Timeline mode={isMobile ? "left" : "alternate"}>
        {concoursEtapes.map((etape, index) => {
          const status = getStepStatus(etape, index);
          return (
            <Timeline.Item
              key={etape.id}
              color={status === 'finish' ? 'green' : status === 'error' || status === 'blocked' ? 'red' : 'blue'}
              dot={
                status === 'finish' ? <CheckCircleOutlined /> :
                status === 'error' || status === 'blocked' ? <CloseCircleOutlined /> :
                status === 'process' ? <ClockCircleOutlined /> :
                <ClockCircleOutlined />
              }
            >
              <Card 
                size="small" 
                style={{ 
                  width: isMobile ? '100%' : 300,
                  backgroundColor: status === 'blocked' ? '#ffcccb' : 'white'
                }}
              >
                <p style={{ fontWeight: 'bold' }}>{etape.nom}</p>
                <p>{new Date(etape.date_debut).toLocaleDateString()} - {new Date(etape.date_fin).toLocaleDateString()}</p>
                <Tag color={etape.est_active ? 'green' : 'default'}>
                  {etape.est_active ? 'Active' : 'Inactive'}
                </Tag>
                {etape.votes_en_ligne && <Tag color="blue">Votes en ligne</Tag>}
                {etape.votes_payants && <Tag color="gold">Votes payants</Tag>}
                <Tag color={
                  status === 'finish' ? 'green' :
                  status === 'error' || status === 'blocked' ? 'red' :
                  status === 'process' ? 'blue' :
                  'default'
                }>
                  {status === 'finish' ? 'Validée' :
                   status === 'error' ? 'Échouée' :
                   status === 'blocked' ? 'Non accessible' :
                   status === 'process' ? 'En cours' :
                   'Non commencée'}
                </Tag>
              </Card>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </Card>
  );

  const renderVotesTable = () => {
    const columns = [
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        ellipsis: true,
      },
      {
        title: 'Date',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text) => new Date(text).toLocaleString(),
      },
      {
        title: 'Type',
        dataIndex: 'is_paid_vote',
        key: 'is_paid_vote',
        render: (isPaid) => (
          <Tag color={isPaid ? 'green' : 'blue'}>
            {isPaid ? 'Payant' : 'Gratuit'}
          </Tag>
        ),
      },
    ];

    return (
      <Card title="Détails des votes">
        <Table 
          dataSource={votes} 
          columns={columns} 
          rowKey="id" 
          scroll={{ x: true }}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    );
  };

  const renderMobileMenu = () => (
    <Anchor affix={false} className='flex ' onClick={e => e.preventDefault()}>
<Flex>
      <Link href="#profile" title="Profil" />
      <Link href="#progress" title="Progression" />
      <Link href="#timeline" title="Chronologie" />
      <Link href="#votes" title="Votes" />
  </Flex> 
    </Anchor>
  );

  return (
    <Layout>
      <Header className="header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">Tableau de bord</Menu.Item>
          </Menu>
        </div>
        <Menu theme="dark" mode="horizontal">
          <Menu.SubMenu 
            key="user" 
            icon={<UserOutlined />} 
            title={name || "Utilisateur"}
          >
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
              Déconnexion
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Header>
      <Content style={{ padding: '0 1px' }}>
        {isMobile && renderMobileMenu()}
        <div className="site-layout-content" style={{ padding: 7, minHeight: 380 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              {renderProfileCard()}
            </Col>
            <Col xs={24} md={12}>
              {renderProgressCard()}
            </Col>
            <Col xs={24} md={12}>
              {renderVotesCard()}
            </Col>
            <Col xs={24}>
              {renderTimelineCard()}
            </Col>
            <Col xs={24}>
              {renderVotesTable()}
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default CandidateDashboard;