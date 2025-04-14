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
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!assets || assets.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No asset details available</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Assets Details</h3>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>SAP Code</TableHead>
              <TableHead>Date Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell className="font-medium">{asset.id}</TableCell>
                <TableCell>{asset.name}</TableCell>
                <TableCell>
                  <div className="whitespace-pre-line">{asset.description}</div>
                </TableCell>
                <TableCell className="text-center">{asset.quantity}</TableCell>
                <TableCell className="text-right">{formatCurrency(asset.per_unit_price)}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(parseFloat(asset.per_unit_price) * asset.quantity)}
                </TableCell>
                <TableCell>{asset.sap_code}</TableCell>
                <TableCell>{formatDate(asset.date)}</TableCell>
              </TableRow>
            ))}
            
            {/* Total row */}
            <TableRow className="bg-gray-50 dark:bg-gray-800 font-medium">
              <TableCell colSpan={5} className="text-right">
                Total
              </TableCell>
              <TableCell className="text-right">{formatCurrency(calculateTotal())}</TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AssetDetailsTable; 