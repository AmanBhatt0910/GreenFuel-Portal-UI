import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Building,
  IndianRupee,
  Check,
  X,
} from "lucide-react";

import {
  badgeVariants,
  cardVariants,
  iconVariants,
  ProfileCardProps,
  staggerContainer,
} from "./types";

const ProfileCard: React.FC<ProfileCardProps> = ({
  userInfo,
  department,
  designation,
  businessUnit,
}) => {
  const isBudgetRequestor = userInfo?.is_budget_requester || false;

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 relative overflow-hidden border border-gray-100 dark:border-gray-700"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        y: -5,
        transition: { duration: 0.3 },
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
            scale: { repeat: Infinity, duration: 8, ease: "easeInOut" },
          },
        }}
        style={{
          background:
            "radial-gradient(circle, rgba(79, 70, 229, 1) 0%, rgba(79, 70, 229, 0) 70%)",
          borderRadius: "50%",
          filter: "blur(10px)",
        }}
      />

      {/* Circular pattern on bottom left */}
      <motion.div
        className="absolute bottom-0 left-0 w-32 h-32 opacity-5"
        initial={{ rotate: 0, scale: 0.8 }}
        animate={{
          rotate: -360,
          scale: [0.8, 1.1, 0.8],
          transition: {
            rotate: { repeat: Infinity, duration: 25, ease: "linear" },
            scale: {
              repeat: Infinity,
              duration: 10,
              ease: "easeInOut",
              delay: 1,
            },
          },
        }}
        style={{
          background:
            "radial-gradient(circle, rgba(236, 72, 153, 1) 0%, rgba(236, 72, 153, 0) 70%)",
          borderRadius: "50%",
          filter: "blur(10px)",
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
            stiffness: 100,
          },
        }}
      >
        {/* Budget Requestor ribbon - only shows if true */}
        {isBudgetRequestor && (
          <motion.div
            className="absolute -top-2 -right-2 z-20"
            initial={{ opacity: 0, scale: 0.5, rotate: 45 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              transition: {
                delay: 0.7,
                type: "spring",
                stiffness: 200,
                damping: 15,
              },
            }}
          >
            <motion.div
              className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-md"
              animate={{
                boxShadow: [
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  "0 4px 10px -1px rgba(79, 70, 229, 0.3)",
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
            >
              <IndianRupee className="h-3 w-3" />
              <span>Budget Requestor</span>
            </motion.div>
          </motion.div>
        )}

        <motion.div
          className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            transition: {
              delay: 0.4,
              type: "spring",
              stiffness: 100,
            },
          }}
          whileHover={{
            scale: 1.1,
            boxShadow: "0 0 0 4px rgba(79, 70, 229, 0.3)",
            transition: { duration: 0.2 },
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
                ease: "easeInOut",
              },
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
              stiffness: 100,
            },
          }}
        >
          {userInfo?.name || "User Name"}
        </motion.h3>

        <motion.p
          className="text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 0.6 },
          }}
        >
          {designation?.name || "Employee"}
        </motion.p>

        <div className="flex items-center gap-2 mt-3">
          <motion.div
            className="px-3 py-1 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            variants={badgeVariants}
            animate={userInfo?.status ? "active" : "inactive"}
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.2 },
            }}
          >
            <p className="text-xs font-medium flex items-center gap-1">
              {userInfo?.status ? (
                <>
                  <Check className="h-3 w-3" /> Active
                </>
              ) : (
                <>
                  <X className="h-3 w-3" /> Inactive
                </>
              )}
            </p>
          </motion.div>
        </div>
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
            transition: { duration: 0.2 },
          }}
        >
          <motion.div variants={iconVariants} whileHover="hover">
            <Mail className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3" />
          </motion.div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
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
            transition: { duration: 0.2 },
          }}
        >
          <motion.div variants={iconVariants} whileHover="hover">
            <Phone className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3" />
          </motion.div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
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
            transition: { duration: 0.2 },
          }}
        >
          <motion.div variants={iconVariants} whileHover="hover">
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
            transition: { duration: 0.2 },
          }}
        >
          <motion.div variants={iconVariants} whileHover="hover">
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

        {/* <motion.div
          className={`flex items-center p-3 rounded-lg ${isBudgetRequestor ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'bg-gray-50 dark:bg-gray-800/50'}`}
          variants={cardVariants}
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { 
              delay: 0.9,
              type: "spring",
              stiffness: 100
            }
          }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        >
          <motion.div
            variants={iconVariants}
            whileHover="hover"
            className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${isBudgetRequestor ? 'bg-indigo-100 dark:bg-indigo-800' : 'bg-gray-200 dark:bg-gray-700'}`}
            animate={isBudgetRequestor ? 
              { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 2 } } : 
              { scale: 1 }
            }
          >
            <IndianRupee className={`h-6 w-6 ${isBudgetRequestor ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400'}`} />
          </motion.div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Budget Authorization
            </p>
            <motion.div 
              className={`text-sm font-medium rounded-full px-3 py-1 inline-flex items-center gap-1.5 ${isBudgetRequestor ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800/50 dark:text-indigo-300' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              variants={pulseBadge}
              animate={isBudgetRequestor ? "pulse" : ""}
            >
              {isBudgetRequestor ? (
                <>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, delay: 1 }}
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                  Authorized Budget Requestor
                </>
              ) : (
                <>
                  <X className="h-4 w-4" />
                  Not Authorized for Budget Requests
                </>
              )}
            </motion.div>
          </div>
        </motion.div> */}

        <motion.div
          className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700"
          variants={cardVariants}
        >
          <motion.button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition-colors cursor-pointer"
            whileHover={{
              scale: 1.03,
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.97 }}
            // onClick={() => router.push("/dashboard/profile")}
            onClick={() => window.location.href = "/dashboard/profile"}
          >
            View Full Profile
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileCard;
