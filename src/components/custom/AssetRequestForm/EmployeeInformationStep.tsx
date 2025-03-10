import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slideVariants } from "./animations";
import { FormStepProps } from "./types";
import useAxios from "@/app/hooks/use-axios";
import { Checkbox } from "@/components/ui/checkbox";

interface BusinessUnit {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
  business_unit: number;
}

export const EmployeeInformationStep: React.FC<FormStepProps> = ({
  formData,
  handleChange,
  handleCheckboxChange,
  direction,
}) => {
  const api = useAxios();
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch business units (plants) when component mounts
  useEffect(() => {
    const fetchBusinessUnits = async () => {
      setLoading(true);
      try {
        const response = await api.get('business-units/');
        // console.log(response.data)
        setBusinessUnits(response.data);
      } catch (error) {
        console.error("Error fetching business units:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessUnits();
  }, []);

  // Fetch departments whenever selected business unit changes
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!formData.plant) return;
      
      setLoading(true);
      try {
        const response = await api.get(`/departments/?business_unit=${formData.plant}`);
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [formData.plant]);

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
          Requestor Summary
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please fill in your requestor details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="employeeName">Employee Name</Label>
          <Input
            id="employeeName"
            name="employeeName"
            placeholder="Enter your name"
            disabled
            value={formData.employeeName || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="employeeCode">Employee Code</Label>
          <Input
            id="employeeCode"
            name="employeeCode"
            placeholder="Enter your employee code"
            value={formData.employeeCode || ""}
            disabled
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="plant">Business Unit / Plant</Label>
          <select
            id="plant"
            name="plant"
            value={formData.plant || ""}
            onChange={handleChange}
            disabled={loading || businessUnits.length === 0}
            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-100 dark:focus:border-blue-100"
          >
            <option value="">
              {loading ? "Loading..." : "Select Business Unit"}
            </option>
            {businessUnits.map((bu) => (
              <option key={bu.id} value={bu.id}>
                {bu.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="initiateDept">Initiate Department</Label>
          <select
            id="initiateDept"
            name="initiateDept"
            value={formData.initiateDept || ""}
            onChange={handleChange}
            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-100 dark:focus:border-blue-100"
          >
            <option value="">Select Initiate Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <select
            id="department"
            name="department"
            value={formData.department || ""}
            onChange={handleChange}
            disabled={loading || !formData.plant || departments.length === 0}
            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-100 dark:focus:border-blue-100"
          >
            <option value="">
              {loading 
                ? "Loading..." 
                : !formData.plant 
                  ? "Select Business Unit first" 
                  : "Select Department"}
            </option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div> */}

        {/* <div className="space-y-2">
          <Label htmlFor="designation">Designation</Label>
          <Input
            id="designation"
            name="designation"
            placeholder="Enter your designation"
            value={formData.designation || ""}
            onChange={handleChange}
            required
          />
        </div> */}

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date || ""}
            disabled
            onChange={handleChange}
            required
          />
        </div>
        
        

        {/* <div className="space-y-2">
          <Label htmlFor="currentStatus">Current Status</Label>
          <Input
            id="currentStatus"
            name="currentStatus"
            placeholder="Enter current status"
            value={formData.currentStatus || ""}
            onChange={handleChange}
            required
          />
        </div> */}

      </div>

      {/* <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="policyAgreement"
            checked={formData.policyAgreement === true}
            onCheckedChange={(checked) => {
              if (handleCheckboxChange) {
                handleCheckboxChange("policyAgreement");
              }
            }}
          />
          <Label
            htmlFor="policyAgreement"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the company asset policy
          </Label>
        </div>
      </div> */}

    </motion.div>
  );
};