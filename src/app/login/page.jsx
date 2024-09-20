import React from 'react'
import { LoginPage } from "./MainLogin"

const page = () => {
  return (
     <LoginPage/> 
  )
}

export default page

export const metadata = {
    title: 'Connexion - Concours d’Éloquence VOUS AVEZ LA PAROLE',
    description: 'Connectez-vous à votre compte pour accéder à vos informations de participation au concours d’éloquence.',
    openGraph: {
      title: 'Connexion - Concours VOUS AVEZ LA PAROLE',
      description: 'Connectez-vous pour gérer votre participation au concours d’éloquence.',
      url: 'https://votresite.com/login',
      siteName: 'VOUS AVEZ LA PAROLE',
      images: [
        {
          url: 'https://votresite.com/images/login.png',
          width: 1200,
          height: 630,
          alt: 'Page de connexion',
        }
      ],
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Connexion - VOUS AVEZ LA PAROLE',
      description: 'Accédez à votre compte pour voir vos informations de participation.',
      images: ['https://votresite.com/images/login.png'],
    }
  };
  