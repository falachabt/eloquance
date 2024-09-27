"use client";
import React from 'react';
import { Carousel, Image } from 'antd';
import Link from 'next/link';

const contentStyle = {
  lineHeight: '160px',
  textAlign: 'center',
  background: '#FED536',
};

const imageStyle = {
  width: '100%',
  maxWidth: '550px',
  height: 'auto',
};

export const OldSessions = () => (
  <div className='bg-white'>
    <div className='gap-10 items-center px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 py-16 lg:px-6'>
      <div>
        <h2 className="text-4xl font-bold mb-4">Retour sur les éditions précédentes</h2>
        <p className="text-lg mb-6">
          {`Plongez dans l'atmosphère inoubliable des éditions précédentes de "VOUS AVEZ LA PAROLE". 
          Revivez les moments forts et les discours marquants qui ont inspiré des centaines de jeunes orateurs. 
          Inscrivez-vous dès aujourd'hui et faites partie des talents qui marqueront cette nouvelle édition !`}
        </p>
        <Link
          href="/signup"
          className="inline-block text-white mb-8 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
        >
          Participer !
        </Link>
      </div>
      <div className='max-w-[550px] mx-auto'>
        <style jsx>{`
          @media (max-width: 768px) {
            .ant-image {
              width: 390px !important;
            }
          }
        `}</style>
        <Carousel autoplay arrows infinite={false}>
          {Array.from({ length: 7 }, (_, index) => index + 1).map((item) => (
            <div style={contentStyle} key={item}>
              <Image
                src={`/assets/${item}.jpg`}
                alt={`Old Session ${item}`}
                width={550}
                height={320}
                style={imageStyle}
              />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  </div>
);

export default OldSessions;