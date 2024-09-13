"use client"
import React from 'react';
import { Carousel } from 'antd';
import { div } from 'framer-motion/client';
const contentStyle = {
  maxHeight: '360px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#FED536',
};

export const OldSessions = () => (
    <div className='bg-white'>

    <div className='gap-8 items-center  px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 py-16 lg:px-6'>
  <div>
    <h2 className="text-4xl font-bold mb-4">Retour sur les éditions précédentes</h2>
    <p className="text-lg mb-12">
      Plongez dans l'atmosphère inoubliable des éditions précédentes de "VOUS AVEZ LA PAROLE". Revivez les moments forts et les discours marquants qui ont inspiré des centaines de jeunes orateurs. Inscrivez-vous dès aujourd'hui et faites partie des talents qui marqueront cette nouvelle édition !
    </p>
  </div>
  <div>
    <Carousel  autoplay arrows infinite={false}>
    {
        Array.from({ length: 7 }, (_, index) => index + 1).map((item) => (
          <div style={contentStyle} key={item}>
            <img
            className='h-[360px] w-full'
              src={`/assets/${item}.jpg`}
              alt={`Old Session ${item}`}
            />
          </div>
        ))
  
    }
    
    </Carousel>
  </div>
    </div>
</div>

);
export default OldSessions;