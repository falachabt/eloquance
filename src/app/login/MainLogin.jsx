"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { message } from 'antd';

export const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetStep, setResetStep] = useState(0);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Implement your login logic here
      const { data , error }  = await supabase.auth.signInWithPassword({ email, password })
     if(error){
        message.error("echece de la connexion")
     }
      // If login is successful, redirect to dashboard
      router.push('/candidat');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Échec de la connexion. Veuillez réessayer.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      if (resetStep === 0) {
        // Send OTP
        // Implement sendVerificationCode(email) here
        console.log('Sending OTP to:', email);
        setResetStep(1);
        alert('Un code de vérification a été envoyé à votre adresse e-mail.');
      } else if (resetStep === 1) {
        // Verify OTP
        // Implement checkOtp(email, otp) here
        console.log('Verifying OTP:', otp);
        setResetStep(2);
        alert('Code de vérification confirmé. Veuillez définir un nouveau mot de passe.');
      } else {
        // Set new password
        // Implement updateUserPassword(email, newPassword) here
        console.log('Setting new password');
        alert('Mot de passe mis à jour avec succès. Veuillez vous connecter.');
        setIsResetMode(false);
        setResetStep(0);
      }
    } catch (error) {
      console.error('Reset password failed:', error);
      alert('Une erreur s\'est produite. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          src="/assets/logo.svg"
          alt="Logo"
          width={150}
          height={24}
          className="mx-auto"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isResetMode ? 'Réinitialisation du mot de passe' : 'Connexion à votre compte'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={isResetMode ? handleResetPassword : handleLogin} className="space-y-6">
            {!isResetMode || resetStep === 0 ? (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse e-mail
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            ) : null}

            {!isResetMode ? (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            ) : null}

            {isResetMode && resetStep === 1 ? (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Code de vérification
                </label>
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            ) : null}

            {isResetMode && resetStep === 2 ? (
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  Nouveau mot de passe
                </label>
                <div className="mt-1">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            ) : null}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isResetMode
                  ? resetStep === 0
                    ? 'Envoyer le code de vérification'
                    : resetStep === 1
                    ? 'Vérifier le code'
                    : 'Réinitialiser le mot de passe'
                  : 'Se connecter'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isResetMode ? 'Ou' : 'Problème de connexion ?'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  setIsResetMode(!isResetMode);
                  setResetStep(0);
                }}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                {isResetMode ? 'Retour à la connexion' : 'Mot de passe oublié ?'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
