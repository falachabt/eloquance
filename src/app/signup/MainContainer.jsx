"use client"
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, Steps, message } from 'antd';
import Image from 'next/image';
import { checkOtp, insertCandidatData, pay_inscription, sendVerificationCode, updateUserPassword } from "./utils"
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
const { TextArea } = Input;
const { Step } = Steps;

export const SignUpForm = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [otp, setOtp] = useState(''); 
  const [formData, setFormData] = useState({}); // State to store form data
  const router = useRouter();
  const [insStep, setInsStet] = useState(null);


  useEffect( () => {
fetchIns()
  } , [] )


  const fetchIns = async  () => {
    const { data , error } = await supabase.from("etapes_concours").select("*").eq("ordre", 1).maybeSingle();
    if (error) throw error
    setInsStet(data)
    return data
    
  } 

  const onFinish = async () => {
    try {
      await pay_inscription(formData?.email);

      // Handle success message
      console.log('Paiement réussi!');

      router.push("/candidat")
    } catch (error) {
      message.error("failed to initialize the paiement")
      console.log("error", error)
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const nextStep = async () => {
    try {
      await form.validateFields(steps[currentStep].fields);

      
   

      // Update formData with the current step's values
      const updatedFormData = { ...formData, ...form.getFieldsValue() };
      console.log(updatedFormData)
      setFormData(updatedFormData);

      if(currentStep === 0){
        await sendVerificationCode(updatedFormData?.email)
      }

      if (currentStep === 1) {
        await checkOtp(updatedFormData?.email , updatedFormData?.otp);
      }

      if (currentStep === 3) {

        // Update user password
        await updateUserPassword(updatedFormData?.email, updatedFormData?.password);
    
        // Insert formData into 'candidats' table
        const candidatData = {
          name: updatedFormData?.name,
          email: updatedFormData?.email,
          age: updatedFormData?.age,
          school: updatedFormData?.school || null, // Handle optional field
          phone: updatedFormData?.phone,
          city: updatedFormData?.city,
          motivation: updatedFormData?.motivation,
        };
    
        await insertCandidatData(candidatData);
    
        // Handle success message
        console.log('Inscription complete!');
      }




      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log('Validation failed:', error);
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
            <Input
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Veuillez entrer votre email' },
              { type: 'email', message: 'Veuillez entrer un email valide' }
            ]}
          >
            <Input
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </Form.Item>
          <Form.Item
            name="age"
            label="Âge"
            rules={[{ required: true, message: 'Veuillez entrer votre âge' }]}
          >
            <Input
              type="number" 
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </Form.Item>
          <Form.Item
            name="school"
            label="École/Faculté (laissez vide si non étudiant)"
          >
            <Input
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Confirmation d\'email',
      fields: ['otp'],
      content: (
        <>
          <p className="mb-2">Un code de confirmation a été envoyé à votre adresse email.</p>
          <Form.Item
            name="otp"
            label="Code de confirmation"
            rules={[{ required: true, message: 'Veuillez entrer le code de confirmation' }]}
          >
            <Input 
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            />
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
            <Input
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </Form.Item>
          <Form.Item
            name="city"
            label="Ville de résidence"
            rules={[{ required: true, message: 'Veuillez entrer votre ville de résidence' }]}
          >
            <Input 
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            />
          </Form.Item>
          <Form.Item
            name="motivation"
            label="Motivations à vouloir participer"
            rules={[{ required: true, message: 'Veuillez entrer vos motivations' }]}
          >
            <TextArea 
              rows={4} 
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            />
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
            <Input.Password 
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            />
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
            <Input.Password 
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            />
          </Form.Item>
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Vous devez accepter les conditions')) },
            ]}
          >
            <Checkbox className="text-gray-600 dark:text-gray-400">
              J'accepte les <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Conditions d'utilisation</a>
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
          {/* Add your payment integration here */}
          {/* Example: You can use a third-party payment gateway */}
        </>
      ),
    },
  ];

  if (insStep) {
    const isBeforeStart = new Date() < new Date(insStep?.date_debut);
    const isAfterEnd = new Date() > new Date(insStep?.date_fin);
  
    const message = isBeforeStart
      ? `Cette inscription ne peut pas commencer avant ${new Date(insStep?.date_debut).toLocaleDateString()}`
      : `Cette inscription est terminée depuis le ${new Date(insStep?.date_fin).toLocaleDateString()}`;
  
    return (
      <section className="bg-gray-50 dark:bg-gray-900 h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center max-w-md">
          <img src="/assets/logo.svg" alt="Logo" className="mx-auto mb-4 w-36 h-20 " />
          <p className="text-lg text-red-600 mb-4">{message}</p>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            En attendant, visitez notre site pour plus d'informations ou réservez une place pour assister à l'événement.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/login" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
              Se connecter
            </a>
            <a href="/reservations" className="bg-primary-500 text-gray-800 py-2 px-4 rounded hover:bg-primary-600 transition">
              Réserver une place
            </a>
          </div>
        </div>
      </section>
    );
  }
  

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center"> 
   
      <div className="w-full max-w-[950px] p-6 space-y-6 rounded-md shadow-md bg-white dark:bg-gray-800"> 
        <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <Image src="/assets/logo.svg" alt="logo comète" width={100} height={24} />
        </a>*
        insinsininin {
      JSON.stringify(insStep)
    }
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
       Inscrivez-Vous au Concours
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
          <span className="font-bold">Réalisez votre potentiel</span> dans un environnement 
          stimulant et rejoignez une communauté passionnée.
        </p> 
       
        <Form
          form={form}
          name="signup"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          className="space-y-4 md:space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps[currentStep].content}
          </div>
          <div className="flex justify-between mt-6 space-x-4">
            {currentStep > 0 && (
              <Button onClick={prevStep} className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Précédent
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button onClick={nextStep} className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Suivant
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary" htmlType="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Finaliser
              </Button>
            )}
          </div>
        </Form>
        <p className="text-center text-sm font-light text-gray-500 dark:text-gray-400">
          Vous avez déjà un compte ?{' '}
          <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
            Connectez-vous ici
          </a>
        </p>
      </div>
    </section>
  );
};



