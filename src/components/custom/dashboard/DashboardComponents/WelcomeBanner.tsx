import React from "react";
import { motion } from "framer-motion";
import { Plus, Bell, Calendar, Sparkles } from "lucide-react";
import { UserInfoType } from "../types";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface WelcomeBannerProps {
  userInfo: UserInfoType | null;
}

// Enhanced animation variants
const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 0.8,
      delay: 0.1,
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
      stiffness: 300, 
      damping: 15,
      delay: 0.4,
    }
  },
  hover: { 
    scale: 1.05,
    boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.2), 0 4px 6px -2px rgba(79, 70, 229, 0.1)",
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
      damping: 10,
      delay: 0.5,
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

const floatingIconVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ userInfo }) => {
  const router = useRouter();
  
  // Get current time to show appropriate greeting
  const currentHour = new Date().getHours();
  let greeting = "Good morning";
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  } else if (currentHour >= 18) {
    greeting = "Good evening";
  }

  // Calculate date info for display
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Get number of tasks (this would normally come from props or API)
  const pendingTasks = 5;

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 shadow-xl"
    >
      {/* Background decoration elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <motion.div 
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-purple-500 opacity-20 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 15, 0],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-indigo-400 opacity-20 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -10, 0],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut" 
          }}
        />
        
        {/* Animated decorative elements */}
        <motion.div 
          className="absolute top-4 right-12 opacity-10"
          animate="animate"
        >
          <Sparkles className="w-16 h-16 text-white" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-4 left-1/4 opacity-10"
          animate="animate"
          transition={{ 
            delay: 1,
            duration: 4,
          }}
        >
          <Calendar className="w-10 h-10 text-white" />
        </motion.div>

        {/* Semi-transparent overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Left text content */}
          <div className="space-y-4">
            <div>
              <motion.span
                className="inline-block text-indigo-100 text-sm font-medium mb-1 bg-white/10 px-3 py-1 rounded-full"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {dateString}
              </motion.span>
              
              <motion.h1
                className="text-3xl font-bold text-white"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.3,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
              >
                {greeting}, {userInfo?.name?.split(' ')[0] || "User"}!
              </motion.h1>
              
              <motion.p
                className="text-indigo-100 mt-2 max-w-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Welcome to your dashboard. Here's what's happening with your workflow today.
              </motion.p>
            </div>
            
            {/* Stats row */}
            <motion.div 
              className="flex items-center space-x-6 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 mr-2">
                  <Bell className="h-4 w-4 text-white" />
                </span>
                <div>
                  <span className="text-sm text-indigo-100">Pending</span>
                  <p className="font-medium text-white">{pendingTasks} tasks</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 mr-2">
                  <Calendar className="h-4 w-4 text-white" />
                </span>
                <div>
                  <span className="text-sm text-indigo-100">Today</span>
                  <p className="font-medium text-white">{today.getDate()} Tasks</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right action button */}
          <motion.div
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            <button 
              onClick={() => router.push("/dashboard/form")}
              className="bg-white text-indigo-600 hover:text-indigo-700 font-semibold px-5 py-3 rounded-xl flex items-center shadow-lg transition-all"
            >
              <motion.div
                variants={iconVariants}
                whileHover="hover"
              >
                <Plus className="h-4 w-4 mr-2" />
              </motion.div>
              <span>Create Request</span>
            </button>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="absolute bottom-0 left-0 w-full h-10 text-white opacity-10"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            className="fill-current"
          />
        </svg>
      </div>
    </motion.div>
  );
};

export default WelcomeBanner; 