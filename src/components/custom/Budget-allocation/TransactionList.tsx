import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction } from './types';
import { BudgetHistoryTransaction } from './types';

interface TransactionListProps {
  transactions: BudgetHistoryTransaction[];
  loading: boolean;
}

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
}


export const TransactionList = ({
  transactions,
  loading,
}: TransactionListProps) => {
  const safeTransactions = Array.isArray(transactions)
    ? transactions
    : [];

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
                      {new Date(tx.created_at).toLocaleString()}
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
        )}
      </CardContent>
    </Card>
  );
};
