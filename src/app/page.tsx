import Page from "@/components/page"


export const metadata = {
  title: 'VOUS AVEZ LA PAROLE - Concours d’Éloquence 2024',
  description: 'Découvrez la deuxième édition du concours d’éloquence VOUS AVEZ LA PAROLE, organisé par l’Association COMÈTE, pour encourager la jeunesse camerounaise à développer leur talent oratoire et à réfléchir sur des sujets d’actualité.',
  openGraph: {
    title: 'VOUS AVEZ LA PAROLE - Concours d’Éloquence 2024',
    description: 'Participez à l’événement qui met en avant les jeunes talents oratoires au Cameroun. Inscrivez-vous dès maintenant !',
    url: 'https://comete.ezadrive.com/',
    siteName: 'VOUS AVEZ LA PAROLE',
    images: [
      {
        url: 'https://comete.ezadrive.com/twitter-image.png',
        width: 1200,
        height: 630,
        alt: 'Concours d’éloquence 2024',
      }
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VOUS AVEZ LA PAROLE - Concours d’Éloquence 2024',
    description: 'Rejoignez le concours qui fait briller les talents oratoires de la jeunesse camerounaise !',
    images: ['https://comete.ezadrive.com/twitter-image.png'],
  }
};



export default function Home() {
  return <Page />
}