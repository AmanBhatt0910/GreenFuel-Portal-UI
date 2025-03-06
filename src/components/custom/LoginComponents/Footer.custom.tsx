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
    <motion.div variants={itemVariants} className="text-center text-sm text-[#6C757D] mt-6">
      <p>
        © {new Date().getFullYear()} GreenFuel Corporation. All rights reserved.
      </p>
    </motion.div>
  );
};