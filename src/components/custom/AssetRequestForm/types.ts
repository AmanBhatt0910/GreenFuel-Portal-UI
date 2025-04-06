export interface AssetItem {
  title: string;
  description: string;
  quantity: number;
  pricePerUnit: number;
  sapItemCode: string;
  total: number;
}


export interface FormData {
  plant: number;
  date: string;
  employeeCode: string;
  employeeName: string;
  department: number;
  designation: number;
  assets: AssetItem[];
  assetAmount: string;
  reason: string;
  policyAgreement: boolean;
  initiateDept: number;
  currentStatus: string;
  benefitToOrg: string;
  approvalCategory: string;
  approvalType: string;
  notifyTo: number;
  category: number;
  concerned_department: number;
  paybackmonth : string;
  documentsSummary : string;
}

export interface SubmittingFormData {
  business_unit: number;           // Changed from string to number
  department: number;              // Changed from string to number
  designation: number;             // Changed from string to number
  total: number;                   // Changed from string to number
  reason: string;
  policy_agreement: boolean;
  initiate_dept: string;
  status: string;                  // Changed from current_status to status
  items: SubmittingAssetItem[];    // Changed from 'items' to match your data
  benefit_to_organisation: string; // Using UK spelling as in your data
  approval_category: string;
  approval_type: string;
  notify_to: number | null;        // Changed from string to number to match your data
  form_category: number;           // Changed from category to form_category
  concerned_department: number;    // Added field for concerned department
  current_category_level: number;  // Added field for current category level
  current_form_level: number;      // Added new field
  //form_max_level: number;          // Changed from max_level
  category_max_level?: number;     // Made optional as we're commenting it out
  rejected?: boolean;     
  documentsSummary :  string;         // Made optional as it's not in your sample data
  paybackmonth?: string;             
  rejection_reason?: string | null; // Made optional as it's not in your sample data
  user?: number;                    // Made optional as it's not in your sample data
}

export interface SubmittingAssetItem {
  name: string;                     // Changed from 'title' in your component
  description: string;
  quantity: number;
  per_unit_price: number;           // Changed from string to number based on your data
  sap_code: string;                 // Added this field that was in your data
}

export interface BudgetRequest {
  id: number;
  budget_id: string;
  date: string;
  total: string;
  reason: string;
  policy_agreement: boolean;
  current_status: string;
  benefit_to_organisation: string;
  approval_category: string;
  approval_type: string;
  current_level: number;
  max_level: number;
  rejected: boolean;
  rejection_reason: string | null;
  user: number;
  business_unit: number;
  department: number;
  designation: number;
  initiate_dept: number | null;
  notify_to: number;
}

export interface RequestData {
  id: number;
  title: string;
  budget_id: number;
  status: string;
  created_at: string;
}

export interface FormStepProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxChange?: (checked: boolean | string) => void;
  direction: number;
}

export interface AssetFormProps {
  currentAsset: AssetItem;
  handleCurrentAssetChange: (key: keyof AssetItem, value: string | number) => void;
  addAssetItem: () => void;
  updateEditedAsset: () => void;
  cancelEditing: () => void;
  editingAssetIndex: number | null;
}

export interface AssetTableProps {
  assets: AssetItem[];
  startEditingAsset: (index: number) => void;
  removeAssetItem: (index: number) => void;
  totalAmount: string;
}

export interface AssetDetailsProps extends FormStepProps {
  navigateToStep: (step: number) => void;
  user: any[];
  formAttachments: File[];
  setFormAttachments: React.Dispatch<React.SetStateAction<File[]>>;
  assetAttachments: File[];
  setAssetAttachments: React.Dispatch<React.SetStateAction<File[]>>;
}

export interface FormNavigationProps {
  currentStep: number;
  stepsCount: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  isSubmitting: boolean;
  isStepValid: () => boolean;
}
