import React from "react";
import { motion } from "framer-motion";
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GreenFuelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
  ariaLabel?: string; 
  ariaDescribedBy?: string; 
}

export const GreenFuelButton: React.FC<GreenFuelButtonProps> = ({
  variant = "primary",
  fullWidth = false,
  children,
  className,
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
      whileHover="hover"
      className={fullWidth ? "w-full" : ""}
    >
      <ShadcnButton
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        className={cn(
          "h-11 font-medium",
          variant === "primary"
            ? "bg-gradient-to-r from-[#41a350] to-[#6552D0] hover:from-[#378a44] hover:to-[#5644c0] text-white"
            : "border-[#A5A5A5]/30 hover:bg-[#6552D0]/5 hover:text-[#6552D0] text-black",
          fullWidth ? "w-full" : "",
          className
        )}
        {...props}
      >
        {children}
      </ShadcnButton>
    </motion.div>
  );
};
