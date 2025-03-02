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
}

export interface FormStepProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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

export interface AssetDetailsProps extends FormStepProps {
  navigateToStep: (step: number) => void;
}
