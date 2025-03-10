export interface AssetItem {
  title: string;
  description: string;
  quantity: number;
  pricePerUnit: number;
  sapItemCode: string;
  total: number;
}


export interface FormData {
  plant: string;
  date: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  designation: string;
  assets: AssetItem[];
  assetAmount: string;
  reason: string;
  policyAgreement: boolean;
  initiateDept: string;
  currentStatus: string;
  benefitToOrg: string;
  approvalCategory: string;
  approvalType: string;
  notifyTo: string;
}

export interface SubmittingFormData {
  user: number; 
  business_unit: string; 
  department: string; 
  designation: string; 
  date: string; 
  total: string; 
  reason: string; 
  policy_agreement: boolean; 
  initiate_dept: string; 
  current_status: string; 
  items : SubmittingAssetItem[];
  benefit_to_organisation: string; 
  approval_category: string; 
  approval_type: string; 
  notify_to: string | null; 
  current_level: number; 
  max_level: number; 
  rejected: boolean; 
  rejection_reason: string | null; 
}

export interface SubmittingAssetItem {
  name: string; 
  description: string; 
  quantity: number; 
  per_unit_price: string; 
  sap_code: string; 
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
