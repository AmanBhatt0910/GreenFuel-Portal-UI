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

export interface ApprovalLevel {
  level: number;
  status: "approved" | "pending" | "waiting" | "rejected";
  approverName?: string;
  approvedAt?: string;
  comments?: string;
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
  // Additional request details
  benefitToOrganisation?: string;
  paybackPeriod?: string;
  documentEnclosedSummary?: string;
  policyAgreement?: boolean;
  rejectionReason?: string;
  rejected?: boolean;
  // Approval hierarchy information
  currentLevel?: number;
  maxLevel?: number;
  approvalLevels?: ApprovalLevel[];
}

// Color definitions for consistent theming
const PDF_COLORS = {
  primary: [44, 62, 80] as [number, number, number],
  secondary: [52, 152, 219] as [number, number, number],
  text: [51, 51, 51] as [number, number, number],
  background: [245, 245, 245] as [number, number, number],
  border: [221, 221, 221] as [number, number, number],
  success: [34, 197, 94] as [number, number, number],
  error: [239, 68, 68] as [number, number, number],
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
 * Adds approval hierarchy section with current level information
 */
function addApprovalHierarchy(
  doc: jsPDF, 
  currentLevel: number, 
  maxLevel: number, 
  approvalLevels: ApprovalLevel[], 
  y: number
): number {
  console.log('addApprovalHierarchy called with:', { currentLevel, maxLevel, approvalLevels, y });
  
  addSectionHeader(doc, "APPROVAL HIERARCHY", y);
  y += 15;

  // Current level information
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.primary);
  doc.text(`Current Approval Level: ${currentLevel} of ${maxLevel}`, 14, y);
  y += 10;

  // Progress indicator
  const progressWidth = 160;
  const progressHeight = 8;
  const progressX = 14;
  
  // Background
  doc.setFillColor(...PDF_COLORS.background);
  doc.roundedRect(progressX, y, progressWidth, progressHeight, 2, 2, "F");
  
  // Progress fill
  const fillWidth = (currentLevel / maxLevel) * progressWidth;
  doc.setFillColor(...PDF_COLORS.primary);
  doc.roundedRect(progressX, y, fillWidth, progressHeight, 2, 2, "F");
  
  y += 20;

  // Approval levels table
  if (approvalLevels && approvalLevels.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [["Level", "Status", "Approver", "Date", "Comments"]],
      body: approvalLevels.map((level) => [
        `Level ${level.level}`,
        level.status.charAt(0).toUpperCase() + level.status.slice(1),
        level.approverName || "Pending Assignment",
        level.approvedAt ? format(new Date(level.approvedAt), "MMM dd, yyyy") : "-",
        level.comments || "-"
      ]),
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: PDF_COLORS.border,
        textColor: PDF_COLORS.text,
      },
      headStyles: {
        fillColor: PDF_COLORS.primary,
        textColor: 255,
        fontSize: 10,
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 20 },
        1: { halign: "center", cellWidth: 25 },
        2: { cellWidth: 50 },
        3: { halign: "center", cellWidth: 30 },
        4: { cellWidth: 55 }
      },
      didParseCell: function(data: any) {
        if (data.column.index === 1 && data.cell.section === 'body') {
          const status = data.cell.raw.toLowerCase();
          if (status === 'approved') {
            data.cell.styles.textColor = PDF_COLORS.success;
          } else if (status === 'rejected') {
            data.cell.styles.textColor = PDF_COLORS.error;
          } else if (status === 'pending') {
            data.cell.styles.textColor = PDF_COLORS.secondary;
          }
        }
      }
    });
    return (doc as any).lastAutoTable.finalY + 15;
  } else {
    doc.setTextColor(...PDF_COLORS.text);
    doc.text("No detailed approval information available", 14, y);
    return y + 15;
  }
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
 * Adds benefit to organisation section
 */
function addBenefitToOrganisation(doc: jsPDF, benefit: string, y: number): number {
  addSectionHeader(doc, "BENEFIT TO ORGANISATION", y);
  y += 15;

  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.text);
  const splitBenefit = doc.splitTextToSize(
    benefit || "No benefit description provided",
    180
  );
  doc.text(splitBenefit, 14, y);
  return y + splitBenefit.length * 5 + 15;
}

/**
 * Adds payback period section
 */
function addPaybackPeriod(doc: jsPDF, payback: string, y: number): number {
  addSectionHeader(doc, "PAYBACK PERIOD", y);
  y += 15;

  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.text);
  const splitPayback = doc.splitTextToSize(
    payback || "No payback period specified",
    180
  );
  doc.text(splitPayback, 14, y);
  return y + splitPayback.length * 5 + 15;
}

/**
 * Adds document enclosed summary section
 */
function addDocumentSummary(doc: jsPDF, summary: string, y: number): number {
  addSectionHeader(doc, "DOCUMENT ENCLOSED SUMMARY", y);
  y += 15;

  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.text);
  const splitSummary = doc.splitTextToSize(
    summary || "No document summary provided",
    180
  );
  doc.text(splitSummary, 14, y);
  return y + splitSummary.length * 5 + 15;
}

/**
 * Enhanced policy agreement section with actual status
 */
function addPolicyAgreementStatus(doc: jsPDF, policyAgreement: boolean, y: number): number {
  addSectionHeader(doc, "POLICY AGREEMENT", y);
  y += 15;

  doc.setFontSize(10);
  
  if (policyAgreement) {
    doc.setTextColor(...PDF_COLORS.success);
    doc.text("✓ Policy Agreement: AGREED", 14, y);
    y += 10;
    doc.setTextColor(...PDF_COLORS.text);
    doc.text("The requestor has acknowledged and agreed to comply with all company policies.", 14, y);
  } else {
    doc.setTextColor(...PDF_COLORS.error);
    doc.text("✗ Policy Agreement: NOT AGREED", 14, y);
    y += 10;
    doc.setTextColor(...PDF_COLORS.text);
    doc.text("The requestor has not agreed to the company policies.", 14, y);
  }
  
  return y + 15;
}

/**
 * Adds rejection reason section (if applicable)
 */
function addRejectionReason(doc: jsPDF, rejectionReason: string, y: number): number {
  addSectionHeader(doc, "REJECTION REASON", y);
  y += 15;

  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.error);
  const splitReason = doc.splitTextToSize(
    rejectionReason || "No rejection reason provided",
    180
  );
  doc.text(splitReason, 14, y);
  return y + splitReason.length * 5 + 15;
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
    benefitToOrganisation,
    paybackPeriod,
    documentEnclosedSummary,
    policyAgreement,
    rejectionReason,
    rejected,
    currentLevel,
    maxLevel,
    approvalLevels,
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
  
  // Add business justification (reason)
  if (reason) {
    y = addJustification(doc, reason, y);
  }
  
  // Add benefit to organisation
  if (benefitToOrganisation) {
    y = addBenefitToOrganisation(doc, benefitToOrganisation, y);
  }
  
  // Add payback period
  if (paybackPeriod) {
    y = addPaybackPeriod(doc, paybackPeriod, y);
  }
  
  // Add document enclosed summary
  if (documentEnclosedSummary) {
    y = addDocumentSummary(doc, documentEnclosedSummary, y);
  }

  // Add approval hierarchy if available
  if ((currentLevel && maxLevel) || (approvalLevels && approvalLevels.length > 0)) {
    console.log('Adding approval hierarchy:', { currentLevel, maxLevel, approvalLevels });
    y = addApprovalHierarchy(doc, currentLevel || 1, maxLevel || 1, approvalLevels || [], y);
  } else {
    console.log('Skipping approval hierarchy:', { currentLevel, maxLevel, approvalLevels });
  }

  // Add policy agreement status if available
  if (policyAgreement !== undefined) {
    y = addPolicyAgreementStatus(doc, policyAgreement, y);
  } else if (includePolicySection) {
    y = addPolicySection(doc, y);
  }
  
  // Add rejection reason if rejected
  if (rejected && rejectionReason) {
    y = addRejectionReason(doc, rejectionReason, y);
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
    benefitToOrganisation: requestData.benefit_to_organisation || "",
    paybackPeriod: requestData.payback_period || "",
    documentEnclosedSummary: requestData.document_enclosed_summary || "",
    policyAgreement: requestData.policy_agreement,
    rejectionReason: requestData.rejection_reason || "",
    rejected: requestData.rejected || false,
    currentLevel: requestData.current_form_level || requestData.current_level || 1,
    maxLevel: requestData.form_max_level || requestData.max_level || 1,
    approvalLevels: requestData.approval_levels || [],
  });
}
