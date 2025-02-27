"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

const steps = [
  "Basic Information",
  "Asset Request",
  "Additional Details",
  "Approvals & Confirmations",
];

const ComputerItemRequestForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    plant: "",
    date: "",
    employeeCode: "",
    employeeName: "",
    department: "",
    designation: "",
    assets: [] as string[],
    assetAmount: "",
    assetSpecification: "",
    reason: "",
    approvals: {
      requesterSignature: "",
      hodSignature: "",
      financeHeadApproval: "",
      itHeadApproval: "",
      cfoApproval: "",
    },
  });

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.plant) newErrors.plant = "Plant is required";
      if (!formData.date) newErrors.date = "Date is required";
      if (!formData.employeeCode) newErrors.employeeCode = "Employee Code is required";
      if (!formData.employeeName) newErrors.employeeName = "Employee Name is required";
      if (!formData.department) newErrors.department = "Department is required";
      if (!formData.designation) newErrors.designation = "Designation is required";
    } else if (step === 2) {
      if (formData.assets.length === 0) newErrors.assets = "Select at least one asset";
    } else if (step === 3) {
      if (!formData.assetAmount) newErrors.assetAmount = "Asset Amount is required";
      if (!formData.assetSpecification) newErrors.assetSpecification = "Asset Specification is required";
      if (!formData.reason) newErrors.reason = "Reason is required";
    } else if (step === 4) {
      if (!formData.approvals.requesterSignature) newErrors.requesterSignature = "Requester Signature is required";
      if (!formData.approvals.hodSignature) newErrors.hodSignature = "HOD Signature is required";
      if (!formData.approvals.financeHeadApproval) newErrors.financeHeadApproval = "Finance Head Approval is required";
      if (!formData.approvals.itHeadApproval) newErrors.itHeadApproval = "IT Head Approval is required";
      if (!formData.approvals.cfoApproval) newErrors.cfoApproval = "CFO Approval is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateStep(step)) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep(5);
      }, 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <Card className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-indigo-600 p-6">
          <CardTitle className="text-white text-2xl font-bold">
            Computer Item Request Form
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-10">
          <div className="mb-8">
            <Progress value={(step / steps.length) * 100} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              {steps.map((label, index) => (
                <span key={label} className={step > index + 1 ? "text-indigo-600" : ""}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: step > 5 ? 0 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: step > 5 ? 0 : -50 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label>Plant</Label>
                    <Input
                      value={formData.plant}
                      onChange={(e) => setFormData({ ...formData, plant: e.target.value })}
                      className="mt-1"
                    />
                    {errors.plant && <p className="text-red-500 text-sm mt-1">{errors.plant}</p>}
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="mt-1"
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                  </div>
                  <div>
                    <Label>Employee Code</Label>
                    <Input
                      value={formData.employeeCode}
                      onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                      className="mt-1"
                    />
                    {errors.employeeCode && <p className="text-red-500 text-sm mt-1">{errors.employeeCode}</p>}
                  </div>
                  <div>
                    <Label>Employee Name</Label>
                    <Input
                      value={formData.employeeName}
                      onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                      className="mt-1"
                    />
                    {errors.employeeName && <p className="text-red-500 text-sm mt-1">{errors.employeeName}</p>}
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Input
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="mt-1"
                    />
                    {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
                  </div>
                  <div>
                    <Label>Designation</Label>
                    <Input
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="mt-1"
                    />
                    {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation}</p>}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["Desktop", "Laptop", "Printer", "Headphone", "Mouse", "Monitor", "MS Office License", "SAP ID"].map((asset) => (
                    <div key={asset} className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData.assets.includes(asset)}
                        onCheckedChange={(checked) => {
                          setFormData({
                            ...formData,
                            assets: checked
                              ? [...formData.assets, asset]
                              : formData.assets.filter((a) => a !== asset),
                          });
                        }}
                        className="text-indigo-600 border-indigo-600"
                      />
                      <Label>{asset}</Label>
                    </div>
                  ))}
                  {errors.assets && <p className="text-red-500 text-sm mt-1">{errors.assets}</p>}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label>Asset Amount</Label>
                    <Input
                      value={formData.assetAmount}
                      onChange={(e) => setFormData({ ...formData, assetAmount: e.target.value })}
                      className="mt-1"
                    />
                    {errors.assetAmount && <p className="text-red-500 text-sm mt-1">{errors.assetAmount}</p>}
                  </div>
                  <div>
                    <Label>Asset Specification</Label>
                    <Input
                      value={formData.assetSpecification}
                      onChange={(e) => setFormData({ ...formData, assetSpecification: e.target.value })}
                      className="mt-1"
                    />
                    {errors.assetSpecification && <p className="text-red-500 text-sm mt-1">{errors.assetSpecification}</p>}
                  </div>
                  <div>
                    <Label>Reason for Requested Asset</Label>
                    <Textarea
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="mt-1"
                    />
                    {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Object.entries(formData.approvals).map(([key, value]) => (
                    <div key={key}>
                      <Label>{key.replace(/([A-Z])/g, " $1").trim()}</Label>
                      <Input
                        value={value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            approvals: { ...formData.approvals, [key]: e.target.value },
                          })
                        }
                        className="mt-1"
                      />
                      {errors[key] && <p className="text-red-500 text-sm mt-1">{errors[key]}</p>}
                    </div>
                  ))}
                </div>
              )}

              {step === 5 && (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                  <h2 className="text-2xl font-bold text-indigo-800">Submission Successful!</h2>
                  <p className="text-gray-600">Your request has been submitted successfully.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-10">
            {step > 1 && step < 5 && (
              <Button onClick={prevStep} variant="outline" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
            )}
            {step < 4 ? (
              <Button onClick={nextStep} className="flex items-center space-x-2">
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : step === 4 ? (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center space-x-2 bg-green-600 hover:bg-green-700">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComputerItemRequestForm;