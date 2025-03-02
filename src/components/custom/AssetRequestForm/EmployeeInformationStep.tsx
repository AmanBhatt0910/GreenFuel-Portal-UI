import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slideVariants } from "./animations";
import { FormStepProps } from "./types";

export const EmployeeInformationStep: React.FC<FormStepProps> = ({
  formData,
  handleChange,
  direction,
}) => {
  return (
    <motion.div
      key="step1"
      custom={direction}
      variants={slideVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="space-y-1 mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Employee Information
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please fill in your employee details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="employeeCode"
            className="text-sm font-medium"
          >
            Employee Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="employeeCode"
            name="employeeCode"
            value={formData.employeeCode}
            autoFocus
            onChange={handleChange}
            placeholder="Enter your employee code"
            className="h-10 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-100 dark:focus:border-blue-100"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="employeeName"
            className="text-sm font-medium"
          >
            Employee Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="employeeName"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="h-10 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-100 dark:focus:border-blue-100"

          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="department"
            className="text-sm font-medium"
          >
            Department <span className="text-red-500">*</span>
          </Label>
          <Input
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Enter your department"
            className="h-10 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-100 dark:focus:border-blue-100"

          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="designation"
            className="text-sm font-medium"
          >
            Designation <span className="text-red-500">*</span>
          </Label>
          <Input
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Enter your designation"
            className="h-10 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-100 dark:focus:border-blue-100"

          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="plant"
            className="text-sm font-medium"
          >
            Plant <span className="text-red-500">*</span>
          </Label>
          <Input
            id="plant"
            name="plant"
            value={formData.plant}
            onChange={handleChange}
            placeholder="Enter your plant"
            className="h-10 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-100 dark:focus:border-blue-100"

          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium">
            Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="h-10 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-100 dark:focus:border-blue-100"

          />
        </div>
      </div>
    </motion.div>
  );
};
