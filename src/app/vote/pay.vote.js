import { notchpay } from "../.././../lib/notchpay"

export async function vote_pay( amount){
    const paymentInitiated = await notchpay.payments.initializePayment({
      currency: "XAF",
      amount: amount,
      phone: "657273753",
      reference: generateReadableId(),
      description: "Payment to vote for comete",
      callback:  "http://comete.ezadrive.com/vote" ,
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