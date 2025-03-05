"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/custom/LoginComponents/LoginForm.custom";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast-util";
import { motion } from "framer-motion";

// LoginPage component
export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.8
      },
    },
  };

  // Check if user is already authenticated and redirect
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Handle login submission
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Login attempt with:", { email, password });
      const success = await login(email, password);

      if (success) {
        toast.success("Login successful! Redirecting to dashboard...");
        router.push("/dashboard");
      } else {
        setError("Login failed. Please check your credentials.");
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="shadow-lg dark:bg-gray-800">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/greenfuel-logo.png"
                alt="GreenFuel Logo"
                width={120}
                height={40}
                priority
              />
            </div>
            <CardTitle className="text-2xl font-bold text-[#41a350]">
              Sign in to GreenFuel
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Enter your credentials to access your account.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm mt-2">
              <span className="text-gray-500 dark:text-gray-400">
                Don&apos;t have an account?{" "}
              </span>
              <Link
                href="/register"
                className="text-[#6552D0] dark:text-[#41a350] hover:underline"
              >
                Create an account
              </Link>
            </div>
            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} GreenFuel. All rights reserved.
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
