import React from "react";
import { motion } from "framer-motion";
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GreenFuelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
  isLoading?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export const GreenFuelButton: React.FC<GreenFuelButtonProps> = ({
  variant = "primary",
  fullWidth = false,
  children,
  className,
  isLoading = false,
  ariaLabel = "Submit action",
  ariaDescribedBy,
  ...props
}) => {
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: {
      scale: 1.03,
      boxShadow: "0px 5px 15px rgba(101, 82, 208, 0.3)",
      transition: { type: "spring", stiffness: 400 },
    },
  };

  return (
    <motion.div
      variants={buttonVariants}
      whileHover={isLoading ? undefined : "hover"}
      className={fullWidth ? "w-full" : ""}
    >
      <ShadcnButton
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        className={cn(
          "h-11 font-medium relative",
          variant === "primary"
            ? "bg-gradient-to-r from-[#41a350] to-[#6552D0] hover:from-[#378a44] hover:to-[#5644c0] text-white"
            : "border-[#A5A5A5]/30 hover:bg-[#6552D0]/5 hover:text-[#6552D0] text-black",
          fullWidth ? "w-full" : "",
          isLoading ? "opacity-90 cursor-not-allowed" : "",
          className
        )}
        {...props}
      >
        {isLoading && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg
              className="animate-spin h-5 w-5 text-white"
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
          </span>
        )}
        <span className={isLoading ? "opacity-0" : ""}>{children}</span>
      </ShadcnButton>
    </motion.div>
  );
};