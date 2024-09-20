"use client"
import { message } from "antd";
import { notchpay } from "@/lib/notchpay";
import { supabase } from "@/lib/supabase"



export async function pay(){
  const paymentInitiated = await notchpay.payments.initializePayment({
    currency: "XAF",
    amount: 1000,
    phone: "657273753",
    reference: generateReadableId(),
    description: "Payment for testing the Notch Pay SDK",
    callback: "http://localhost:3000/reservations",
  });


  return { url :  paymentInitiated.authorization_url , trx_id : paymentInitiated.transaction.reference }
}



export async function handlePayment(participants, emailInCookies) {
 

  if(!emailInCookies) message.error("Connectez vous pour resever ")

    try {
      
  
      const paymentInitiated = await notchpay.payments.initializePayment({
        currency: "XAF",
        amount: participants?.length * 1000,
        emailInCookies,
        phone: "657273753",
        reference: "ref." + (Math.floor(Math.random() * (2000 - 100 + 1)) + 100),
        description: "Payment for testing the Notch Pay SDK",
        callback: "http://localhost:3000/reservations",
        metadata: {
          emailInCookies,
          start: new Date(),
        },
      });
  
      // Open the payment page
      window.open(paymentInitiated.authorization_url);

      participants?.map( async (p) => {
        const { error: statusError } = await supabase
        .from("reservations")
        .insert({
          id: generateReadableId() ,
          quantite : participants?.length,
          montant_total : participants?.length * 1000,
          name : p.name,
          email: emailInCookies,
          data: { email : emailInCookies, start: new Date() },
          trx_id : paymentInitiated.transaction.reference 
        })

        console.log("error :", statusError)

      } )
  
    } catch (error) {
      message.error(error.message);
    }
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


