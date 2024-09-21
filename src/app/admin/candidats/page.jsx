"use client"
// import Navbar from '../components/Navbar';  // Assurez-vous que le chemin est correct
// import CandidatsTable from '../components/CandidatsTable';
import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import  Navbar from "./NavBar"
import CandidatsTable from "./Filter"

const AdminCandidatsPage = () => {
  const [candidats, setCandidats] = useState([]);

  useEffect(() => {
    const fetchCandidats = async () => {
      const { data, error } = await supabase.from('candidats').select('*');
      if (error) {
        console.error('Erreur lors de la récupération des candidats:', error);
      } else {
        setCandidats(data);
      }
    };
    fetchCandidats();
  }, []);

  return (
    <div>
      <Navbar title='Candidats' />
      <div className="container mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">Gestion des Candidats</h1>
      <Suspense>
        <CandidatsTable candidats={candidats} />
        </Suspense> 
      </div>
    </div>
  );
};

export default AdminCandidatsPage;
