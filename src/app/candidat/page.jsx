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

const fetchSteps = async () => {
  const { data, error } = await supabase.from("etapes_concours").select("*");
  if (error) throw error;
  return data;
};

const fetchCandidateData = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Utilisateur non connecté");
  }

  const { data: candidate, error: candidateError } = await supabase
    .from("candidats")
    .select("*, candidats_etapes(*)")
    .eq("email", user.email)
    .single();

  if (candidateError) {
    throw new Error("Impossible de charger les données du candidat.");
  }

  const paymentDetails = await notchpay.payments.verifyAndFetchPayment(candidate?.trx_id);

  // Insérer l'étape d'inscription si le paiement est complet
  if (paymentDetails?.transaction?.status === "complete") {
    const stps = await fetchSteps();
    const stp_id = stps?.find(step => step.ordre === 1)?.id;
    const { error: insertError } = await supabase
      .from("candidats_etapes")
      .insert([{ candidat_id: candidate.id, etape_id: stp_id, statut: "validée" }]);

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
  const { data: consours_steps, error: steps_error } = useSWR("steps", fetchSteps, {
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
  const { name, email, age, school, city, motivation, payment_status, steps } = candidate;

  const updateProfilePicture = async (event) => {
    const file = event.target.files[0];
    setIsUpdating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsUpdating(false);
    // Logique de mise à jour de l'image de profil avec Supabase
  };

  const handlePayRetry = async () => {
    try {
      await pay_inscription(user.email);
      mutate(); // Rafraîchir les données après le paiement
    } catch (err) {
      console.error("Erreur lors du paiement :", err);
    }
  };

  const renderPaymentStatusIcon = () => {
    switch (payment_status) {
      case "pending":
        return <HourglassOutlined className="text-orange-500" style={{ fontSize: "24px" }} />;
      case "complete":
        return <CheckCircleOutlined className="text-green-500" style={{ fontSize: "24px" }} />;
      default:
        return <CloseCircleOutlined className="text-red-500" style={{ fontSize: "24px" }} />;
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
                  <Image
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${name}`}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 group-hover:opacity-75 transition-opacity duration-300"
                    width={128}
                    height={128}
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
                        d="M16 16v-1a4 4 0 00-8 0v1M12 12v6m0 0l-3-3m3 3l3-3"
                      />
                    </svg>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    onChange={updateProfilePicture}
                    className="hidden"
                  />
                </div>
                <h2 className="text-2xl font-bold mt-4">{name}</h2>
                <p className="text-gray-600">{email}</p>
                <p className="text-gray-600">Age: {age}</p>
                <p className="text-gray-600">École: {school}</p>
                <p className="text-gray-600">Ville: {city}</p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-3/5 bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-bold">Motivation</h2>
              <p className="text-gray-600">{motivation}</p>
              <h2 className="text-lg font-bold mt-6">Étapes</h2>
              <ul className="list-disc list-inside">
                {steps.map(step => (
                  <li key={step.etape_id} className={`text-gray-600 ${step.statut === "validée" ? "text-green-500" : "text-red-500"}`}>
                    Étape ID: {step.etape_id} - Statut: {step.statut}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CandidateDashboard;
