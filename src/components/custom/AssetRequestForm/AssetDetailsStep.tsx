import React from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { slideVariants } from "./animations";
import { AssetDetailsProps } from "./types";

export const AssetDetailsStep: React.FC<AssetDetailsProps> = ({
  formData,
  handleChange,
  direction,
  navigateToStep,
  handleCheckboxChange,
}) => {
  return (
    <motion.div
      key="step3"
      custom={direction}
      variants={slideVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="space-y-1 mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Asset Details
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Verify your asset list and provide additional details
        </p>
      </div>

      {/* Asset List Table */}
      {formData.assets.length > 0 ? (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
          <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Asset Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price/Unit
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {formData.assets.map((asset, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {asset.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {asset.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {asset.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    ₹{asset.pricePerUnit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    ₹{asset.total}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 dark:bg-gray-800 font-medium">
                <td colSpan={4} className="px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                  Total
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  ₹{formData.assetAmount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No assets have been added yet. Please go back and add at least one asset.</p>
          <Button
            type="button"
            onClick={() => navigateToStep(1)}
            className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
          >
            Go Back to Asset Selection
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="reason"
            className="text-sm font-medium"
          >
            Reason for Request <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Please provide the reason for requesting the assets"
            className="min-h-32 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="policyAgreement"
            name="policyAgreement"
            checked={Boolean(formData.policyAgreement)}
            onChange={(e) => {
              if (handleCheckboxChange) {
                handleCheckboxChange(e.target.checked);
              }
            }}
            className="mr-2 mt-1"
          />
          <Label
            htmlFor="policyAgreement"
            className="text-sm"
          >
            I agree to the company's asset usage policy and understand
            that I am responsible for the proper use and maintenance of
            these assets.
          </Label>
        </div>
      </div>
    </motion.div>
  );
};
