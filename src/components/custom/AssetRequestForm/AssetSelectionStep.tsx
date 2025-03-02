import React from "react";
import { motion } from "framer-motion";
import { FormStepProps, AssetItem } from "./types";
import { slideVariants } from "./animations";
import { AssetForm } from "./AssetForm";
import { AssetTable } from "./AssetTable";

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
  return (
    <motion.div
      key="step2"
      custom={direction}
      variants={slideVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="space-y-1 mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Asset Selection
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please add the required assets with details
        </p>
      </div>

      {/* Asset entry form */}
      <AssetForm
        currentAsset={currentAsset}
        handleCurrentAssetChange={handleCurrentAssetChange}
        addAssetItem={addAssetItem}
        updateEditedAsset={updateEditedAsset}
        cancelEditing={cancelEditing}
        editingAssetIndex={editingAssetIndex}
      />

      {/* Asset Table */}
      {formData.assets.length > 0 && (
        <AssetTable
          assets={formData.assets}
          startEditingAsset={startEditingAsset}
          removeAssetItem={removeAssetItem}
          totalAmount={formData.assetAmount}
        />
      )}
    </motion.div>
  );
};
