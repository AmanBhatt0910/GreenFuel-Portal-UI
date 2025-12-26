import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction } from './types';

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  page: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const TransactionList = ({
  transactions,
  loading,
  page,
  total,
  onPageChange,
}: TransactionListProps) => {
  const totalPages = Math.ceil(total / 10); // backend page size

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          Latest spending activities across all departments
        </CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-sm text-gray-500">Loading transactions…</p>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-gray-500">No transactions found</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {transaction.description}
                      </h3>
                      <Badge variant="outline">
                        {transaction.department}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Category</p>
                        <p className="font-medium">{transaction.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Date</p>
                        <p className="font-medium">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Amount</p>
                        <p
                          className={`font-semibold ${
                            transaction.type === 'expense'
                              ? 'text-red-600'
                              : 'text-green-600'
                          }`}
                        >
                          {transaction.type === 'expense' ? '-' : '+'}
                          ₹{transaction.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
