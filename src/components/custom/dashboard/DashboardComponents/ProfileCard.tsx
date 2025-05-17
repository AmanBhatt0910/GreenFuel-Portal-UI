import React from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Briefcase, Building, Fingerprint } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserInfoType } from "@/context/AuthContext";


interface ProfileCardProps {
  userInfo: UserInfoType;
  department: any;
  designation: any;
  businessUnit: any;
}

// Animation variants
const cardVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
    },
  },
  hover: {
    y: -8,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 15 
    }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2
    },
  },
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

const ProfileCard: React.FC<ProfileCardProps> = ({ userInfo, department, designation , businessUnit }) => {

  const router = useRouter();

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 relative overflow-hidden"
      variants={cardVariants}
      whileHover={{
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.3 }
      }}
    >
      {/* Background pattern animation */}
      <motion.div 
        className="absolute top-0 right-0 w-40 h-40 opacity-5"
        initial={{ rotate: 0, scale: 0.8 }}
        animate={{ 
          rotate: 360,
          scale: [0.8, 1.2, 0.8],
          transition: { 
            rotate: { repeat: Infinity, duration: 20, ease: "linear" },
            scale: { repeat: Infinity, duration: 8, ease: "easeInOut" }
          }
        }}
        style={{
          background: "radial-gradient(circle, rgba(79, 70, 229, 1) 0%, rgba(79, 70, 229, 0) 70%)",
          borderRadius: "50%",
          filter: "blur(10px)"
        }}
      />
      
      <motion.div 
        className="flex flex-col items-center mb-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { 
            delay: 0.3,
            type: "spring",
            stiffness: 100
          }
        }}
      >
        <motion.div 
          className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            transition: { 
              delay: 0.4,
              type: "spring",
              stiffness: 100
            }
          }}
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 0 0 4px rgba(79, 70, 229, 0.3)",
            transition: { duration: 0.2 }
          }}
        >
          {/* Pulsing ring effect */}
          <motion.div 
            className="absolute inset-0 rounded-full bg-indigo-200 dark:bg-indigo-800"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 0.2, 0],
              scale: [0.8, 1.2, 0.8],
              transition: { 
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              }
            }}
          />
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <User className="h-10 w-10 text-indigo-600 dark:text-indigo-300" />
          </motion.div>
        </motion.div>
        
        <motion.h3 
          className="text-xl font-semibold text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { 
              delay: 0.5,
              type: "spring",
              stiffness: 100
            }
          }}
        >
          {userInfo?.name || "User Name"}
        </motion.h3>
        
        <motion.p 
          className="text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            transition: { delay: 0.6 }
          }}
        >
          {designation?.name || "Employee"}
        </motion.p>

        
        <motion.div 
          className="mt-2 px-3 py-1 bg-green-100 dark:bg-green-900 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            transition: { 
              delay: 0.7,
              type: "spring",
              stiffness: 200
            }
          }}
          whileHover={{ 
            scale: 1.1,
            transition: { duration: 0.2 }
          }}
        >
          <p className="text-xs text-green-800 dark:text-green-300">
            {userInfo?.status ? "Active" : "Inactive"}
          </p>
        </motion.div>
      </motion.div>

      <motion.div 
        className="space-y-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex items-center"
          variants={cardVariants}
          whileHover={{ 
            x: 5,
            transition: { duration: 0.2 }
          }}
        >
          <motion.div
            variants={iconVariants}
            whileHover="hover"
          >
            <Mail className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3" />
          </motion.div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Email
            </p>
            <p className="text-gray-900 dark:text-white">
              {userInfo?.email || "Not available"}
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="flex items-center"
          variants={cardVariants}
          whileHover={{ 
            x: 5,
            transition: { duration: 0.2 }
          }}
        >
          <motion.div
            variants={iconVariants}
            whileHover="hover"
          >
            <Phone className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3" />
          </motion.div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Contact
            </p>
            <p className="text-gray-900 dark:text-white">
              {userInfo?.contact || "Not available"}
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="flex items-center"
          variants={cardVariants}
          whileHover={{ 
            x: 5,
            transition: { duration: 0.2 }
          }}
        >
          <motion.div
            variants={iconVariants}
            whileHover="hover"
          >
            <Briefcase className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3" />
          </motion.div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Department
            </p>
            <p className="text-gray-900 dark:text-white">
              {department?.name || "Not assigned"}
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="flex items-center"
          variants={cardVariants}
          whileHover={{ 
            x: 5,
            transition: { duration: 0.2 }
          }}
        >
          <motion.div
            variants={iconVariants}
            whileHover="hover"
          >
            <Building className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3" />
          </motion.div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Business Unit
            </p>
            <p className="text-gray-900 dark:text-white">
              {businessUnit?.name || "Not assigned"}
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="flex items-center"
          variants={cardVariants}
          whileHover={{ 
            x: 5,
            transition: { duration: 0.2 }
          }}
        >
          <motion.div
            variants={iconVariants}
            whileHover="hover"
          >
            <Fingerprint className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3" />
          </motion.div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Employee Code
            </p>
            <p className="text-gray-900 dark:text-white">
              {userInfo?.employee_code || "Not assigned"}
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700"
          variants={cardVariants}
        >
          <motion.button 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition-colors"
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/dashboard/profile")}
          >
            View Full Profile
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileCard;