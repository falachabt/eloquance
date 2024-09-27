import { supabase, supabseAdmin } from "../../../lib/supabase";
import { vote_pay } from "./pay.vote";

// Créer ou récupérer un utilisateur avec l'email fourni
export async function creerOuRecupererUtilisateur_OTP(email) {
  try {
    // Vérifier si l'utilisateur existe déjà
    const { data: utilisateur, error: checkError } =
      await supabseAdmin.auth.admin.listUsers({ email });

    if (checkError) throw checkError;

    // Si l'utilisateur n'existe pas, on le crée
    if (!utilisateur || utilisateur.length === 0) {
      await supabseAdmin.auth.admin.createUser({
        email: email,
        password: "dsldfj5757dsf",
        email_confirm: true,
      });
    }

    await envoyerOTP(email);

    // Si l'utilisateur existe déjà, on retourne ses infos
    return {
      success: true,
      message: "Utilisateur existant, OTP envoyé.",
      user: utilisateur ? utilisateur[0] : null,
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
    await supabase.auth.signInWithOtp({ email });
    return { success: true, message: "OTP envoyé à l'adresse email." };
  } catch (error) {
    console.error("Erreur lors de l’envoi de l’OTP:", error.message);
    throw error;
  }
}

async function enregistrerVote(email, idEtape, idCandidat, isPayant, montant = 500) {
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
        throw new Error("Vous avez déjà voté pour cette étape.");
      }

      // Enregistrer le vote avec le candidat choisi
      await supabase.from("votes").insert([
        {
          email: email,
          etape_id: idEtape,
          candidat_id: idCandidat,
          created_at: new Date(),
          vote_ok: true,
          is_paid_vote: false,
        },
      ]);
    } else {
      const { trx_id, url } = await vote_pay(montant);
      window.open(url);

      // Enregistrer le vote avec le candidat choisi
      await supabase.from("votes").insert([
        {
          email: email,
          etape_id: idEtape,
          candidat_id: idCandidat,
          created_at: new Date(),
          vote_ok: false,
          is_paid_vote: true,
          trx_id: trx_id,
          paiement_amount: montant,
        },
      ]);
    }

    return {
      success: true,
      message: "Votre vote pour le candidat a été enregistré avec succès.",
    };
  } catch (error) {
    console.error("Erreur lors de l’enregistrement du vote:", error.message);
    throw error;
  }
}

export async function verifierOtpEtEnregistrerVote(email, otp, idEtape, idCandidat, isPayant, montant) {

  
  try {
    // Vérifier l'OTP

    if(!isPayant){
      const { error: otpError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });
  
      if (otpError) {
        console.error('Erreur lors de la vérification de l’OTP:', otpError.message);
        throw otpError;
      }
    }

    // Si l'OTP est valide, on enregistre le vote
    return await enregistrerVote(email, idEtape, idCandidat, isPayant, montant);
  } catch (error) {
    console.error("Erreur lors du processus de vote après OTP:", error.message);
    throw error;
  }
}

export default enregistrerVote;
