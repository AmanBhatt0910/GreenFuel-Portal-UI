import React from "react";
import { motion } from "framer-motion";

interface FooterLinksProps {
  links: Array<{
    href: string;
    label: string;
  }>;
}

export const FooterLinks: React.FC<FooterLinksProps> = ({ links }) => {
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
      <motion.div variants={itemVariants} className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#A5A5A5]/20"></span>
        </div>
      </motion.div>

      

      <motion.div
        variants={itemVariants}
        className="text-center text-sm text-[#A5A5A5] pt-2"
      >
        <p>
          © {new Date().getFullYear()} GreenFuel Corporation. All rights
          reserved.
        </p>
      </motion.div>
    </>
  );
};
