import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AssetFormProps } from "./types";

export const AssetForm: React.FC<AssetFormProps> = ({
  currentAsset,
  handleCurrentAssetChange,
  addAssetItem,
  updateEditedAsset,
  cancelEditing,
  editingAssetIndex,
}) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 relative">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assetTitle" className="text-sm font-medium">
            Asset Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="assetTitle"
            name="assetTitle"
            value={currentAsset.title}
            onChange={(e) => handleCurrentAssetChange("title", e.target.value)}
            placeholder="Enter asset title"
            className="h-10 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assetDescription" className="text-sm font-medium">
            Description/Specifications <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="assetDescription"
            name="assetDescription"
            value={currentAsset.description}
            onChange={(e) => handleCurrentAssetChange("description", e.target.value)}
            placeholder="Enter asset specifications"
            className="min-h-20 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="assetQuantity" className="text-sm font-medium">
              Quantity <span className="text-red-500">*</span>
            </Label>
            <Input
              id="assetQuantity"
              name="assetQuantity"
              type="number"
              value={currentAsset.quantity}
              onChange={(e) => handleCurrentAssetChange("quantity", e.target.value)}
              placeholder="Enter quantity"
              className="h-10 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetPricePerUnit" className="text-sm font-medium">
              Price Per Unit <span className="text-red-500">*</span>
            </Label>
            <Input
              id="assetPricePerUnit"
              name="assetPricePerUnit"
              type="number"
              value={currentAsset.pricePerUnit}
              onChange={(e) => handleCurrentAssetChange("pricePerUnit", e.target.value)}
              placeholder="Enter price per unit"
              className="h-10 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assetTotal" className="text-sm font-medium">
            Total (Auto-calculated)
          </Label>
          <Input
            id="assetTotal"
            name="assetTotal"
            value={`₹${currentAsset.total}`}
            className="h-10 rounded-md bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            readOnly
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2 justify-end">
        {editingAssetIndex !== null ? (
          <>
            <Button
              type="button"
              onClick={cancelEditing}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={updateEditedAsset}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Update Asset
            </Button>
          </>
        ) : (
          <Button
            type="button"
            onClick={addAssetItem}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Add Asset
          </Button>
        )}
      </div>
    </div>
  );
};
