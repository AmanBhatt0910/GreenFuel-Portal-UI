"use client";
import React, { useState } from "react";
import Link from "next/link";
import { GreenFuelInput } from "../ui/Input.custom";
import { GreenFuelButton } from "../ui/Button.custom";
import { z } from "zod";
import { toast } from "@/lib/toast-util";


const LoginSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => { // 🔥 Accept loading state
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

    await onSubmit(email, password); 
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <GreenFuelInput
        id="email"
        type="email"
        label="Company Email"
        placeholder="name@greenfuel.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-black dark:text-[#41a350] font-medium">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-[#6552D0] dark:text-[#41a350] dark:hover:text-[#6552D0] hover:text-[#41a350] transition-colors"
          >
            Forgot password?
          </Link>
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
        />

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <div className="pt-2">
        <GreenFuelButton type="submit" fullWidth isLoading={isLoading} disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In to Dashboard"}
        </GreenFuelButton>
      </div>
    </form>
  );
};
