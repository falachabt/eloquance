
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


  export async function sendVerificationCode(email, password) {
    try {
      await checkIfEmail(email, password);
    } catch (error) {
      throw error
    }
  }



  export async function checkIfEmail(email, password) {
    try {
      // Check if the user is already a candidate
      const { data: candidate } = await supabseAdmin.from("candidats").select("*").eq("email", email).maybeSingle();
  
      if (candidate) {
        throw new Error("Un candidat est déjà inscrit à cette adresse, connectez-vous à la place");
      }
  
      // Try to create a new user
      const { data: newUser, error: createUserError } = await supabseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
      });

      if (createUserError) {
        
     
        // If the error is because the user already exists
        if (createUserError.message.includes("A user with this email address has already")) {
          // List users and find the one with matching email
          const { data, error: listUsersError } = await supabseAdmin
            .auth.admin.listUsers();
  
            const users = data.users

            
          if (listUsersError) {
            console.error("Error listing users:", listUsersError);
            throw listUsersError;
          }
  
          const existingUser = users.find(user => user.email === email);
  
          if (!existingUser) {
            throw new Error("User found in auth but not in user list");
          }
  
          // Update the existing user's password
          const { error: updateUserError } = await supabseAdmin
            .auth.admin.updateUserById(existingUser.id, { password: password });
  
          if (updateUserError) {
            console.error("Error updating user password:", updateUserError);
            throw updateUserError;
          }
  
          console.log("Existing user's password updated successfully");
          return existingUser;
        } else {
          // If it's a different error, throw it
          console.error("Error creating user:", createUserError);
          throw createUserError;
        }
      }
  
      console.log("New user created successfully");
      return newUser;
  
    } catch (err) {
      console.error("Unexpected error:", err);
      throw err;
    }
  }


  export const signInUser = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
  
    if (error) {
      console.error("Error updating password:", error);
      throw error;
    }
    return data;
  };


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