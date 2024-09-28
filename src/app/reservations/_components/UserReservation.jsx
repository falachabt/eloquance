"use client";

import React, { useEffect } from 'react';
import { Table, Typography, Spin, Alert, Tag, Button, message } from 'antd';
import useSWR from 'swr';
import { supabase } from '@/lib/supabase';
import { notchpay } from '@/lib/notchpay';
import { RedoOutlined } from '@ant-design/icons';
import { pay } from "./payment.utils";

const { Title } = Typography;

const fetcher = async () => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) throw authError;
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('email', user.email);

  if (error) throw error;

  // Fetch payment status for each reservation
  const reservationsWithStatus = await Promise.all(data.map(async (rev) => {
    const paymentDetails = await notchpay.payments.verifyAndFetchPayment(rev.trx_id);
    console.log(paymentDetails?.transaction?.status)
    return {
      ...rev,
      status: paymentDetails?.transaction?.status || 'unknown'
    };
  }));

  return reservationsWithStatus;
};

export const UserReservations = () => {
  const { data: reservations, error, mutate } = useSWR('userReservations', fetcher);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        mutate();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [mutate]);

  async function handleRedoPayment(id) {
    try {
      const { url, trx_id } = await pay();
      if (!trx_id) throw 'Failed to initialize the payment';

      const { error } = await supabase.from("reservations").update({ trx_id }).eq("id", id);
      if (error) throw error;

      message.success("Go to the payment page and confirm the payment");
      window.open(url);

      // Revalidate the data after successful payment initiation
      mutate();
    } catch (error) {
      console.error(error);
      message.error("Error restarting payment");
    }
  }

  if (error) return <Alert message="Error" description={error.message} type="error" showIcon />;
  if (!reservations) return <Spin size="large" />;

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Participant Name',
      dataIndex: 'name',
      key: 'participant_name',
    },
    {
      title: 'Reservation Date',
      dataIndex: 'date_reservation',
      key: 'date_reservation',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: "status",
      render: (status) => (
        <Tag color={status === 'pending' ? 'orange' : status === 'complete' ? 'green' : 'red'}>
          {status === 'pending' ? 'En attente de paiement' : status === 'complete' ? 'Payé' : 'Echec'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        if (record.status !== 'complete') {
          return <Button type="link" onClick={() => handleRedoPayment(record.id)} icon={<RedoOutlined />} />;
        }
        return "--";
      }
    }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '100%', overflowX: 'hidden' }}>
      <Title level={3}>Vos Reservations</Title>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={reservations}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </div>
  );
};