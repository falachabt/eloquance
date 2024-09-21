import Footer from "@/components/Footer";
import Header from "@/components/Header";;
import {  EloquenceCompetitionReservation } from "./_components/Reservations"

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
  
};
