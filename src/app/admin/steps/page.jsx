"use client"
import React, { useEffect, useState } from 'react';
import { Table, Button, Drawer, Form, Input, DatePicker, Select, message, Modal, Layout, Checkbox } from 'antd';
import { supabase } from "@/lib/supabase"; 
import moment from 'moment';
import Navbar from '../candidats/NavBar';
const { Header, Content } = Layout;

const AdminPage = () => {
  const [steps, setSteps] = useState([]);
  const [candidatesCount, setCandidatesCount] = useState({});
  const [currentStep, setCurrentStep] = useState(null);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [activeStep, setActiveStep] = useState(null);
  
  // États pour gérer l'affichage des champs dynamiques
  const [isOnlineVoting, setIsOnlineVoting] = useState(false);
  const [isPaidVoting, setIsPaidVoting] = useState(false);

  useEffect(() => {
    fetchSteps();
    fetchCandidatesCount();
  }, []);

  const fetchSteps = async () => {
    const { data, error } = await supabase.from('etapes_concours').select('*');
    if (error) {
      console.error(error);
      return;
    }
    setSteps(data);
    const activeStepData = data.find(step => step.est_active);
    setActiveStep(activeStepData);
  };

  const fetchCandidatesCount = async () => {
    const { data, error } = await supabase.from('candidats_etapes').select('etape_id');
    if (error) {
      console.error(error);
      return;
    }
    const countMap = {};
    data.forEach(candidate => {
      countMap[candidate.etape_id] = (countMap[candidate.etape_id] || 0) + 1;
    });
    setCandidatesCount(countMap);
  };

  const handleSetActiveStep = async (id) => {
    Modal.confirm({
      title: 'Confirmer le changement d\'étape active',
      content: 'Êtes-vous sûr de vouloir changer l\'étape active ?',
      onOk: async () => {
        await supabase.from('etapes_concours').update({ est_active: false }).eq('est_active', true);
        await supabase.from('etapes_concours').update({ est_active: true }).eq('id', id);
        fetchSteps();
      },
    });
  };

  const showDrawer = (step = null) => {
    form.resetFields();
    setIsOnlineVoting(false);
    setIsPaidVoting(false);

    if (step) {
      form.setFieldsValue({
        ...step,
        date_debut: moment(step.date_debut),
        date_fin: step.date_fin ? moment(step.date_fin) : null,
        votes_en_ligne: step.votes_en_ligne,
        votes_payants: step.votes_payants,
        montant_paiement: step.montant_paiement,
      });
      setIsOnlineVoting(step.votes_en_ligne);
      setIsPaidVoting(step.votes_payants);
      setCurrentStep(step.id);
    } else {
      setCurrentStep(null);
    }
    setVisible(true);
  };

  const onFinish = async (values) => {
    try {
      const { date_debut, date_fin, ...rest } = values;
      const formattedValues = {
        ...rest,
        date_debut: date_debut.format('YYYY-MM-DD'),
        date_fin: date_fin ? date_fin.format('YYYY-MM-DD') : null,
      };
      if (currentStep) {
        await supabase.from('etapes_concours').update(formattedValues).eq('id', currentStep);
      } else {
        await supabase.from('etapes_concours').insert(formattedValues);
      }
      message.success('Étape enregistrée avec succès !');
      fetchSteps();
      setVisible(false);
    } catch (error) {
      message.error('Erreur lors de l\'enregistrement de l\'étape');
      console.error(error);
    }
  };

  const confirmDelete = async (id) => {
    Modal.confirm({
      title: 'Êtes-vous sûr de vouloir supprimer cette étape ?',
      onOk: async () => {
        await supabase.from('etapes_concours').delete().eq('id', id);
        message.success('Étape supprimée avec succès !');
        fetchSteps();
      },
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar title='Etapes' />
      <Content style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Select
            onChange={handleSetActiveStep}
            placeholder="Sélectionner l'étape active"
            style={{ width: '200px', marginRight: '16px' }}
          >
            {steps.map(step => (
              <Select.Option key={step.id} value={step.id}>
                {step.nom}
              </Select.Option>
            ))}
          </Select>
          <Button onClick={() => showDrawer()} type="primary">Ajouter une étape</Button>
        </div>
        {activeStep && (
          <div style={{ marginBottom: '20px', fontSize: '16px', color: 'green' }}>
            Étape active actuelle : <strong>{activeStep.nom}</strong>
          </div>
        )}
        <Table
          dataSource={steps?.sort((a, b) => a.ordre - b.ordre)}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        >
          <Table.Column title="Nom de l'Étape" dataIndex="nom" />
          <Table.Column title="Nombre de Candidats" render={(text, record) => <span>{candidatesCount[record.id] || 0}</span>} />
          <Table.Column title="Action" render={(text, record) => (
            <>
              <Button onClick={() => showDrawer(record)}>Éditer</Button>
              <Button onClick={() => confirmDelete(record.id)} type="danger">Supprimer</Button>
            </>
          )} />
        </Table>
        <Drawer title={currentStep ? "Éditer l'étape" : "Ajouter une étape"} visible={visible} onClose={() => setVisible(false)}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="nom" label="Nom de l'Étape" rules={[{ required: true, message: 'Veuillez entrer le nom de l\'étape' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="date_debut" label="Date de Début" rules={[{ required: true, message: 'Veuillez sélectionner la date de début' }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="date_fin" label="Date de Fin">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="ordre" label="Ordre" rules={[{ required: true, message: 'Veuillez entrer l\'ordre' }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="votes_en_ligne" label="Votes en Ligne" valuePropName="checked">
              <Checkbox onChange={(e) => {
                setIsOnlineVoting(e.target.checked);
                form.setFieldsValue({ votes_payants: false, montant_paiement: undefined }); // Reset if unchecked
              }} />
            </Form.Item>
            {isOnlineVoting && (
              <>
                <Form.Item name="votes_payants" label="Votes Payants" valuePropName="checked">
                  <Checkbox onChange={(e) => {
                    setIsPaidVoting(e.target.checked);
                  }} />
                </Form.Item>
                {isPaidVoting && (
                  <Form.Item name="montant_paiement" label="Montant de Paiement" rules={[{ required: true, message: 'Veuillez entrer le montant' }]}>
                    <Input type="number" />
                  </Form.Item>
                )}
              </>
            )}
            <Form.Item name="est_active" label="Étape Active" valuePropName="checked">
              <Checkbox />
            </Form.Item>
            <Button type="primary" htmlType="submit">Enregistrer</Button>
          </Form>
        </Drawer>
      </Content>
    </Layout>
  );
};

export default AdminPage;
