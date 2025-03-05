"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ArrowRight,
  FileCheck,
  ArrowLeft,
  Building,
  Clock,
  AlertCircle,
  Leaf,
  FileText,
  Home,
} from "lucide-react";
import Link from "next/link";

// Import our custom components
import {
  FormData,
  AssetItem,
  EmployeeInformationStep,
  AssetSelectionStep,
  AssetDetailsStep,
  ConfirmationStep,
  FormNavigation,
  SidebarItem,
} from "@/components/custom/AssetRequestForm";
import { Button } from "@/components/ui/button";
import CustomBreadcrumb from "@/components/custom/CustomBreadcrumb";

// Form steps with enhanced descriptions
const formSteps = [
  {
    id: 1,
    title: "Requestor Summary",
    description: "Your details and department",
    icon: "user",
  },
  {
    id: 2,
    title: "Asset Selection",
    description: "Select items to request",
    icon: "package",
  },
  {
    id: 3,
    title: "Asset Details",
    description: "Provide justification",
    icon: "clipboard",
  },
  {
    id: 4,
    title: "Confirmation",
    description: "Review and submit",
    icon: "check-circle",
  },
];

// Initial form data
const getInitialFormData = (): FormData => ({
  plant: "",
  date: format(new Date(), "yyyy-MM-dd"),
  employeeCode: "",
  employeeName: "",
  department: "",
  designation: "",
  assets: [],
  assetAmount: "",
  reason: "",
  policyAgreement: false,
  initiateDept: "",
  currentStatus: "",
  benefitToOrg: "",
  approvalCategory: "",
  approvalType: "",
  notifyTo: "",
});

export default function AssetRequestForm() {
  // State for multi-step form
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState<FormData>(getInitialFormData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // State for asset management
  const [currentAsset, setCurrentAsset] = useState<AssetItem>({
    title: "",
    description: "",
    quantity: 1,
    pricePerUnit: 0,
    total: 0,
    sapItemCode : ""
  });
  const [editingAssetIndex, setEditingAssetIndex] = useState<number | null>(
    null
  );

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (checked: boolean | string) => {
    setFormData((prev) => ({
      ...prev,
      policyAgreement:
        typeof checked === "boolean" ? checked : checked === "true",
    }));
  };

  // Handle current asset changes
  const handleCurrentAssetChange = (
    key: keyof AssetItem,
    value: string | number
  ) => {
    setCurrentAsset((prev) => {
      const newAsset = { ...prev, [key]: value };

      // Calculate total when quantity or price changes
      if (key === "quantity" || key === "pricePerUnit") {
        const quantity = key === "quantity" ? Number(value) : prev.quantity;
        const pricePerUnit =
          key === "pricePerUnit" ? Number(value) : prev.pricePerUnit;
        newAsset.total = quantity * pricePerUnit;
      }

      return newAsset;
    });
  };

  // Add asset to the list
  const addAssetItem = () => {
    if (!currentAsset.title.trim()) return;

    const updatedAssets = [...formData.assets, currentAsset];
    const totalAmount = updatedAssets.reduce(
      (sum, asset) => sum + asset.total,
      0
    );

    setFormData((prev) => ({
      ...prev,
      assets: updatedAssets,
      assetAmount: totalAmount.toString(),
    }));

    setCurrentAsset({
      title: "",
      description: "",
      quantity: 1,
      pricePerUnit: 0,
      sapItemCode: "",
      total: 0,
    });
  };

  // Remove asset from the list
  const removeAssetItem = (index: number) => {
    const updatedAssets = formData.assets.filter((_, i) => i !== index);
    const totalAmount = updatedAssets.reduce(
      (sum, asset) => sum + asset.total,
      0
    );

    setFormData((prev) => ({
      ...prev,
      assets: updatedAssets,
      assetAmount: totalAmount.toString(),
    }));
  };

  // Start editing an asset
  const startEditingAsset = (index: number) => {
    setCurrentAsset(formData.assets[index]);
    setEditingAssetIndex(index);
  };

  // Update asset being edited
  const updateEditedAsset = () => {
    if (editingAssetIndex === null) return;

    const updatedAssets = [...formData.assets];
    updatedAssets[editingAssetIndex] = currentAsset;

    const totalAmount = updatedAssets.reduce(
      (sum, asset) => sum + asset.total,
      0
    );

    setFormData((prev) => ({
      ...prev,
      assets: updatedAssets,
      assetAmount: totalAmount.toString(),
    }));

    setCurrentAsset({
      title: "",
      description: "",
      quantity: 1,
      pricePerUnit: 0,
      sapItemCode: "",
      total: 0,
    });

    setEditingAssetIndex(null);
  };

  // Cancel editing
  const cancelEditing = () => {
    setCurrentAsset({
      title: "",
      description: "",
      quantity: 1,
      pricePerUnit: 0,
      sapItemCode: "",
      total: 0,
    });

    setEditingAssetIndex(null);
  };

  // Handle step click
  const handleStepClick = (clickedStep: number) => {
    // Only allow navigation to completed steps or the next available step
    if (clickedStep <= currentStep || isStepComplete(currentStep)) {
      setDirection(clickedStep > currentStep ? 1 : -1);
      setCurrentStep(clickedStep);
    }
  };

  // Navigate to a specific step
  const navigateToStep = (step: number) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  };

  // Go to previous step
  const goToPreviousStep = () => {
    if (currentStep === 0) return;
    setDirection(-1);
    setCurrentStep((prev) => prev - 1);
  };

  // Go to next step
  const goToNextStep = () => {
    if (!isStepValid()) return;
    if (currentStep === formSteps.length - 1) {
      handleSubmit();
      return;
    }
    setDirection(1);
    setCurrentStep((prev) => prev + 1);
  };

  // Submit the form
  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(formData);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  // Reset the form
  const resetForm = () => {
    setFormData(getInitialFormData());
    setCurrentStep(0);
    setIsSubmitted(false);
  };

  // Validation checks for each step
  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return (
          formData.plant.trim() !== "" &&
          formData.employeeCode.trim() !== "" &&
          formData.employeeName.trim() !== "" &&
          formData.department.trim() !== "" &&
          formData.designation.trim() !== ""
        );
      case 1:
        return formData.assets.length > 0;
      case 2:
        return formData.assets.length > 0 && formData.reason.trim() !== "";
      case 3:
        return formData.policyAgreement;
      default:
        return false;
    }
  };

  // Check if a step is complete
  const isStepComplete = (step: number) => {
    switch (step) {
      case 0:
        return (
          formData.plant.trim() !== "" &&
          formData.employeeCode.trim() !== "" &&
          formData.employeeName.trim() !== "" &&
          formData.department.trim() !== "" &&
          formData.designation.trim() !== ""
        );
      case 1:
        return formData.assets.length > 0;
      case 2:
        return formData.assets.length > 0 && formData.reason.trim() !== "";
      case 3:
        return formData.policyAgreement;
      default:
        return false;
    }
  };

  // Calculate progress percentage
  const progressPercentage = Math.floor(
    ((currentStep + 1) / formSteps.length) * 100
  );

  // Get request ID
  const getRequestId = () => {
    const prefix = formData.plant
      ? formData.plant.substring(0, 2).toUpperCase()
      : "AR";
    return `${prefix}-${Math.floor(10000 + Math.random() * 90000)}`;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Render form step content
  const renderFormStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="step1"
            custom={direction}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <EmployeeInformationStep
              formData={formData}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
              direction={direction}
            />
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            key="step2"
            custom={direction}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <AssetSelectionStep
              formData={formData}
              direction={direction}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
              currentAsset={currentAsset}
              handleCurrentAssetChange={handleCurrentAssetChange}
              addAssetItem={addAssetItem}
              removeAssetItem={removeAssetItem}
              startEditingAsset={startEditingAsset}
              updateEditedAsset={updateEditedAsset}
              cancelEditing={cancelEditing}
              editingAssetIndex={editingAssetIndex}
            />
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step3"
            custom={direction}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <AssetDetailsStep
              formData={formData}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
              direction={direction}
              navigateToStep={navigateToStep}
            />
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step4"
            custom={direction}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <ConfirmationStep
              formData={formData}
              direction={direction}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Generate estimated timeline
  const getEstimatedTimeline = () => {
    const today = new Date();
    const approvalDate = new Date(today);
    approvalDate.setDate(today.getDate() + 3);

    const processingDate = new Date(approvalDate);
    processingDate.setDate(approvalDate.getDate() + 2);

    const deliveryDate = new Date(processingDate);
    deliveryDate.setDate(processingDate.getDate() + 5);

    return {
      approval: format(approvalDate, "MMM dd, yyyy"),
      processing: format(processingDate, "MMM dd, yyyy"),
      delivery: format(deliveryDate, "MMM dd, yyyy"),
    };
  };

  const timeline = getEstimatedTimeline();
  const requestId = getRequestId();

  return (
    <div className="container mx-auto py-6 max-w-[95%] bg-gradient from-green-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-screen">
      <CustomBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Asset Request", href: "/dashboard/form" },
        ]}
      />

      {isSubmitted ? (
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto p-6 rounded-xl bg-gradient-to-b from-white to-green-50 dark:from-gray-800 dark:to-green-900/40 shadow-lg border border-green-100 dark:border-green-900/50">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-green-400/20 dark:bg-green-500/10 rounded-full animate-ping opacity-75"></div>
            <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800/40 dark:to-green-700/40 rounded-full shadow-inner">
              <Check
                className="h-12 w-12 text-green-600 dark:text-green-400"
                strokeWidth={3}
              />
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white text-center">
            Asset Request Submitted
          </h2>

          <div className="flex items-center mb-6 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg">
            <FileCheck className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              Request #{requestId}
            </p>
          </div>

          {/* Submission Details Card */}
          <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              Submission Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Submitted By
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formData.employeeName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Employee Code
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formData.employeeCode}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Department
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formData.department}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Submission Date
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {format(new Date(), "MMMM dd, yyyy")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Plant Location
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formData.plant}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Designation
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formData.designation}
                  </p>
                </div>
              </div>
            </div>

            {/* Assets Summary */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Asset Summary
              </h4>

              {formData.assets.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Asset
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Qty
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Unit Price
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {formData.assets.map((asset, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0
                              ? "bg-white dark:bg-gray-800"
                              : "bg-gray-50 dark:bg-gray-700"
                          }
                        >
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {asset.title}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            {asset.description || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                            {asset.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-right">
                            {formatCurrency(Number(asset.pricePerUnit))}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right font-medium">
                            {formatCurrency(Number(asset.total))}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-blue-50 dark:bg-blue-900/20 font-medium">
                        <td
                          colSpan={4}
                          className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right"
                        >
                          Total Amount:
                        </td>
                        <td className="px-4 py-3 text-sm text-blue-700 dark:text-blue-400 text-right font-bold">
                          {formatCurrency(Number(formData.assetAmount))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No assets requested
                </p>
              )}
            </div>

            {/* Request Reason */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Request Reason
              </h4>
              <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                {formData.reason}
              </p>
            </div>

            {/* Timeline */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                Estimated Timeline
              </h4>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                {/* Current status */}
                <div className="relative flex items-center mb-6">
                  <div className="absolute left-8 -ml-3 h-6 w-6 rounded-full border-2 border-blue-500 bg-white dark:bg-gray-800 z-10"></div>
                  <div className="absolute left-8 -ml-2.5 h-5 w-5 rounded-full bg-blue-500 animate-pulse z-20"></div>
                  <div className="ml-12">
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Current Status
                    </p>
                    <div className="flex items-center mt-1 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Pending Approval
                      </p>
                    </div>
                  </div>
                </div>

                {/* Upcoming stages */}
                <div className="relative flex items-center mb-6">
                  <div className="absolute left-8 -ml-2.5 h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-600 z-10"></div>
                  <div className="ml-12">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Management Approval
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Expected by {timeline.approval}
                    </p>
                  </div>
                </div>

                <div className="relative flex items-center mb-6">
                  <div className="absolute left-8 -ml-2.5 h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-600 z-10"></div>
                  <div className="ml-12">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Processing & Procurement
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Expected by {timeline.processing}
                    </p>
                  </div>
                </div>

                <div className="relative flex items-center">
                  <div className="absolute left-8 -ml-2.5 h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-600 z-10"></div>
                  <div className="ml-12">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Delivery & Handover
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Expected by {timeline.delivery}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Request Note */}
            <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex">
                <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-yellow-500 dark:text-yellow-400" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                    Important Note
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Your asset request will be reviewed by your department head
                    and the procurement team. You'll receive email notifications
                    about the status updates.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-2xl">
            Thank you for submitting your asset request. The request has been
            logged in our system and is now pending approval. You can track the
            status of your request using the reference number above.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-xl">
            <Button
              onClick={resetForm}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md transition-all duration-200 flex items-center justify-center"
            >
              <FileCheck className="h-4 w-4 mr-2" />
              Submit Another Request
            </Button>

            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Asset Request Form</h1>
              <p className="text-green-700 dark:text-green-400 text-sm font-medium mt-1">
                Complete all required fields to submit your asset request
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="border-green-200 hover:bg-green-50 hover:text-green-700 dark:border-green-800 dark:hover:bg-green-900/20 dark:hover:text-green-400" asChild>
                <Link href="/dashboard/requests">
                  <FileText className="mr-2 h-4 w-4" />
                  View My Requests
                </Link>
              </Button>
              <Button variant="outline" className="border-green-200 hover:bg-green-50 hover:text-green-700 dark:border-green-800 dark:hover:bg-green-900/20 dark:hover:text-green-400" asChild>
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>

          {/* <div className="bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 px-4 py-3 rounded-lg mb-6 border border-amber-200 dark:border-amber-800/50 flex items-start">
            <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-amber-500 dark:text-amber-400" />
            <div>
              <p className="font-medium">Important Information</p>
              <p className="text-sm mt-1">All asset requests require approval from your department head. Standard processing time is 5-7 business days after approval.</p>
            </div>
          </div> */}

          <div className="bg-gradient-to-br from-white to-green-50 dark:bg-gray-950 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="grid grid-cols-12 min-h-[700px]">
              {/* Sidebar */}
              <div className="col-span-12 p-6 md:col-span-4 lg:col-span-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700">
                <div className="sticky top-6">
                  {/* Form Title */}
                  <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900   dark:text-white mb-1">
                      Asset Request Form
                    </h1>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      Complete all sections to submit your request
                    </p>
                  </div>

                  {/* Steps */}
                  <div className="space-y-2 mb-8">
                    {formSteps.map((step, index) => (
                      <SidebarItem
                        key={step.id}
                        step={step}
                        index={index}
                        currentStep={currentStep}
                        onClick={() => handleStepClick(index)}
                        completed={isStepComplete(index)}
                        className={
                          index === currentStep
                            ? "border-green-500 dark:border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                            : ""
                        }
                      />
                    ))}
                  </div>

                </div>
              </div>

              {/* Main content */}
              <div className="col-span-12 md:col-span-8 lg:col-span-9 p-8 dark:bg-gray-900">
                <form className="max-w-3xl mx-auto ">
                  <AnimatePresence mode="wait" custom={direction}>
                    {renderFormStep()}
                  </AnimatePresence>

                  {/* Navigation buttons */}
                  <div className="flex justify-between mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      type="button"
                      onClick={goToPreviousStep}
                      disabled={currentStep === 0}
                      className={`bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 ${
                        currentStep === 0 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>

                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full border border-green-100 dark:border-green-800/30">
                      <Leaf className="h-3.5 w-3.5 mr-1.5 text-green-500 dark:text-green-400" />
                      Step {currentStep + 1} of {formSteps.length}:{" "}
                      {formSteps[currentStep].title}
                    </div>

                    {currentStep < formSteps.length - 1 ? (
                      <Button
                        type="button"
                        onClick={goToNextStep}
                        disabled={!isStepValid()}
                        className={`bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white ${
                          !isStepValid() ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!isStepValid() || isSubmitting}
                        className={`bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white ${
                          !isStepValid() || isSubmitting
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            Submit Request
                            <Check className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
