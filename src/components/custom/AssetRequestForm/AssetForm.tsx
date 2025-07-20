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
  const isFormValid = currentAsset.title.trim() !== '' && 
                     currentAsset.description.trim() !== '' && 
                     currentAsset.quantity > 0 && 
                     currentAsset.pricePerUnit > 0;

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Add New Asset</h3>
        <p className="text-sm text-gray-600">Fill in the details for your new asset</p>
      </div>

      {/* First Row: SAP Item Code and Asset Title */}
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div>
          <Label htmlFor="sapItemCode" className="block text-sm font-medium text-gray-700 mb-1">
            SAP Item Code
          </Label>
          <Input
            id="sapItemCode"
            name="sapItemCode"
            value={currentAsset.sapItemCode}
            onChange={(e) => handleCurrentAssetChange("sapItemCode", e.target.value)}
            placeholder="Enter SAP code (optional)"
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="assetTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Asset Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="assetTitle"
            name="assetTitle"
            value={currentAsset.title}
            onChange={(e) => handleCurrentAssetChange("title", e.target.value)}
            placeholder="Enter descriptive asset title"
            className="w-full"
            required
          />
        </div>
      </div>

      {/* Second Row: Description (full width) */}
      <div className="mb-4">
        <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description/Specifications <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          value={currentAsset.description}
          onChange={(e) => handleCurrentAssetChange("description", e.target.value)}
          placeholder="Enter detailed specifications, features, model number, etc."
          className="w-full min-h-24 resize-none"
          required
        />
      </div>

      {/* Third Row: Quantity, Amount, Total */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <Label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantity <span className="text-red-500">*</span>
          </Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            value={currentAsset.quantity}
            onChange={(e) => handleCurrentAssetChange("quantity", e.target.value)}
            placeholder="1"
            className="w-full text-center"
            required
          />
        </div>
        <div>
          <Label htmlFor="pricePerUnit" className="block text-sm font-medium text-gray-700 mb-1">
            Amount <span className="text-red-500">*</span>
          </Label>
          <Input
            id="pricePerUnit"
            name="pricePerUnit"
            type="number"
            min="0"
            step="0.01"
            value={currentAsset.pricePerUnit}
            onChange={(e) => handleCurrentAssetChange("pricePerUnit", e.target.value)}
            placeholder="0"
            className="w-full text-center"
            required
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Total (Auto Cal)
          </Label>
          <div className="w-full h-10 bg-green-50 border border-green-200 rounded-md flex items-center justify-center">
            <span className="font-semibold text-green-800">
              ₹{currentAsset.total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center pt-4 border-t border-gray-200">
        {editingAssetIndex !== null ? (
          <div className="flex space-x-3">
            <Button
              type="button"
              onClick={cancelEditing}
              variant="outline"
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={updateEditedAsset}
              disabled={!isFormValid}
              className="px-6 py-2"
            >
              Update Asset
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            onClick={addAssetItem}
            disabled={!isFormValid}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
          >
            + Add Asset
          </Button>
        )}
      </div>
    </div>
  );
};

export default AssetForm;
