import { useState } from 'react';
import { generateAssetRequestPDF, generateApprovalPDF, RequestorInfo, AssetItem } from '@/lib/pdf-generator';

export interface UseAssetRequestPDFOptions {
  budgetId: string | number;
  requestorInfo: RequestorInfo;
  assets: AssetItem[];
  totalAmount: string | number;
  reason?: string;
  documentType?: string;
  status?: string;
  customTitle?: string;
  includePolicySection?: boolean;
}

/**
 * Hook for generating asset request PDFs
 */
export function useAssetRequestPDF() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePDF = async (options: UseAssetRequestPDFOptions) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      await generateAssetRequestPDF(options);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate PDF';
      setError(errorMessage);
      console.error('Error generating PDF:', err);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatePDF,
    isGenerating,
    error,
  };
}

/**
 * Hook for generating approval PDFs
 */
export function useApprovalPDF() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePDF = async (
    requestData: any,
    budgetId: string | number,
    fetchEntityNames?: (api: any) => Promise<{ businessUnitName: string; departmentName: string; designationName: string }>
  ) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      await generateApprovalPDF(requestData, budgetId, fetchEntityNames);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate PDF';
      setError(errorMessage);
      console.error('Error generating PDF:', err);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatePDF,
    isGenerating,
    error,
  };
}

/**
 * General purpose PDF generation utilities
 */
export const pdfUtils = {
  /**
   * Generate asset request PDF with basic options
   */
  generateAssetRequest: async (options: UseAssetRequestPDFOptions) => {
    return generateAssetRequestPDF(options);
  },

  /**
   * Generate approval PDF
   */
  generateApproval: async (
    requestData: any,
    budgetId: string | number,
    fetchEntityNames?: (api: any) => Promise<{ businessUnitName: string; departmentName: string; designationName: string }>
  ) => {
    return generateApprovalPDF(requestData, budgetId, fetchEntityNames);
  },

  /**
   * Create requestor info object from form data
   */
  createRequestorInfo: (formData: any): RequestorInfo => ({
    employeeName: formData.employeeName || formData.user?.name || "N/A",
    employeeCode: formData.employeeCode || formData.user?.employee_code || "N/A",
    businessUnitName: formData.businessUnitName || formData.business_unit?.name || "N/A",
    departmentName: formData.departmentName || formData.department?.name || "N/A",
    designationName: formData.designationName || formData.designation?.name || "N/A",
  }),

  /**
   * Create assets array from various data formats
   */
  createAssetsArray: (assetsData: any[]): AssetItem[] => {
    return assetsData.map((item: any) => ({
      title: item.title || item.name || "N/A",
      description: item.description || "",
      quantity: item.quantity || 1,
      pricePerUnit: item.pricePerUnit || item.per_unit_price || 0,
      total: (item.quantity || 1) * (item.pricePerUnit || item.per_unit_price || 0),
      sapItemCode: item.sapItemCode || item.sap_code || "",
    }));
  },
};
