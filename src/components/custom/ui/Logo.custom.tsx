import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface GreenFuelLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light";
}

export const GreenFuelLogo: React.FC<GreenFuelLogoProps> = ({
  size = "md",
  variant = "light",
}) => {
  const sizes = {
    sm: { logoHeight: 40, textSize: "text-xs" },
    md: { logoHeight: 60, textSize: "text-sm" },
    lg: { logoHeight: 80, textSize: "text-base" },
  };

  const colors = {
    dark: {
      primary: "#1E293B",
      secondary: "#2E93A3", // Blue color from logo
      accent: "#4CAF50",    // Green color from logo
      text: "text-white"
    },
    light: {
      primary: "#FFFFFF",
      secondary: "#2E93A3", // Blue color from logo
      accent: "#4CAF50",    // Green color from logo
      text: "text-gray-500"
    }
  };

  const selectedColors = colors[variant];
  
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
    <motion.div 
      className="flex flex-row items-center"
      initial="hidden"
      animate="visible"
      variants={logoVariants}
    >
      <div className="relative">
        <Image src={'/Greenfuel.png'} alt="Logo" width={30} height={30}/>
      </div>

      <div className={`mt-1 font-extrabold ${sizes[size].textSize} ${selectedColors.text}`}>
        Green Fuel
      </div>
    </motion.div>
  );
};