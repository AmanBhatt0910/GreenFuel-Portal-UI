"use client";
import React, { useContext, useState, useEffect } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ArrowRight,
  FileCheck,
  ArrowLeft,
  Leaf,
  FileText,
  Home,
  Download,
} from "lucide-react";
import Link from "next/link";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Import our custom components
import {
  FormData as FormDataType,
  AssetItem,
  EmployeeInformationStep,
  AssetSelectionStep,
  AssetDetailsStep,
  ConfirmationStep,
  SidebarItem,
  SubmittingFormData,
} from "@/components/custom/AssetRequestForm";
import { Button } from "@/components/ui/button";
import { CustomBreadcrumb } from "@/components/custom/ui/Breadcrumb.custom";
import { GFContext } from "@/context/AuthContext";
import useAxios from "@/app/hooks/use-axios";

// Optionally, if you're using TypeScript and still have type errors, add this declaration near the top of the file:
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => any;
  }
}

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
    title: "Expenditure Details",
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
const getInitialFormData = (): FormDataType => ({
  plant: 0,
  date: format(new Date(), "yyyy-MM-dd"),
  employeeCode: "",
  employeeName: "",
  department: 0,
  designation: 0,
  assets: [],
  assetAmount: "",
  reason: "",
  policyAgreement: false,
  initiateDept: 0,
  currentStatus: "",
  benefitToOrg: "",
  approvalCategory: "",
  approvalType: "",
  notifyTo: 0,
  category: 0, 
  concerned_department: 0,
  paybackmonth : "",
  documentsSummary : "",
});

export default function AssetRequestForm() {
  // State for multi-step form
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState<FormDataType>(getInitialFormData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { userInfo } = useContext(GFContext);
  const [user, setUser] = useState(null);
  const [budgetId, setBudgetId] = useState(null);
  const [formAttachments, setFormAttachments] = useState<File[]>([]);
  const [assetAttachments, setAssetAttachments] = useState<File[]>([]);

  const api = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/userInfo/");
        const userData = response.data;
        console.log(userInfo)
        setUser(userData);

        const mergedUserData = {
          name: userInfo?.name || userData?.name || "",
          employeeCode: userInfo?.employee_code || userData?.employee_code || "",
          
          businessUnit: typeof userData?.business_unit === 'object' 
            ? userData?.business_unit?.id || 0 
            : userData?.business_unit || 0,
          
          department: typeof userData?.department === 'object' 
            ? userData?.department?.id || 0 
            : userData?.department || 0,
          
          designation: typeof userData?.designation === 'object' 
            ? userData?.designation?.id || 0 
            : userData?.designation || 0
        };
        setFormData((prevData) => ({
          ...prevData,
          employeeName: mergedUserData.name,
          employeeCode: mergedUserData.employeeCode,
          plant: mergedUserData.businessUnit,
          initiateDept: mergedUserData.department,
          designation: mergedUserData.designation
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchData();
  }, [userInfo]);


  // State for asset management
  const [currentAsset, setCurrentAsset] = useState<AssetItem>({
    title: "",
    description: "",
    quantity: 1,
    pricePerUnit: 0,
    total: 0,
    sapItemCode: "",
  });
  const [editingAssetIndex, setEditingAssetIndex] = useState<number | null>(
    null
  );

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    
    
    if (["plant", "department", "designation", "notifyTo", "category", "concerned_department", "initiateDept"].includes(name)) {
      const numValue = value === "" ? 0 : parseInt(value, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
    try {
      setIsSubmitting(true);
      const formDataToSubmit = new FormData();
      
      let currentCategoryLevel = 1; 
      
      if (!formData.category || formData.category === 0) {
        currentCategoryLevel = 0;
      }

      const submittingFormData: SubmittingFormData = {
        user: userInfo?.id || 0,
        business_unit: formData.plant,
        department: formData.initiateDept,
        designation: formData.designation,
        total: Number(formData.assetAmount),
        reason: formData.reason,
        documentsSummary: formData.documentsSummary || "",
        paybackmonth: formData.paybackmonth || "",
        policy_agreement: formData.policyAgreement,
        initiate_dept: formData.initiateDept ? String(formData.initiateDept) : "",
        status: "pending", 
        benefit_to_organisation: formData.benefitToOrg,
        approval_category: formData.approvalCategory,
        approval_type: formData.approvalType,
        notify_to: formData.notifyTo,
        form_category: formData.category,
        concerned_department: formData.concerned_department,
        current_category_level: currentCategoryLevel,
        current_form_level: 1,
        rejected: false,
        rejection_reason: null,
        items: formData.assets.map((asset) => ({
          name: asset.title,
          description: asset.description,
          quantity: asset.quantity,
          per_unit_price: Number(asset.pricePerUnit),
          sap_code: asset.sapItemCode,
        })),
      };


      formDataToSubmit.append("user", String(submittingFormData.user || 0));
      formDataToSubmit.append("business_unit", String(submittingFormData.business_unit));
      formDataToSubmit.append("department", String(submittingFormData.department));
      formDataToSubmit.append("designation", String(submittingFormData.designation));
      formDataToSubmit.append("total", String(submittingFormData.total));
      formDataToSubmit.append("reason", submittingFormData.reason);
      formDataToSubmit.append("document_enclosed_summary", submittingFormData.documentsSummary || "");
      formDataToSubmit.append("payback_period", submittingFormData.paybackmonth || "");
      formDataToSubmit.append("policy_agreement", String(submittingFormData.policy_agreement));
      formDataToSubmit.append("initiate_dept", submittingFormData.initiate_dept ? String(submittingFormData.initiate_dept) : "");
      formDataToSubmit.append("status", "pending");
      formDataToSubmit.append("benefit_to_organisation", submittingFormData.benefit_to_organisation);
      formDataToSubmit.append("approval_category", submittingFormData.approval_category);
      formDataToSubmit.append("approval_type", submittingFormData.approval_type);
      formDataToSubmit.append("notify_to", String(submittingFormData.notify_to));
      formDataToSubmit.append("form_category", String(submittingFormData.form_category));
      formDataToSubmit.append("concerned_department", String(submittingFormData.concerned_department));
      formDataToSubmit.append("current_category_level", String(submittingFormData.current_category_level));
      formDataToSubmit.append("current_form_level", String(submittingFormData.current_form_level));
      formDataToSubmit.append("rejected", String(submittingFormData.rejected));
      formDataToSubmit.append("rejection_reason", String(submittingFormData.rejection_reason));

      submittingFormData.items.forEach((item: any) => {
        formDataToSubmit.append("items", JSON.stringify(item));
      });
      
      if (formAttachments && formAttachments.length > 0) {
        formAttachments.forEach((file) => {
          formDataToSubmit.append(`form_attachments`, file);
        });
      }
      
      if (assetAttachments && assetAttachments.length > 0) {
        assetAttachments.forEach((file) => {
          formDataToSubmit.append(`asset_attachments`, file);
        });
      }      

      const response = await api.post("approval-requests/", formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setBudgetId(response.data.budget_id);
        setIsSubmitting(false);
        setIsSubmitted(true);
        return;
      }

      setIsSubmitting(false);
      setIsSubmitted(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
      setIsSubmitted(false);
    }
  };

  // Reset the form
  const resetForm = () => {
    const initialData = getInitialFormData();
    if (userInfo) {
      initialData.employeeName = userInfo.name || "";
      initialData.employeeCode = userInfo.employee_code || "";
    }
    setFormData(initialData);
    setCurrentStep(0);
    setIsSubmitted(false);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return true;
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
        return true;
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

// Push here
const generatePDF = async (): Promise<void> => {
  let businessUnitName: string = "N/A";
  let departmentName: string = "N/A";
  let designationName: string = "N/A";
  
  try {
    if (formData.plant) {
      const businessUnitResponse = await api.get(
        `business-units/${formData.plant}/`
      );
      if (businessUnitResponse.data?.name) {
        businessUnitName = businessUnitResponse.data.name;
      }
    }
    
    if (formData.initiateDept) {
      const departmentResponse = await api.get(
        `/departments/${formData.initiateDept}/`
      );
      if (departmentResponse.data?.name) {
        departmentName = departmentResponse.data.name;
      }
    }
    
    if (formData.designation) {
      const designationResponse = await api.get(
        `/designations/${formData.designation}/`
      );
      if (designationResponse.data?.name) {
        designationName = designationResponse.data.name;
      }
    }
  } catch (error) {
    console.error("Error fetching entity names:", error);
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Fixed color type definitions with explicit tuple types
  const colors: {
    primary: [number, number, number];
    secondary: [number, number, number];
    text: [number, number, number];
    background: [number, number, number];
    border: [number, number, number];
  } = {
    primary: [44, 62, 80],
    secondary: [52, 152, 219],
    text: [51, 51, 51],
    background: [245, 245, 245],
    border: [221, 221, 221]
  };

  // Header Section
  try {
    const imgData: string = "/green.png"; 
    doc.addImage(imgData, "PNG", 14, 10, 35, 15);
  } catch (error) {
    doc.setFontSize(18);
    doc.setFillColor(...colors.primary);
    doc.setFont("helvetica", "bold");
    doc.text("GREEN CORP", 14, 20);
  }

  // Title Section
  doc.setFontSize(20);
  doc.setTextColor(...colors.primary);
  doc.setFont("helvetica", "bold");
  doc.text("ASSET REQUEST", 105, 25, { align: "center" });

  // Subtitle
  doc.setFontSize(12);
  doc.setTextColor(...colors.secondary);
  doc.text(`Request #${budgetId}`, 105, 33, { align: "center" });

  // Divider Line
  doc.setDrawColor(...colors.border);
  doc.setLineWidth(0.5);
  doc.line(14, 38, 196, 38);

  // Metadata
  doc.setFontSize(10);
  doc.setTextColor(...colors.text);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${format(new Date(), "MMMM dd, yyyy")}`, 14, 45);
  doc.text("CONFIDENTIAL", 196, 45, { align: "right" });

  // Introduction
  doc.setFontSize(10);
  const introText = "This document contains a formal request for company assets...";
  const splitIntro = doc.splitTextToSize(introText, 180);
  doc.text(splitIntro, 14, 55);

  let y: number = 55 + splitIntro.length * 5 + 10;

  // Requestor Information Section
  const addSectionHeader = (title: string, y: number) => {
    doc.setFillColor(...colors.background);
    doc.rect(14, y, 182, 10, "F");
    doc.setFontSize(12);
    doc.setTextColor(...colors.primary);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, y + 7);
  };

  addSectionHeader("REQUESTOR INFORMATION", y);
  y += 15;

  // Requestor Info Card
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...colors.border);
  doc.roundedRect(14, y, 182, 40, 3, 3, "S");

  const addInfoRow = (label: string, value: string, x: number, yOffset: number) => {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(label, x, y + yOffset);
    doc.setFontSize(10);
    doc.setTextColor(...colors.text);
    doc.text(value, x + 35, y + yOffset);
  };

  addInfoRow("Name:", formData.employeeName, 20, 8);
  addInfoRow("Employee ID:", formData.employeeCode, 20, 16);
  addInfoRow("Department:", departmentName, 20, 24);
  addInfoRow("Business Unit:", businessUnitName, 110, 8);
  addInfoRow("Designation:", designationName, 110, 16);
  addInfoRow("Status:", "Pending Approval", 110, 24);

  y += 45;

  // Asset Summary Section
  addSectionHeader("ASSET SUMMARY", y);
  y += 15;

  if (formData.assets?.length) {
    autoTable(doc, {
      startY: y,
      head: [["Asset", "Description", "SAP Code", "Qty", "Unit Price", "Total"]],
      body: formData.assets.map(asset => [
        asset.title,
        asset.description || "-",
        asset.sapItemCode || "N/A",
        asset.quantity,
        formatCurrency(asset.pricePerUnit),
        formatCurrency(asset.total)
      ]),
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 4,
        lineColor: colors.border,
        textColor: colors.text
      },
      headStyles: {
        fillColor: colors.primary,
        textColor: 255,
        fontSize: 10
      },
      columnStyles: {
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" }
      },
      foot: [
        ["", "", "", "", "Total:", formatCurrency(Number(formData.assetAmount))]
      ]
    });

    y = (doc as any).lastAutoTable.finalY + 10;
  } else {
    doc.setFontSize(10);
    doc.setTextColor(...colors.text);
    doc.text("No assets requested", 14, y);
    y += 15;
  }

  // Justification Section
  addSectionHeader("BUSINESS JUSTIFICATION", y);
  y += 15;

  doc.setFontSize(10);
  doc.setTextColor(...colors.text);
  const splitReason = doc.splitTextToSize(formData.reason || "No justification provided", 180);
  doc.text(splitReason, 14, y);
  y += splitReason.length * 5 + 15;

  // Policy Agreement Section
  addSectionHeader("POLICY AGREEMENT", y);
  y += 15;

  doc.setFontSize(10);
  doc.setTextColor(...colors.text);
  const policyText = "The requestor has acknowledged and agreed to comply with all company policies...";
  const splitPolicy = doc.splitTextToSize(policyText, 180);
  doc.text(splitPolicy, 14, y);

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...colors.text);
    doc.text(`Page ${i} of ${pageCount}`, 196, 287, { align: "right" });
    doc.text("Confidential Document", 14, 287);
  }

  doc.save(`Asset_Request_${budgetId}.pdf`);
};

  
  // Format currency with proper thousand separators
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

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
              user={user}
              formAttachments={formAttachments}
              setFormAttachments={setFormAttachments}
              assetAttachments={assetAttachments}
              setAssetAttachments={setAssetAttachments}
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

  return (
    <div className="container py-4 mx-auto max-w-[95%] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <CustomBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Forms", href: "/dashboard/form" },
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
            Asset Request Submitted Successfully
          </h2>

          <div className="flex items-center mb-6 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg">
            <FileCheck className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              Request #{budgetId}
            </p>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-2xl">
            Thank you for submitting your asset request. The request has been
            logged in our system and is now pending approval. You can track the
            status of your request using the reference number above.
          </p>

          {/* Simple request summary card */}
          <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              Request Overview
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Requestor
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
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Request Value
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(Number(formData.assetAmount))}
                </p>
              </div>
            </div>

            <Button
              onClick={generatePDF}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              View Complete Summary (PDF)
            </Button>
          </div>

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
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Asset Request Form
              </h1>
              <p className="text-green-700 dark:text-green-400 text-sm font-medium mt-1">
                Complete all required fields to submit your asset request
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="border-green-200 hover:bg-green-50 hover:text-green-700 dark:border-green-800 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                asChild
              >
                <Link href="/dashboard/requests">
                  <FileText className="mr-2 h-4 w-4" />
                  View My Requests
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-green-200 hover:bg-green-50 hover:text-green-700 dark:border-green-800 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                asChild
              >
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-green-50 dark:bg-gray-950 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="grid grid-cols-12 min-h-[700px]">
              {/* Sidebar */}
              <div className="col-span-12 p-6 md:col-span-4 lg:col-span-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700">
                <div className="sticky top-6">
                  {/* Form Title */}
                  <div className="mb-8">
                    <h1 className="text-xl font-bold text-gray-900   dark:text-white mb-1">
                      Request Form Tracker
                    </h1>
                    {/* <p className="text-sm text-green-700 dark:text-green-400">
                      Complete all sections to submit your request
                    </p> */}
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
