import React from 'react'
import { SignUpForm  } from "./MainContainer"

const page = () => {
  return (
     <SignUpForm/> 
  )
}

export default page


export const metadata = {
    title: 'Inscription - Concours d’Éloquence VOUS AVEZ LA PAROLE',
    description: 'Inscrivez-vous au concours d’éloquence VOUS AVEZ LA PAROLE et rejoignez la compétition pour mettre en valeur votre talent oratoire.',
    openGraph: {
      title: 'Inscription - Concours d’Éloquence VOUS AVEZ LA PAROLE',
      description: 'Participez à la deuxième édition du concours VOUS AVEZ LA PAROLE en vous inscrivant dès maintenant. Montrez vos compétences en éloquence !',
      url: 'https://votresite.com/signup',
      siteName: 'VOUS AVEZ LA PAROLE',
      images: [
        {
          url: 'https://votresite.com/images/signup.png',
          width: 1200,
          height: 630,
          alt: 'Page d’inscription',
        }
      ],
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Inscription - VOUS AVEZ LA PAROLE',
      description: 'Rejoignez la compétition ! Inscrivez-vous dès aujourd’hui pour participer au concours d’éloquence.',
      images: ['https://votresite.com/images/signup.png'],
    }
  };
  