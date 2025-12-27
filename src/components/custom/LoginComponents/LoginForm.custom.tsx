"use client";
import React, { useState } from "react";
import Link from "next/link";
import { GreenFuelInput } from "../ui/Input.custom";
import { GreenFuelButton } from "../ui/Button.custom";
import { z } from "zod";
import { toast } from "@/lib/toast-util";
import { motion } from "framer-motion";
import { LucideAlertCircle } from "lucide-react";

const LoginSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = LoginSchema.safeParse({ email, password });
    if (!result.success) {
      const errorMessage = result.error.errors.map((err) => err.message).join(", ");
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    try {
      await onSubmit(email, password);
    } catch (err) {
      // Error handling is done in the parent component
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div className="space-y-1">
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Company Email
          </label>
          <GreenFuelInput
            id="email"
            type="email"
            placeholder="name@greenfuel.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            ariaLabel="Enter your company email"
            ariaRequired={true}
            ariaDescribedBy="email-description"
            className="focus:border-green-500 dark:focus:border-green-400 transition-all duration-300"
          />
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-500 text-sm px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-md">
            <LucideAlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
          </div>
          <GreenFuelInput
            id="password"
            isPassword
            showPassword={showPassword}
            togglePassword={() => setShowPassword(!showPassword)}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            ariaLabel="Enter your password"
            ariaRequired={true}
            ariaDescribedBy="password-description"
            className="focus:border-green-500 dark:focus:border-green-400 transition-all duration-300"
          />
          <div className="text-right mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Forgot your password?{" "}
              <span className="font-medium text-[#243B55] dark:text-blue-400">
                Please contact the system administrator.
              </span>
            </p>
          </div>

        </div>

        <div className="pt-4">
          <GreenFuelButton
            type="submit"
            fullWidth
            isLoading={isLoading}
            ariaLabel="Sign in to your dashboard"
            ariaDescribedBy="sign-in-description"
            className="bg-gradient-to-br from-[#141E30] to-[#243B55] text-white hover:from-[#243B55] hover:to-[#141E30] dark:from-[#0D47A1] dark:to-[#1976D2] dark:hover:from-[#1976D2] dark:hover:to-[#0D47A1] shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 py-2.5"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In to Dashboard"}
          </GreenFuelButton>
        </div>
      </form>
    </motion.div>
  );
};