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
  AlertCircle,
  X,
  Info,
  Package,
} from "lucide-react";
import Link from "next/link";
import { toast } from "@/lib/toast-util";
import { generateAssetRequestPDF, RequestorInfo, formatCurrency } from "@/lib/pdf-generator";
import { useAssetRequestPDF } from "@/lib/pdf-hooks";

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

interface BudgetAllocation {
  id: number;
  budget: string;
  remaining_budget: string;
  business_unit: number;
  department: number;
  category: number;
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
  notifyTo: 0,
  category: 0,
  concerned_department: 0,
  paybackmonth: "",
  documentsSummary: "",
});

export default function AssetRequestForm() {
  // State for multi-step form
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState<FormDataType>(getInitialFormData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { userInfo } = useContext(GFContext);
  const [user, setUser] = useState<any>(null);
  const [budgetId, setBudgetId] = useState<any>(null);
  const [formAttachments, setFormAttachments] = useState<File[]>([]);
  const [assetAttachments, setAssetAttachments] = useState<File[]>([]);
  const [budgetAllocations, setBudgetAllocations] = useState<BudgetAllocation[]>([]);
  const [remainingBudget, setRemainingBudget] = useState<number | null>(null);
  const [budgetError, setBudgetError] = useState<string>("");

  const api = useAxios();
  const { generatePDF: generateAssetPDF, isGenerating: isPDFGenerating, error: pdfError } = useAssetRequestPDF();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/userInfo/");
        const userData = response.data;
        
        setUser(userData);

        setFormData((prevData) => ({
          ...prevData,
          employeeName: userInfo?.name || userData?.name || "",
          employeeCode:
            userInfo?.employee_code || userData?.employee_code || "",
          // Remove auto-selection - let user choose manually
          // plant: 0,
          // initiateDept: 0,
          // designation: 0
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userInfo) {
      fetchData();
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchBudgetAllocations = async () => {
      try {
        const response = await api.get("/budget-allocation/?all=true");
        setBudgetAllocations(response.data.results || []);
      } catch (error) {
        console.error("Error fetching budget allocations:", error);
      }
    };

    fetchBudgetAllocations();
  }, []);

  useEffect(() => {
    if (formData.plant && formData.initiateDept && formData.category && budgetAllocations.length > 0) {
      const allocation = budgetAllocations.find(
        (a) => 
          a.business_unit === formData.plant && 
          a.department === formData.initiateDept && 
          a.category === formData.category
      );

      if (allocation) {
        setRemainingBudget(Number(allocation.remaining_budget));
        setBudgetError("");
      } else {
        setRemainingBudget(null);
        setBudgetError("No budget allocation found for this combination");
      }
    } else {
      setRemainingBudget(null);
    }
  }, [formData.plant, formData.initiateDept, formData.category, budgetAllocations]);

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (
      [
        "plant",
        "department",
        "designation",
        "notifyTo",
        "category",
        "concerned_department",
        "initiateDept",
      ].includes(name)
    ) {
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

      if (key === "quantity" || key === "pricePerUnit") {
        const quantity = key === "quantity" ? Number(value) : prev.quantity;
        const pricePerUnit =
          key === "pricePerUnit" ? Number(value) : prev.pricePerUnit;
        newAsset.total = quantity * pricePerUnit;
      }

      return newAsset;
    });
  };

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

  const startEditingAsset = (index: number) => {
    setCurrentAsset(formData.assets[index]);
    setEditingAssetIndex(index);
  };

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

  const goToNextStep = () => {
    if (!isStepValid()) {
      switch (currentStep) {
        case 0:
          toast.warning(
            "Please fill in all required employee information fields (Business Unit, Department, and Designation)."
          );
          break;
        case 1:
          toast.warning("Please add at least one asset to your request.");
          break;
        case 2:
          const totalAmount = Number(formData.assetAmount) || 0;
          
          if (remainingBudget !== null && totalAmount > remainingBudget) {
            toast.warning(
              `Request amount exceeds remaining budget by ${formatCurrency(totalAmount - remainingBudget)}`
            );
          } else {
            toast.warning(
              "Please complete all required fields: Request Category, Concerned Department, Budget Approval Category, and Reason for Request."
            );
          }
          break;
        case 3:
          toast.warning(
            "Please agree to the company policy terms before submitting."
          );
          break;
        default:
          toast.warning(
            "Please complete all required fields before proceeding."
          );
      }
      return;
    }

    if (currentStep === formSteps.length - 1) {
      handleSubmit();
      return;
    }
    setDirection(1);
    setCurrentStep((prev) => prev + 1);
  };

  // Submit the form
  const handleSubmit = async () => {
    const totalAmount = Number(formData.assetAmount) || 0;

    if (remainingBudget !== null && totalAmount > remainingBudget) {
      toast.error("Request amount exceeds remaining budget");
      setIsSubmitting(false);
      return;
    }


    try {
      setIsSubmitting(true);

      const formDataToSubmit = new FormData();

      let currentCategoryLevel = 1;
      let currentFormLevel = 0;

      if (!formData.category || formData.category === 0) {
        currentCategoryLevel = 0;
        currentFormLevel = 1;
      }

      const submittingFormData: SubmittingFormData = {
        user: userInfo?.id || 0,
        business_unit: formData.plant,
        department: formData.initiateDept,
        designation: formData.designation,
        total: Number(formData.assetAmount) || 0,
        reason: formData.reason,
        documentsSummary: formData.documentsSummary || "",
        paybackmonth: formData.paybackmonth || "",
        policy_agreement: formData.policyAgreement,
        initiate_dept: formData.initiateDept
          ? String(formData.initiateDept)
          : "",
        status: "pending",
        benefit_to_organisation: formData.benefitToOrg,
        approval_category: formData.approvalCategory,
        notify_to: formData.notifyTo && formData.notifyTo !== 0 ? formData.notifyTo : null,
        request_category: formData.category,
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

      formDataToSubmit.append('pdf', '');

      formDataToSubmit.append("user", String(submittingFormData.user || 0));
      formDataToSubmit.append(
        "business_unit",
        String(submittingFormData.business_unit)
      );
      formDataToSubmit.append(
        "department",
        String(submittingFormData.department)
      );
      formDataToSubmit.append(
        "designation",
        String(submittingFormData.designation)
      );
      formDataToSubmit.append("total", String(submittingFormData.total));
      formDataToSubmit.append("reason", submittingFormData.reason);
      formDataToSubmit.append(
        "document_enclosed_summary",
        submittingFormData.documentsSummary || ""
      );
      formDataToSubmit.append(
        "payback_period",
        submittingFormData.paybackmonth || ""
      );
      formDataToSubmit.append(
        "policy_agreement",
        String(submittingFormData.policy_agreement)
      );
      formDataToSubmit.append(
        "initiate_dept",
        submittingFormData.initiate_dept
          ? String(submittingFormData.initiate_dept)
          : ""
      );
      formDataToSubmit.append("status", "pending");
      formDataToSubmit.append(
        "benefit_to_organisation",
        submittingFormData.benefit_to_organisation
      );
      formDataToSubmit.append(
        "approval_category",
        submittingFormData.approval_category
      );
      
      // Only append notify_to if it has a valid value
      if (submittingFormData.notify_to !== null && submittingFormData.notify_to !== 0) {
        formDataToSubmit.append(
          "notify_to",
          String(submittingFormData.notify_to)
        );
      }
      
      formDataToSubmit.append(
        "request_category",
        String(submittingFormData.request_category)
      );
      formDataToSubmit.append(
        "concerned_department",
        String(submittingFormData.concerned_department)
      );
      formDataToSubmit.append(
        "current_category_level",
        String(submittingFormData.current_category_level)
      );
      formDataToSubmit.append(
        "current_form_level",
        String(submittingFormData.current_form_level)
      );
      formDataToSubmit.append("rejected", String(submittingFormData.rejected));
      formDataToSubmit.append(
        "rejection_reason",
        String(submittingFormData.rejection_reason)
      );

      submittingFormData.items.forEach((item: any) => {
        formDataToSubmit.append("items", JSON.stringify(item));
      });

      if (formAttachments && formAttachments.length > 0) {
        formAttachments.forEach((file, index) => {
          formDataToSubmit.append(`form_attachments`, file);
        });
      }

      if (assetAttachments && assetAttachments.length > 0) {
        assetAttachments.forEach((file, index) => {
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
        toast.success("Asset request submitted successfully!");
        return;
      }

      setIsSubmitting(false);
      setIsSubmitted(false);
      toast.error(`${response.data?.error || response.data?.message}`);
    } catch (error: any) {
      console.error("Error submitting form:", error);

      let errorMessage = "An unexpected error occurred. Please try again.";
      let errorDetails = "";

      if (error.response?.data) {
        // Handle different types of error responses
        const errorData = error.response.data;
        console.error("Error response data:", errorData);

        if (typeof errorData === "string") {
          errorMessage = errorData;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (
          errorData.non_field_errors &&
          Array.isArray(errorData.non_field_errors)
        ) {
          errorMessage = errorData.non_field_errors[0];
        } else {
          // Handle field-specific errors
          const fieldErrors = [];
          for (const [field, errors] of Object.entries(errorData)) {
            if (Array.isArray(errors)) {
              fieldErrors.push(`${field}: ${errors.join(", ")}`);
            } else if (typeof errors === "string") {
              fieldErrors.push(`${field}: ${errors}`);
            }
          }
          
          if (fieldErrors.length > 0) {
            errorMessage = "Please fix the following errors:";
            errorDetails = fieldErrors.join("; ");
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Determine the error type for better user feedback
      if (error.response?.status === 400) {
        if (!errorMessage.includes("fix the following errors")) {
          errorMessage = "Invalid data submitted. " + errorMessage;
        }
      } else if (error.response?.status === 401) {
        errorMessage = "You are not authorized to submit this request. Please log in again.";
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to submit this request.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error occurred. Please try again later.";
      }

      // Show the error toast with the extracted message
      const fullErrorMessage = errorDetails ? `${errorMessage}\n${errorDetails}` : errorMessage;
      toast.error(fullErrorMessage, {
        duration: 8000,
        style: {
          maxWidth: '500px',
        },
      });

      setIsSubmitting(false);
      setIsSubmitted(false);
    }
  };

  const resetForm = () => {
    const initialData = getInitialFormData();
    if (userInfo) {
      initialData.employeeName = userInfo.name || "";
      initialData.employeeCode = userInfo.employee_code || "";
    }
    setFormData(initialData);
    setCurrentStep(0);
    setIsSubmitted(false);
    
    // Reset file attachments
    setFormAttachments([]);
    setAssetAttachments([]);
    
    // Reset current asset form
    setCurrentAsset({
      title: "",
      description: "",
      quantity: 1,
      pricePerUnit: 0,
      total: 0,
      sapItemCode: "",
    });
    setEditingAssetIndex(null);
    
    // Reset budget ID
    setBudgetId(null);
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 0:
        return !!(
          formData.plant &&
          formData.plant !== 0 &&
          formData.initiateDept &&
          formData.initiateDept !== 0 &&
          formData.designation &&
          formData.designation !== 0
        );
      case 1:
        return formData.assets.length > 0;
      case 2:
        const totalAmount = Number(formData.assetAmount) || 0;
        const isBudgetValid = remainingBudget === null || totalAmount <= remainingBudget;
        
        return !!(
          formData.assets.length > 0 &&
          formData.reason.trim() !== "" &&
          formData.category &&
          formData.category !== 0 &&
          formData.concerned_department &&
          formData.concerned_department !== 0 &&
          formData.approvalCategory &&
          formData.approvalCategory.trim() !== "" &&
          isBudgetValid
        );
      case 3:
        return formData.policyAgreement;
      default:
        return false;
    }
  };

  // Check if a step is complete
  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(
          formData.plant &&
          formData.plant !== 0 &&
          formData.initiateDept &&
          formData.initiateDept !== 0 &&
          formData.designation &&
          formData.designation !== 0
        );
      case 1:
        return formData.assets.length > 0;
      case 2:
        return !!(
          formData.assets.length > 0 &&
          formData.reason.trim() !== "" &&
          formData.category &&
          formData.category !== 0 &&
          formData.concerned_department &&
          formData.concerned_department !== 0 &&
          formData.approvalCategory &&
          formData.approvalCategory.trim() !== ""
        );
      case 3:
        return formData.policyAgreement;
      default:
        return false;
    }
  };

  // Generate PDF using the utility function
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

    const requestorInfo: RequestorInfo = {
      employeeName: formData.employeeName,
      employeeCode: formData.employeeCode,
      businessUnitName,
      departmentName,
      designationName,
    };

    try {
      await generateAssetPDF({
        budgetId: budgetId || "PENDING",
        requestorInfo,
        assets: formData.assets,
        totalAmount: formData.assetAmount,
        reason: formData.reason,
        documentType: "Asset Request",
        status: "Pending Approval",
      });
      
      toast.success("PDF generated successfully!");
    } catch (error) {
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

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
              remainingBudget={remainingBudget}
              budgetError={budgetError}
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
              remainingBudget={remainingBudget}
              budgetError={budgetError}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950/20">
      <div className="container py-6 mx-auto max-w-[95%]">
        <CustomBreadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Forms", href: "/dashboard/form" },
          ]}
        />

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center max-w-5xl mx-auto mt-8">
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-green-400/20 dark:bg-green-500/10 rounded-full animate-ping opacity-75"></div>
              <div className="absolute inset-2 bg-green-300/30 dark:bg-green-600/20 rounded-full animate-pulse opacity-50"></div>
              <div className="relative flex items-center justify-center w-28 h-28 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800/40 dark:to-green-700/40 rounded-full shadow-xl border border-green-200 dark:border-green-700">
                <Check
                  className="h-14 w-14 text-green-600 dark:text-green-400"
                  strokeWidth={3}
                />
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Asset Request Submitted Successfully
              </h2>
              <div className="flex items-center justify-center mb-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 px-6 py-3 rounded-full border border-green-200 dark:border-green-800 shadow-sm">
                <FileCheck className="h-5 w-5 mr-3 text-green-600 dark:text-green-400" />
                <span className="text-lg font-semibold text-green-800 dark:text-green-300">
                  Request #{budgetId}
                </span>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
                Thank you for submitting your asset request. The request has
                been logged in our system and is now pending approval. You can
                track the status of your request using the reference number
                above.
              </p>
            </div>

            <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-10 border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
              <div className="flex items-center mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full mr-4"></div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Request Overview
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                    Requestor
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formData.employeeName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {formData.employeeCode}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">
                    Submission Date
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {format(new Date(), "MMM dd, yyyy")}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(), "h:mm a")}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">
                    Total Request Value
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(Number(formData.assetAmount) || 0)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formData.assets.length} item
                    {formData.assets.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <Button
                onClick={generatePDF}
                disabled={isPDFGenerating}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPDFGenerating ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-3" />
                    Download Complete Summary (PDF)
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-2xl">
              <Button
                onClick={resetForm}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              >
                <FileCheck className="h-5 w-5 mr-3" />
                Submit Another Request
              </Button>

              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="border-2 border-gray-300 dark:border-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-700 py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center hover:border-gray-400 dark:hover:border-gray-500"
                >
                  <ArrowLeft className="h-5 w-5 mr-3" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full mr-4"></div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                    Asset Request Form
                  </h1>
                </div>
                <p className="text-lg text-green-700 dark:text-green-400 font-medium ml-5">
                  Complete all required fields to submit your asset request
                </p>
                <div className="flex items-center mt-3 ml-5">
                  <div className="flex items-center bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full border border-green-200 dark:border-green-800">
                    <Leaf className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      Step {currentStep + 1} of {formSteps.length}:{" "}
                      {formSteps[currentStep].title}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="border-2 border-green-200 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 dark:border-green-800 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 dark:hover:text-green-400 transition-all duration-300 font-semibold"
                  asChild
                >
                  <Link href="/dashboard/requests">
                    <FileText className="mr-2 h-4 w-4" />
                    View My Requests
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 dark:border-blue-800 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 dark:hover:text-blue-400 transition-all duration-300 font-semibold"
                  asChild
                >
                  <Link href="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Link>
                </Button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
              <div className="grid grid-cols-12 min-h-[700px]">
                <div className="col-span-12 p-8 md:col-span-4 lg:col-span-3 bg-gradient-to-br from-slate-50 via-gray-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900/20 border-r border-gray-200 dark:border-gray-700">
                  <div className="sticky top-6">
                    <div className="mb-10">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                          <FileCheck className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Request Tracker
                          </h2>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        Complete all sections to submit your request. Track your
                        progress below.
                      </p>
                    </div>

                    <div className="space-y-3 mb-10">
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
                              ? "border-2 border-green-500 dark:border-green-400 text-green-700 dark:text-green-400 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 shadow-lg transform scale-105"
                              : isStepComplete(index)
                              ? "border-2 border-green-300 dark:border-green-600 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-md transition-all duration-200"
                              : "border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200"
                          }
                        />
                      ))}
                    </div>

                    {/* Step Requirements Section */}
                    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 shadow-lg">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3 shadow-md">
                          <AlertCircle className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Step Requirements
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {currentStep === 0 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-3">
                              Employee Information Required:
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                {formData.plant && formData.plant !== 0 ? (
                                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                ) : (
                                  <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                                )}
                                <span
                                  className={
                                    formData.plant && formData.plant !== 0
                                      ? "text-green-700 dark:text-green-400"
                                      : "text-gray-600 dark:text-gray-400"
                                  }
                                >
                                  Business Unit / Plant
                                </span>
                              </div>
                              <div className="flex items-center text-sm">
                                {formData.initiateDept &&
                                formData.initiateDept !== 0 ? (
                                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                ) : (
                                  <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                                )}
                                <span
                                  className={
                                    formData.initiateDept &&
                                    formData.initiateDept !== 0
                                      ? "text-green-700 dark:text-green-400"
                                      : "text-gray-600 dark:text-gray-400"
                                  }
                                >
                                  Department
                                </span>
                              </div>
                              <div className="flex items-center text-sm">
                                {formData.designation &&
                                formData.designation !== 0 ? (
                                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                ) : (
                                  <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                                )}
                                <span
                                  className={
                                    formData.designation &&
                                    formData.designation !== 0
                                      ? "text-green-700 dark:text-green-400"
                                      : "text-gray-600 dark:text-gray-400"
                                  }
                                >
                                  Designation
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {currentStep === 1 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-3">
                              Asset Selection Required:
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                {formData.assets.length > 0 ? (
                                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                ) : (
                                  <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                                )}
                                <span
                                  className={
                                    formData.assets.length > 0
                                      ? "text-green-700 dark:text-green-400"
                                      : "text-gray-600 dark:text-gray-400"
                                  }
                                >
                                  Add at least one asset (
                                  {formData.assets.length} added)
                                </span>
                              </div>
                              {formData.assets.length > 0 && (
                                <div className="ml-6 mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                  <div className="text-xs text-green-700 dark:text-green-400 font-medium mb-1">
                                    Assets Added:
                                  </div>
                                  <div className="space-y-1">
                                    {formData.assets
                                      .slice(0, 3)
                                      .map((asset, index) => (
                                        <div
                                          key={index}
                                          className="text-xs text-green-600 dark:text-green-300 flex items-center"
                                        >
                                          <Package className="h-3 w-3 mr-2 flex-shrink-0" />
                                          <span className="truncate">
                                            {asset.title} (Qty: {asset.quantity}
                                            )
                                          </span>
                                        </div>
                                      ))}
                                    {formData.assets.length > 3 && (
                                      <div className="text-xs text-green-500 dark:text-green-400 italic">
                                        +{formData.assets.length - 3} more
                                        assets
                                      </div>
                                    )}
                                  </div>
                                  <div className="mt-2 pt-2 border-t border-green-200 dark:border-green-800">
                                    <div className="text-xs text-green-700 dark:text-green-400 font-semibold">
                                      Total Estimated Value: ₹
                                      {formData.assets
                                        .reduce(
                                          (sum, asset) => sum + asset.total,
                                          0
                                        )
                                        .toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {currentStep === 2 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-3">
                              Asset Details Required:
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                {formData.assets.length > 0 ? (
                                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                ) : (
                                  <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                                )}
                                <span
                                  className={
                                    formData.assets.length > 0
                                      ? "text-green-700 dark:text-green-400"
                                      : "text-gray-600 dark:text-gray-400"
                                  }
                                >
                                  Assets selected
                                </span>
                              </div>
                              <div className="flex items-center text-sm">
                                {formData.category &&
                                formData.category !== 0 ? (
                                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                ) : (
                                  <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                                )}
                                <span
                                  className={
                                    formData.category && formData.category !== 0
                                      ? "text-green-700 dark:text-green-400"
                                      : "text-gray-600 dark:text-gray-400"
                                  }
                                >
                                  Request Category
                                </span>
                              </div>
                              <div className="flex items-center text-sm">
                                {formData.concerned_department &&
                                formData.concerned_department !== 0 ? (
                                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                ) : (
                                  <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                                )}
                                <span
                                  className={
                                    formData.concerned_department &&
                                    formData.concerned_department !== 0
                                      ? "text-green-700 dark:text-green-400"
                                      : "text-gray-600 dark:text-gray-400"
                                  }
                                >
                                  Concerned Department
                                </span>
                              </div>
                              <div className="flex items-center text-sm">
                                {formData.approvalCategory &&
                                formData.approvalCategory.trim() !== "" ? (
                                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                ) : (
                                  <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                                )}
                                <span
                                  className={
                                    formData.approvalCategory &&
                                    formData.approvalCategory.trim() !== ""
                                      ? "text-green-700 dark:text-green-400"
                                      : "text-gray-600 dark:text-gray-400"
                                  }
                                >
                                  Budget Approval Category
                                </span>
                              </div>
                              <div className="flex items-center text-sm">
                                {formData.reason &&
                                formData.reason.trim() !== "" ? (
                                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                ) : (
                                  <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                                )}
                                <span
                                  className={
                                    formData.reason &&
                                    formData.reason.trim() !== ""
                                      ? "text-green-700 dark:text-green-400"
                                      : "text-gray-600 dark:text-gray-400"
                                  }
                                >
                                  Reason for Request
                                </span>
                              </div>
                              <div className="flex items-center text-sm">
                                {formData.notifyTo ? (
                                  <Check className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                                ) : (
                                  <Info className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                                )}
                                <span
                                  className={
                                    formData.notifyTo
                                      ? "text-blue-700 dark:text-blue-400"
                                      : "text-gray-500 dark:text-gray-500"
                                  }
                                >
                                  Notify Request to (Optional)
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {currentStep === 3 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-3">
                              Final Confirmation Required:
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                {formData.policyAgreement ? (
                                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                ) : (
                                  <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                                )}
                                <span
                                  className={
                                    formData.policyAgreement
                                      ? "text-green-700 dark:text-green-400"
                                      : "text-gray-600 dark:text-gray-400"
                                  }
                                >
                                  Policy agreement
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-4 pt-3 border-t border-blue-200 dark:border-blue-800">
                          <div className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
                            <Info className="h-3 w-3 mr-1" />
                            Complete all requirements to proceed to the next
                            step
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-8 lg:col-span-9 p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <form className="max-w-4xl mx-auto">
                    <AnimatePresence mode="wait" custom={direction}>
                      {renderFormStep()}
                    </AnimatePresence>

                    <div className="flex justify-between items-center mt-10 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                      <Button
                        type="button"
                        onClick={goToPreviousStep}
                        disabled={currentStep === 0}
                        className={`bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:from-gray-300 hover:to-gray-400 dark:from-gray-700 dark:to-gray-600 dark:text-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500 py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                          currentStep === 0
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:shadow-xl hover:scale-105"
                        }`}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>

                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 px-6 py-2 rounded-full border-2 border-green-200 dark:border-green-800 shadow-sm">
                        <Leaf className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
                        <span className="font-medium">
                          Step {currentStep + 1} of {formSteps.length}:{" "}
                          {formSteps[currentStep].title}
                        </span>
                      </div>

                      {currentStep < formSteps.length - 1 ? (
                        <Button
                          type="button"
                          onClick={goToNextStep}
                          disabled={!isStepValid()}
                          className={`bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                            !isStepValid()
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:shadow-xl hover:scale-105"
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
                          className={`bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-8 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                            !isStepValid() || isSubmitting
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:shadow-xl hover:scale-105"
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                              Processing Request...
                            </>
                          ) : (
                            <>
                              Submit Request
                              <Check className="h-5 w-5 ml-2" />
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
    </div>
  );
}
