import React, { useContext, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slideVariants } from "./animations";
import { FormStepProps } from "./types";
import useAxios from "@/app/hooks/use-axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { GFContext } from "@/context/AuthContext";

interface BusinessUnit {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
  business_unit: number;
}

interface Designation {
  id: number;
  name: string;
  department: number;
}

export const EmployeeInformationStep: React.FC<FormStepProps> = React.memo(({
  formData,
  handleChange,
  handleCheckboxChange,
  direction,
}) => {
  const api = useAxios();
  const { userInfo } = useContext(GFContext);

  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDepts, setLoadingDepts] = useState<boolean>(false);
  const [loadingDesigs, setLoadingDesigs] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(() => {
    // Initialize with form data date or current date
    return formData.date ? new Date(formData.date) : new Date();
  });

  const handleSelectChange = (name: string, value: string) => {
    // console.log(`Dropdown selection changed: ${name} = ${value}`);
    
    // Create a batch update object to minimize re-renders
    const updates: any = {};
    updates[name] = value;
    
    // Reset dependent dropdowns when parent changes
    if (name === "plant") {
      // Only reset if changing to a different business unit
      if (value !== formData.plant?.toString()) {
        updates.initiateDept = "0";
        updates.designation = "0";
      }
    } else if (name === "initiateDept") {
      // Only reset designation if changing to a different department
      if (value !== formData.initiateDept?.toString()) {
        updates.designation = "0";
      }
    }
    
    // Apply all updates at once
    Object.keys(updates).forEach(key => {
      handleChange({
        target: { name: key, value: updates[key] },
      } as React.ChangeEvent<HTMLSelectElement>);
    });
  };

  // Fetch business units on component mount
  useEffect(() => {
    const fetchBusinessUnits = async () => {
      setLoading(true);
      try {
        const response = await api.get("business-units/");
        setBusinessUnits(response.data);
      } catch (error) {
        console.error("Error fetching business units:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinessUnits();
  }, []);

  // Fetch departments when business unit changes
  useEffect(() => {
    if (!formData.plant || formData.plant === 0) {
      setDepartments([]);
      return;
    }

    const fetchDepartments = async () => {
      setLoadingDepts(true);
      try {
        const response = await api.get(`/departments/?business_unit=${formData.plant}`);
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartments([]);
      } finally {
        setLoadingDepts(false);
      }
    };

    fetchDepartments();
  }, [formData.plant]);

  // Fetch designations when department changes
  useEffect(() => {
    if (!formData.initiateDept || formData.initiateDept === 0) {
      setDesignations([]);
      return;
    }

    const fetchDesignations = async () => {
      setLoadingDesigs(true);
      try {
        const response = await api.get(`/designations/?department=${formData.initiateDept}`);
        setDesignations(response.data);
      } catch (error) {
        console.error("Error fetching designations:", error);
        setDesignations([]);
      } finally {
        setLoadingDesigs(false);
      }
    };

    fetchDesignations();
  }, [formData.initiateDept]);

  // Memoize the select options to prevent re-renders
  const businessUnitOptions = useMemo(() => 
    businessUnits.map((unit) => (
      <SelectItem key={unit.id} value={unit.id.toString()}>
        {unit.name}
      </SelectItem>
    )), [businessUnits]
  );

  const departmentOptions = useMemo(() => 
    departments.map((dept) => (
      <SelectItem key={dept.id} value={dept.id.toString()}>
        {dept.name}
      </SelectItem>
    )), [departments]
  );

  const designationOptions = useMemo(() => 
    designations.map((desig) => (
      <SelectItem key={desig.id} value={desig.id.toString()}>
        {desig.name}
      </SelectItem>
    )), [designations]
  );

  // Sync date state with form data
  useEffect(() => {
    if (formData.date) {
      const formDate = new Date(formData.date);
      setDate(formDate);
    }
  }, [formData.date]);

  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="space-y-6"
    >

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employee Name */}
        <div className="space-y-2">
          <Label htmlFor="employeeName" className="text-sm font-medium">
            Employee Name
          </Label>
          <Input
            id="employeeName"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            placeholder="Enter employee name"
            className="border-gray-300 focus:border-blue-500"
            disabled
          />
        </div>

        {/* Employee Code */}
        <div className="space-y-2">
          <Label htmlFor="employeeCode" className="text-sm font-medium">
            Employee Code
          </Label>
          <Input
            id="employeeCode"
            name="employeeCode"
            value={formData.employeeCode}
            onChange={handleChange}
            placeholder="Enter employee code"
            className="border-gray-300 focus:border-blue-500"
            disabled
          />
        </div>

        {/* Business Unit / Plant */}
        <div className="space-y-2">
          <Label htmlFor="plant" className="text-sm font-medium">
            Business Unit / Plant <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.plant ? formData.plant.toString() : ""}
            onValueChange={(value) => handleSelectChange("plant", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Business Unit" />
            </SelectTrigger>
            <SelectContent>
              {businessUnitOptions}
            </SelectContent>
          </Select>
        </div>

        {/* Initiate Department */}
        <div className="space-y-2">
          <Label htmlFor="initiateDept" className="text-sm font-medium">
            Initiate Department <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.initiateDept ? formData.initiateDept.toString() : ""}
            onValueChange={(value) => handleSelectChange("initiateDept", value)}
            disabled={!formData.plant || formData.plant === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue 
                placeholder={
                  loadingDepts 
                    ? "Loading departments..." 
                    : !formData.plant || formData.plant === 0 
                      ? "Select Business Unit First" 
                      : "Select Department"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              {departmentOptions}
            </SelectContent>
          </Select>
        </div>

        {/* Designation */}
        <div className="space-y-2">
          <Label htmlFor="designation" className="text-sm font-medium">
            Designation <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.designation ? formData.designation.toString() : ""}
            onValueChange={(value) => handleSelectChange("designation", value)}
            disabled={!formData.initiateDept || formData.initiateDept === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue 
                placeholder={
                  loadingDesigs 
                    ? "Loading designations..." 
                    : !formData.initiateDept || formData.initiateDept === 0 
                      ? "Select Department First" 
                      : "Select Designation"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              {designationOptions}
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium">
            Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative">
                <Input
                  id="date"
                  name="date"
                  value={date ? format(date, "PPP") : ""}
                  placeholder="Select date"
                  className="border-gray-300 focus:border-blue-500 cursor-pointer pr-10"
                  readOnly
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    setDate(selectedDate);
                    handleChange({
                      target: {
                        name: "date",
                        value: format(selectedDate, "yyyy-MM-dd"),
                      },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {(loading || loadingDepts || loadingDesigs) && (
        <div className="flex justify-center items-center py-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
          <span className="ml-2 text-xs text-gray-500">
            Loading...
          </span>
        </div>
      )}

      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Note:</strong> Please select your Business Unit first, then Department, and finally your Designation. Each field depends on the previous selection.
        </p>
      </div>
    </motion.div>
  );
});
