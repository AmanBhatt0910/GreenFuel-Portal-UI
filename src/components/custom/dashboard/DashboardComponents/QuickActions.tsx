import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Users, 
  BarChart3, 
  Bell, 
  CheckCircle, 
  Calendar, 
  Settings, 
  HelpCircle,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";

// Animation variants
const cardVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
    },
  }
};

const iconContainerVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.15,
    rotate: 5,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 10 
    }
  },
  tap: { scale: 0.95 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    },
  },
};

type ActionCardProps = {
  icon: React.ReactNode;
  label: string;
  bgColor: string;
  hoverBgColor: string;
  darkBgColor: string;
  darkHoverBgColor: string;
  iconBgColor: string;
  darkIconBgColor: string;
  iconTextColor: string;
  darkIconTextColor: string;
  onClick?: () => void;
};

const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  label,
  bgColor,
  hoverBgColor,
  darkBgColor,
  darkHoverBgColor,
  iconBgColor,
  darkIconBgColor,
  iconTextColor,
  darkIconTextColor,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.button
      className={`relative flex flex-col items-center justify-center p-5 ${bgColor} dark:${darkBgColor} rounded-xl hover:${hoverBgColor} dark:hover:${darkHoverBgColor} transition-all duration-300 shadow-sm hover:shadow-md`}
      variants={cardVariants}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className={`${iconBgColor} dark:${darkIconBgColor} p-3 rounded-full mb-3`}
        variants={iconContainerVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
      >
        <div className={`h-6 w-6 ${iconTextColor} dark:${darkIconTextColor}`}>
          {icon}
        </div>
      </motion.div>
      <span className="text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </span>
      
      {isHovered && (
        <motion.div 
          className="absolute -right-1 -top-1 bg-indigo-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <ChevronRight className="h-3 w-3" />
        </motion.div>
      )}
    </motion.button>
  );
};

type PendingTaskProps = {
  status: "urgent" | "due" | "upcoming";
  task: string;
  dueText: string;
};

const PendingTask: React.FC<PendingTaskProps> = ({
  status,
  task,
  dueText
}) => {
  const statusColors = {
    urgent: "bg-red-500",
    due: "bg-amber-500",
    upcoming: "bg-green-500"
  };
  
  const pulseAnimations = {
    urgent: { 
      scale: [1, 1.4, 1],
      transition: { repeat: Infinity, repeatDelay: 1, duration: 0.7 }
    },
    due: { 
      scale: [1, 1.3, 1],
      transition: { repeat: Infinity, repeatDelay: 2, duration: 0.6 }
    },
    upcoming: { 
      scale: [1, 1.2, 1],
      transition: { repeat: Infinity, repeatDelay: 3, duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg group"
      variants={cardVariants}
      whileHover={{ 
        x: 5,
        backgroundColor: "rgba(249, 250, 251, 1)",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        transition: { duration: 0.2 }
      }}
    >
      <div className="flex items-center">
        <motion.div 
          className={`w-2 h-2 ${statusColors[status]} rounded-full mr-3`}
          animate={pulseAnimations[status]}
        ></motion.div>
        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
          {task}
        </span>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {dueText}
      </span>
    </motion.div>
  );
};

// Type-safe props definition with React's HTMLAttributes
interface QuickActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  // Add any additional props specific to QuickActions here
}

const QuickActions: React.FC<QuickActionsProps> = ({ className = "", ...props }) => {
  const router = useRouter();
  const [showAllTasks, setShowAllTasks] = useState(false);
  
  const goToNewRequest = () => {
    router.push("/requests/new");
  };
  
  const goToTeam = () => {
    router.push("/team");
  };
  
  const goToReports = () => {
    router.push("/reports");
  };
  
  const goToNotifications = () => {
    router.push("/notifications");
  };

  const toggleShowAllTasks = () => {
    setShowAllTasks(!showAllTasks);
  };

  return (
    <div className={className} {...props}>
      <motion.div 
        className="grid grid-cols-2 gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <ActionCard 
          icon={<FileText className="h-6 w-6" />}
          label="New Request"
          bgColor="bg-indigo-50"
          hoverBgColor="bg-indigo-100"
          darkBgColor="bg-indigo-900/20"
          darkHoverBgColor="bg-indigo-800/30"
          iconBgColor="bg-indigo-100"
          darkIconBgColor="bg-indigo-800/50"
          iconTextColor="text-indigo-600"
          darkIconTextColor="text-indigo-400"
          onClick={goToNewRequest}
        />

        <ActionCard 
          icon={<Users className="h-6 w-6" />}
          label="Team"
          bgColor="bg-green-50"
          hoverBgColor="bg-green-100"
          darkBgColor="bg-green-900/20"
          darkHoverBgColor="bg-green-800/30"
          iconBgColor="bg-green-100"
          darkIconBgColor="bg-green-800/50"
          iconTextColor="text-green-600"
          darkIconTextColor="text-green-400"
          onClick={goToTeam}
        />

        <ActionCard 
          icon={<BarChart3 className="h-6 w-6" />}
          label="Reports"
          bgColor="bg-amber-50"
          hoverBgColor="bg-amber-100"
          darkBgColor="bg-amber-900/20"
          darkHoverBgColor="bg-amber-800/30"
          iconBgColor="bg-amber-100"
          darkIconBgColor="bg-amber-800/50"
          iconTextColor="text-amber-600"
          darkIconTextColor="text-amber-400"
          onClick={goToReports}
        />

        <ActionCard 
          icon={
            <Bell className="h-6 w-6" />
          }
          label="Notifications"
          bgColor="bg-blue-50"
          hoverBgColor="bg-blue-100"
          darkBgColor="bg-blue-900/20"
          darkHoverBgColor="bg-blue-800/30"
          iconBgColor="bg-blue-100"
          darkIconBgColor="bg-blue-800/50"
          iconTextColor="text-blue-600"
          darkIconTextColor="text-blue-400"
          onClick={goToNotifications}
        />
      </motion.div>

      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { 
            delay: 0.6,
            type: "spring",
            stiffness: 100
          }
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <motion.h4 
            className="text-sm font-medium text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: -5 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { 
                delay: 0.7,
                type: "spring",
                stiffness: 100
              }
            }}
          >
            Pending Tasks
          </motion.h4>
          <motion.button
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.8 } }}
            onClick={toggleShowAllTasks}
          >
            {showAllTasks ? "Show Less" : "View All"}
            <ChevronRight className="h-3 w-3 ml-1" />
          </motion.button>
        </div>
        
        <motion.div 
          className="space-y-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <PendingTask
            status="urgent"
            task="Review budget proposals"
            dueText="Overdue by 2 days"
          />
          
          <PendingTask
            status="due"
            task="Complete monthly report"
            dueText="Due tomorrow"
          />
          
          <PendingTask
            status="upcoming"
            task="Schedule team meeting"
            dueText="Due in 3 days"
          />
          
          {showAllTasks && (
            <>
              <PendingTask
                status="upcoming"
                task="Update project roadmap"
                dueText="Due in 5 days"
              />
              
              <PendingTask
                status="upcoming"
                task="Quarterly review preparation"
                dueText="Due in 1 week"
              />
              
              <motion.button
                className="w-full py-2 mt-2 text-sm text-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800/30 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  transition: { 
                    delay: 0.2,
                    type: "spring",
                    stiffness: 100
                  }
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Add New Task
              </motion.button>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QuickActions;