"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { GreenFuelLogo } from "@/components/custom/ui/Logo.custom";
import { GreenFuelTitle } from "@/components/custom/ui/Title.custom";
import { LoginForm } from "@/components/custom/LoginComponents/LoginForm.custom";
import { FooterLinks } from "@/components/custom/LoginComponents/Footer.custom";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.25,
      },
    },
  };

  const handleLogin = (email: string, password: string, rememberMe: boolean) => {
    try {
      login(email, password, rememberMe);
      console.log("Login attempt:", { email, password, rememberMe });
      setError(null);
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    }
  };

  const companyLinks = [
    { href: "/help", label: "IT Support" },
    { href: "/training", label: "Training Portal" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F172A] to-[#1E293B] font-poppins p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-10 text-white flex flex-col justify-center items-center text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl font-bold mb-4">Welcome to GreenFuel</h1>
            <p className="text-lg mb-6 max-w-md">
              Empowering a sustainable future with innovative energy solutions.
            </p>
            <button
              onClick={() => window.open("https://greenfuelenergy.in/", "_blank", "noopener,noreferrer")}
              className="px-6 py-2 bg-transparent border-2 border-white rounded-full text-white hover:bg-white hover:text-[#0F172A] transition-all duration-300"
            >
              Learn More
            </button>
          </motion.div>
        </div>

        <div className="md:w-1/2 p-10 flex flex-col justify-center items-center w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full max-w-md"
          >
            <div className="flex justify-center mb-4">
              <GreenFuelLogo size="md" />
            </div>
            <GreenFuelTitle title="Welcome Back" subtitle="Sign in to your account" />
            <LoginForm onSubmit={handleLogin} />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <FooterLinks links={companyLinks} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}