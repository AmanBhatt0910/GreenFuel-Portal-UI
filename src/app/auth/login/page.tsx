"use client";
import { useContext, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/custom/LoginComponents/LoginForm.custom";
import Image from "next/image";
import Link from "next/link";
import { GFContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import useAxios from "@/app/hooks/use-axios";

// LoginPage component
export default function LoginPage() {
  const { setAuthToken , authToken, baseURL } = useContext(GFContext);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const api = useAxios();

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
    if (authToken) {
      router.push("/");
    }
  }, [authToken, router]);

  // Handle login submission
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Login attempt with:", { email, password });
      const response = await fetch(baseURL+`/auth/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      if (response.status == 200) {
        const data = await response.json()
        console.log("Login response:", data);
        localStorage.setItem("access" , data.access);
        localStorage.setItem("refresh" , data.refresh);
        // Handle successful login
      } else {
        console.error("Unexpected response structure:", response);
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="w-full max-w-md shadow-xl border-green-100 dark:border-green-900/20">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Image
              src="/logo.png"
              alt="Green Fuel Logo"
              width={120}
              height={120}
              className="mb-4"
              priority
            />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-green-700 dark:text-green-500">
            Welcome to Green Fuel
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}
          <LoginForm 
            onSubmit={handleLogin}
            isLoading={isLoading}
          />
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-sm text-gray-500">
          <div className="text-center w-full">
            <Link href="/auth/forgot-password" className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
              Forgot your password?
            </Link>
          </div>
          <div className="text-center w-full text-xs">
            &copy; {new Date().getFullYear()} Green Fuel. All rights reserved.
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
