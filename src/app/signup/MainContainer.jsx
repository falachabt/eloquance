"use client"
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, message, Spin, Result } from 'antd';
import { insertCandidatData, pay_inscription, sendVerificationCode, signInUser } from "./utils";
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

const { TextArea } = Input;

export const SignUpForm = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const router = useRouter();
  const [insStep, setInsStep] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inscriptionStatus, setInscriptionStatus] = useState('loading');

  useEffect(() => {
    fetchIns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchIns = async () => {
    const { data, error } = await supabase
      .from("etapes_concours")
      .select("*")
      .eq("ordre", 1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching inscription step:", error);
      setInscriptionStatus('error');
      return;
    }

    setInsStep(data);
    checkInscriptionPeriod(data);
  };

  const checkInscriptionPeriod = (step) => {
    const now = new Date();
    const startDate = new Date(step.date_debut);
    const endDate = step.date_fin ? new Date(step.date_fin) : null;

    if (now < startDate) {
      setInscriptionStatus('not-started');
    } else if (endDate && now > endDate) {
      setInscriptionStatus('ended');
    } else {
      setInscriptionStatus('active');
    }
  };

  const onFinish = async () => {
    setLoading(true);
    try {
      await pay_inscription(formData?.email);
      console.log('Paiement réussi!');
      router.push("/candidat");
    } catch (error) {
      message.error("Échec de l'initialisation du paiement");
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const nextStep = async () => {
    setLoading(true);
    try {
      await form.validateFields(steps[currentStep].fields);
      const updatedFormData = { ...formData, ...form.getFieldsValue() };
      setFormData(updatedFormData);

      if (currentStep === 2) {
        await sendVerificationCode(updatedFormData?.email, updatedFormData?.password);
        await signInUser(updatedFormData?.email, updatedFormData?.password);
        
        const candidatData = {
          name: updatedFormData?.name,
          email: updatedFormData?.email,
          age: updatedFormData?.age,
          school: updatedFormData?.school || null,
          phone: updatedFormData?.phone,
          city: updatedFormData?.city,
          motivation: updatedFormData?.motivation,
        };
        await insertCandidatData(candidatData);
        console.log('Inscription complete!');
      }

      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log('Validation failed:', error);
      message.error(error.message || "Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    {
      title: 'Informations personnelles',
      fields: ['name', 'email', 'age', 'school'],
      content: (
        <>
          <Form.Item
            name="name"
            label="Nom complet"
            rules={[{ required: true, message: 'Veuillez entrer votre nom' }]}
          >
            <Input className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Veuillez entrer votre email' }, { type: 'email', message: 'Veuillez entrer un email valide' }]}
          >
            <Input className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
          </Form.Item>
          <Form.Item
            name="age"
            label="Âge"
            rules={[{ required: true, message: 'Veuillez entrer votre âge' }]}
          >
            <Input type="number" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
          </Form.Item>
          <Form.Item name="school" label="École/Faculté (laissez vide si non étudiant)">
            <Input className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Coordonnées et motivation',
      fields: ['motivation', 'phone', 'city'],
      content: (
        <>
          <Form.Item
            name="phone"
            label="Numéro de téléphone (WhatsApp)"
            rules={[{ required: true, message: 'Veuillez entrer votre numéro de téléphone' }]}
          >
            <Input className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
          </Form.Item>
          <Form.Item
            name="city"
            label="Ville de résidence"
            rules={[{ required: true, message: 'Veuillez entrer votre ville de résidence' }]}
          >
            <Input className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
          </Form.Item>
          <Form.Item
            name="motivation"
            label="Motivations à vouloir participer"
            rules={[{ required: true, message: 'Veuillez entrer vos motivations' }]}
          >
            <TextArea rows={4} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Sécurité',
      fields: ['password', 'confirm', 'agreement'],
      content: (
        <>
          <Form.Item
            name="password"
            label="Mot de passe"
            rules={[{ required: true, message: 'Veuillez entrer votre mot de passe' }]}
          >
            <Input.Password className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Confirmer le mot de passe"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Veuillez confirmer votre mot de passe' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Les deux mots de passe ne correspondent pas'));
                },
              }),
            ]}
          >
            <Input.Password className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
          </Form.Item>
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Vous devez accepter les conditions')) },
            ]}
          >
            <Checkbox className="text-gray-600">
              {"J'accepte les"} <a href="#" className="font-medium text-primary-600 hover:underline">{"Conditions d'utilisation"}</a>
            </Checkbox>
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Paiement',
      fields: [],
      content: (
        <>
          <p className="mb-2">Veuillez effectuer le paiement de 2000 FCFA pour finaliser votre inscription.</p>
        </>
      ),
    },
  ];

  const renderLogo = () => (
    <div className='w-full flex justify-center mb-6'>
      <Link href="/">
        <Image src="/assets/logo.svg" alt='comète' width={180} height={160} /> 
      </Link> 
    </div>
  );

  const renderHomeLink = () => (
    <div className="mt-4 text-center">
      <Link href="/">
        <span className="text-primary-600 hover:text-primary-500">{"Retour à la page d'accueil"}</span>
      </Link>
    </div>
  );

  if (inscriptionStatus === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        {renderLogo()}
        <Spin size="large" />
        {renderHomeLink()}
      </div>
    );
  }

  if (inscriptionStatus === 'not-started') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        {renderLogo()}
        <Result
          status="info"
          title="L'inscription n'a pas encore commencé"
          subTitle={`Les inscriptions débuteront le ${new Date(insStep.date_debut).toLocaleDateString()}.`}
        />
        {renderHomeLink()}
      </div>
    );
  }

  if (inscriptionStatus === 'ended') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        {renderLogo()}
        <Result
          status="warning"
          title="La période d'inscription est terminée"
          subTitle="Désolé, les inscriptions sont closes pour le moment."
        />
        {renderHomeLink()}
      </div>
    );
  }

  if (inscriptionStatus === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        {renderLogo()}
        <Result
          status="error"
          title="Une erreur s'est produite"
          subTitle="Nous n'avons pas pu récupérer les informations d'inscription. Veuillez réessayer plus tard."
        />
        {renderHomeLink()}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex-grow flex flex-col py-4 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          {renderLogo()}
          <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center">{steps[currentStep].title}</h2>
            <Form
              form={form}
              name="signup-form"
              layout="vertical"
              initialValues={{ remember: true }}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              className="space-y-4"
            >
              <div className="space-y-4">
                {steps[currentStep].content}
              </div>
              <div className="flex justify-between pt-4">
                {currentStep > 0 && (
                  <Button onClick={prevStep} disabled={loading} className="text-primary-500 hover:text-primary-600">
                    Précédent
                  </Button>
                )}
                {currentStep < steps.length - 1 ? (
                  <Button type="primary" onClick={nextStep} disabled={loading}>
                    {loading ? <Spin /> : 'Suivant'}
                  </Button>
                ) : (
                  <Button type="primary" onClick={onFinish} disabled={loading}>
                    {loading ? <Spin /> : 'Payer'}
                  </Button>
                )}
              </div>
            </Form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {'Déjà inscrit ?'}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/login">
                  <button
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    disabled={loading}
                  >
                    {'Se connecter ?'}
                  </button>
                </Link> 
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-4">
        {renderHomeLink()}
      </div>
    </div>
  );
};