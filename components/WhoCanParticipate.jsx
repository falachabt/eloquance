"use client";
import React from 'react';
import { IconMapPin, IconCalendarEvent, IconMicrophone, IconInfoCircle } from '@tabler/icons-react';

export const EligibilitySection = () => (
  <section className="bg-gray-800 mt-10 py-16">
    <div className="container mx-auto px-4 text-white">
      <h2 className="text-4xl font-bold text-center mb-8">
        Détails du Concours
      </h2>
      
      {/* Grand Message d'inscription */}
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold text-yellow-500">
          Inscriptions ouvertes à partir du 30 septembre !
        </h3>
      </div>

      <div className="max-w-4xl mx-auto bg-gray-900 p-10 rounded-lg shadow-lg space-y-12">
        {/* Qui */}
        <div className="flex items-start space-x-4 hover:bg-gray-700 p-4 rounded transition duration-300">
          <IconMicrophone className="text-yellow-500 w-16 h-16" />
          <div>
            <h3 className="text-2xl font-semibold">Qui peut participer ?</h3>
            <p className="text-gray-300">
              {"Le concours est ouvert aux jeunes Camerounais âgés de 16 à 30 ans, résidant au Cameroun ou à l'étranger, capables de s'exprimer couramment en français."}
            </p>
          </div>
        </div>

        {/* Où */}
        <div className="flex items-start space-x-4 hover:bg-gray-700 p-4 rounded transition duration-300">
          <IconMapPin className="text-yellow-500 w-16 h-16" />
          <div>
            <h3 className="text-2xl font-semibold">Où se déroule le concours ?</h3>
            <p className="text-gray-300">
              Le concours se tiendra a <strong>Yaounde</strong>, un lieu historique de rassemblement pour des événements éducatifs et culturels.
            </p>
          </div>
        </div>

        {/* Quand */}
        <div className="flex items-start space-x-4 hover:bg-gray-700 p-4 rounded transition duration-300">
          <IconCalendarEvent className="text-yellow-500 w-16 h-16" />
          <div>
            <h3 className="text-2xl font-semibold">Quand aura lieu le concours ?</h3>
            <p className="text-gray-300">
              Le concours débutera avec les inscriptions à partir du <strong>30 septembre</strong>. Les phases de présélection, quart de finale, demi-finale et finale seront annoncées ultérieurement.
            </p>
          </div>
        </div>

        {/* Comment */}
        <div className="flex items-start space-x-4 hover:bg-gray-700 p-4 rounded transition duration-300">
          <IconInfoCircle className="text-yellow-500 w-16 h-16" />
          <div>
            <h3 className="text-2xl font-semibold">Comment participer ?</h3>
            <p className="text-gray-300">
             {" Pour participer, inscrivez-vous en ligne via notre plateforme officielle à partir du 30 septembre. Vous devrez soumettre une vidéo de présélection et répondre aux critères d'éligibilité."}
            </p>
          </div>
        </div>
      </div>
      
      {/* Call-to-action */}
      <div className="mt-12 text-center">
        <a
          href="#"
          className="inline-block px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-600 transition-colors"
        >
          Inscrivez-vous dès maintenant !
        </a>
      </div>
    </div>
  </section>
);

export default EligibilitySection;
