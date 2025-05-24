import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface CubiaLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light";
}

export const CubiaLogo: React.FC<CubiaLogoProps> = ({
  size = "md",
  variant = "light",
}) => {
  const sizes = {
    sm: { logoWidth: 160, logoHeight: 160, textSize: "text-xs" },
    md: { logoWidth: 200, logoHeight: 200, textSize: "text-sm" },
    lg: { logoWidth: 240, logoHeight: 240, textSize: "text-base" },
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
  const currentSize = sizes[size];
  
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
        <Image 
          src={'/CubiaBlack.png'} 
          alt="Logo" 
          width={currentSize.logoWidth} 
          height={currentSize.logoHeight}
          className="object-contain"
        />
      </div>
    </motion.div>
  );
};