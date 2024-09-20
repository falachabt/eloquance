"use client";
import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Layout, Steps, Divider } from 'antd';
import { PlusOutlined, MinusOutlined, UserOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthModal } from "./AuthModal";
import { UserReservations } from "./UserReservation";
import { handlePayment } from "./payment.utils";
import Cookies from "js-cookie"; 

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;
const { Step } = Steps;

export const EloquenceCompetitionReservation = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [participants, setParticipants] = useState([{ name: '', email: '' }]);

  const addParticipant = () => {
    setParticipants([...participants, { name: '', email: '' }]);
  };

  const removeParticipant = (index) => {
    if (participants.length > 1) {
      const newParticipants = participants.filter((_, i) => i !== index);
      setParticipants(newParticipants);
    }
  };

  const onFinish = async (values) => {
    try {
      let p = [];
      for (const key in values) {
        if (Object.hasOwnProperty.call(values, key)) {
          p.push({ name: values[key] });
        }
      }
      setParticipants(p);
      setCurrentStep(1);
    } catch (error) {
      console.log(error);
    }
  };

  const steps = [
    {
      title: 'Participants',
      content: (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <AnimatePresence>
            {participants.map((participant, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Form.Item
                  name={'participants' + index}
                  rules={[{ required: true, message: 'Veuillez entrer le nom' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    suffix={
                      participants.length > 1 && (
                        <MinusOutlined
                          onClick={() => removeParticipant(index)}
                          style={{ color: 'red', cursor: 'pointer' }}
                        />
                      )
                    }
                    placeholder="Nom du participant"
                  />
                </Form.Item>
              </motion.div>
            ))}
          </AnimatePresence>
          <Form.Item>
            <Button type="dashed" onClick={addParticipant} block icon={<PlusOutlined />}>
              Ajouter un participant
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Suivant
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Résumé',
      content: (
        <div id='canvas'>
          <Title level={4}>Résumé de la réservation</Title>
          <Divider />
          {participants.map((participant, index) => (
            <p key={index} className='p-4 py-2 border rounded'>{participant.name}</p>
          ))}
          <Divider />
          <Paragraph>
            <Text strong>Nombre total de places:</Text> {participants.length}
          </Paragraph>
          <Paragraph>
            <Text strong>Montant total à payer:</Text> {participants.length * 1000} FCFA
          </Paragraph>
          <Form.Item>
            <Button type="dashed" onClick={() => setCurrentStep(0)} block>
              Retour
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={async () => {
              const emailInCookies = Cookies.get("user_email");
              await handlePayment(participants, emailInCookies);
            }} block>
              Payer
            </Button>
          </Form.Item>
        </div>
      ),
    },
  ];

  return (
    <div className='flex max-[1100px]:flex-col-reverse'>
      <AuthModal />
      <div className='w-full bg-white'>
        <UserReservations />
      </div>
      <Layout className="w-full bg-white">
        <Content className="p-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="shadow-2xl">
              <Title level={2} className="text-center mb-4 text-primary-500">Réservation</Title>
              <Paragraph className="text-center mb-8">
                Réservez vos places pour notre concours d'éloquence exceptionnel. Prix par place : 1000 FCFA
              </Paragraph>
              <Steps current={currentStep} className="mb-8">
                {steps.map(item => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
              <div className="steps-content">{steps[currentStep].content}</div>
            </Card>
          </motion.div>
        </Content>
      </Layout>
    </div>
  );
};

export default EloquenceCompetitionReservation;
