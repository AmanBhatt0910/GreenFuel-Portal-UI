import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { slideVariants } from "./animations";
import { FormStepProps } from "./types";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import useAxios from "@/app/hooks/use-axios";

export const ConfirmationStep: React.FC<FormStepProps> = ({
  formData,
  handleCheckboxChange,
  direction,
}) => {
  const [departmentName, setDepartmentName] = useState("Loading...");
  const [businessUnitName, setBusinessUnitName] = useState("Loading...");
  const [designationName, setDesignationName] = useState("Loading...");
  const [categoryName, setCategoryName] = useState("Loading...");
  const [concernedDepartmentName, setConcernedDepartmentName] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const api = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch business unit name
        if (formData.plant) {
          const businessUnitResponse = await api.get(`/business-units/${formData.plant}/`);
          console.log("Business Unit Response:", businessUnitResponse.data);
          if (businessUnitResponse.data) {
            setBusinessUnitName(businessUnitResponse.data.name || "Unknown");
          }
        }
        
        // Fetch department name - check both department and initiateDept
        if (formData.initiateDept) {
          const departmentResponse = await api.get(`/departments/${formData.initiateDept}/`);
          console.log("Department Response:", departmentResponse.data);
          if (departmentResponse.data) {
            setDepartmentName(departmentResponse.data.name || "Unknown");
          }
        }
        
        // Fetch designation name
        if (formData.designation) {
          const designationResponse = await api.get(`/designations/${formData.designation}/`);
          console.log("Designation Response:", designationResponse.data);
          if (designationResponse.data) {
            setDesignationName(designationResponse.data.name || "Unknown");
          }
        }
        
        // Fetch category name
        if (formData.category) {
          console.log("Fetching category with ID:", formData.category);
          const categoryResponse = await api.get(`/approval-request-category/${formData.category}/`);
          console.log("Category Response:", categoryResponse.data);
          if (categoryResponse.data) {
            setCategoryName(categoryResponse.data.name || "Unknown");
          }
        }
        
        // Fetch concerned department name
        if (formData.concerned_department) {
          console.log("Fetching concerned department with ID:", formData.concerned_department);
          const concernedDeptResponse = await api.get(`/departments/${formData.concerned_department}/`);
          console.log("Concerned Department Response:", concernedDeptResponse.data);
          if (concernedDeptResponse.data) {
            setConcernedDepartmentName(concernedDeptResponse.data.name || "Unknown");
          }
        }
        
      } catch (error) {
        console.error("Error fetching entity names:", error);
      } finally {
        setLoading(false);
      }
    };
    
    console.log("Form data in ConfirmationStep:", formData);
    fetchData();
  }, [formData.plant, formData.initiateDept, formData.designation, formData.category, formData.concerned_department]);

  // Format currency
  const formatCurrency = (amount: string) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return "₹0";
    
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

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
          Review and Confirm
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please review your asset request details before submitting
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-6 border border-gray-200 dark:border-gray-700">
        {/* Section title with toggle */}
        <div 
          className="flex justify-between items-center cursor-pointer" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h4 className="text-base font-medium text-gray-900 dark:text-white">
            Request Summary
          </h4>
          <button className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
        
        {isExpanded && (
          <>
            {/* Requestor Information */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                Requestor Information
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formData.employeeName}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Employee Code</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formData.employeeCode}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Business Unit</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {loading ? "Loading..." : businessUnitName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Department</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {loading ? "Loading..." : departmentName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Designation</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {loading ? "Loading..." : designationName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Category</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {loading ? "Loading..." : categoryName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Concerned Department</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {loading ? "Loading..." : concernedDepartmentName}
                  </p>
                </div>
              </div>
            </div>

            {/* Asset Information */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                Asset Information
              </h5>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Asset
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Qty
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {formData.assets.map((asset, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                        <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {asset.title}
                        </td>
                        <td className="px-6 py-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {asset.description}
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {asset.quantity}
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          ₹{asset.pricePerUnit}
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          ₹{asset.total}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100 dark:bg-gray-800 font-medium">
                      <td colSpan={4} className="px-6 py-2 text-right text-sm text-gray-700 dark:text-gray-300">
                        Total Value
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(formData.assetAmount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Request Details */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                Request Details
              </h5>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Reason for Request</p>
                  <p className="text-gray-900 dark:text-white mt-1">{formData.reason}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Benefit to Organization</p>
                  <p className="text-gray-900 dark:text-white mt-1">{formData.benefitToOrg}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Approval Category</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formData.approvalCategory}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Approval Type</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formData.approvalType}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg">
        <div className="flex">
          <div className="min-w-0 flex-1 flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <Check className="h-5 w-5 text-green-500 dark:text-green-400" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                Review Complete
              </p>
              <p className="mt-1 text-sm text-green-600/90 dark:text-green-500/80">
                Your request has been prepared and is ready to be submitted. Please confirm that you agree to the company's asset usage policy before proceeding.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start mt-4">
        <div className="flex items-center h-5">
          <input
            id="policyAgreement"
            name="policyAgreement"
            type="checkbox"
            checked={Boolean(formData.policyAgreement)}
            onChange={(e) => {
              if (handleCheckboxChange) {
                handleCheckboxChange(e.target.checked);
              }
            }}
            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
          />
        </div>
        <div className="ml-3 text-sm">
          <Label htmlFor="policyAgreement" className="text-gray-500 dark:text-gray-400">
            I understand that by submitting this request, I am responsible for the proper use and maintenance of these assets in accordance with company policy.
          </Label>
        </div>
      </div>
    </motion.div>
  );
};
