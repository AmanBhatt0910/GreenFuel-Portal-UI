import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface AssetItem {
  name: string;
  quantity: number;
}

interface FormData {
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
}

interface FullFormModalProps {
  formData: FormData;
}

const FullFormModal: React.FC<FullFormModalProps> = ({ formData }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm font-medium shadow-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <Eye className="w-5 h-5" /> View Full Form
        </Button>
      </DialogTrigger>
      
      <DialogContent className="p-6 max-w-2xl rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-wide text-gray-800 dark:text-white">
            Form Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <InfoItem label="Employee Name" value={formData.employeeName} />
          <InfoItem label="Employee Code" value={formData.employeeCode} />
          <InfoItem label="Department" value={formData.department} />
          <InfoItem label="Designation" value={formData.designation} />
          <InfoItem label="Approval Type" value={formData.approvalType} />
          <InfoItem label="Approval Category" value={formData.approvalCategory} />
          <InfoItem label="Reason" value={formData.reason} fullWidth />
          <InfoItem label="Benefit to Organization" value={formData.benefitToOrg} fullWidth />

          <div className="col-span-2">
            <p className="text-gray-500 dark:text-gray-400 font-medium">Assets:</p>
            {formData.assets.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.assets.map((asset, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg"
                  >
                    {asset.name} - {asset.quantity}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">No assets listed.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const InfoItem: React.FC<{ label: string; value: string | number; fullWidth?: boolean }> = ({ label, value, fullWidth }) => {
  return (
    <div className={`${fullWidth ? "col-span-2" : "col-span-1"} space-y-1`}>
      <p className="text-gray-500 dark:text-gray-400 font-medium">{label}:</p>
      <p className="text-gray-800 dark:text-gray-200 text-lg font-semibold">{value}</p>
    </div>
  );
};

export default FullFormModal;
