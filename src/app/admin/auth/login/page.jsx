"use client";
import React from 'react';
import { supabase } from "@/lib/supabase"; // Assurez-vous que le chemin est correct
import { useRouter } from 'next/navigation';
import { message } from 'antd';

const Page = () => {
  const router = useRouter();

  async function loginFormSubmit(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');

    console.log(email, password);

    

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      message.error("Erreur avec vos identifiants");
      return;
    }

    // Récupérer les métadonnées de l'utilisateur connecté
    const user = data.user;

    if (user) {
      const { user_metadata } = user; // Accès direct aux métadonnées
      
      // console.log("meat", user_metadata)
      if (user_metadata?.role === 'admin') {
        router.push('/admin/candidats'); // Redirection vers la page admin
      } else {
        await supabase.auth.signOut(); // Déconnexion si ce n'est pas un admin
        message.error("Erreur avec vos identifiants, ceci est une page réservée");
      }
    }else{
      console.log("no user bro")
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-36 h-40 mr-2" src="/assets/logo.svg" alt="logo" />
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Connectez-vous
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={loginFormSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mot de passe</label>
                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Se souvenir de moi</label>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Se connecter</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Page;
