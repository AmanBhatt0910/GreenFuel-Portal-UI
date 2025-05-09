import { CheckCircle, FileText, XCircle } from "lucide-react";
import React from "react";

const RequestDetailsSection: React.FC<{ request: any }> = React.memo(
  ({ request }) => {

    return (
      <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="font-medium text-indigo-800 mb-4 text-lg flex items-center">
          <FileText className="h-5 w-5 mr-2 text-indigo-600" />
          Request Details
        </h3>
        <div className="space-y-4">
          <div className="bg-white p-3 rounded-md border border-indigo-100">
            <p className="text-sm font-medium text-indigo-700">
              Reason for Request
            </p>
            <p className="text-base text-gray-900 whitespace-pre-line mt-1">
              {request.reason}
            </p>
          </div>
          <div className="bg-white p-3 rounded-md border border-indigo-100">
            <p className="text-sm font-medium text-indigo-700">
              Benefit to Organization
            </p>
            <p className="text-base text-gray-900 whitespace-pre-line mt-1">
              {request.benefit_to_organisation}
            </p>
          </div>
          <div className="bg-white p-3 rounded-md border border-indigo-100">
            <p className="text-sm font-medium text-indigo-700">
              Payback Period
            </p>
            <p className="text-base text-gray-900 whitespace-pre-line mt-1">
              {request.payback_period}
            </p>
          </div>
          <div className="bg-white p-3 rounded-md border border-indigo-100">
            <p className="text-sm font-medium text-indigo-700">
              Document enclosed summary
            </p>
            <p className="text-base text-gray-900 whitespace-pre-line mt-1">
              {request.document_enclosed_summary}
            </p>
          </div>
          <div className="bg-white p-3 rounded-md border border-indigo-100">
            <p className="text-sm font-medium text-indigo-700">
              Policy Agreement
            </p>
            <p className="text-base mt-1">
              {request.policy_agreement ? (
                <span className="text-green-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" /> Agreed
                </span>
              ) : (
                <span className="text-red-600 flex items-center">
                  <XCircle className="h-4 w-4 mr-1" /> Not Agreed
                </span>
              )}
            </p>
          </div>
          {request.rejected && (
            <div className="bg-red-50 p-3 rounded-md border border-red-100">
              <p className="text-sm font-medium text-red-500">
                Rejection Reason
              </p>
              <p className="text-base text-red-600 whitespace-pre-line mt-1">
                {request.rejection_reason}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

RequestDetailsSection.displayName = "RequestDetailsSection";

export default RequestDetailsSection;
