import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Cta = () => {
  return (
    <div className="px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
      <div className="gap-8 items-center md:grid md:grid-cols-2 xl:gap-16">
        <div className="relative w-full aspect-video md:aspect-square">
          <Image
            fill
            className="object-cover rounded-lg dark:hidden"
            src="/assets/IMG-20240905-WA0058.jpg"
            alt="Dashboard in light mode"
          />
          <Image
            fill
            className="object-cover rounded-lg hidden dark:block"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup-dark.svg"
            alt="Dashboard in dark mode"
          />
        </div>
        <div className="mt-4 md:mt-0">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Exploitez votre talent, partagez vos idées et faites entendre votre voix.
          </h2>
          <p className="mb-6 font-light text-gray-700 md:text-lg dark:text-gray-400">
            Le concours d&apos;éloquence &quot;VOUS AVEZ LA PAROLE&quot; est l&apos;opportunité parfaite pour vous démarquer, inspirer les autres et développer vos talents oratoires. Relevez le défi et faites partie des jeunes qui changent le Cameroun en participant à cette compétition passionnante.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900"
          >
            Participez maintenant
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cta