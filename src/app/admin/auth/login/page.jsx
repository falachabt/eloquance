"use client";
import React, { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { message as antMessage } from "antd";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  const router = useRouter();

  // Set up Ant Design message configuration
  useEffect(() => {
    antMessage.config({
      top: 100,
      duration: 2,
      maxCount: 3,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to handle login form submission
  async function loginFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      // Attempt to log in the user with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        antMessage.error("Erreur avec vos identifiants");
        return;
      }

      const user = data?.user;

      // Check if the user is an admin
      if (user && user.user_metadata?.role === "admin") {
        router.push("/admin/candidats");
      } else {
        await supabase.auth.signOut();
        antMessage.error("Accès réservé aux administrateurs.");
      }
    } catch (error) {
      console.error("Login error:", error);
      antMessage.error("Une erreur est survenue lors de la connexion.");
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        {/* Logo and Heading */}
        <Link
          href="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          {/* Ensure the image path is correct, use fallback URL if necessary */}
          <Image
            width={144}
            height={160}
            className="w-36 h-40 mr-2"
            src="/assets/logo.svg" // Check if the logo path is correct
            alt="logo"
            onError={(e) => (e.target.src = "/fallback-logo.png")} // Optional: fallback logo
          />
        </Link>

        {/* Form Container */}
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Connectez-vous
            </h1>

            {/* Login Form */}
            <form className="space-y-4 md:space-y-6" onSubmit={loginFormSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Se souvenir de moi
                    </label>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Se connecter
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
