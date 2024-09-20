
import { supabseAdmin, supabase  } from "../../../lib/supabase";
import { inscription_pay } from "./payment.utils"
// TODO create the account a send the email when the user wants to create a new account


export async function checkOtp(email, otp){
 // Verify OTP
 const { data, error: verifyError } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: "magiclink",
  });

  if (verifyError) throw verifyError;
}



async function sendOtp(email) {
    try {
      await supabase.auth.signInWithOtp({ email });
      message.success("Code d'activation envoyé à votre email.");
    } catch (error) {
      message.error(error.message || "Erreur lors de l'envoi du code d'activation.");
    }
  }

  export async function sendVerificationCode(email) {
    try {
      await checkIfEmail(email);
      await sendOtp(email);
    } catch (error) {
      if (error.message?.includes("A user with this email address has already")) {
        await sendOtp(email);
      }
    }
  }



export async function checkIfEmail(email) {
    try {

        // check if the user is alearidy a candidate
        const { data: candidate, error: candidateError } = await supabseAdmin.from("candidats").select("*").eq("email", email).maybeSingle();

        if (candidate) {
            throw "Already a candidate";
        }

        
      const { data: user, error: createUserError } = await supabseAdmin.auth.admin.createUser({
        email: email,
        email_confirm: true,
      });
  


      if (createUserError) {
        console.error("Error creating user:", createUserError);
      throw createUserError;
        return;
      }
  
    
  
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }



  export const updateUserPassword = async (email, password) => {
    const { data, error } = await supabase.auth.updateUser({
      email: email,
      password: password
    });
  
    if (error) {
      console.error("Error updating password:", error);
      throw error;
    }
    return data;
  };
  
  export const insertCandidatData = async (formData) => {
    const { data, error } = await supabase
      .from('candidats')
      .insert([formData]);
  
    if (error) {
      console.error("Error inserting candidat data:", error);
      throw error;
    }
    return data;
  };


  export const pay_inscription = async (email) => {
    try {
        const { trx_id , url } = await inscription_pay(true);
        const { data , error} = await supabase.from("candidats").update({ trx_id }).eq("email", email);

        
        window.open(url)
        
    } catch (error) {
        console.log(error);
    }
  }