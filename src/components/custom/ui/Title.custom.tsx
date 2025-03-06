import React from "react";
import { Leaf } from "lucide-react";
import { motion } from "framer-motion";

interface GreenFuelLogoProps {
  size?: "sm" | "md" | "lg";
}

export const GreenFuelLogo: React.FC<GreenFuelLogoProps> = ({
  size = "md",
}) => {
  const sizes = {
    sm: { container: "h-12 w-12", icon: "h-6 w-6" },
    md: { container: "h-16 w-16", icon: "h-8 w-8" },
    lg: { container: "h-20 w-20", icon: "h-10 w-10" },
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        delay: 0.1,
      },
    },
  };

  return (
    <motion.div className="flex justify-center mb-6" initial="hidden" animate="visible" variants={logoVariants}>
      <div
        className={`${sizes[size].container} rounded-full bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center shadow-xl`}
      >
        <Leaf className={`${sizes[size].icon} text-white`} />
      </div>
    </motion.div>
  );
};

interface GreenFuelTitleProps {
  title: string;
  subtitle?: string;
}

export const GreenFuelTitle: React.FC<GreenFuelTitleProps> = ({
  title,
  subtitle,
}) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <>
      <motion.div variants={itemVariants} className="mb-4">
        <h2 className="text-2xl font-bold text-center text-[#0F172A]">
          {title}
        </h2>
      </motion.div>
      {subtitle && (
        <motion.div variants={itemVariants}>
          <p className="text-center text-[#6C757D]">{subtitle}</p>
        </motion.div>
      )}
    </>
  );
};