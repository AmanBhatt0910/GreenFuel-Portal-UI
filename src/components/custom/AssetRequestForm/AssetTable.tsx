import React from "react";
import { AssetTableProps } from "./types";
import { Edit, Trash2, Package, DollarSign, TrendingUp, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  startEditingAsset,
  removeAssetItem,
  totalAmount,
}) => {
  if (assets.length === 0) {
    return null;
  }

  // Format currency with proper thousand separators
  const formatCurrency = (amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(numAmount);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-blue-500" />
                    <span>Asset Details</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-green-500" />
                    <span>Quantity</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <DollarSign className="h-4 w-4 text-orange-500" />
                    <span>Unit Price</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <span>Total</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {assets.map((asset, index) => (
                <motion.tr
                  key={index}
                  variants={rowVariants}
                  className={`group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 ${
                    index % 2 === 0 
                      ? 'bg-white dark:bg-gray-800' 
                      : 'bg-gray-50/50 dark:bg-gray-750'
                  }`}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {asset.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {asset.description}
                        </p>
                        {asset.sapItemCode && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                              SAP: {asset.sapItemCode}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-8 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg font-semibold text-sm">
                      {asset.quantity}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(asset.pricePerUnit)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                      {formatCurrency(asset.total)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() => startEditingAsset(index)}
                        className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200 hover:scale-110"
                        title="Edit Asset"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeAssetItem(index)}
                        className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200 hover:scale-110"
                        title="Delete Asset"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {assets.map((asset, index) => (
          <motion.div
            key={index}
            variants={rowVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-lg"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-xl flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {asset.title}
                  </h3>
                  {asset.sapItemCode && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 mt-1">
                      SAP: {asset.sapItemCode}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => startEditingAsset(index)}
                  className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeAssetItem(index)}
                  className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {asset.description}
            </p>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Quantity</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{asset.quantity}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Unit Price</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(asset.pricePerUnit)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  {formatCurrency(asset.total)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Summary */}
      <motion.div 
        variants={rowVariants}
        className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-teal-900/20 rounded-2xl border-2 border-emerald-200 dark:border-emerald-700 p-6 shadow-lg"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Request Summary
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                Review your asset selection details
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 md:flex md:space-x-8">
            <div className="text-center md:text-right">
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Total Assets
              </p>
              <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
                {assets.length}
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Total Amount
              </p>
              <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
                {formatCurrency(Number(totalAmount) || 0)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
