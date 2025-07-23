import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

// Types for the PDF generator
export interface AssetItem {
  title: string;
  description?: string;
  quantity: number;
  pricePerUnit: number;
  total: number;
  sapItemCode?: string;
}

export interface RequestorInfo {
  employeeName: string;
  employeeCode: string;
  businessUnitName?: string;
  departmentName?: string;
  designationName?: string;
}

export interface PDFGeneratorOptions {
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

// Color definitions for consistent theming
const PDF_COLORS = {
  primary: [44, 62, 80] as [number, number, number],
  secondary: [52, 152, 219] as [number, number, number],
  text: [51, 51, 51] as [number, number, number],
  background: [245, 245, 245] as [number, number, number],
  border: [221, 221, 221] as [number, number, number],
};

/**
 * Formats currency for PDF display
 */
export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) || 0 : amount;
  const formattedNumber = numAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `Rs. ${formattedNumber}`;
}

/**
 * Adds a section header to the PDF
 */
function addSectionHeader(doc: jsPDF, title: string, y: number): void {
  doc.setFillColor(...PDF_COLORS.background);
  doc.rect(14, y, 182, 10, "F");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.primary);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, y + 7);
}

/**
 * Adds an info row to the PDF
 */
function addInfoRow(
  doc: jsPDF,
  label: string,
  value: string,
  x: number,
  yOffset: number,
  baseY: number
): void {
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(label, x, baseY + yOffset);
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.text);
  doc.text(value, x + 35, baseY + yOffset);
}

/**
 * Adds header section with logo and title
 */
function addHeader(doc: jsPDF, title: string, budgetId: string | number): void {
  // Try to add logo, fallback to text
  try {
    const imgData: string = "/green.png";
    doc.addImage(imgData, "PNG", 14, 10, 35, 15);
  } catch (error) {
    doc.setFontSize(18);
    doc.setFillColor(...PDF_COLORS.primary);
    doc.setFont("helvetica", "bold");
    doc.text("GREEN CORP", 14, 20);
  }

  // Title Section
  doc.setFontSize(20);
  doc.setTextColor(...PDF_COLORS.primary);
  doc.setFont("helvetica", "bold");
  doc.text(title.toUpperCase(), 105, 25, { align: "center" });

  // Subtitle
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.secondary);
  doc.text(`Request #${budgetId}`, 105, 33, { align: "center" });

  // Divider Line
  doc.setDrawColor(...PDF_COLORS.border);
  doc.setLineWidth(0.5);
  doc.line(14, 38, 196, 38);

  // Metadata
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.text);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${format(new Date(), "MMMM dd, yyyy")}`, 14, 45);
  doc.text("CONFIDENTIAL", 196, 45, { align: "right" });
}

/**
 * Adds requestor information section
 */
function addRequestorInfo(doc: jsPDF, requestorInfo: RequestorInfo, status: string, y: number): number {
  addSectionHeader(doc, "REQUESTOR INFORMATION", y);
  y += 15;

  // Requestor Info Card
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...PDF_COLORS.border);
  doc.roundedRect(14, y, 182, 40, 3, 3, "S");

  addInfoRow(doc, "Name:", requestorInfo.employeeName, 20, 8, y);
  addInfoRow(doc, "Employee ID:", requestorInfo.employeeCode, 20, 16, y);
  addInfoRow(doc, "Department:", requestorInfo.departmentName || "N/A", 20, 24, y);
  addInfoRow(doc, "Business Unit:", requestorInfo.businessUnitName || "N/A", 110, 8, y);
  addInfoRow(doc, "Designation:", requestorInfo.designationName || "N/A", 110, 16, y);
  addInfoRow(doc, "Status:", status, 110, 24, y);

  return y + 45;
}

/**
 * Adds assets table section
 */
function addAssetsTable(doc: jsPDF, assets: AssetItem[], totalAmount: string | number, y: number): number {
  addSectionHeader(doc, "ASSET SUMMARY", y);
  y += 15;

  if (assets?.length) {
    autoTable(doc, {
      startY: y,
      head: [
        ["Asset", "Description", "SAP Code", "Qty", "Unit Price", "Total"],
      ],
      body: assets.map((asset) => [
        asset.title,
        asset.description || "-",
        asset.sapItemCode || "N/A",
        asset.quantity,
        formatCurrency(Number(asset.pricePerUnit) || 0),
        formatCurrency(Number(asset.total) || 0),
      ]),
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 4,
        lineColor: PDF_COLORS.border,
        textColor: PDF_COLORS.text,
      },
      headStyles: {
        fillColor: PDF_COLORS.primary,
        textColor: 255,
        fontSize: 10,
      },
      columnStyles: {
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
      },
      foot: [
        [
          "",
          "",
          "",
          "",
          "Total:",
          formatCurrency(Number(totalAmount) || 0),
        ],
      ],
    });

    return (doc as any).lastAutoTable.finalY + 10;
  } else {
    doc.setFontSize(10);
    doc.setTextColor(...PDF_COLORS.text);
    doc.text("No assets requested", 14, y);
    return y + 15;
  }
}

/**
 * Adds justification section
 */
function addJustification(doc: jsPDF, reason: string, y: number): number {
  addSectionHeader(doc, "BUSINESS JUSTIFICATION", y);
  y += 15;

  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.text);
  const splitReason = doc.splitTextToSize(
    reason || "No justification provided",
    180
  );
  doc.text(splitReason, 14, y);
  return y + splitReason.length * 5 + 15;
}

/**
 * Adds policy agreement section
 */
function addPolicySection(doc: jsPDF, y: number): number {
  addSectionHeader(doc, "POLICY AGREEMENT", y);
  y += 15;

  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.text);
  const policyText =
    "The requestor has acknowledged and agreed to comply with all company policies and procedures regarding asset management, usage, and return. This request is subject to approval based on available budget and business requirements.";
  const splitPolicy = doc.splitTextToSize(policyText, 180);
  doc.text(splitPolicy, 14, y);

  return y + splitPolicy.length * 5 + 15;
}

/**
 * Adds footer to all pages
 */
function addFooter(doc: jsPDF): void {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...PDF_COLORS.text);
    doc.text(`Page ${i} of ${pageCount}`, 196, 287, { align: "right" });
    doc.text("Confidential Document", 14, 287);
  }
}

/**
 * Main PDF generator function
 */
export async function generateAssetRequestPDF(options: PDFGeneratorOptions): Promise<void> {
  const {
    budgetId,
    requestorInfo,
    assets,
    totalAmount,
    reason = "",
    documentType = "Asset Request",
    status = "Pending Approval",
    customTitle,
    includePolicySection = true,
  } = options;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const title = customTitle || documentType;

  // Add header
  addHeader(doc, title, budgetId);

  // Introduction
  doc.setFontSize(10);
  const introText = `This document contains a formal ${documentType.toLowerCase()} for company assets. Please review all sections carefully and ensure compliance with company policies.`;
  const splitIntro = doc.splitTextToSize(introText, 180);
  doc.text(splitIntro, 14, 55);

  let y: number = 55 + splitIntro.length * 5 + 10;

  // Add sections
  y = addRequestorInfo(doc, requestorInfo, status, y);
  y = addAssetsTable(doc, assets, totalAmount, y);
  y = addJustification(doc, reason, y);

  if (includePolicySection) {
    y = addPolicySection(doc, y);
  }

  // Add footer
  addFooter(doc);

  // Save the PDF
  const fileName = `${documentType.replace(/\s+/g, "_")}_${budgetId}.pdf`;
  doc.save(fileName);
}

/**
 * Generate PDF for approval requests (can be used in approvals dashboard)
 */
export async function generateApprovalPDF(
  requestData: any,
  budgetId: string | number,
  fetchEntityNames?: (api: any) => Promise<{ businessUnitName: string; departmentName: string; designationName: string }>
): Promise<void> {
  console.log('generateApprovalPDF - requestData:', requestData);
  console.log('generateApprovalPDF - employee_code from requestData:', requestData.employee_code);
  
  // Use enriched data if available (from approval pages), otherwise fallback to original logic
  const requestorInfo: RequestorInfo = {
    employeeName: requestData.user_name || requestData.user?.name || requestData.employeeName || "N/A",
    employeeCode: requestData.employee_code || requestData.user?.employee_code || requestData.employeeCode || "N/A",
    businessUnitName: requestData.business_unit_name || "N/A",
    departmentName: requestData.department_name || "N/A",
    designationName: requestData.designation_name || "N/A",
  };

  console.log('generateApprovalPDF - Final requestorInfo:', requestorInfo);

  // Handle asset details - check if assetDetails is passed directly or use items
  let assets: AssetItem[] = [];
  
  if (requestData.assetDetails && Array.isArray(requestData.assetDetails)) {
    // Data from approval pages - use assetDetails
    assets = requestData.assetDetails.map((item: any) => ({
      title: item.name || item.title || "N/A",
      description: item.description || "",
      quantity: item.quantity || 1,
      pricePerUnit: item.per_unit_price || item.pricePerUnit || 0,
      total: (item.quantity || 1) * (item.per_unit_price || item.pricePerUnit || 0),
      sapItemCode: item.sap_code || item.sapItemCode || "",
    }));
  } else if (requestData.items && Array.isArray(requestData.items)) {
    // Original logic for form page
    assets = requestData.items.map((item: any) => ({
      title: item.name || item.title || "N/A",
      description: item.description || "",
      quantity: item.quantity || 1,
      pricePerUnit: item.per_unit_price || item.pricePerUnit || 0,
      total: (item.quantity || 1) * (item.per_unit_price || item.pricePerUnit || 0),
      sapItemCode: item.sap_code || item.sapItemCode || "",
    }));
  }

  // Calculate total amount
  const totalAmount = assets.reduce((sum, asset) => sum + asset.total, 0) || requestData.total || 0;

  await generateAssetRequestPDF({
    budgetId: requestData.budget_id || budgetId,
    requestorInfo,
    assets,
    totalAmount,
    reason: requestData.reason || "",
    documentType: "Asset Request",
    status: requestData.status ? requestData.status.charAt(0).toUpperCase() + requestData.status.slice(1) : "Pending Approval",
  });
}
