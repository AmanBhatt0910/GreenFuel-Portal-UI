import React, { useState } from "react";
import Link from "next/link";
import { GreenFuelInput } from "../ui/Input.custom";
import { GreenFuelCheckbox } from "../ui/CheckBox";
import { GreenFuelButton } from "../ui/Button.custom";
import { z } from "zod";
import { toast } from "@/lib/toast-util";
import { useRouter } from "next/navigation";

const LoginSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .min(1, "Password is required"),
  rememberme: z.boolean().optional(),
});

interface LoginFormProps {
  onSubmit: (email: string, password: string, rememberMe: boolean) => void;
}

export const LoginForm: React.FC<LoginFormProps> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = LoginSchema.safeParse({ email, password, rememberMe });

    if (!result.success) {
      const errorMessage = result.error.errors
        .map((err) => err.message)
        .join(", ");
      setError(errorMessage);
      toast.error(errorMessage);
    } else {
      toast.success("Login successful! Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div>
        <label htmlFor="email" className="block text-[#141E30] dark:text-[#243B55] font-medium mb-1">
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
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label htmlFor="password" className="block text-[#141E30] dark:text-[#243B55] font-medium mb-1">
          Password
        </label>
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
        />
        <div className="text-right mt-2">
          <Link
            href="/request-to-admin"
            className="text-sm font-medium text-[#243B55] hover:text-[#141E30] transition-colors"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <GreenFuelCheckbox
        id="remember"
        label="Keep me signed in"
        checked={rememberMe}
        onCheckedChange={setRememberMe}
        ariaLabel="Keep me signed in for future visits"
        ariaRequired={false}
      />

      <div className="pt-4">
        <GreenFuelButton
          type="submit"
          fullWidth
          ariaLabel="Sign in to your dashboard"
          ariaDescribedBy="sign-in-description"
          className="bg-gradient-to-br from-[#141E30] to-[#243B55] text-white hover:from-[#243B55] hover:to-[#141E30]"
        >
          Sign In to Dashboard
        </GreenFuelButton>
      </div>
    </form>
  );
};
