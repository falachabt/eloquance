"use client"
import { IconTicket } from "@tabler/icons-react";
import { Button } from "antd";


export function ReservationSection() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-primary-500 mb-4">
          Assistez à la grande finale !
        </h2>
        <p className="text-lg text-neutral-600 mb-8">
          Ne manquez pas l'opportunité d'assister à la finale du concours d'éloquence "VOUS AVEZ LA PAROLE". 
          Venez encourager les finalistes et vivez une expérience oratoire unique. Réservez dès maintenant votre place pour seulement 
          <span className="font-bold text-primary-500"> 1000 FCFA</span>.
        </p>

        <div className="flex justify-center">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg">
            <IconTicket className="mx-auto text-primary-500 mb-4" size={64} />
            <p className="text-lg font-medium text-neutral-700 mb-6">
              Finalisez votre réservation en quelques clics et venez vivre un moment unique le jour de la grande finale !
            </p>
            <Button 
              className="w-full text-white bg-primary-500 hover:bg-primary-600 transition-colors duration-200 py-3 px-6 rounded-full text-lg"
              onClick={() => handleReservation()}
            >
              Réserver ma place maintenant
            </Button>
            <p className="text-sm text-neutral-500 mt-4">
              * Le paiement s'effectue en ligne et garantit votre place pour la finale.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function handleReservation() {
  // Logique pour gérer la réservation, redirection vers une page de paiement ou autre
  window.location.href = "/reservation"; // Remplacez par la bonne route de réservation
}
