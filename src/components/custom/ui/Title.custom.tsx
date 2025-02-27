import React from "react";
import { motion } from "framer-motion";

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
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-center text-black dark:text-white">
          {title.includes("GreenFuel") ? (
            <>
              {title.split("GreenFuel")[0]}
              <span className="text-[#41a350]">Green</span>
              <span className="text-[#6552D0]">Fuel</span>
              {title.split("GreenFuel")[1]}
            </>
          ) : (
            title
          )}
        </h2>
      </motion.div>

      {subtitle && (
        <motion.div variants={itemVariants}>
          <p className="text-center text-[#A5A5A5]">{subtitle}</p>
        </motion.div>
      )}
    </>
  );
};
