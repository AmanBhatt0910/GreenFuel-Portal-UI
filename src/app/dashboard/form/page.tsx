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
  Download,
  FileDown,
} from "lucide-react";
import Link from "next/link";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

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

  // Generate and download professional PDF-like document
  const generateDetailedDocument = () => {
    // Create table rows for assets
    const assetRows = [];
    
    // Create header row
    const headerRow = new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: {
            size: 30,
            type: WidthType.PERCENTAGE,
          },
          shading: {
            fill: "F1F1F1",
          },
          children: [new Paragraph("Asset")],
        }),
        new TableCell({
          width: {
            size: 40,
            type: WidthType.PERCENTAGE,
          },
          shading: {
            fill: "F1F1F1",
          },
          children: [new Paragraph("Description")],
        }),
        new TableCell({
          width: {
            size: 10,
            type: WidthType.PERCENTAGE,
          },
          shading: {
            fill: "F1F1F1",
          },
          children: [new Paragraph({ text: "Quantity", alignment: AlignmentType.CENTER })],
        }),
        new TableCell({
          width: {
            size: 10,
            type: WidthType.PERCENTAGE,
          },
          shading: {
            fill: "F1F1F1",
          },
          children: [new Paragraph({ text: "Unit Price", alignment: AlignmentType.RIGHT })],
        }),
        new TableCell({
          width: {
            size: 10,
            type: WidthType.PERCENTAGE,
          },
          shading: {
            fill: "F1F1F1",
          },
          children: [new Paragraph({ text: "Total", alignment: AlignmentType.RIGHT })],
        }),
      ],
    });
    
    assetRows.push(headerRow);
    
    // Add asset data rows
    formData.assets.forEach((asset, index) => {
      const dataRow = new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph(asset.title)],
          }),
          new TableCell({
            children: [new Paragraph(asset.description || "-")],
          }),
          new TableCell({
            children: [new Paragraph({ text: asset.quantity.toString(), alignment: AlignmentType.CENTER })],
          }),
          new TableCell({
            children: [new Paragraph({ 
              text: Number(asset.pricePerUnit).toLocaleString('en-IN', { 
                style: 'currency', 
                currency: 'INR',
                maximumFractionDigits: 0
              }),
              alignment: AlignmentType.RIGHT 
            })],
          }),
          new TableCell({
            children: [new Paragraph({ 
              text: Number(asset.total).toLocaleString('en-IN', { 
                style: 'currency', 
                currency: 'INR',
                maximumFractionDigits: 0
              }),
              alignment: AlignmentType.RIGHT 
            })],
          }),
        ],
      });
      
      assetRows.push(dataRow);
    });
    
    // Total row
    const totalRow = new TableRow({
      children: [
        new TableCell({
          columnSpan: 4,
          children: [new Paragraph({ 
            text: "Total Amount:", 
            alignment: AlignmentType.RIGHT,
            heading: HeadingLevel.HEADING_4
          })],
        }),
        new TableCell({
          children: [new Paragraph({ 
            text: Number(formData.assetAmount).toLocaleString('en-IN', { 
              style: 'currency', 
              currency: 'INR',
              maximumFractionDigits: 0
            }),
            alignment: AlignmentType.RIGHT,
            heading: HeadingLevel.HEADING_4
          })],
        }),
      ],
    });
    
    assetRows.push(totalRow);
    
    // Create the document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "GREEN FUEL ASSET REQUEST",
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: `Request #${getRequestId()}`,
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: `Submission Date: ${format(new Date(), "MMMM dd, yyyy")}`,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({}),
            new Paragraph({
              text: "REQUESTOR INFORMATION",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({}),
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: {
                        size: 30,
                        type: WidthType.PERCENTAGE,
                      },
                      children: [new Paragraph("Employee Name")],
                    }),
                    new TableCell({
                      width: {
                        size: 70,
                        type: WidthType.PERCENTAGE,
                      },
                      children: [new Paragraph(formData.employeeName)],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("Employee Code")],
                    }),
                    new TableCell({
                      children: [new Paragraph(formData.employeeCode)],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("Department")],
                    }),
                    new TableCell({
                      children: [new Paragraph(formData.department)],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("Designation")],
                    }),
                    new TableCell({
                      children: [new Paragraph(formData.designation)],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("Plant Location")],
                    }),
                    new TableCell({
                      children: [new Paragraph(formData.plant)],
                    }),
                  ],
                }),
              ],
            }),
            new Paragraph({}),
            new Paragraph({
              text: "ASSET DETAILS",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({}),
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: assetRows,
            }),
            new Paragraph({}),
            new Paragraph({
              text: "REQUEST REASON",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph(formData.reason),
            new Paragraph({}),
            new Paragraph({
              text: "ESTIMATED TIMELINE",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({}),
            new Paragraph({
              text: `Current Status: Pending Approval`,
            }),
            new Paragraph({
              text: `Management Approval: Expected by ${getEstimatedTimeline().approval}`,
            }),
            new Paragraph({
              text: `Processing & Procurement: Expected by ${getEstimatedTimeline().processing}`,
            }),
            new Paragraph({
              text: `Delivery & Handover: Expected by ${getEstimatedTimeline().delivery}`,
            }),
            new Paragraph({}),
            new Paragraph({
              text: "IMPORTANT NOTE",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: "Your asset request will be reviewed by your department head and the procurement team. You'll receive email notifications about the status updates."
            }),
            new Paragraph({}),
            new Paragraph({
              text: "Green Fuel Industries Ltd.",
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: " 2025 All Rights Reserved",
              alignment: AlignmentType.CENTER,
            }),
          ],
        },
      ],
    });

    // Generate and save the document
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `GreenFuel_AssetRequest_${getRequestId()}.docx`);
    });
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

          {/* Simplified Submission Details Card */}
          <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              Request Summary
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
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
                  Submission Date
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {format(new Date(), "MMMM dd, yyyy")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Department
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formData.department}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Amount
                </p>
                <p className="font-medium text-blue-700 dark:text-blue-400">
                  {formatCurrency(Number(formData.assetAmount))}
                </p>
              </div>
            </div>

            {/* Current status card */}
            <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-6">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Current Status: <span className="font-medium">Pending Approval</span>
                </p>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Expected approval by {timeline.approval}
              </p>
            </div>

            {/* See detailed info button */}
            <button
              onClick={generateDetailedDocument}
              className="w-full flex items-center justify-center gap-2 p-3 font-medium text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FileDown className="h-5 w-5" />
              Download Detailed Request Document
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-4">
            <Link href="/dashboard" className="inline-flex items-center">
              <Button className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Return to Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/form" className="inline-flex items-center">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Create New Request
              </Button>
            </Link>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mt-8 text-center max-w-2xl">
            Thank you for submitting your asset request. The request has been
            logged in our system and is now pending approval. You can track the
            status of your request using the reference number above.
          </p>
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
