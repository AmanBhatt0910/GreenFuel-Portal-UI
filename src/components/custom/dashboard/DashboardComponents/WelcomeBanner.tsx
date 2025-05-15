import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { UserInfoType } from "../types";

interface WelcomeBannerProps {
  userInfo: UserInfoType | null;
}

// Animation variants
const slideUp = {
  hidden: { y: 70, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
      mass: 0.8
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 200, 
      damping: 15 
    }
  },
  hover: { 
    scale: 1.05,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 10 
    }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 } 
  }
};

const iconVariants = {
  hidden: { opacity: 0, rotate: -10, scale: 0.8 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 200, 
      damping: 10 
    }
  },
  hover: { 
    rotate: 15, 
    scale: 1.2,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 10 
    }
  }
};

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ userInfo }) => {
  return (
    <motion.div
      variants={slideUp}
      className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg overflow-hidden relative"
      whileHover={{
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.3 }
      }}
    >
      {/* Background animation effect */}
      <motion.div 
        className="absolute top-0 left-0 right-0 bottom-0 bg-white opacity-10"
        initial={{ x: "-100%" }}
        animate={{ 
          x: ["100%", "-100%"],
          transition: { 
            repeat: Infinity, 
            duration: 15, 
            ease: "linear",
            repeatType: "mirror"
          }
        }}
        style={{ 
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
          width: "50%"
        }}
      />
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center relative z-10">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 10,
              delay: 0.2
            }}
            className="text-2xl font-bold"
          >
            Welcome back, {userInfo?.name || "User"}!
          </motion.h2>
          <motion.p
            className="mt-1 text-indigo-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 10,
              delay: 0.4
            }}
          >
            Here's what's happening with your requests today.
          </motion.p>
        </div>
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="mt-4 md:mt-0"
        >
          <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors flex items-center">
            <motion.div
              variants={iconVariants}
              whileHover="hover"
            >
              <Plus className="h-4 w-4 mr-2" />
            </motion.div>
            New Request
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WelcomeBanner;