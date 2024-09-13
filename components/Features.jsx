import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const FeaturesSection = () => {
  return (
    <section class="">
    <div className="bg-white text-gray-900 py-16 px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Vous avez la parole !!!</h2>
        <p className="text-lg mb-12">
        Rejoignez le mouvement dès aujourd'hui ! Inscrivez-vous maintenant pour prouver que vous avez la parole, inspirez les autres et gagnez des récompenses prestigieuses</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Inscription */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-500 p-3 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Étape 1: Inscription</h3>
            <ul className="space-y-2 text-left">
              <li>✅ Remplissage des informations personnelles</li>
              <li>✅ Paiement des frais d'inscription</li>
              <li>✅ Lien Instagram fourni pour participation</li>
            </ul>
          </div>

          {/* Préselection */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-purple-500 p-3 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l4-4-4-4m8 0l-4 4 4 4" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Étape 2: Préselection</h3>
            <ul className="space-y-2 text-left">
              <li>✅ Vidéo de présentation postée sur Instagram</li>
              <li>✅ Première élimination par les organisateurs</li>
            </ul>
          </div>

          {/* Compétition */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-teal-500 p-3 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c.37 0 .737-.055 1.087-.158a4 4 0 10-6.174 0A4.992 4.992 0 0012 11z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Étape 3: Compétition</h3>
            <ul className="space-y-2 text-left">
              <li>✅ Quart de finale, demi-finale, et finale</li>
              <li>✅ Votes en ligne gratuits pour les phases initiales</li>
              <li>✅ Votes payants pour la finale (500 FCFA)</li>
              <li>✅ Avis du jury à chaque étape</li>
            </ul>
          </div>
        </div>

        <div class=" mt-10 flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
    <Link href="/signup" class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-primary-700 border border-primary-700 rounded-lg hover:bg-primary-700 hover:text-white focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
        Rejoindre la compétition
        <svg class="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
    </Link>
</div>

      </div>
    </div>
    <section class="bg-white dark:bg-gray-900">
   
</section>


</section>
  );
};



// <div className="bg-gray-900 text-white py-16 px-8">
// <div className="max-w-7xl mx-auto text-center">
//   <h2 className="text-4xl font-bold mb-4">Secure platform, secure data</h2>
//   <p className="text-lg mb-12">
//     Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.
//   </p>
//   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//     <div className="bg-gray-800 p-6 rounded-lg">
//       <div className="flex items-center justify-center mb-4">
//         <div className="bg-blue-600 p-3 rounded-full">
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 4v16m8-8H4"
//             />
//           </svg>
//         </div>
//       </div>
//       <h3 className="text-xl font-semibold mb-2">Project Management</h3>
//       <ul className="space-y-2">
//         <li>✅ Unified Contribution Graph</li>
//         <li>✅ Org activity graph</li>
//         <li>✅ Org dependency insights</li>
//         <li>✅ Milestones</li>
//         <li>✅ Repo insights</li>
//       </ul>
//     </div>

//     {/* Collaborative Coding */}
//     <div className="bg-gray-800 p-6 rounded-lg">
//       <div className="flex items-center justify-center mb-4">
//         <div className="bg-purple-600 p-3 rounded-full">
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M8 16l4-4-4-4m8 0l-4 4 4 4"
//             />
//           </svg>
//         </div>
//       </div>
//       <h3 className="text-xl font-semibold mb-2">Collaborative Coding</h3>
//       <ul className="space-y-2">
//         <li>✅ Dynamic reports and dashboards</li>
//         <li>✅ Code review assignments</li>
//         <li>✅ Team discussions</li>
//         <li>✅ Protected branches</li>
//         <li>✅ Draft pull requests</li>
//       </ul>
//     </div>

//     {/* Enterprise Security */}
//     <div className="bg-gray-800 p-6 rounded-lg">
//       <div className="flex items-center justify-center mb-4">
//         <div className="bg-teal-600 p-3 rounded-full">
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 11c.37 0 .737-.055 1.087-.158a4 4 0 10-6.174 0A4.992 4.992 0 0012 11z"
//             />
//           </svg>
//         </div>
//       </div>
//       <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
//       <ul className="space-y-2">
//         <li>✅ Required reviews</li>
//         <li>✅ Dependabot security</li>
//         <li>✅ Dependency graph</li>
//         <li>✅ GitHub Advisory Database</li>
//         <li>✅ GPG commit signing verification</li>
//       </ul>
//     </div>
//   </div>
// </div>
// </div>
