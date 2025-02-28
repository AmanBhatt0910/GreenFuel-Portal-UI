"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const handleLogin = (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    try {
      login(email, password, rememberMe);
      console.log("Login attempt with:", { email, password, rememberMe });
      setError(null);
    } catch (error) {
      setError("Login failed Please check your credentials");
      console.log("error", error);
    }
  };

  const companyLinks = [
    { href: "/help", label: "IT Support" },
    { href: "/training", label: "Training Portal" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C5B299] to-[#e9ecef] dark:from-[#1E1E2E] dark:to-[#2D2D3A]">
      <div className="absolute top-0 right-0 w-1/3 h-screen bg-[#6552D0]/5 -skew-x-12 transform origin-top-right" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md px-4 z-10"
      >
        <Card className="border-[#6552D0]/10 shadow-xl overflow-hidden relative dark:bg-[#2D2D3F] dark:border-[#6552D0]/20">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#6552D0] to-[#41a350]"></div>

          <CardHeader className="space-y-1 pb-6">
            <GreenFuelLogo size="md" />
            <GreenFuelTitle
              title="Welcome to GreenFuel"
              subtitle="Employee Portal Access"
            />
          </CardHeader>

          <CardContent>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <LoginForm onSubmit={handleLogin} />
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <FooterLinks links={companyLinks} />
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
