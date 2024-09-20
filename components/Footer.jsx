import { MailOutlined, PhoneOutlined, FacebookOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-primary-100 py-4">
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <Image src="/assets/logo.svg" width={120} height={60} className="h-12 w-auto" alt="Comète Logo" />
          </Link>
          <nav className="flex flex-wrap items-center text-sm text-gray-500">
            <Link href="#" className="hover:underline mr-4">À propos</Link>
            <Link href="#" className="hover:underline mr-4">Politique de confidentialité</Link>
            <Link href="#" className="hover:underline mr-4">Licence</Link>
            <Link href="#" className="hover:underline">Contact</Link>
          </nav>
        </div>
        <hr className="my-3 border-gray-200" />
        <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
          <span>
            © 2024 <Link href="/" className="hover:underline">Groupe Comète™</Link>. Tous droits réservés.
          </span>
          <div className="flex items-center mt-2 sm:mt-0">
            <Link href="mailto:cometecameroun@gmail.com" className="text-gray-500 hover:text-gray-900 mr-3">
              <MailOutlined className="w-4 h-4" />
            </Link>
            <Link href="tel:+237694650142" className="text-gray-500 hover:text-gray-900 mr-3">
              <PhoneOutlined className="w-4 h-4" />
            </Link>
            <Link href="https://www.facebook.com/groupecomete" className="text-gray-500 hover:text-gray-900">
              <FacebookOutlined className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Téléphones: 694650142 / 651055663 / 695051893 / 658959491
        </div>
      </div>
    </footer>
  );
};

export default Footer;