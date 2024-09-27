
import { supabseAdmin, supabase  } from "../../../lib/supabase";
import { inscription_pay } from "./payment.utils"
// TODO create the account a send the email when the user wants to create a new account


export async function checkOtp(email, otp){
 // Verify OTP
 const { error: verifyError } = await supabase.auth.verifyOtp({
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
        const { data: candidate } = await supabseAdmin.from("candidats").select("*").eq("email", email).maybeSingle();

        if (candidate) {
            throw "Already a candidate";
        }

        
      const {  error: createUserError } = await supabseAdmin.auth.admin.createUser({
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
    try {
      // First, check if a candidate with this email already exists
      const { data: existingCandidate, error: fetchError } = await supabase
        .from('candidats')
        .select('id')
        .eq('email', formData.email)
        .single();
  
      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 is the error code for "no rows returned"
        console.error("Error checking for existing candidate:", fetchError);
        throw fetchError;
      }
  
      let result;
  
      if (existingCandidate) {
        // If the candidate exists, update their data
        const { data, error } = await supabase
          .from('candidats')
          .update(formData)
          .eq('id', existingCandidate.id)
          .select();
  
        if (error) {
          console.error("Error updating candidat data:", error);
          throw error;
        }
        result = data;
      } else {
        // If the candidate doesn't exist, insert a new record
        const { data, error } = await supabase
          .from('candidats')
          .insert([formData])
          .select();
 
        if (error) {
          console.error("Error inserting candidat data:", error);
          throw error;
        }
        result = data;
      }
  
      return result;
    } catch (error) {
      console.error("Error in insertCandidatData:", error);
      throw error;
    }
  };

  export const pay_inscription = async (email) => {
    try {
        const { trx_id , url } = await inscription_pay(true);
         await supabase.from("candidats").update({ trx_id }).eq("email", email);

        
        window.open(url)
        
    } catch (error) {
        console.log(error);
    }
  }