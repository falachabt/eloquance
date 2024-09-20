import { supabase, supabseAdmin } from "../../../lib/supabase";
import {vote_pay } from "./pay.vote"
// Créer ou récupérer un utilisateur avec l'email fourni
export async function creerOuRecupererUtilisateur_OTP(email) {
  try {
    // Vérifier si l'utilisateur existe déjà
    const { data: utilisateur, error: checkError } =
      await supabseAdmin.auth.admin.listUsers({
        email: email,
      });

    if (checkError) throw checkError;

    // Si l'utilisateur n'existe pas, on le crée
    if (!utilisateur || utilisateur.length === 0) {
      const { data: newUser, error: createError } =
        await supabseAdmin.auth.admin.createUser({
          email: email,
          password: "dsldfj5757dsf",
          email_confirm: true,
        });

      if (createError) throw createError;
      //   return { success: true, message: "Utilisateur créé et OTP envoyé.", user: newUser };
    }

    await envoyerOTP(email);

    // Si l'utilisateur existe déjà, on retourne ses infos
    return {
      success: true,
      message: "Utilisateur existant, OTP envoyé.",
      user: utilisateur[0],
    };
  } catch (error) {
    console.error("Erreur lors de la gestion de l’utilisateur:", error.message);
    return {
      success: false,
      message: "Erreur lors de la gestion de l’utilisateur.",
    };
  }
}

async function envoyerOTP(email) {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
    return { success: true, message: "OTP envoyé à l'adresse email." };
  } catch (error) {
    throw error;
    console.error("Erreur lors de l’envoi de l’OTP:", error.message);
    return { success: false, message: "Erreur lors de l’envoi de l’OTP." };
  }
}

async function enregistrerVote(email, idEtape, idCandidat, isPayant, montant = 500) {
    console.log(email, idEtape, idCandidat, isPayant)
  try {
    // Vérifier si l'utilisateur a déjà voté pour cette étape si les votes ne sont pas payants
    if (!isPayant) {
      const { data: votesExistants, error: checkError } = await supabase
        .from("votes")
        .select("id")
        .eq("email", email)
        .eq("etape_id", idEtape);

      if (checkError) throw checkError;

      // Si l'utilisateur a déjà voté, empêcher un nouveau vote
      if (votesExistants && votesExistants.length > 0) {
        throw new Error("Vous avez déjà voté por cette étape");
        return {
          success: false,
          message: "Vous avez déjà voté pour cette étape.",
        };
      }

      // Enregistrer le vote avec le candidat choisi
      const { data, error } = await supabase.from("votes").insert([
        {
          email: email,
          etape_id: idEtape,
          candidat_id: idCandidat, // Enregistrement du candidat
          created_at: new Date(),
          vote_ok: true,
          is_paid_vote: false,
        },
      ]);

      if (error) throw error;
    }else {
        const { trx_id , url } = await vote_pay(montant);
        window.open(url);
        // Enregistrer le vote avec le candidat choisi
      const { data, error } = await supabase.from("votes").insert([
        {
          email: email,
          etape_id: idEtape,
          candidat_id: idCandidat, // Enregistrement du candidat
          created_at: new Date(),
          vote_ok: false,
          is_paid_vote: true,
          trx_id: trx_id, // Enregistrement du transaction id payant
          paiement_amount : montant,
        },
      ]);

      if(error) {
        throw error
      }


    }

    return {
      success: true,
      message: "Votre vote pour le candidat a été enregistré avec succès.",
    };
  } catch (error) {
    throw error;
    console.error("Erreur lors de l’enregistrement du vote:", error.message);
    return {
      success: false,
      message: "Erreur lors de l’enregistrement du vote.",
    };
  }
}

export async function verifierOtpEtEnregistrerVote(
  email,
  otp,
  idEtape,
  idCandidat,
  isPayant
) {
  try {
    //   // Vérifier l'OTP
    //   const { data, error: otpError } = await supabase.auth.verifyOtp({
    //     email,
    //     token: otp,
    //     type: 'email'
    //   });

    //   if (otpError) {
    //     console.error('Erreur lors de la vérification de l’OTP:', otpError.message);
    //     throw otpError
    //     return { success: false, message: "OTP incorrect ou expiré." };
    //   }

    // Si l'OTP est valide, on enregistre le vote
    const voteResult = await enregistrerVote(
      email,
      idEtape,
      idCandidat,
      isPayant
    );

    return voteResult; // Retourner le résultat du vote
  } catch (error) {
    throw error;
    console.error("Erreur lors du processus de vote après OTP:", error.message);
    return { success: false, message: "Erreur lors du processus de vote." };
  }
}

export default enregistrerVote;
