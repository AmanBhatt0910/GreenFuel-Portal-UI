"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "@/lib/toast-util";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.6
      },
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would call an API to send a password reset email
      // await axios.post('/api/auth/forgot-password', { email });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
      toast.success("Password reset instructions sent to your email");
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Failed to send reset instructions. Please try again.");
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
              width={100}
              height={100}
              className="mb-2"
              priority
            />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-green-700 dark:text-green-500">
            {isSubmitted ? "Check Your Email" : "Reset Your Password"}
          </CardTitle>
          <CardDescription>
            {isSubmitted 
              ? "We've sent password reset instructions to your email" 
              : "Enter your email address and we'll send you instructions"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <Mail className="h-16 w-16 text-green-600 mb-2" />
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Please check your inbox and follow the instructions in the email we sent to <strong>{email}</strong>
              </p>
              <Button 
                className="w-full mt-2" 
                variant="outline"
                onClick={() => router.push("/auth/login")}
              >
                Return to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending Instructions
                  </>
                ) : (
                  "Send Reset Instructions"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-sm text-gray-500">
          <div className="text-center w-full">
            <Link href="/auth/login" className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 inline-flex items-center">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Login
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
