import React from "react";
import { motion } from "framer-motion";
import { slideVariants } from "./animations";
import { FormStepProps } from "./types";

export const ConfirmationStep: React.FC<FormStepProps> = ({
  formData,
  direction,
}) => {
  return (
    <motion.div
      key="step4"
      custom={direction}
      variants={slideVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="space-y-1 mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Confirmation
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please review your information before submitting
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
          Employee Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400 block">
              Plant
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formData.plant}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400 block">
              Date
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formData.date}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400 block">
              Employee Code
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formData.employeeCode}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400 block">
              Employee Name
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formData.employeeName}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400 block">
              Department
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formData.department}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400 block">
              Designation
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formData.designation}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400 block">
              Initiate Department
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formData.initiateDept}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400 block">
              Current Status
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formData.currentStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
          Asset Details
        </h4>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4">
          <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-white dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Asset Title
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
                <td colSpan={3} className="px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                  Total
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  ₹{formData.assetAmount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 block">
              Reason for Request
            </span>
            <p className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-900 p-3 rounded-md">
              {formData.reason}
            </p>
          </div>
          
          <div className="space-y-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 block">
              Benefit to Organization
            </span>
            <p className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-900 p-3 rounded-md">
              {formData.benefitToOrg}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400 block">
                Approval Category
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formData.approvalCategory}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400 block">
                Approval Type
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formData.approvalType}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400 block">
                Notify To
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formData.notifyTo}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-500 dark:text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              By submitting this form, you are confirming that all
              information provided is accurate and complete. You also
              agree to the company's asset usage policy.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
