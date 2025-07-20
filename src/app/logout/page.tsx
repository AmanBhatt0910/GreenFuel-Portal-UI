"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CubiaLogo } from "@/components/custom/ui/Logo.custom";
import { CubiaTitle } from "@/components/custom/ui/Title.custom";
import { FooterLinks } from "@/components/custom/LoginComponents/Footer.custom";
import { LucideSmile, LucideChevronLeft } from "lucide-react";

export default function GoodbyePage() {
  const router = useRouter();

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

  const footerLinks = [
    { href: "/help", label: "IT Support" },
    { href: "/training", label: "Training Portal" },
    { href: "/about", label: "About Us" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F172A] to-[#1E293B] dark:from-[#0B1121] dark:to-[#162033] font-poppins p-4">
      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side (Pattern and message) */}
        <div className="md:w-1/2 bg-gradient-to-br from-[#0F172A] to-[#1E293B] dark:from-[#141E30] dark:to-[#243B55] p-10 text-white flex flex-col justify-center items-center text-center md:text-left relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtOGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNHptLTggNGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNHptOCAwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+')]"></div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative z-10"
          >
            <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Goodbye from Cubia!
            </h1>
            <p className="text-lg mb-8 max-w-md text-gray-200">
              You have successfully logged out.<br />We hope to see you again soon!
            </p>

            {/* Just one feature card as accent */}
            <motion.div
              className="flex items-center space-x-3 mt-10"
              variants={featureVariants}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-white/10 p-2 rounded-full">
                <LucideSmile className="h-5 w-5 text-amber-400" />
              </div>
              <p className="text-sm text-gray-200">Your data is safe. Enjoy your day!</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side (Content & Button) */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center items-center w-full bg-white dark:bg-gray-800">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full max-w-md"
          >
            <div className="flex justify-center mb-6">
              <CubiaLogo size="sm" variant="light" />
            </div>
            <CubiaTitle
              title="Logged Out"
              subtitle="Thank you for using Cubia. Click below to log back in."
            />

            <div className="mt-10 mb-4 flex flex-col items-center">
              <button
                onClick={() => router.push("/")}
                className="flex items-center px-6 py-3 bg-[#0F172A] text-white rounded-full font-semibold hover:bg-[#1E293B] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 gap-2"
              >
                <LucideChevronLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>

            <div className="mt-10">
              <FooterLinks links={footerLinks} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
