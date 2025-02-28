"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

// Types
type AssetType =
  | "Desktop"
  | "Laptop"
  | "Printer"
  | "Headphone"
  | "Mouse"
  | "Monitor"
  | "MS Office License"
  | "SAP ID";

interface FormData {
  plant: string;
  date: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  designation: string;
  assetTypes: AssetType[];
  assetAmount: string;
  assetSpecification: string;
  reason: string;
  policyAgreement: boolean;
}

// Asset options with icons
const assetOptions: { type: AssetType; icon: string }[] = [
  { type: "Desktop", icon: "🖥️" },
  { type: "Laptop", icon: "💻" },
  { type: "Printer", icon: "🖨️" },
  { type: "Headphone", icon: "🎧" },
  { type: "Mouse", icon: "🖱️" },
  { type: "Monitor", icon: "🖥️" },
  { type: "MS Office License", icon: "📄" },
  { type: "SAP ID", icon: "🔑" },
];

// Form steps
const formSteps = [
  { id: 0, title: "Employee Information", icon: "👤" },
  { id: 1, title: "Asset Selection", icon: "📦" },
  { id: 2, title: "Asset Details", icon: "📝" },
  { id: 3, title: "Confirmation", icon: "✓" },
];

// Initial form data function
const getInitialFormData = (): FormData => ({
  plant: "",
  date: format(new Date(), "yyyy-MM-dd"),
  employeeCode: "",
  employeeName: "",
  department: "",
  designation: "",
  assetTypes: [],
  assetAmount: "",
  assetSpecification: "",
  reason: "",
  policyAgreement: false,
});

export default function AssetRequestForm() {
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState<FormData>(getInitialFormData());
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const [direction, setDirection] = useState(0);


  // Initialize data client-side only
  useEffect(() => {
    setIsClient(true);
    setFormData(getInitialFormData());
    setMounted(true);
  }, []);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle asset type selection
  const handleAssetTypeChange = (
    assetType: AssetType,
    checked: boolean | "indeterminate"
  ) => {
    const isChecked = checked === true;
    setFormData((prev) => {
      if (isChecked) {
        return {
          ...prev,
          assetTypes: prev.assetTypes.includes(assetType)
            ? prev.assetTypes
            : [...prev.assetTypes, assetType],
        };
      } else {
        return {
          ...prev,
          assetTypes: prev.assetTypes.filter((type) => type !== assetType),
        };
      }
    });
  };

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, policyAgreement: checked }));
  };

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < formSteps.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        return formData.assetTypes.length > 0;
      case 2:
        return (
          formData.assetAmount.trim() !== "" &&
          formData.assetSpecification.trim() !== "" &&
          formData.reason.trim() !== ""
        );
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

  // Animation variants
  const slideVariants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    }),
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  // Success screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 200,
          }}
          className="max-w-md w-full"
        >
          <Card className="border-0 shadow-xl">
            <CardContent className="p-0">
              <motion.div
                className="bg-green-500 h-2 w-full rounded-t-lg"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              ></motion.div>
              <div className="p-8">
                <motion.div
                  className="text-center"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.3,
                    }}
                  >
                    <Check className="w-10 h-10 text-green-600 dark:text-green-300" />
                  </motion.div>
                  <motion.h2
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                    variants={itemVariants}
                  >
                    Request Submitted Successfully!
                  </motion.h2>
                  <motion.p
                    className="text-gray-600 dark:text-gray-300 mb-6"
                    variants={itemVariants}
                  >
                    Your asset request has been processed and sent for approval.
                  </motion.p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.6 }}
                >
                  <Card className="bg-gray-50 dark:bg-gray-800 border-0 mb-6">
                    <CardContent className="p-4">
                      <motion.div
                        className="flex flex-col space-y-3"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <motion.div
                          className="flex justify-between items-center"
                          variants={itemVariants}
                        >
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Reference ID:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            AST-{Math.floor(1000 + Math.random() * 9000)}
                          </span>
                        </motion.div>
                        <motion.div
                          className="flex justify-between items-center"
                          variants={itemVariants}
                        >
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Date Submitted:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {isClient
                              ? format(new Date(), "MMMM dd, yyyy")
                              : ""}
                          </span>
                        </motion.div>
                        <motion.div
                          className="flex justify-between items-center"
                          variants={itemVariants}
                        >
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Status:
                          </span>
                          <span className="font-medium text-yellow-600 dark:text-yellow-400">
                            Pending Approval
                          </span>
                        </motion.div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  You will receive an email notification once your request is
                  approved.
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 1,
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    onClick={resetForm}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 transition-all"
                  >
                    Request Another Asset
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Form content based on current step
  const renderFormStep = () => {
    if (!isClient) return null;

    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="step1"
            custom={direction}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div className="space-y-1 mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Employee Information
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please provide your employee details
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="plant" className="text-sm font-medium">
                  Plant <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="plant"
                  name="plant"
                  value={formData.plant}
                  onChange={handleChange}
                  placeholder="Enter plant location"
                  className="h-10 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  Date
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="h-10 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="employeeCode" className="text-sm font-medium">
                  Employee Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="employeeCode"
                  name="employeeCode"
                  value={formData.employeeCode}
                  onChange={handleChange}
                  placeholder="Enter employee code"
                  className="h-10 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeName" className="text-sm font-medium">
                  Employee Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="employeeName"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="h-10 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium">
                  Department <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Enter your department"
                  className="h-10 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation" className="text-sm font-medium">
                  Designation <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Enter your designation"
                  className="h-10 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </motion.div>
        );
      case 1:
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
                Please select the assets you need
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {assetOptions.map(({ type, icon }) => (
                <div
                  key={type}
                  className={`flex items-center space-x-3 border rounded-lg p-4 transition-colors ${
                    formData.assetTypes.includes(type)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Checkbox
                    id={type}
                    checked={formData.assetTypes.includes(type)}
                    onCheckedChange={(checked) =>
                      handleAssetTypeChange(type, checked)
                    }
                    className="h-5 w-5"
                  />
                  <div className="flex items-center space-x-3">
                    <span className="text-xl" role="img" aria-label={type}>
                      {icon}
                    </span>
                    <Label
                      htmlFor={type}
                      className="cursor-pointer text-base font-medium"
                    >
                      {type}
                    </Label>
                  </div>
                </div>
              ))}
            </div>

            {formData.assetTypes.length > 0 && (
              <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Selected Assets ({formData.assetTypes.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {formData.assetTypes.map((asset) => (
                    <span
                      key={asset}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {asset}
                      <button
                        type="button"
                        className="ml-1.5 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                        onClick={() => handleAssetTypeChange(asset, false)}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        );
      case 2:
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
                Provide specifications and reason for the request
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assetAmount" className="text-sm font-medium">
                  Asset Estimated Cost (in INR){" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="assetAmount"
                  name="assetAmount"
                  value={formData.assetAmount}
                  onChange={handleChange}
                  placeholder="Enter cost estimate"
                  className="h-10 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex items-center mt-1 text-xs text-blue-600 dark:text-blue-400">
                  <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-1.5">
                    <span className="text-blue-600 dark:text-blue-400">i</span>
                  </div>
                  Requests under ₹15,000 don&apos;t require CFO approval
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="assetSpecification"
                  className="text-sm font-medium"
                >
                  Asset Specification <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="assetSpecification"
                  name="assetSpecification"
                  value={formData.assetSpecification}
                  onChange={handleChange}
                  placeholder="Enter detailed specifications"
                  className="h-10 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  E.g., Model, Brand, Configuration, etc.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason" className="text-sm font-medium">
                  Business Justification <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Explain why this asset is needed for your work"
                  className="min-h-32 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </motion.div>
        );
      case 3:
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
                Review and Submit
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please verify all information before submitting
              </p>
            </div>

            <Card className="bg-gray-50 dark:bg-gray-800 border-0">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Employee Information
                    </h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Employee Code:
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formData.employeeCode}
                      </div>

                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Employee Name:
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formData.employeeName}
                      </div>

                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Department:
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formData.department}
                      </div>

                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Designation:
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formData.designation}
                      </div>

                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Plant:
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formData.plant}
                      </div>

                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Date:
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formData.date
                          ? format(new Date(formData.date), "MMMM dd, yyyy")
                          : ""}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Asset Details
                    </h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Selected Assets:
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formData.assetTypes.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {formData.assetTypes.map((asset) => (
                              <span
                                key={asset}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              >
                                {asset}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">
                            No assets selected
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Estimated Cost:
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ₹{formData.assetAmount}
                      </div>

                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Specifications:
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formData.assetSpecification}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Business Justification
                    </h4>
                    <div className="text-sm font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-900 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                      {formData.reason}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="pt-4">
              <div className="flex items-start space-x-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <Checkbox
                  id="policyAgreement"
                  checked={formData.policyAgreement}
                  onCheckedChange={handleCheckboxChange}
                  className="h-5 w-5 mt-0.5"
                />
                <Label
                  htmlFor="policyAgreement"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  I confirm that I will use the requested assets only for
                  official purposes and understand they may be withdrawn in case
                  of policy violation or upon leaving the company. I have read
                  and accept the IT Policy & IT Security Policy terms and
                  conditions.
                </Label>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Approval Workflow
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="h-full w-1/5 bg-blue-500 rounded-full"></div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  Step 1/5
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>Requester</span>
                <span>HOD</span>
                <span>IT</span>
                <span>Finance</span>
                <span>CFO</span>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Sidebar item component
  const SidebarItem = ({
    step,
    index,
  }: {
    step: (typeof formSteps)[0];
    index: number;
  }) => {
    const isActive = currentStep === index;
    const isCompleted = currentStep > index;

    return (
      <div
        className={`flex items-center space-x-3 py-3 px-4 rounded-lg cursor-pointer transition-all duration-300 ${
          isActive
            ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
            : isCompleted
            ? "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l-4 border-green-500"
            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
        }`}
        onClick={() => {
          // Only allow navigation to completed steps or current step
          if (currentStep >= index) {
            setCurrentStep(index);
          }
        }}
      >
        <div
          className={`relative flex items-center justify-center w-8 h-8 rounded-full text-sm transition-all duration-300 ${
            isActive
              ? "bg-blue-500 text-white"
              : isCompleted
              ? "bg-green-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          {isActive && (
            <span className="absolute w-full h-full rounded-full bg-blue-400/50 animate-ping opacity-50"></span>
          )}
          {isCompleted ? (
            <Check className="w-4 h-4" />
          ) : (
            <span>{index + 1}</span>
          )}
        </div>
        <div>
          <div
            className={`text-sm font-medium ${
              isActive
                ? "text-blue-700 dark:text-blue-400"
                : isCompleted
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {step.title}
            {isCompleted && (
              <div className="text-xs text-green-600 dark:text-blue-400 opacity-80">
                Step completed
              </div>
            )}
          </div>
          {isActive && (
            <div className="text-xs text-blue-600 dark:text-blue-400 opacity-80">
              Current Step
            </div>
          )}
        </div>
      </div>
    );
  };

  // Show a simple loading state until client-side rendering takes over
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Form header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Asset Request Form
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Request new assets for your work requirements
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - only shown on large screens */}
          <div className="hidden lg:block">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Progress
                  </h2>
                </div>

                <div className="space-y-1">
                  {formSteps.map((step, index) => (
                    <SidebarItem key={step.id} step={step} index={index} />
                  ))}
                </div>

                <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Overall Progress
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form content */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit}>
                  {/* Mobile progress indicator */}
                  <div className="block lg:hidden mb-6">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-4 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Step {currentStep + 1} of {formSteps.length}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Form steps */}
                  <AnimatePresence mode="wait" custom={direction}>
                    {renderFormStep()}
                  </AnimatePresence>

                  {/* Navigation buttons */}
                  <div className="flex justify-between mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      type="button"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      variant="outline"
                      className={`px-4 ${
                        currentStep === 0 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    {currentStep < formSteps.length - 1 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStepValid()}
                        className={`bg-blue-600 hover:bg-blue-700 text-white px-4 ${
                          !isStepValid() ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={!isStepValid() || isSubmitting}
                        className={`bg-green-600 hover:bg-green-700 text-white px-6 ${
                          !isStepValid() || isSubmitting
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          "Submit Request"
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
