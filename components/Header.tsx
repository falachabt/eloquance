"use client"
import Image from 'next/image';
import Link from 'next/link'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path  : any) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50">
  <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
      <Link href="/" className="flex items-center">
        <Image
          height={90}
          width={120}
          src="/assets/logo.svg"
          className="mr-3 max-sm:w-[80px] max-sm:scale-125"
          alt="Comète logo"
        />
      </Link>
      <div className="flex items-center lg:order-2">
        <Link
          href="#"
          className="max-sm:hidden dark:text-white text-primary-700 border border-primary-700 hover:bg-primary-700 hover:text-white focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2"
        >
          Se connecter
        </Link>
        <Link
          href="/signup"
          className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
        >
          Participer !
        </Link>
        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="mobile-menu-2"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className={`w-6 h-6 ${isMenuOpen ? "hidden" : "block"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
          <svg
            className={`w-6 h-6 ${isMenuOpen ? "block" : "hidden"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
      <div
        className={`lg:flex lg:w-auto lg:order-1 ${
          isMenuOpen ? "block" : "hidden"
        }`}
        id="mobile-menu-2"
      >
        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
          {[
            { href: "/", label: "Accueil" },
            { href: "/reservations", label: "Réserver" },
            { href: "/vote", label: "Voter" },
          ].map((item) => (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                className={`block py-2 pr-4 pl-3 lg:p-0 transition-all duration-300 ease-in-out
                  ${isActive(item.href)
                    ? "text-primary-700 dark:text-white font-bold lg:bg-transparent"
                    : "text-gray-700 dark:text-gray-400 hover:bg-gray-50 lg:hover:bg-transparent lg:hover:text-primary-700"
                  }
                  ${isActive(item.href) && "lg:scale-110"}
                `}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-700 dark:bg-white transform scale-x-0 transition-transform duration-300 ease-in-out lg:group-hover:scale-x-100"></span>
                )}
              </Link>
              {isActive(item.href) && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary-700 dark:bg-white lg:block hidden"></span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </nav>
</header>

  )
}

export default Header