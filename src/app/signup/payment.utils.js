"use client"

import { notchpay } from "../../../lib/notchpay";



export async function inscription_pay(d = false){
  const paymentInitiated = await notchpay.payments.initializePayment({
    currency: "XAF",
    amount: 2000,
    phone: "657273753",
    reference: generateReadableId(),
    description: "Payment of the insription for la comète site",
    callback: !d ? "http://comete.ezadrive.com/reservations" : "http://comete.ezadrive.com/candidat",
  });


  return { url :  paymentInitiated.authorization_url , trx_id : paymentInitiated.transaction.reference }
}





function generateReadableId() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let id = 'REF.';

    // Generate 3 random letters
    for (let i = 0; i < 4; i++) {
        id += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    id += '-' 

    // Generate 3 random numbers
    for (let i = 0; i < 3; i++) {
        id += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    return id;
}


