import React from "react";
import { motion } from "framer-motion";
import { FormStepProps, AssetItem } from "./types";
import { slideVariants } from "./animations";
import { AssetForm } from "./AssetForm";
import { AssetTable } from "./AssetTable";
import { Package, Plus, ShoppingCart, TrendingUp } from "lucide-react";

interface AssetSelectionStepProps extends FormStepProps {
  currentAsset: AssetItem;
  handleCurrentAssetChange: (key: keyof AssetItem, value: string | number) => void;
  addAssetItem: () => void;
  removeAssetItem: (index: number) => void;
  startEditingAsset: (index: number) => void;
  updateEditedAsset: () => void;
  cancelEditing: () => void;
  editingAssetIndex: number | null;
}

export const AssetSelectionStep: React.FC<AssetSelectionStepProps> = ({
  formData,
  direction,
  currentAsset,
  handleCurrentAssetChange,
  addAssetItem,
  removeAssetItem,
  startEditingAsset,
  updateEditedAsset,
  cancelEditing,
  editingAssetIndex,
}) => {
  // Format currency with proper thousand separators
  function formatCurrency(amount: number | string): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(numAmount);
  }

  return (
    <motion.div
      key="step2"
      custom={direction}
      variants={slideVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8 max-w-6xl mx-auto"
    >
      {/* Enhanced Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="flex items-center justify-between mb-6 p-2 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Asset Selection
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Add and configure the assets you need for your request
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex space-x-4">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4 text-blue-500" />
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Items</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{formData.assets.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Value</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(Number(formData.assetAmount) || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Asset Entry Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Plus className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingAssetIndex !== null ? 'Edit Asset Details' : 'Add New Asset'}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {editingAssetIndex !== null ? 'Update the asset information below' : 'Fill in the details for your new asset'}
                </p>
              </div>
            </div>
            {editingAssetIndex !== null && (
              <div className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  Editing Item #{editingAssetIndex + 1}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <AssetForm
            currentAsset={currentAsset}
            handleCurrentAssetChange={handleCurrentAssetChange}
            addAssetItem={addAssetItem}
            updateEditedAsset={updateEditedAsset}
            cancelEditing={cancelEditing}
            editingAssetIndex={editingAssetIndex}
          />
        </div>
      </motion.div>

      {/* Enhanced Asset Table */}
      {formData.assets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Selected Assets
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Review and manage your asset selection
                  </p>
                </div>
              </div>
              <div className="bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  {formData.assets.length} Asset{formData.assets.length !== 1 ? 's' : ''} Selected
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <AssetTable
              assets={formData.assets}
              startEditingAsset={startEditingAsset}
              removeAssetItem={removeAssetItem}
              totalAmount={formData.assetAmount}
            />
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {formData.assets.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 text-center"
        >
          <div className="max-w-sm mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-8 w-8 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Assets Added Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Start by adding your first asset using the form above. Each asset should include specifications, quantity, and pricing details.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Fill out the form above to get started</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
