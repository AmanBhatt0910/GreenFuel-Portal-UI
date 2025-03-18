import React from 'react';
import { AlertCircle } from 'lucide-react';

interface NoResultsProps {
  searchTerm: string;
}

export default function NoResults({ searchTerm }: NoResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
        <AlertCircle className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        No requests found
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md">
        {searchTerm
          ? "Try adjusting your search terms or filters to find what you're looking for."
          : "There are no approval requests matching your current criteria."}
      </p>
    </div>
  );
} 