"use client"
import React from 'react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="bg-[#193A5D] dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        <a href="#" className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700" role="alert">
          <span className="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3"> 🔥🔥 </span>
          <span className="text-sm font-medium"> 200.000 CFA à gagner 🚀 </span>
          <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
          </svg>
        </a>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-200 md:text-5xl lg:text-6xl dark:text-white">{"Rejoignez le Concours d'Éloquence 2024"}</h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400"> Développez vos compétences en art oratoire, inspirez votre audience, et courez la chance de gagner de magnifiques prix !</p>
        <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <Link href="/signup" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
            S&apos;enregistrer
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </Link>
          <Link href="/reservations" className="max-sm:hidden dark:text-white text-primary-700 border border-primary-700 hover:bg-primary-700 hover:text-white focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2"> Reserver </Link>
        </div>
        <div className="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
          <span className="font-semibold text-gray-400 uppercase">Nos partenaires</span>
          <div className="flex flex-wrap justify-center items-center mt-8 text-gray-500 sm:justify-between">
            <a href="#" className="mr-5 mb-5 lg:mb-0 hover:text-gray-800 dark:hover:text-gray-400">
              <svg className="h-8" viewBox="0 0 132 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Ajoute ici le contenu SVG */}
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
