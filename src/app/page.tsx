"use client";
import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { GreenFuelLogo } from "@/components/custom/ui/Logo.custom";
import { GreenFuelTitle } from "@/components/custom/ui/Title.custom";
import { LoginForm } from "@/components/custom/LoginComponents/LoginForm.custom";
import { FooterLinks } from "@/components/custom/LoginComponents/Footer.custom";
import { GFContext } from "@/context/AuthContext";
import { LucideShield, LucideZap, LucideUsers } from "lucide-react";

export default function LoginPage() {
  const {login } = useContext(GFContext);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await login(email, password);
      if (!response.success) {
        setError(response.message);
        return;
      }
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const companyLinks = [
    { href: "/help", label: "IT Support" },
    { href: "/training", label: "Training Portal" },
    { href: "/about", label: "About Us" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F172A] to-[#1E293B] dark:from-[#0B1121] dark:to-[#162033] font-poppins p-4">
      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side */}
        <div className="md:w-1/2 bg-gradient-to-br from-[#0F172A] to-[#1E293B] dark:from-[#141E30] dark:to-[#243B55] p-10 text-white flex flex-col justify-center items-center text-center md:text-left relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtOGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNHptLTggNGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNHptOCAwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+')]"></div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative z-10"
          >
            <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Welcome to Green Fuel Energy</h1>
            <p className="text-lg mb-8 max-w-md text-gray-200">
              Empowering a sustainable future with innovative energy solutions.
            </p>
            
            {/* Features */}
            <div className="space-y-6 mt-8 mb-10">
              <motion.div 
                className="flex items-center space-x-3" 
                variants={featureVariants}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-white/10 p-2 rounded-full">
                  <LucideShield className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-sm text-gray-200">Secure employee portal</p>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-3" 
                variants={featureVariants}
                transition={{ delay: 0.7 }}
              >
                <div className="bg-white/10 p-2 rounded-full">
                  <LucideZap className="h-5 w-5 text-yellow-400" />
                </div>
                <p className="text-sm text-gray-200">Real-time energy monitoring</p>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-3" 
                variants={featureVariants}
                transition={{ delay: 0.9 }}
              >
                <div className="bg-white/10 p-2 rounded-full">
                  <LucideUsers className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-sm text-gray-200">Team collaboration tools</p>
              </motion.div>
            </div>

            <button
              onClick={() =>
                window.open(
                  "https://greenfuelenergy.in/",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              className="px-6 py-3 bg-transparent border-2 border-white/80 rounded-full text-white hover:bg-white hover:text-[#0F172A] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Learn More
            </button>
          </motion.div>
        </div>

        <div className="md:w-1/2 p-10 flex flex-col justify-center items-center w-full bg-white dark:bg-gray-800">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full max-w-md"
          >
            <div className="flex justify-center mb-6">
              <GreenFuelLogo size="lg" variant="light" />
            </div>
            <GreenFuelTitle
              title="Welcome Back"
              subtitle="Sign in to your account to access the dashboard"
            />
            <div className="mt-8 mb-4">
              <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
            </div>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-2 text-center"
              >
                {error}
              </motion.p>
            )}
            <div className="mt-8">
              <FooterLinks links={companyLinks} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}