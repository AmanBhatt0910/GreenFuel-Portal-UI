"use client";
import React, { useContext, useState, useEffect } from "react";
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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
  SubmittingFormData,
  SubmittingAssetItem,
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
});

export default function AssetRequestForm() {
  // State for multi-step form
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState<FormData>(getInitialFormData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { userInfo } = useContext(GFContext);
  const [user, setUser] = useState<any>(null);
  const [budgetId, setBudgetId] = useState<any>(null);

  const api = useAxios();

  // Pre-fill form data with user information when userInfo is available
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching user data from API...");
        const response = await api.get("/userInfo/");
        const userData = response.data;
        setUser(userData);
        
        console.log("Complete user data from API:", userData);
        
        // Create a merged data object with values from both userInfo context and API response
        const mergedUserData = {
          // Basic info
          name: userInfo?.name || userData?.name || "",
          employeeCode: userInfo?.employee_code || userData?.employee_code || "",
          
          // Organizational info - properly handle both object and primitive value cases
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
        
        console.log("Merged user data for form with extracted IDs:", mergedUserData);
        
        // Apply all the data at once to prevent multiple renders
        setFormData((prevData) => ({
          ...prevData,
          employeeName: mergedUserData.name,
          employeeCode: mergedUserData.employeeCode,
          plant: mergedUserData.businessUnit,
          initiateDept: mergedUserData.department,
          designation: mergedUserData.designation
        }));

        // Log the full extracted form data to make debugging easier
        console.log("Setting form data with these extracted values:", {
          name: mergedUserData.name,
          employeeCode: mergedUserData.employeeCode,
          plant: mergedUserData.businessUnit,
          initiateDept: mergedUserData.department,
          designation: mergedUserData.designation
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchData();
  }, [userInfo]); // Re-run when userInfo changes

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
    const approverResponse = await api.get(`approver/`);
    console.log(approverResponse.data);
    // console.log(formData);

    const submittingFormData: SubmittingFormData = {
      user: userInfo?.id || 0,
      business_unit: formData.plant,
      department: formData.initiateDept,
      designation: formData.designation,
      total: Number(formData.assetAmount),
      reason: formData.reason,
      policy_agreement: formData.policyAgreement,
      // initiate_dept: formData.initiateDept,
      initiate_dept: "",
      current_status: "pending",
      benefit_to_organisation: formData.benefitToOrg,
      approval_category: formData.approvalCategory,
      approval_type: formData.approvalType,
      notify_to: formData.notifyTo,
      current_level: 1,
      max_level: approverResponse.data.length,
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

    console.log("submittingFormData", submittingFormData);

    const response = await api.post("approval-requests/", submittingFormData);
    console.log("response", response);

    // console.log("response" , response.data.budget_id)
    if (response.status === 201) {
      setBudgetId(response.data.budget_id);

      setIsSubmitting(false);
      setIsSubmitted(true);
      return;
    }

    setIsSubmitting(false);
    setIsSubmitted(false);
  };

  // Reset the form
  const resetForm = () => {
    // Pre-fill user information when resetting the form
    const initialData = getInitialFormData();
    if (userInfo) {
      initialData.employeeName = userInfo.name || "";
      initialData.employeeCode = userInfo.employee_code || "";
    }
    setFormData(initialData);
    setCurrentStep(0);
    setIsSubmitted(false);
  };

  // Validation checks for each step
  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return (
          formData.plant !== 0 &&
          formData.employeeCode !== "" &&
          formData.employeeName !== "" &&
          formData.initiateDept !== 0 &&
          formData.designation !== 0
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
          formData.plant !== 0 &&
          formData.employeeCode !== "" &&
          formData.employeeName !== "" &&
          formData.department !== 0
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

  // Get request ID
  const getRequestId = () => {
    const prefix = formData.plant ? formData.plant : "AR";
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

  // Generate PDF with all details
  // Generate PDF with all details
  // Generate PDF with professional formatting and corporate style
  const generatePDF = async () => {
    // First, fetch the business unit and department names
    let businessUnitName = "N/A";
    let departmentName = "N/A";
    let designationName = "N/A";

    try {
      // Fetch business unit name
      if (formData.plant) {
        const businessUnitResponse = await api.get(
          `business-units/${formData.plant}/`
        );
        if (businessUnitResponse.data && businessUnitResponse.data.name) {
          businessUnitName = businessUnitResponse.data.name;
        }
      }

      // Fetch department name
      if (formData.department) {
        const departmentResponse = await api.get(
          `/departments/?business_unit=${formData.plant}`
        );
        if (departmentResponse.data) {
          departmentName = departmentResponse.data.name;
        }
      }

      // Fetch designation name
      if (formData.designation) {
        const designationResponse = await api.get(
          `/designations/?department=${formData.initiateDept}`
        );
        if (designationResponse.data && designationResponse.data.name) {
          designationName = designationResponse.data.name;
        }
      }
    } catch (error) {
      console.error("Error fetching entity names:", error);
    }

    // Create a new PDF document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const timeline: { approval: string; processing: string; delivery: string } =
      getEstimatedTimeline();

    // Define colors
    const primaryColor = [0, 102, 51]; // Green
    const secondaryColor = [0, 71, 36]; // Darker green
    const accentColor = [0, 153, 76]; // Lighter green
    const grayColor = [100, 100, 100];
    const lightGrayBg = [248, 250, 248];

    // Add company logo
    try {
      const imgData = "/green.png"; // Path to logo in assets folder
      doc.addImage(imgData, "PNG", 14, 10, 30, 15);
    } catch (error) {
      console.error("Error adding logo:", error);
      // Fallback: Write company name instead of logo
      doc.setFontSize(18);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text("GREEN CORP", 14, 20);
    }

    // Document title
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text("ASSET REQUEST", 105, 20, { align: "center" });

    // Document subtitle with request ID
    doc.setFontSize(14);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(`Request #${budgetId}`, 105, 28, { align: "center" });

    // Add header decorative element - improved contrast
    doc.setFillColor(lightGrayBg[0], lightGrayBg[1], lightGrayBg[2]);
    doc.rect(0, 35, 210, 12, "F");

    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(1);
    doc.line(14, 35, 196, 35);

    // Date and confidentiality - ensuring proper alignment
    doc.setFontSize(9);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${format(new Date(), "MMMM dd, yyyy")}`, 14, 42);
    doc.text("CONFIDENTIAL - INTERNAL USE ONLY", 196, 42, { align: "right" });

    // Add decorative element
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(14, 47, 196, 47);

    // Introduction paragraph - improved line spacing
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "normal");
    const introText: string =
      "This document contains a formal request for company assets as submitted through the Asset Management System. The request is subject to approval according to company policies and budgetary constraints. Please review all details carefully before proceeding with the approval process.";
    const splitIntro: string[] = doc.splitTextToSize(introText, 180);
    doc.text(splitIntro, 14, 55);

    let y: number = 55 + splitIntro.length * 5 + 8;

    // REQUESTOR INFORMATION SECTION
    addSectionHeader(doc, "REQUESTOR INFORMATION", y, primaryColor);
    y += 8;

    // Create two-column layout for requestor info
    const leftColX = 14;
    const rightColX = 110;
    const labelWidth = 40;

    // Add field labels and values
    addLabelValuePair(
      doc,
      "Name:",
      formData.employeeName,
      leftColX,
      y,
      labelWidth
    );
    addLabelValuePair(
      doc,
      "Submission Date:",
      format(new Date(), "MMMM dd, yyyy"),
      rightColX,
      y,
      labelWidth
    );
    y += 8;

    addLabelValuePair(
      doc,
      "Employee ID:",
      formData.employeeCode,
      leftColX,
      y,
      labelWidth
    );
    addLabelValuePair(
      doc,
      "Business Unit:",
      businessUnitName,
      rightColX,
      y,
      labelWidth
    );
    y += 8;

    addLabelValuePair(
      doc,
      "Department:",
      departmentName,
      leftColX,
      y,
      labelWidth
    );
    addLabelValuePair(
      doc,
      "Designation:",
      designationName,
      rightColX,
      y,
      labelWidth
    );
    y += 8;

    addLabelValuePair(
      doc,
      "Request Status:",
      "Pending Approval",
      leftColX,
      y,
      labelWidth
    );
    addLabelValuePair(
      doc,
      "Approval Level:",
      "Initial",
      rightColX,
      y,
      labelWidth
    );

    y += 16;

    // ASSET SUMMARY SECTION - improved table formatting
    addSectionHeader(doc, "ASSET SUMMARY", y, primaryColor);
    y += 10;

    if (formData.assets && formData.assets.length > 0) {
      // Improved table columns with proper width distribution
      const tableColumn: { header: string; dataKey: string }[] = [
        { header: "Asset", dataKey: "asset" },
        { header: "Description", dataKey: "description" },
        { header: "SAP Code", dataKey: "sapCode" },
        { header: "Qty", dataKey: "qty" },
        { header: "Unit Price", dataKey: "unitPrice" },
        { header: "Total", dataKey: "total" },
      ];

      const tableRows = formData.assets.map((asset) => ({
        asset: asset.title,
        description: asset.description || "-",
        sapCode: asset.sapItemCode || "N/A",
        qty: asset.quantity.toString(),
        unitPrice: formatCurrency(Number(asset.pricePerUnit)).replace(
          "₹",
          "INR "
        ),
        total: formatCurrency(Number(asset.total)).replace("₹", "INR "),
      }));

      // Improved table formatting with better column widths
      autoTable(doc, {
        head: [tableColumn.map((col) => col.header)],
        body: tableRows.map((row) => [
          row.asset,
          row.description,
          row.sapCode,
          row.qty,
          row.unitPrice,
          row.total,
        ]),
        startY: y,
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: "linebreak",
          lineWidth: 0.1,
        },
        columnStyles: {
          0: { cellWidth: 30 }, // Asset
          1: { cellWidth: 60 }, // Description
          2: { cellWidth: 20 }, // SAP Code
          3: { cellWidth: 10 }, // Qty
          4: { cellWidth: 25 }, // Unit Price
          5: { cellWidth: 25 }, // Total
        },
        headStyles: {
          fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "left",
        },
        alternateRowStyles: { fillColor: [245, 250, 245] },
        footStyles: {
          fillColor: [240, 248, 240],
          fontStyle: "bold",
          halign: "right",
        },
        foot: [
          [
            "",
            "",
            "",
            "",
            "Total Request Value:",
            formatCurrency(Number(formData.assetAmount)).replace("₹", "INR "),
          ],
        ],
        didDrawPage: (data) => {
          // Ensure footer appears on every page of the table
          doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.rect(0, 287, 210, 10, "F");

          doc.setFontSize(8);
          doc.setTextColor(255, 255, 255);
          doc.text(
            `Request #${budgetId} | Page ${doc.getNumberOfPages()} of ${doc.getNumberOfPages()}`,
            105,
            293,
            { align: "center" }
          );
          doc.text(`Asset Management System`, 14, 293);
          doc.text(`Confidential Document`, 196, 293, { align: "right" });
        },
      });

      y = (doc as any).lastAutoTable.finalY + 15;
    } else {
      doc.setFontSize(10);
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text("No assets have been requested.", 14, y);
      y += 15;
    }

    // Business Justification Section
    addSectionHeader(doc, "BUSINESS JUSTIFICATION", y, primaryColor);
    y += 8;

    // Add boxed justification
    doc.setFillColor(248, 250, 248);
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(14, y, 182, 40, 2, 2, "FD");

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "normal");

    // Handle multiline text for reason
    const splitReason: string[] = doc.splitTextToSize(
      formData.reason || "No justification provided",
      170
    );
    doc.text(splitReason, 19, y + 8);

    y += 45;

    // Benefits to Organization
    if (formData.benefitToOrg) {
      addSectionHeader(doc, "ORGANIZATIONAL BENEFITS", y, primaryColor);
      y += 8;

      // Add boxed benefits with proper padding
      doc.setFillColor(248, 250, 248);
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.roundedRect(14, y, 182, 35, 2, 2, "FD");

      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      const splitBenefits: string[] = doc.splitTextToSize(
        formData.benefitToOrg,
        170
      );
      doc.text(splitBenefits, 19, y + 8);

      y += 40;
    }

    // Check if need to add a new page
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    // APPROVAL WORKFLOW SECTION
    addSectionHeader(doc, "APPROVAL WORKFLOW", y, primaryColor);
    y += 10;

    // Draw workflow steps
    const workflowSteps: { title: string; status: string; date: string }[] = [
      {
        title: "Request Submitted",
        status: "Complete",
        date: format(new Date(), "MMM dd, yyyy"),
      },
      {
        title: "Department Approval",
        status: "Pending",
        date: timeline.approval,
      },
      { title: "Financial Approval", status: "Pending", date: "TBD" },
      {
        title: "Procurement Process",
        status: "Pending",
        date: timeline.processing,
      },
      {
        title: "Delivery & Handover",
        status: "Pending",
        date: timeline.delivery,
      },
    ];

    // Draw workflow diagram with improved spacing and alignment
    const startX: number = 25;
    const colWidth: number = 35;

    workflowSteps.forEach((step, index) => {
      const x: number = startX + index * colWidth;

      // Draw circle with better contrast
      if (step.status === "Complete") {
        doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      } else {
        doc.setFillColor(220, 220, 220);
      }
      doc.circle(x, y, 5, "F");

      // Draw connecting line with improved visibility
      if (index < workflowSteps.length - 1) {
        doc.setDrawColor(150, 150, 150);
        doc.setLineWidth(0.7);
        doc.line(x + 5, y, x + colWidth - 5, y);
      }

      // Draw text with improved positioning and readability
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text(step.title, x, y + 10, { align: "center" });

      // Draw status with better color contrast
      doc.setFontSize(7);
      if (step.status === "Complete") {
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      } else {
        doc.setTextColor(120, 120, 120);
      }
      doc.text(step.status, x, y + 15, { align: "center" });

      // Draw date with consistent formatting
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      doc.text(step.date, x, y + 20, { align: "center" });
    });

    y += 30;

    // ESTIMATED TIMELINE
    addSectionHeader(doc, "ESTIMATED TIMELINE", y, primaryColor);
    y += 10;

    // Add timeline information in a box with better contrast
    doc.setFillColor(248, 250, 248);
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(14, y, 182, 40, 2, 2, "FD");

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    // Add timeline details with better spacing
    addLabelValuePair(
      doc,
      "Current Status:",
      "Pending Department Approval",
      20,
      y + 8,
      60
    );
    addLabelValuePair(
      doc,
      "Management Approval Expected:",
      timeline.approval,
      20,
      y + 16,
      85
    );
    addLabelValuePair(
      doc,
      "Procurement Process Expected:",
      timeline.processing,
      20,
      y + 24,
      85
    );
    addLabelValuePair(
      doc,
      "Estimated Delivery:",
      timeline.delivery,
      20,
      y + 32,
      85
    );

    y += 50;

    // TERMS AND CONDITIONS
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    addSectionHeader(doc, "TERMS & CONDITIONS", y, primaryColor);
    y += 10;

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);

    // Terms with better spacing
    const terms: string[] = [
      "1. All asset requests are subject to company approval policies and budget availability.",
      "2. The requestor is responsible for the proper use and care of company assets.",
      "3. Assets remain company property and must be returned upon request or termination.",
      "4. Damaged or lost assets may result in financial liability as per company policy.",
      "5. Use of assets for purposes other than company business is strictly prohibited.",
    ];

    terms.forEach((term) => {
      doc.text(term, 14, y);
      y += 6;
    });

    // Policy agreement
    y += 5;
    doc.setFillColor(240, 248, 240);
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(14, y, 182, 20, 2, 2, "FD");

    doc.setFontSize(9);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Policy Agreement Confirmation", 19, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    const policyText: string =
      "The requestor has acknowledged and agreed to comply with all company policies related to asset usage, maintenance, and return as specified in the Asset Management Procedure document (Ref: AMP-2023-01).";
    const splitPolicy: string[] = doc.splitTextToSize(policyText, 172);
    doc.text(splitPolicy, 19, y + 12);

    // APPROVAL SECTION
    y += 30;
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    addSectionHeader(doc, "APPROVAL SECTION", y, primaryColor);
    y += 10;

    // Draw signature boxes
    const signatureWidth: number = 80;
    const signatureHeight: number = 35;
    const leftSigX: number = 14;
    const rightSigX: number = 116;

    // Requestor signature box with better borders
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.3);
    doc.rect(leftSigX, y, signatureWidth, signatureHeight);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Requestor", leftSigX + 2, y + 5);

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text(formData.employeeName, leftSigX + 40, y + 15, { align: "center" });

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "Date: " + format(new Date(), "dd/MM/yyyy"),
      leftSigX + 40,
      y + 23,
      { align: "center" }
    );
    doc.text("Employee ID: " + formData.employeeCode, leftSigX + 40, y + 30, {
      align: "center",
    });

    // Approver signature box with consistent styling
    doc.setDrawColor(150, 150, 150);
    doc.rect(rightSigX, y, signatureWidth, signatureHeight);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Department Approver", rightSigX + 2, y + 5);

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Signature: _________________________", rightSigX + 40, y + 15, {
      align: "center",
    });
    doc.text("Name: _________________________", rightSigX + 40, y + 23, {
      align: "center",
    });
    doc.text("Date: _________________________", rightSigX + 40, y + 30, {
      align: "center",
    });

    // Footer for all pages
    const pageCount: number = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Add green footer bar
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 287, 210, 10, "F");

      // Footer text with improved alignment
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(`Request #${budgetId} | Page ${i} of ${pageCount}`, 105, 293, {
        align: "center",
      });
      doc.text(`Asset Management System`, 14, 293);
      doc.text(`Confidential Document`, 196, 293, { align: "right" });
    }
    doc.save(`Asset_Request_${budgetId}.pdf`);
  };

  // Helper function to add section headers
  function addSectionHeader(doc: any, title: any, y: any, primaryColor: any) {
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(14, y, 182, 6, "F");

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(title, 17, y + 4);
  }

  // Helper function to add label-value pairs
  function addLabelValuePair(
    doc: any,
    label: any,
    value: any,
    x: any,
    y: any,
    labelWidth: any
  ) {
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text(label, x, y);

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(value || "N/A", x + labelWidth, y);
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
                  Department
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formData.initiateDept}
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

            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Estimated Completion: {timeline.delivery}
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
