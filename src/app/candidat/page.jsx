"use client";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import useSWR from "swr";
import { pay_inscription } from "../signup/utils";
import {
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HourglassOutlined,
} from "@ant-design/icons";
import { notchpay } from "@/lib/notchpay";

const fetchSteps =  async  () => {
    const { data , error} = await supabase.from("etapes_concours").select("*");
    if(error) throw error;


    return data;
} 

const fetchCandidateData = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      throw new Error("Utilisateur non connecté");
    }
  
    const { data: candidate, error: candidateError } = await supabase
      .from("candidats")
      .select("*,  candidats_etapes(*)")
      .eq("email", user.email)
      .single();
  
    if (candidateError) {
      throw new Error("Impossible de charger les données du candidat.");
    }
  
    const paymentDetails = await notchpay.payments.verifyAndFetchPayment(
      candidate?.trx_id
    );
  
    // Si le paiement est complet, insérer l'étape d'inscription dans la table candidats_etapes
    if (paymentDetails?.transaction?.status === "complete") {
        const stps = await fetchSteps();

        const stp_id = stps?.find(step => step.ordre === 1)?.id
      const { error: insertError } = await supabase
        .from("candidats_etapes")
        .insert([
          { candidat_id: candidate.id, etape_id: stp_id, statut: "validée" }, // 1 correspond à l'ID de l'étape d'inscription
        ]);
  
      if (insertError) {
        console.error("Erreur lors de l'insertion de l'étape d'inscription :", insertError);
      }
    }
  
    // Récupérer les étapes associées au candidat
    const { data: steps, error: stepsError } = await supabase
      .from("candidats_etapes")
      .select("etape_id, statut")
      .eq("candidat_id", candidate.id);
  
    if (stepsError) {
      throw new Error("Impossible de charger les étapes du candidat.");
    }
  
    return {
      user,
      candidate: {
        ...candidate,
        payment_status: paymentDetails?.transaction?.status,
        steps,
      },
    };
  };
  
const CandidateDashboard = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  // Use SWR for data fetching
  const { data, error, mutate } = useSWR("candidateData", fetchCandidateData, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });
  // Use SWR for data fetching
  const { data : consours_steps, error : steps_error, mutate :  steps_mutate } = useSWR("steps", fetchSteps, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  if (error) {
    if (error.message === "Utilisateur non connecté") {
      router.push("/login");
      return null;
    }
    return (
      <div className="bg-primary-50 h-screen text-red-500 text-center py-10">
        {error.message}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex bg-primary-50 justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { user, candidate } = data;
  const { name, email, age, school, city, motivation, payment_status, votes, steps } =
    candidate;

  const updateProfilePicture = async (event) => {
    const file = event.target.files[0];
    setIsUpdating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsUpdating(false);
    // Update profile picture logic with Supabase
  };

  const updateDescription = async (event) => {
    const description = event.target.value;
    setIsUpdating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    mutate({ ...candidate, motivation: description }, false);
    setIsUpdating(false);
    // Update description logic with Supabase
  };

  const handlePayRetry = async () => {
    try {
      await pay_inscription(user.email);
      mutate(); // Refresh data after payment
    } catch (err) {
      console.error("Erreur lors du paiement :", err);
    }
  };

  const applicationSteps = [
    "Inscription",
    "Paiement",
    "Validation",
    "Campagne",
  ];
  const currentStep = payment_status ? 3 : 1;

  const renderPaymentStatusIcon = () => {
    switch (payment_status) {
      case "pending":
        return (
          <HourglassOutlined
            className="text-orange-500"
            style={{ fontSize: "24px" }}
          />
        );
      case "complete":
        return (
          <CheckCircleOutlined
            className="text-green-500"
            style={{ fontSize: "24px" }}
          />
        );
      default:
        return (
          <CloseCircleOutlined
            className="text-red-500"
            style={{ fontSize: "24px" }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-opacity-95 bg-gray-50">
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <a href="/">
            <Image
              src={"/assets/logo.svg"}
              width={110}
              height={80}
              alt="comète logo"
            />
          </a>
          <h1 className="text-xl font-extrabold text-gray-900">Candidat</h1>
          <div className={`px-4 py-2 rounded-full flex items-center`}>
            {payment_status !== "complete" && (
              <>
                {renderPaymentStatusIcon()}
                <ReloadOutlined
                  className="ml-2 cursor-pointer text-blue-500"
                  onClick={handlePayRetry}
                />
              </>
            )}
          </div>
        </div>
      </header>
      {/* Section that displays payment status */}
      <section className="w-full bg-gray-100 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center space-x-4">
            {renderPaymentStatusIcon()}
            <span className="text-gray-600">
              {payment_status === "pending"
                ? "En attente du paiement"
                : payment_status === "complete"
                ? "Paiement complet"
                : "Paiement échoué"}
            </span>
          </div>
        </div>
      </section>
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/5 bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <img
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${name}`}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 group-hover:opacity-75 transition-opacity duration-300"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={updateProfilePicture}
                    disabled={isUpdating}
                  />
                </div>
                <h2 className="mt-4 text-xl text-center font-bold text-gray-800">
                  {name}
                </h2>
                <p className="text-gray-600">{email}</p>
              </div>
              <div className="mt-6 space-y-4">
                <InfoItem label="Âge" value={age} />
                <InfoItem label="École" value={school} />
                <InfoItem label="Ville" value={city} />
              </div>
              
            </div>
          </div>
          <div className="w-full lg3 bg-white shadow-xl rounded-lg overflow-hidden">
            {" "}
            <div className="p-6">
              {" "}
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                {" "}
                Progression{" "}
              </h3>{" "}
              <ul className="space-y-4">
                {" "}
                {consours_steps?.map((step, index) => {
  // Check if the step is validated
  const isOk = steps?.filter((item) => item.etape_id === step.id && item.statut === "validée")?.length > 0;

  return (
    <li
      key={index}
      className={`p-4 rounded-lg flex items-center justify-between ${
        isOk
          ? "bg-green-100 text-green-800 font-bold"
          : step?.est_active
          ? "bg-blue-100 text-blue-800 font-bold"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {/* Add confirm icon at the start if isOk */}
      {isOk && <CheckCircleOutlined className="text-green-500 mr-2" style={{ fontSize: "24px" }} />}

      {/* Step Name */}
      <div className="flex flex-col">
        <span>{step?.nom}</span>
        <span className="text-sm text-gray-500">{`Début: ${new Date(step?.date_debut).toLocaleDateString()} - Fin: ${new Date(step?.date_fin).toLocaleDateString()}`}</span>
      </div>
    </li>
  );
})}
{" "}
              </ul>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </main>{" "}
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="flex justify-between items-center">
    {" "}
    <span className="font-semibold text-gray-800">{label}</span>{" "}
    <span className="text-gray-600">{value}</span>{" "}
  </div>
);
export default CandidateDashboard;
