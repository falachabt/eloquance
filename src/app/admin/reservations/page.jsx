"use client"
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { supabase } from "@/lib/supabase";
import { notchpay } from "@/lib/notchpay";
import { Input, Table, Modal, Button, AutoComplete, message, Descriptions, Tag, Spin, Card, Row, Col, Statistic } from 'antd';
import { SearchOutlined, CheckOutlined, CloseOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import Navbar from '../candidats/NavBar';

const fetcher = async (url) => {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('date_reservation', { ascending: false });
  
  if (error) throw error;
  return data;
};

export default function GestionReservations() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data: reservations, error, mutate } = useSWR('/api/reservations', fetcher);
  const [stats, setStats] = useState({ total: 0, used: 0 });

  useEffect(() => {
    if (reservations) {
      setStats({
        total: reservations.length,
        used: reservations.filter(r => r.used_at).length
      });
    }
  }, [reservations]);

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const handleSelect = (value) => {
    const reservation = reservations.find(r => r.id === value);
    setSelectedReservation(reservation);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedReservation(null);
  };

  const handleMarkAsUsed = async () => {
    if (!selectedReservation || selectedReservation.used_at) return;

    try {
      const paymentDetails = await notchpay.payments.verifyAndFetchPayment(selectedReservation.trx_id);
      
      if (paymentDetails?.transaction?.status !== "complete") {
        message.error('Impossible de marquer comme utilisée. Le paiement n\'est pas complet.');
        return;
      }

      const { data, error } = await supabase
        .from('reservations')
        .update({ used_at: new Date().toISOString() })
        .eq('id', selectedReservation.id);

      if (error) throw error;

      message.success('Réservation marquée comme utilisée');
      mutate();
      handleCloseModal();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réservation:', error);
      message.error('Erreur lors de la mise à jour de la réservation');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', responsive: ['md'] },
    { title: 'Nom', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email', responsive: ['lg'] },
    { title: 'Quantité', dataIndex: 'quantite', key: 'quantite', responsive: ['sm'] },
    { 
      title: 'Montant total', 
      dataIndex: 'montant_total', 
      key: 'montant_total',
      render: (value) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(value),
      responsive: ['md']
    },
    { 
      title: 'Date de réservation', 
      dataIndex: 'date_reservation', 
      key: 'date_reservation',
      render: (value) => new Date(value).toLocaleString('fr-FR'),
      responsive: ['lg']
    },
    { 
      title: 'Utilisée', 
      key: 'used',
      render: (text, record) => record.used_at ? <CheckOutlined style={{ color: 'green' }} /> : '-',
      responsive: ['sm']
    },
  ];

  const filteredReservations = reservations?.filter(r => 
    r.id.toLowerCase().includes(searchValue.toLowerCase()) ||
    r.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
    r.email?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div>
        <Navbar title='Reservations' />

    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des Réservations</h1>
      
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Total des réservations"
              value={stats.total}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Réservations utilisées"
              value={stats.used}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <AutoComplete
        className="mb-4 w-full max-w-md"
        options={filteredReservations?.map(r => ({ value: r.id }))}
        onSelect={handleSelect}
        onSearch={handleSearch}
      >
        <Input 
          size="large"
          placeholder="Rechercher une réservation par ID, nom ou email" 
          prefix={<SearchOutlined />}
        />
      </AutoComplete>

      <Table 
        dataSource={filteredReservations} 
        columns={columns} 
        rowKey="id"
        onRow={(record) => ({
          onClick: () => handleSelect(record.id)
        })}
        responsive
      />

      <Modal
        title="Détails de la réservation"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="back" onClick={handleCloseModal}>
            Fermer
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleMarkAsUsed}
            disabled={selectedReservation?.used_at || !selectedReservation?.trx_id}
          >
            Marquer comme utilisée
          </Button>,
        ]}
        width={700}
      >
        {selectedReservation && <ReservationDetails reservation={selectedReservation} />}
      </Modal>
    </div>
</div>
  );
}

const ReservationDetails = ({ reservation }) => {
  const [paymentStatus, setPaymentStatus] = useState('loading');

  useEffect(() => {
    const verifyPayment = async () => {
      if (reservation.trx_id) {
        try {
          const paymentDetails = await notchpay.payments.verifyAndFetchPayment(reservation.trx_id);
          setPaymentStatus(paymentDetails?.transaction?.status === "complete" ? "paid" : "pending");
        } catch (error) {
          console.error("Erreur lors de la vérification du paiement:", error);
          setPaymentStatus("error");
        }
      } else {
        setPaymentStatus("unpaid");
      }
    };

    verifyPayment();
  }, [reservation.trx_id]);

  const getPaymentStatusTag = () => {
    switch (paymentStatus) {
      case 'paid':
        return <Tag color="success">Payé</Tag>;
      case 'pending':
        return <Tag color="warning">En attente</Tag>;
      case 'unpaid':
        return <Tag color="error">Non payé</Tag>;
      case 'error':
        return <Tag color="error">Erreur de vérification</Tag>;
      default:
        return <Tag icon={<Spin size="small" />}>Vérification en cours</Tag>;
    }
  };

  return (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="ID">{reservation.id}</Descriptions.Item>
      <Descriptions.Item label="Nom">{reservation.name || 'Non spécifié'}</Descriptions.Item>
      <Descriptions.Item label="Email">{reservation.email || 'Non spécifié'}</Descriptions.Item>
      <Descriptions.Item label="Quantité">{reservation.quantite}</Descriptions.Item>
      <Descriptions.Item label="Montant total">
        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(reservation.montant_total)}
      </Descriptions.Item>
      <Descriptions.Item label="Date de réservation">
        {new Date(reservation.date_reservation).toLocaleString('fr-FR')}
      </Descriptions.Item>
      <Descriptions.Item label="Statut de paiement">
        {getPaymentStatusTag()}
      </Descriptions.Item>
      <Descriptions.Item label="Utilisée">
        {reservation.used_at ? (
          <Tag icon={<CheckOutlined />} color="success">
            Oui - {new Date(reservation.used_at).toLocaleString('fr-FR')}
          </Tag>
        ) : (
          <Tag icon={<CloseOutlined />} color="default">Non</Tag>
        )}
      </Descriptions.Item>
    </Descriptions>
  );
};