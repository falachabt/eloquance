import Footer from "@/components/Footer";
import Header from "@/components/Header";;
import { Button, Divider } from "antd";
import {  EloquenceCompetitionReservation } from "./_components/Reservations"

import { postData, sendEmail } from "@/lib/sendEmail"
export default function ReservationPage() {
  return (
    <div className="h-full flex flex-col">
         <div className="border-b" >
        <Header/> 
          </div> 

          <div className=" flex-1 ">

 <EloquenceCompetitionReservation /> 
          </div>


 <Footer/> 
    </div>
  );
}




export const metadata = {
  title: 'Réserver - Assistez au Concours VOUS AVEZ LA PAROLE',
  description: 'Réservez votre place pour assister à la deuxième édition du concours d’éloquence VOUS AVEZ LA PAROLE, qui aura lieu au CENAJES de Dschang.',
  openGraph: {
    title: 'Réserver - Concours VOUS AVEZ LA PAROLE',
    description: 'Ne manquez pas cet événement ! Réservez votre place pour assister à l’un des événements phares du Cameroun.',
    url: 'https://votresite.com/reservation',
    siteName: 'VOUS AVEZ LA PAROLE',
    images: [
      {
        url: 'https://votresite.com/images/reservation.png',
        width: 1200,
        height: 630,
        alt: 'Page de réservation',
      }
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Réserver - VOUS AVEZ LA PAROLE',
    description: 'Réservez votre place pour être témoin des talents oratoires des jeunes Camerounais.',
    images: ['https://votresite.com/images/reservation.png'],
  }
};
