"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import useAxios from "@/app/hooks/use-axios";

// Page transition animations
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const PasswordStrengthMeter: React.FC<{ password: string }> = ({
  password,
}) => {
  // Password strength calculation
  const calculateStrength = (password: string) => {
    if (!password) return 0;

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;

    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    return Math.min(strength, 4);
  };

  const strength = calculateStrength(password);

  const getStrengthLabel = () => {
    if (strength === 0) return { text: "Too weak", color: "bg-red-500" };
    if (strength === 1) return { text: "Weak", color: "bg-red-500" };
    if (strength === 2) return { text: "Fair", color: "bg-yellow-500" };
    if (strength === 3) return { text: "Good", color: "bg-green-400" };
    return { text: "Strong", color: "bg-green-500" };
  };

  const label = getStrengthLabel();

  // Don't show meter if no password entered
  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Password strength:
        </span>
        <span
          className="text-xs font-medium"
          style={{
            color:
              strength > 1
                ? strength > 2
                  ? "rgb(34 197 94)"
                  : "rgb(234 179 8)"
                : "rgb(239 68 68)",
          }}
        >
          {label.text}
        </span>
      </div>
      <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${label.color} transition-all duration-300 ease-in-out`}
          style={{ width: `${(strength / 4) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

const ForgotPasswordPage = () => {
  const router = useRouter();
  const api = useAxios();

  // Form states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form validation states
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password requirements
  const requirements = [
    { text: "At least 8 characters", met: newPassword.length >= 8 },
    { text: "At least one uppercase letter", met: /[A-Z]/.test(newPassword) },
    { text: "At least one number", met: /[0-9]/.test(newPassword) },
    {
      text: "At least one special character",
      met: /[^A-Za-z0-9]/.test(newPassword),
    },
  ];

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    // Validate old password
    if (!oldPassword.trim()) {
      newErrors.oldPassword = "Current password is required";
      isValid = false;
    }

    // Validate new password
    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/[A-Z]/.test(newPassword)) {
      newErrors.newPassword =
        "Password must contain at least one uppercase letter";
      isValid = false;
    } else if (!/[0-9]/.test(newPassword)) {
      newErrors.newPassword = "Password must contain at least one number";
      isValid = false;
    } else if (!/[^A-Za-z0-9]/.test(newPassword)) {
      newErrors.newPassword =
        "Password must contain at least one special character";
      isValid = false;
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password";
      isValid = false;
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };


  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/change-password/", {
        old_pass: oldPassword,
        new_pass: newPassword,
      });

      if (response.status === 200) {
        toast.success("Password changed successfully", {
          description: "Your password has been updated.",
          icon: <CheckCircle className="text-green-500 h-5 w-5" />,
        });

        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        toast.error("Failed to change password", {
          description: response.data?.message || "Please try again.",
          icon: <AlertCircle className="text-red-500 h-5 w-5" />,
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An error occurred", {
        description: "Please try again later or contact support.",
        icon: <AlertCircle className="text-red-500 h-5 w-5" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <motion.div className="w-full max-w-md" variants={itemVariants}>
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <motion.div
                className="inline-block p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Lock className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              </motion.div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Change Password
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Keep your account secure with a strong password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Password Field */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="oldPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    id="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className={`w-full pl-4 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/50 dark:border-gray-600 dark:text-white transition-all duration-200 ${
                      errors.oldPassword
                        ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                  >
                    {showOldPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.oldPassword && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />{" "}
                    {errors.oldPassword}
                  </p>
                )}
              </motion.div>

              {/* New Password Field */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full pl-4 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/50 dark:border-gray-600 dark:text-white transition-all duration-200 ${
                      errors.newPassword
                        ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                        : "border-gray-300"
                    }`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />{" "}
                    {errors.newPassword}
                  </p>
                )}

                {/* Password Strength Meter */}
                <PasswordStrengthMeter password={newPassword} />

                {/* Password Requirements */}
                {newPassword && (
                  <div className="mt-2 grid grid-cols-2 gap-1.5">
                    {requirements.map((req, index) => (
                      <div key={index} className="flex items-center">
                        <div
                          className={`rounded-full h-3.5 w-3.5 flex items-center justify-center ${
                            req.met
                              ? "bg-green-500"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        >
                          {req.met && (
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span
                          className={`ml-2 text-xs ${
                            req.met
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-4 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/50 dark:border-gray-600 dark:text-white transition-all duration-200 ${
                      errors.confirmPassword
                        ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                        : "border-gray-300"
                    }`}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />{" "}
                    {errors.confirmPassword}
                  </p>
                )}

                {/* Password match indicator */}
                {confirmPassword && (
                  <div className="mt-2 flex items-center">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        confirmPassword === newPassword
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span
                      className={`ml-1.5 text-xs ${
                        confirmPassword === newPassword
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-500"
                      }`}
                    >
                      {confirmPassword === newPassword
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 relative overflow-hidden group"
                >
                  <span
                    className={`absolute inset-0 w-0 bg-white/20 transition-all duration-500 ease-out group-hover:w-full ${
                      isLoading ? "w-full" : ""
                    }`}
                  ></span>
                  <span className="relative flex items-center justify-center cursor-pointer">
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </span>
                </button>
              </motion.div>

              {/* Back to Login Link */}
              <motion.div className="text-center pt-2" variants={itemVariants}>
                <Link
                  href="/auth/login"
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                  Back to Login
                </Link>
              </motion.div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <motion.p
          className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6"
          variants={itemVariants}
        >
          Need help?{" "}
          <Link
            href="/support"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Contact Support
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPasswordPage;
