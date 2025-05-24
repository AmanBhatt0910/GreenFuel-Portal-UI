import React, { forwardRef } from "react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { motion } from "framer-motion";

interface CubiaInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showPassword?: boolean;
  togglePassword?: () => void;
  isPassword?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaRequired?: boolean;
}

export const CubiaInput = forwardRef<HTMLInputElement, CubiaInputProps>(
  (
    {
      label,
      showPassword,
      togglePassword,
      isPassword = false,
      ariaLabel,
      ariaDescribedBy,
      ariaRequired = false,
      ...props
    },
    ref
  ) => {
    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100 },
      },
    };

    return (
      <motion.div variants={itemVariants} className="space-y-2">
        {label && (
          <Label htmlFor={props.id} className="text-black dark:text-[#243B55] font-medium">
            {label}
          </Label>
        )}
        <div className="relative">
          <ShadcnInput
            ref={ref}
            id={props.id}
            aria-label={ariaLabel || label}
            aria-describedby={ariaDescribedBy}
            aria-required={ariaRequired ? "true" : "false"}
            className="border-[#A5A5A5]/30 focus-visible:ring-[#243B55] h-11"
            type={
              isPassword ? (showPassword ? "text" : "password") : props.type
            }
            {...props}
          />
          {isPassword && togglePassword && (
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A5A5A5] hover:text-[#6552D0] transition-colors"
              onClick={togglePassword}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </motion.div>
    );
  }
);

CubiaInput.displayName = "CubiaInput";
