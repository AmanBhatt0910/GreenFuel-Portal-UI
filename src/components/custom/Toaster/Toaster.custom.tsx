import { Toaster } from "sonner";
import React from "react";

export function GreenFuelToaster() {
  return (
    <Toaster
      theme="system"
      position="top-center"
      richColors={false}
      closeButton
      toastOptions={{
        style: {
          backgroundColor: "var(--toast-bg)",
          color: "var(--toast-text)",
          border: "1px solid var(--toast-border)",
          borderRadius: "0.5rem",
          fontWeight: 500,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
        classNames: {
          toast:
            "group flex p-4 items-center data-[type=success]:border-l-4 data-[type=success]:border-l-[#41a350] data-[type=error]:border-l-4 data-[type=error]:border-l-[#e74c3c]",
          title: "text-base font-medium",
          description: "text-sm text-muted-foreground",
          actionButton:
            "bg-[#41a350] text-white hover:bg-[#368a43] focus:ring-2 focus:ring-[#41a350] px-3 py-1 rounded-md text-sm font-medium transition-colors",
          cancelButton:
            "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 px-3 py-1 rounded-md text-sm font-medium transition-colors",
          success:
            "bg-white dark:bg-gray-800 text-[#41a350] dark:text-[#41a350]",
          error: "bg-white dark:bg-gray-800 text-[#e74c3c] dark:text-[#e74c3c]",
          loading:
            "bg-white dark:bg-gray-800 text-[#6552D0] dark:text-[#6552D0]",
          info: "bg-white dark:bg-gray-800 text-[#6552D0] dark:text-[#6552D0]",
          warning:
            "bg-white dark:bg-gray-800 text-[#f39c12] dark:text-[#f39c12]",
        },
        duration: 4000,
      }}
    />
  );
}

export const toastStyles = `
  :root {
    --toast-bg: #ffffff;
    --toast-text: #333333;
    --toast-border: rgba(229, 231, 235, 1);
  }
  
  .dark {
    --toast-bg: #1f2937;
    --toast-text: #e5e7eb;
    --toast-border: rgba(75, 85, 99, 0.4);
  }
  
  /* Customize toast icons */
  [data-sonner-toast][data-type="success"] [data-icon] {
    color: #41a350 !important;
  }
  
  [data-sonner-toast][data-type="error"] [data-icon] {
    color: #e74c3c !important;
  }
  
  [data-sonner-toast][data-type="loading"] [data-icon],
  [data-sonner-toast][data-type="info"] [data-icon] {
    color: #6552D0 !important;
  }
  
  [data-sonner-toast][data-type="warning"] [data-icon] {
    color: #f39c12 !important;
  }
`;
