"use server";
import nodemailer from 'nodemailer';
// import faker from 'faker'; // Si vous n'utilisez pas faker, commentez ou supprimez cette ligne

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'Gmail'
    auth: {
      user: 'benny.tenezeu@2027.icam.fr',
      pass: 'Mohsaakou*19561',
    },
  });

  const mailOptions = {
    from: 'bennytenezeu@gmail.com',
    to: options.email,
    subject: 'Random Data',
    text: `
      Name: 
      Email: 
      Address: 
      Phone: 
    `,
  };

  await transporter.sendMail(mailOptions);
};

export async function postData() {
  const response = await fetch('https://api-notitia.cinetpay.com/sms/1/text/single', {
    method: 'POST',
    headers: {
      'Authorization': '63596605963c69056187183.84449438',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: "CinetPayDemo",
      to: ["237657273753"],
      text: "Ceci est un text pour les sms",
    }),
  });
  
  const data = await response.json();
  console.log(data);
  return data;
}
