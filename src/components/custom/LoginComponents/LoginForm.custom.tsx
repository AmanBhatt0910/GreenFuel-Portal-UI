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
    .min(6, "Password must be of 6 length")
    .min(1, "Password is required"),
  rememberme: z.boolean().optional(),
});

interface LoginFormProps {
  onSubmit: (email: string, password: string, rememberMe: boolean) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <GreenFuelInput
        id="email"
        type="email"
        label="Company Email"
        placeholder="name@greenfuel.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        ariaLabel="Enter your company email"
        ariaRequired={true}
        ariaDescribedBy="email-description"
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-black dark:text-[#41a350] font-medium"
          >
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
          ariaLabel="Enter your password"
          ariaRequired={true}
          ariaDescribedBy="password-description"
        />
      </div>

      <GreenFuelCheckbox
        id="remember"
        label="Keep me signed in"
        checked={rememberMe}
        onCheckedChange={setRememberMe}
        ariaLabel="Keep me signed in for future visits"
        ariaRequired={false}
      />

      <div className="pt-2">
        <GreenFuelButton
          type="submit"
          fullWidth
          ariaLabel="Sign in to your dashboard"
          ariaDescribedBy="sign-in-description"
        >
          Sign In to Dashboard
        </GreenFuelButton>
      </div>
    </form>
  );
};
