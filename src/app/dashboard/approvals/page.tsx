"use client";

import React, { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import FullFormModal from "./FullFormModal";

interface Asset {
  name: string;
  quantity: number;
}

interface FormDetails {
  plant: number;
  date: string;
  employeeCode: string;
  employeeName: string;
  department: number;
  designation: number;
  assets: Asset[];
  assetAmount: string;
  reason: string;
  policyAgreement: boolean;
  initiateDept: number;
  currentStatus: string;
  benefitToOrg: string;
  approvalCategory: string;
  approvalType: string;
  notifyTo: number;
}

interface ApprovalForm {
  id: string;
  submitter: string;
  department: string;
  status: string;
  level: number;
  updatedAt: string;
  formData: FormDetails;
}

const mockForms: ApprovalForm[] = [
  {
    id: "REQ-2025-006",
    submitter: "Aman Bhatt",
    department: "HR",
    status: "Pending",
    level: 2,
    updatedAt: "2025-03-10",
    formData: {
      plant: 101,
      date: "2025-03-10",
      employeeCode: "EMP001",
      employeeName: "Aman Bhatt",
      department: 2,
      designation: 5,
      assets: [{ name: "Laptop", quantity: 1 }],
      assetAmount: "1200 USD",
      reason: "Remote work requirement",
      policyAgreement: true,
      initiateDept: 2,
      currentStatus: "Pending",
      benefitToOrg: "Increased productivity",
      approvalCategory: "Hardware",
      approvalType: "New Request",
      notifyTo: 3,
    },
  },
];

const ApprovalDashboard: React.FC = () => {
  const [comments, setComments] = useState<{ [key: string]: string }>({});

  const handleAction = (id: string, action: "approve" | "reject") => {
    console.log(`Form ID: ${id}, Action: ${action.toUpperCase()}, Comment: ${comments[id]}`);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen overflow-y-auto">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Pending Approvals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockForms.map((form) => (
          <Card key={form.id} className="shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <CardHeader>
              <CardTitle>{form.id}</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">Submitted by: {form.submitter} ({form.department})</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">Level: {form.level}</p>
              <p className="text-gray-700 dark:text-gray-300">Last Updated: {form.updatedAt}</p>
              <Textarea
                placeholder="Add a note (required)"
                value={comments[form.id] || ""}
                onChange={(e) => setComments({ ...comments, [form.id]: e.target.value })}
                className="resize-none border border-gray-300 dark:border-gray-600 rounded-lg"
              />
              <div className="flex justify-between gap-2">
                <Button className="bg-green-500 hover:bg-green-600 text-white flex-1" onClick={() => handleAction(form.id, "approve")} disabled={!comments[form.id]}>
                  <CheckCircle className="w-5 h-5 mr-2" /> Approve
                </Button>
                <Button className="bg-red-500 hover:bg-red-600 text-white flex-1" onClick={() => handleAction(form.id, "reject")} disabled={!comments[form.id]}>
                  <XCircle className="w-5 h-5 mr-2" /> Reject
                </Button>
              </div>
              <FullFormModal formData={form.formData} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApprovalDashboard;
