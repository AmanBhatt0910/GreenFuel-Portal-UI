import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Filter, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  MoreHorizontal,
  Search,
  ChevronDown,
  ChevronUp,
  Calendar,
  ChevronsUpDown
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Status configuration object
const STATUS_CONFIG = {
  approved: {
    bgColor: "from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700",
    textColor: "text-white",
    icon: CheckCircle,
    animation: {
      scale: [1, 1.2, 1],
      transition: { 
        repeat: Infinity, 
        repeatDelay: 3,
        duration: 0.5
      }
    }
  },
  rejected: {
    bgColor: "from-rose-500 to-red-600 dark:from-rose-600 dark:to-red-700",
    textColor: "text-white",
    icon: XCircle,
    animation: {
      rotate: [0, 10, 0, -10, 0],
      transition: { 
        repeat: Infinity, 
        repeatDelay: 3,
        duration: 0.5
      }
    }
  },
  pending: {
    bgColor: "from-amber-400 to-amber-500 dark:from-amber-500 dark:to-amber-600",
    textColor: "text-white",
    icon: Clock,
    animation: {
      rotate: 360,
      transition: { 
        repeat: Infinity, 
        duration: 3,
        ease: "linear"
      }
    }
  }
};

// Animation variants
const tableVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.4, 
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const tableHeaderVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 100,
      duration: 0.5
    }
  }
};

const tableRowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 80,
      delay: 0.05 * i,
      duration: 0.4
    }
  })
};

const buttonVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { type: "spring", stiffness: 200 }
  },
  hover: { 
    scale: 1.1,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.95 }
};

const iconVariants = {
  hover: { 
    rotate: [0, 15, -15, 0],
    transition: { duration: 0.5 }
  }
};

const filterPanelVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: "auto",
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

// Types definition
export interface RequestType {
  id: number;
  budget_id: string;
  date: string;
  total: string;
  reason: string;
  policy_agreement: boolean;
  status: "pending" | "approved" | "rejected";
  benefit_to_organisation?: string;
  approval_category: string;
  approval_type: string;
  current_form_level: number;
  form_max_level: number;
  rejected: boolean;
  rejection_reason?: string;
  payback_period?: string;
  document_enclosed_summary?: string;
  current_status: string;
  user: number;
  business_unit: number;
  department: number;
  designation: number;
  concerned_department?: number;
  notify_to?: number;
  created_at?: string;
  updated_at?: string;
}

interface RequestsTableProps {
  requests: RequestType[];
  formatDate: (date: string) => string;
  showControls?: boolean;
  maxItems?: number;
  onViewAll?: () => void;
}

const isHighAmount = (totalStr: string): boolean => {
  const amount = parseFloat(totalStr);
  return amount >= 5000000; // 50 lakh (5,000,000)
};

// Function to determine the correct status configuration
const getStatusConfig = (request: RequestType) => {
  if (request.status === "approved" || request.current_status.toLowerCase() === "approved") {
    return STATUS_CONFIG.approved;
  } else if (request.status === "rejected" || request.rejected || request.current_status.toLowerCase() === "rejected") {
    return STATUS_CONFIG.rejected;
  } else {
    return STATUS_CONFIG.pending;
  }
};

const RequestsTable: React.FC<RequestsTableProps> = ({ 
  requests, 
  formatDate, 
  showControls = true, 
  maxItems = 5,
  onViewAll
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  
  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(requests.map(r => r.approval_category)));
  const statuses = ["Approved", "Pending", "Rejected"];
  
  // Filter and sort requests
  const filteredRequests = requests
    .filter(request => {
      const matchesSearch = 
        request.budget_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.approval_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.approval_type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter ? request.approval_category === categoryFilter : true;
      const matchesStatus = statusFilter ? request.current_status.toLowerCase() === statusFilter.toLowerCase() : true;
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case "date":
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          break;
        case "amount":
          comparison = parseFloat(b.total) - parseFloat(a.total);
          break;
        case "level":
          comparison = a.current_form_level - b.current_form_level;
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === "asc" ? comparison * -1 : comparison;
    });
  
  const displayRequests = filteredRequests.slice(0, maxItems);
  
  // Handle sorting
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };
  
  // Handle view request
  const handleViewRequest = (id: number) => {
    router.push(`/dashboard/requests/${id}`);
  };
  
  // Handle view all
  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      router.push("/dashboard/requests");
    }
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      {/* Header section */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Filter className="h-4 w-4" />
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Budget Requests</h3>
            <div className="flex items-center">
              <motion.div 
                className="relative ml-2 h-2 w-2 rounded-full bg-green-500"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2
                }}
              />
              <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                Live updating
              </span>
            </div>
          </div>
          
          {showControls && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm w-full sm:w-auto focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-gray-300"
                />
              </div>
              
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                <motion.div
                  animate={{ rotate: showFilters ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="ml-2 h-4 w-4" />
                </motion.div>
              </motion.button>
              
              <motion.button
                onClick={handleViewAll}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.03, x: 3 }}
                whileTap={{ scale: 0.97 }}
              >
                View All
                <ChevronDown className="ml-1 h-4 w-4 rotate-270" style={{ transform: 'rotate(-90deg)' }} />
              </motion.button>
            </div>
          )}
        </div>
        
        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
              variants={filterPanelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-gray-300 px-3 py-2"
                >
                  <option value="">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-gray-300 px-3 py-2"
                >
                  <option value="">All Statuses</option>
                  {statuses.map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Date Range</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-gray-300"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="quarter">Last 90 Days</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Table section */}
      <motion.div 
        className="overflow-x-auto"
        variants={tableVariants}
        initial="hidden"
        animate="visible"
      >
        <table className="w-full">
          <motion.thead variants={tableHeaderVariants}>
            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
              <th className="py-3 px-4 text-left">
                <div className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <span>Budget ID</span>
                </div>
              </th>
              <th className="py-3 px-4 text-left">
                <div 
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort("date")}
                >
                  <span>Date</span>
                  <motion.div animate={{ rotate: sortField === "date" && sortDirection === "asc" ? 180 : 0 }}>
                    <ChevronsUpDown className="h-3 w-3" />
                  </motion.div>
                </div>
              </th>
              <th className="py-3 px-4 text-left">
                <div 
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort("amount")}
                >
                  <span>Amount</span>
                  <motion.div animate={{ rotate: sortField === "amount" && sortDirection === "asc" ? 180 : 0 }}>
                    <ChevronsUpDown className="h-3 w-3" />
                  </motion.div>
                </div>
              </th>
              <th className="py-3 px-4 text-left">
                <div className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <span>Category</span>
                </div>
              </th>
              <th className="py-3 px-4 text-left">
                <div className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <span>Type</span>
                </div>
              </th>
              <th className="py-3 px-4 text-left">
                <div 
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort("level")}
                >
                  <span>Level</span>
                  <motion.div animate={{ rotate: sortField === "level" && sortDirection === "asc" ? 180 : 0 }}>
                    <ChevronsUpDown className="h-3 w-3" />
                  </motion.div>
                </div>
              </th>
              <th className="py-3 px-4 text-left">
                <div className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <span>Status</span>
                </div>
              </th>
              <th className="py-3 px-4 text-right">
                <div className="flex items-center justify-end space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <span>Actions</span>
                </div>
              </th>
            </tr>
          </motion.thead>
          <motion.tbody 
            className="divide-y divide-gray-100 dark:divide-gray-700"
          >
            {displayRequests.length > 0 ? (
              displayRequests.map((request, index) => {
                const statusConfig = getStatusConfig(request);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <motion.tr
                    key={request.id}
                    className="hover:bg-gray-50/70 dark:hover:bg-gray-800/70 cursor-pointer transition-colors"
                    variants={tableRowVariants}
                    custom={index}
                    onClick={() => handleViewRequest(request.id)}
                    whileHover={{
                      backgroundColor: "rgba(243, 244, 246, 0.7)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                      scale: 1.005
                    }}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {request.budget_id}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-800 dark:text-gray-200">{formatDate(request.date)}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(request.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <motion.div 
                        className={`${
                          isHighAmount(request.total) 
                            ? "font-medium text-amber-600 dark:text-amber-400" 
                            : "text-gray-800 dark:text-gray-200"
                        } text-sm`}
                        whileHover={isHighAmount(request.total) ? {
                          scale: 1.05,
                          transition: { duration: 0.2 }
                        } : {}}
                      >
                        {isHighAmount(request.total) && (
                          <motion.span 
                            className="inline-block h-2 w-2 mr-1.5 rounded-full bg-amber-500"
                            animate={{ 
                              scale: [1, 1.3, 1],
                              opacity: [0.7, 1, 0.7]
                            }}
                            transition={{ 
                              repeat: Infinity,
                              duration: 1.5
                            }}
                          />
                        )}
                        ₹{parseFloat(request.total).toLocaleString()}
                      </motion.div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        {request.approval_category}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {request.approval_type}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-indigo-500 h-2 rounded-full" 
                            style={{
                              width: `${(request.current_form_level / request.form_max_level) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300 ml-2">
                          {request.current_form_level}/{request.form_max_level}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <motion.div
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${statusConfig.bgColor} ${statusConfig.textColor}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          transition: { 
                            delay: 0.2 + (0.05 * index),
                            type: "spring",
                            stiffness: 200
                          }
                        }}
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 2px 10px 0 rgba(0,0,0,0.12)",
                          transition: { duration: 0.2 }
                        }}
                      >
                        <motion.div animate={statusConfig.animation}>
                          <StatusIcon className="h-3 w-3 mr-1.5" />
                        </motion.div>
                        {request.current_status}
                      </motion.div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                        <Link href={`/dashboard/requests/${request.id}`}>
                          <motion.button 
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/40"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            title="View Request Details"
                          >
                            <motion.div variants={iconVariants} whileHover="hover">
                              <Eye className="h-4 w-4" />
                            </motion.div>
                          </motion.button>
                        </Link>
                        <motion.button 
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          title="More Options"
                        >
                          <motion.div variants={iconVariants}>
                            <MoreHorizontal className="h-4 w-4" />
                          </motion.div>
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-8 px-4 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No requests found</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                  </div>
                </td>
              </tr>
            )}
          </motion.tbody>
        </table>
      </motion.div>
      
      {/* Footer with pagination if needed */}
      {showControls && displayRequests.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium text-gray-700 dark:text-gray-300">{displayRequests.length}</span> of{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">{filteredRequests.length}</span> requests
          </div>
          
          <motion.button
            onClick={handleViewAll}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
            whileHover={{ scale: 1.03, x: 3 }}
            whileTap={{ scale: 0.97 }}
          >
            View All
            <ChevronDown className="ml-1 h-4 w-4 rotate-270" style={{ transform: 'rotate(-90deg)' }} />
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default RequestsTable;