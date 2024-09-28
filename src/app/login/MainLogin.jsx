"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { message, Spin } from 'antd';
import Link from 'next/link';

export const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetStep, setResetStep] = useState(0);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.auth.signOut();
      }
    };
    checkSession();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await supabase.auth.signOut();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        message.success("Connexion réussie");
        router.replace('/candidat');
      } else {
        throw new Error("Aucun utilisateur retourné après la connexion");
      }
    } catch (error) {
      console.error('Login failed:', error);
      message.error(error.message || 'Échec de la connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (resetStep === 0) {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
        message.success('Un code de vérification a été envoyé à votre adresse e-mail.');
        setResetStep(1);
      } else if (resetStep === 1) {
        const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
        if (error) throw error;
        message.success('Code de vérification confirmé. Veuillez définir un nouveau mot de passe.');
        setResetStep(2);
      } else {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        message.success('Mot de passe mis à jour avec succès. Veuillez vous connecter.');
        setIsResetMode(false);
        setResetStep(0);
      }
    } catch (error) {
      console.error('Reset password failed:', error);
      message.error(error.message || 'Une erreur s\'est produite. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col sm:justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href={"/"}>
          <Image
            src="/assets/logo.svg"
            alt="Logo"
            width={150}
            height={24}
            className="mx-auto"
          />
        </Link> 
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
              </div>
            ) : null}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? <Spin /> : (
                  isResetMode
                    ? resetStep === 0
                      ? 'Envoyer le code de vérification'
                      : resetStep === 1
                      ? 'Vérifier le code'
                      : 'Réinitialiser le mot de passe'
                    : 'Se connecter'
                )}
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

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsResetMode(!isResetMode);
                  setResetStep(0);
                }}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                disabled={loading}
              >
                {isResetMode ? 'Retour à la connexion' : 'Mot de passe oublié ?'}
              </button>
              <Link href={"/signup"}>
                <button
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  disabled={loading}
                >
                  Inscription
                </button>
              </Link> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};