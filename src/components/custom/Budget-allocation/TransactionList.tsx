// TransactionList.tsx

import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { BudgetHistoryTransaction } from './types';

interface TransactionListProps {
  transactions: BudgetHistoryTransaction[];
  loading: boolean;

  // pagination props
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const TransactionList = ({
  transactions,
  loading,
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}: TransactionListProps) => {
  const safeTransactions = Array.isArray(transactions)
    ? transactions
    : [];

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          Budget credit / debit history
        </CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-sm text-gray-500">
            Loading transactions…
          </p>
        ) : safeTransactions.length === 0 ? (
          <p className="text-sm text-gray-500">
            No transactions found
          </p>
        ) : (
          <>
            {/* TRANSACTIONS */}
            <div className="space-y-4">
              {safeTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="border rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">
                        {tx.remarks || '—'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {tx.created_at
                          ? new Date(tx.created_at).toLocaleString()
                          : '—'}
                      </p>
                    </div>

                    <p
                      className={`font-bold ${
                        tx.transaction_type === 'DEBIT'
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      {tx.transaction_type === 'DEBIT' ? '-' : '+'}
                      ₹{Number(tx.amount).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => onPageChange(currentPage - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => onPageChange(currentPage + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
