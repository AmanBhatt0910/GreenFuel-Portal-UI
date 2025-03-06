"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GreenFuelLogo } from "@/components/custom/ui/Logo.custom";
import { GreenFuelTitle } from "@/components/custom/ui/Title.custom";
import { LoginForm } from "@/components/custom/LoginComponents/LoginForm.custom";
import { FooterLinks } from "@/components/custom/LoginComponents/Footer.custom";
import { GFContext } from "@/context/AuthContext";
import { LoaderCircle } from "lucide-react";

export default function LoginPage() {
  const { authToken, setAuthToken, logout } = useContext(GFContext);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (authToken) {
      router.push("/dashboard");
    }
  }, [authToken, router]);

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

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    try {
      setIsLoading(true);
      const token = await fakeLoginRequest(email, password, rememberMe);
      localStorage.setItem("accessToken", JSON.stringify(token));
      setAuthToken(token);
      setError(null);
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fakeLoginRequest = async (email: string, password: string, rememberMe: boolean) => {
    return new Promise<{ access: string; refresh: string }>((resolve, reject) => {
      setTimeout(() => {
        if (email === "test@example.com" && password === "password") {
          resolve({ access: "fakeAccessToken", refresh: "fakeRefreshToken" });
        } else {
          reject("Invalid credentials");
        }
      }, 1000);
    });
  };

  const companyLinks = [
    { href: "/help", label: "IT Support" },
    { href: "/training", label: "Training Portal" },
  ];

  if (authToken) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="animate-pulse flex flex-col items-center justify-center">
          <LoaderCircle className="h-12 w-12 animate-spin text-green-600 dark:text-green-500" />
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Redirecting...</p>
        </div>
      </div>
    );
  }

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
            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />  {/* Login form */}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <FooterLinks links={companyLinks} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
