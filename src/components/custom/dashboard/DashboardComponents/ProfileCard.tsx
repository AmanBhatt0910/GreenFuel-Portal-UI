import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Phone, Briefcase, Building, 
  IndianRupee, Check, X, ChevronDown, 
  BadgeCheck, CreditCard, Award, Shield
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserInfoType, BusinessUnitType, DepartmentType, DesignationType } from "@/components/custom/dashboard/types";

export interface ProfileCardModernProps {
  userInfo: UserInfoType | null;
  department: DepartmentType | null;
  designation: DesignationType | null;
  businessUnit: BusinessUnitType | null;
}

const ProfileCardModern: React.FC<ProfileCardModernProps> = ({ 
  userInfo, 
  department, 
  designation, 
  businessUnit 
}) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState<boolean>(false);
  const isBudgetRequestor = userInfo?.is_budget_requester || false;
  
  // Generate placeholder initials if no user name
  const getInitials = () => {
    if (!userInfo?.name) return "U";
    return userInfo.name
      .split(" ")
      .map(name => name[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Framer Motion variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    },
    exit: { opacity: 0, y: -20 }
  };

  const expandVariants = {
    initial: { height: 0, opacity: 0 },
    animate: { 
      height: "auto", 
      opacity: 1,
      transition: {
        height: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] },
        opacity: { duration: 0.3, delay: 0.1 }
      }
    },
    exit: { 
      height: 0, 
      opacity: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 }
      }
    }
  };

  const staggerChildren = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const childVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const shimmerEffect = {
    initial: { backgroundPosition: "-500px 0" },
    animate: { 
      backgroundPosition: ["500px 0", "-500px 0"],
      transition: { 
        repeat: Infinity,
        duration: 3,
        ease: "linear"
      }
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 relative"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute -right-12 -top-12 w-64 h-64 text-indigo-100 dark:text-indigo-900/20 opacity-50" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M39.5,-65.5C50.2,-55.7,57.6,-43.6,63.7,-30.9C69.8,-18.2,74.7,-5,74.4,8.2C74.1,21.5,68.6,34.8,60.3,46.3C51.9,57.8,40.6,67.4,27.7,72.5C14.8,77.6,0.4,78.1,-13.6,75.3C-27.6,72.5,-41.3,66.4,-52.6,56.9C-63.9,47.3,-72.9,34.2,-77.8,19.7C-82.7,5.1,-83.5,-10.9,-78.5,-24.7C-73.5,-38.5,-62.8,-50.1,-49.9,-59.1C-37,-68.1,-22,-74.4,-6.5,-75.3C9,-76.2,28.7,-75.4,39.5,-65.5Z" transform="translate(100 100)" />
        </svg>
        <svg className="absolute -left-16 -bottom-16 w-64 h-64 text-indigo-100 dark:text-indigo-900/20 opacity-40" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M47.7,-73.2C59.9,-66.9,67.3,-51.3,69.5,-36.4C71.8,-21.6,68.9,-7.5,68.1,7.5C67.3,22.5,68.6,38.3,61.9,48.3C55.1,58.2,40.4,62.3,26.3,67.2C12.2,72.1,-1.2,77.8,-14.5,75.9C-27.8,73.9,-40.8,64.2,-50.2,52.7C-59.5,41.1,-65.1,27.7,-67.8,13.7C-70.6,-0.3,-70.4,-14.9,-64.5,-25.8C-58.6,-36.8,-46.9,-44.1,-35.5,-50.7C-24,-57.3,-12,-63.3,2.2,-66.6C16.5,-69.9,33,-79.6,47.7,-73.2Z" transform="translate(100 100)" />
        </svg>
      </div>

      {/* Budget Requestor Badge */}
      {isBudgetRequestor && (
        <motion.div
          className="absolute top-4 right-4 z-20"
          initial={{ scale: 0, rotate: 15 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
            transition: { 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.5
            }
          }}
        >
          <motion.div
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 4px 6px -1px rgba(79, 70, 229, 0.3)",
                "0 6px 10px -1px rgba(79, 70, 229, 0.4)",
                "0 4px 6px -1px rgba(79, 70, 229, 0.3)",
              ],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }}
          >
            <BadgeCheck className="h-3.5 w-3.5" />
            <span>Budget Requestor</span>
          </motion.div>
        </motion.div>
      )}

      {/* Header Area */}
      <div className="pt-8 px-6 pb-6 flex flex-col items-center relative">
        {/* Avatar */}
        <motion.div
          className="relative mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            transition: { 
              delay: 0.2,
              type: "spring",
              stiffness: 100
            }
          }}
        >
          {/* Pulsing ring effect */}
          <motion.div 
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 0.2, 0],
              scale: [0.8, 1.2, 0.8],
              background: "linear-gradient(-45deg, rgba(99, 102, 241, 0.5), rgba(168, 85, 247, 0.5))",
              transition: { 
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              }
            }}
          />
          
          <motion.div
            className="h-24 w-24 rounded-full ring-4 ring-white dark:ring-gray-800 flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl font-bold shadow-lg"
            whileHover={{ 
              scale: 1.05,
              rotate: 5,
              boxShadow: "0 0 20px 2px rgba(79, 70, 229, 0.3)",
              transition: { duration: 0.2 }
            }}
          >
            {/* You could add user image here if available */}
            {/* <Image src={userInfo?.avatar || "/placeholder-avatar.jpg"} alt={userInfo?.name || "User"} width={96} height={96} /> */}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
            >
              {getInitials()}
            </motion.span>
          </motion.div>

          {userInfo?.status && (
            <motion.div
              className="absolute -right-1 bottom-0 bg-green-500 h-6 w-6 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.8, stiffness: 200 }}
            >
              <Check className="h-3 w-3 text-white" />
            </motion.div>
          )}
        </motion.div>

        {/* User Info */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h3 
            className="text-xl font-bold text-gray-900 dark:text-white"
            variants={shimmerEffect}
            animate="animate"
            style={{ 
              backgroundImage: "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent)",
              backgroundSize: "200% 100%",
              backgroundRepeat: "no-repeat"
            }}
          >
            {userInfo?.name || "User Name"}
          </motion.h3>
          
          <motion.div
            className="text-sm text-gray-600 dark:text-gray-300 mt-1 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span>{designation?.name || "Employee"}</span>
            
            {userInfo?.status !== undefined && (
              <>
                <span className="h-1 w-1 bg-gray-400 dark:bg-gray-500 rounded-full"></span>
                <span className={`flex items-center gap-1 ${userInfo.status ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {userInfo.status ? (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      Active
                    </>
                  ) : (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      Inactive
                    </>
                  )}
                </span>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Primary info cards */}
        <motion.div 
          className="w-full grid grid-cols-2 gap-3 mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700"
            whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="flex items-center mb-1">
              <Briefcase className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400 mr-1.5" />
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Department</p>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {department?.name || "Not assigned"}
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700"
            whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="flex items-center mb-1">
              <Building className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400 mr-1.5" />
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Business Unit</p>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {businessUnit?.name || "Not assigned"}
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Budget Authorization */}
      <motion.div
        className={`px-6 py-4 border-t border-b ${isBudgetRequestor ? 
          'border-indigo-100 dark:border-indigo-900/40 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20' : 
          'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
            isBudgetRequestor ? 
              'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md' : 
              'bg-gray-200 dark:bg-gray-700'
          }`}>
            <IndianRupee className="h-5 w-5 text-white" />
          </div>
          
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Budget Authorization
            </p>
            
            <div className="mt-1">
              <motion.div 
                className={`text-xs font-medium rounded-full px-2.5 py-1 inline-flex items-center gap-1 ${
                  isBudgetRequestor ? 
                    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300' : 
                    'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
                animate={isBudgetRequestor ? {
                  boxShadow: [
                    "0 0 0 rgba(79, 70, 229, 0)",
                    "0 0 5px rgba(79, 70, 229, 0.3)",
                    "0 0 0 rgba(79, 70, 229, 0)"
                  ]
                } : {}}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2
                }}
              >
                {isBudgetRequestor ? (
                  <>
                    <Check className="h-3 w-3" />
                    <span>Authorized Budget Requestor</span>
                  </>
                ) : (
                  <>
                    <X className="h-3 w-3" />
                    <span>Not Authorized</span>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Info Section - Collapsible */}
      <div className="px-6 py-4">
        <motion.button 
          className="w-full flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          onClick={() => setExpanded(!expanded)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            <span>Contact Information</span>
          </span>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              variants={expandVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-3 overflow-hidden"
            >
              <motion.div 
                className="space-y-3"
                variants={staggerChildren}
                initial="initial"
                animate="animate"
              >
                <motion.div 
                  className="flex items-center"
                  variants={childVariants}
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                    <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {userInfo?.email || "Not available"}
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center"
                  variants={childVariants}
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                    <Phone className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {userInfo?.contact || "Not available"}
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center"
                  variants={childVariants}
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                    <CreditCard className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6 mt-1">
        <motion.button 
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2.5 rounded-lg font-medium transition-all shadow-md"
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)",
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/dashboard/profile")}
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { delay: 0.7 }
          }}
        >
          View Full Profile
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProfileCardModern;