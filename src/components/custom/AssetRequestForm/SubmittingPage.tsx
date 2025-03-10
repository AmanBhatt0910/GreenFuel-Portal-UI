import { AlertCircle, Check, FileCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import Link from 'next/link'

const SubmittingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-4xl mx-auto p-6 rounded-xl bg-gradient-to-b from-white to-green-50 dark:from-gray-800 dark:to-green-900/40 shadow-lg border border-green-100 dark:border-green-900/50">
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-green-400/20 dark:bg-green-500/10 rounded-full animate-ping opacity-75"></div>
      <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800/40 dark:to-green-700/40 rounded-full shadow-inner">
        <Check
          className="h-12 w-12 text-green-600 dark:text-green-400"
          strokeWidth={3}
        />
      </div>
    </div>

    <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white text-center">
      Asset Request Submitted
    </h2>

    <div className="flex items-center mb-6 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg">
      <FileCheck className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
      <p className="text-sm font-medium text-green-800 dark:text-green-300">
        Request #{requestId}
      </p>
    </div>

    {/* Submission Details Card */}
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        Submission Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Submitted By
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formData.employeeName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Employee Code
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formData.employeeCode}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Department
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formData.department}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Submission Date
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {format(new Date(), "MMMM dd, yyyy")}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Plant Location
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formData.plant}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Current Status
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formData.currentStatus || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Assets Summary */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
          Asset Summary
        </h4>

        {formData.assets.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Asset
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Qty
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Unit Price
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {formData.assets.map((asset, index) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-gray-50 dark:bg-gray-700"
                    }
                  >
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {asset.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {asset.description || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                      {asset.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-right">
                      {formatCurrency(Number(asset.pricePerUnit))}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right font-medium">
                      {formatCurrency(Number(asset.total))}
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-50 dark:bg-blue-900/20 font-medium">
                  <td
                    colSpan={4}
                    className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right"
                  >
                    Total Amount:
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-700 dark:text-blue-400 text-right font-bold">
                    {formatCurrency(Number(formData.assetAmount))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No assets requested
          </p>
        )}
      </div>

      {/* Request Reason */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          Request Reason
        </h4>
        <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
          {formData.reason}
        </p>
      </div>

      {/* Timeline */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
          Estimated Timeline
        </h4>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>

          {/* Current status */}
          <div className="relative flex items-center mb-6">
            <div className="absolute left-8 -ml-3 h-6 w-6 rounded-full border-2 border-blue-500 bg-white dark:bg-gray-800 z-10"></div>
            <div className="absolute left-8 -ml-2.5 h-5 w-5 rounded-full bg-blue-500 animate-pulse z-20"></div>
            <div className="ml-12">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Current Status
              </p>
              <div className="flex items-center mt-1 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Pending Approval
                </p>
              </div>
            </div>
          </div>

          {/* Upcoming stages */}
          <div className="relative flex items-center mb-6">
            <div className="absolute left-8 -ml-2.5 h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-600 z-10"></div>
            <div className="ml-12">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Management Approval
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Expected by {timeline.approval}
              </p>
            </div>
          </div>

          <div className="relative flex items-center mb-6">
            <div className="absolute left-8 -ml-2.5 h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-600 z-10"></div>
            <div className="ml-12">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Processing & Procurement
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Expected by {timeline.processing}
              </p>
            </div>
          </div>

          <div className="relative flex items-center">
            <div className="absolute left-8 -ml-2.5 h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-600 z-10"></div>
            <div className="ml-12">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Delivery & Handover
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Expected by {timeline.delivery}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Request Note */}
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div className="flex">
          <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-yellow-500 dark:text-yellow-400" />
          <div>
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
              Important Note
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Your asset request will be reviewed by your department head
              and the procurement team. You'll receive email notifications
              about the status updates.
            </p>
          </div>
        </div>
      </div>
    </div>

    <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-2xl">
      Thank you for submitting your asset request. The request has been
      logged in our system and is now pending approval. You can track the
      status of your request using the reference number above.
    </p>

    <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-xl">
      <Button
        onClick={resetForm}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md transition-all duration-200 flex items-center justify-center"
      >
        <FileCheck className="h-4 w-4 mr-2" />
        Submit Another Request
      </Button>

      <Link href="/dashboard">
        <Button
          variant="outline"
          className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex items-center justify-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  </div>
  )
}

export default SubmittingPage