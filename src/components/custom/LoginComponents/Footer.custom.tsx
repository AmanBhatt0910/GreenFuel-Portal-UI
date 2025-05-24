import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface FooterLinksProps {
  links: Array<{
    href: string;
    label: string;
  }>;
}

export const FooterLinks: React.FC<FooterLinksProps> = ({ links }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="mt-8">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap justify-center gap-6 mb-4"
      >
        {links.map((link, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Link 
              href={link.href}
              className="text-sm text-gray-600 hover:text-[#243B55] dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
            >
              {link.label}
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        variants={itemVariants} 
        className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6 border-t border-gray-100 dark:border-gray-700 pt-4"
      >
        <p>
          © {new Date().getFullYear()} Cubia Corporation. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};