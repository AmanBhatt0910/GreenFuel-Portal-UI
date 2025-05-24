import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define the interface for an asset item
interface AssetItem {
  id: number;
  name: string;
  description: string;
  quantity: number;
  per_unit_price: string;
  sap_code: string;
  date: string;
  user: number;
  form: number;
}

interface AssetDetailsTableProps {
  assets: AssetItem[];
  isLoading?: boolean;
}

export function formatDate(dateString: string | number | Date | undefined | null): string {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date format: ${dateString}`);
      return String(dateString);
    }
    
    // Format the date and time
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    // Format hours and minutes with leading zeros if needed
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${day} ${month} on ${formattedHours}:${formattedMinutes}`;
  } catch (error) {
    console.error(`Error formatting date: ${dateString}`, error);
    return String(dateString);
  }
}

const AssetDetailsTable: React.FC<AssetDetailsTableProps> = ({
  assets,
  isLoading = false,
}) => {
  // Format currency
  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(typeof amount === "string" ? parseFloat(amount) : amount);
  };

  // Calculate total
  const calculateTotal = () => {
    return assets.reduce((total, asset) => {
      return total + (asset.quantity * parseFloat(asset.per_unit_price));
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="w-full p-8 flex justify-center">
        <div className="animate-pulse flex flex-col w-full">
          <div className="h-6 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-md w-1/4 mb-4"></div>
          <div className="h-32 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-md w-full"></div>
        </div>
      </div>
    );
  }

  if (!assets || assets.length === 0) {
    return (
      <div className="w-full p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500 font-medium">No asset details available</p>
        <p className="text-sm text-gray-400 mt-1">Assets will appear here once they are added to the request</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-indigo-100 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-3 border-b border-indigo-100">
        <h3 className="font-medium text-indigo-800 flex items-center text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Assets Details
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-indigo-50 to-blue-50">
              <TableHead className="w-[80px] font-semibold text-indigo-700">ID</TableHead>
              <TableHead className="font-semibold text-indigo-700">Name</TableHead>
              <TableHead className="font-semibold text-indigo-700">Description</TableHead>
              <TableHead className="text-center font-semibold text-indigo-700">Quantity</TableHead>
              <TableHead className="text-right font-semibold text-indigo-700">Unit Price</TableHead>
              <TableHead className="text-right font-semibold text-indigo-700">Total</TableHead>
              <TableHead className="font-semibold text-indigo-700">SAP Code</TableHead>
              <TableHead className="font-semibold text-indigo-700">Date Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset, index) => (
              <TableRow key={asset.id} className={index % 2 === 0 ? "bg-white" : "bg-indigo-50/20"}>
                <TableCell className="font-medium text-indigo-600">#{asset.id}</TableCell>
                <TableCell className="font-medium">{asset.name}</TableCell>
                <TableCell>
                  <div className="whitespace-pre-line text-gray-600">{asset.description}</div>
                </TableCell>
                <TableCell className="text-center">{asset.quantity}</TableCell>
                <TableCell className="text-right font-medium text-gray-700">{formatCurrency(asset.per_unit_price)}</TableCell>
                <TableCell className="text-right font-semibold text-indigo-700">
                  {formatCurrency(parseFloat(asset.per_unit_price) * asset.quantity)}
                </TableCell>
                <TableCell className="text-gray-600">{asset.sap_code}</TableCell>
                <TableCell className="text-sm text-gray-600">{formatDate(asset.date)}</TableCell>
              </TableRow>
            ))}
            
            {/* Total row */}
            <TableRow className="bg-gradient-to-r from-indigo-100 to-blue-100 font-medium">
              <TableCell colSpan={5} className="text-right font-semibold text-indigo-800">
                Total Amount
              </TableCell>
              <TableCell className="text-right font-bold text-indigo-900">{formatCurrency(calculateTotal())}</TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AssetDetailsTable; 