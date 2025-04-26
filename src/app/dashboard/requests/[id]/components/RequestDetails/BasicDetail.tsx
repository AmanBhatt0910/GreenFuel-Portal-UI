import { CalendarDays, IndianRupee, Info } from "lucide-react";
import React from "react";
import { formatDate } from "../AssetDetailsTable/AssetDetailsTable";

const BasicInfoSection: React.FC<{ request: any }> = React.memo(({ request }) => {
  const formatCurrency = (
    amount: number | string,
    locale = "en-IN",
    currency = "INR"
  ): string => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(num)) return "₹0.00";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="bg-sky-50 p-5 rounded-xl border border-sky-100 shadow-sm hover:shadow-md transition-all duration-300">
      <h3 className="font-medium text-sky-800 mb-4 text-lg flex items-center">
        <Info className="h-5 w-5 mr-2 text-sky-600" />
        Basic Information
      </h3>
      <div className="space-y-4">
        <div className="bg-white p-3 rounded-md border border-sky-100 hover:border-sky-200 transition-colors duration-300">
          <p className="text-sm font-medium text-sky-700">Budget ID</p>
          <p className="text-base text-gray-900 mt-1">{request.budget_id}</p>
        </div>
        <div className="bg-white p-3 rounded-md border border-sky-100">
          <p className="text-sm font-medium text-sky-700">Date Submitted</p>
          <p className="text-base text-gray-900 mt-1 flex items-center">
            <CalendarDays className="h-4 w-4 mr-1.5 text-sky-500" />
            {formatDate(request.date)}
          </p>
        </div>
        <div className="bg-white p-3 rounded-md border border-sky-100">
          <p className="text-sm font-medium text-sky-700">Total Amount</p>
          <p className="text-base text-gray-900 mt-1 flex items-center">
            <IndianRupee className="h-4 w-4 mr-1.5 text-sky-500" />
            {formatCurrency(request.total)}
          </p>
        </div>
        <div className="bg-white p-3 rounded-md border border-sky-100">
          <p className="text-sm font-medium text-sky-700">Approval Type</p>
          <p className="text-base text-gray-900 mt-1">{request.approval_type}</p>
        </div>
        <div className="bg-white p-3 rounded-md border border-sky-100">
          <p className="text-sm font-medium text-sky-700">Approval Category</p>
          <p className="text-base text-gray-900 mt-1">{request.approval_category}</p>
        </div>
      </div>
    </div>
  );
});

BasicInfoSection.displayName = "BasicInfoSection";

export default BasicInfoSection;
