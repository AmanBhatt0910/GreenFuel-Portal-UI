import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

export const EmployeeInformationStep: React.FC<FormStepProps> = ({
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
  const [loadingDesignations, setLoadingDesignations] = useState<boolean>(false);

  // Log the form data whenever it changes to track prefilled values
  useEffect(() => {
    console.log("EmployeeInformationStep - Current form data:", formData);
    
    // This helps to identify if the plant/department/designation values are populated
    if (formData.plant) {
      console.log("Plant is set to:", formData.plant);
    }
    if (formData.initiateDept) {
      console.log("Department is set to:", formData.initiateDept);
    }
    if (formData.designation) {
      console.log("Designation is set to:", formData.designation);
    }
  }, [formData]);

  // Custom handler for select components
  const handleSelectChange = (name: string, value: string) => {
    console.log(`Dropdown selection changed: ${name} = ${value}`);
    handleChange({
      target: {
        name,
        value,
      },
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  // Fetch business units (plants) when component mounts
  useEffect(() => {
    const fetchBusinessUnits = async () => {
      setLoading(true);
      try {
        console.log("Initial form data state:", JSON.stringify(formData));
        const response = await api.get('business-units/');
        console.log("Fetched business units:", response.data);
        setBusinessUnits(response.data);
        
        // If we already have prefilled plant/business unit, immediately load departments
        if (formData.plant && formData.plant !== 0) {
          console.log("Prefilled plant detected on mount, fetching departments for:", formData.plant);
          try {
            const deptResponse = await api.get(`/departments/?business_unit=${formData.plant}`);
            console.log("Departments for prefilled plant:", deptResponse.data);
            setDepartments(deptResponse.data);
            
            // If we also have a prefilled department, immediately load designations
            if (formData.initiateDept && formData.initiateDept !== 0) {
              console.log("Prefilled department detected on mount:", formData.initiateDept);
              const desigResponse = await api.get(`/designations/?department=${formData.initiateDept}`);
              console.log("Designations for prefilled department:", desigResponse.data);
              setDesignations(desigResponse.data);
            }
          } catch (error) {
            console.error("Error fetching data for prefilled values:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching business units:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessUnits();
  }, []); // Only run once on component mount

  // Fetch departments whenever selected business unit changes (for manual selection)
  useEffect(() => {
    // Skip if this is the initial render or a reset to 0
    if (!formData.plant || formData.plant === 0) return;
    
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        console.log(`User changed business unit to ${formData.plant}, fetching departments...`);
        const response = await api.get(`/departments/?business_unit=${formData.plant}`);
        console.log("Departments data:", response.data);
        setDepartments(response.data);
        
        // If department ID is present but not in the new list, reset it
        if (formData.initiateDept && formData.initiateDept !== 0) {
          const departmentExists = response.data.some((dept: Department) => 
            dept.id.toString() === formData.initiateDept.toString()
          );
          
          if (!departmentExists) {
            console.log("Department not found in new business unit, resetting...");
            handleSelectChange("initiateDept", "0");
            handleSelectChange("designation", "0");
          }
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we're not already in a loading state
    if (!loading) {
      fetchDepartments();
    }
  }, [formData.plant]);

  // Fetch designations whenever selected department changes (for manual selection)
  useEffect(() => {
    // Skip if this is the initial render or a reset to 0
    if (!formData.initiateDept || formData.initiateDept === 0) {
      setDesignations([]);
      return;
    }
    
    const fetchDesignations = async () => {
      setLoadingDesignations(true);
      try {
        console.log(`User changed department to ${formData.initiateDept}, fetching designations...`);
        const response = await api.get(`/designations/?department=${formData.initiateDept}`);
        console.log("Fetched designations:", response.data);
        setDesignations(response.data);
        
        // If designation ID is present but not in the new list, reset it
        if (formData.designation && formData.designation !== 0) {
          const designationExists = response.data.some((desig: Designation) => 
            desig.id.toString() === formData.designation.toString()
          );
          
          if (!designationExists) {
            console.log("Designation not found in new department, resetting...");
            handleSelectChange("designation", "0");
          }
        }
      } catch (error) {
        console.error("Error fetching designations:", error);
        setDesignations([]);
      } finally {
        setLoadingDesignations(false);
      }
    };

    // Only fetch if we're not already in a loading state
    if (!loadingDesignations) {
      fetchDesignations();
    }
  }, [formData.initiateDept]);

  // Track form data changes to ensure we select the correct values in dropdowns
  useEffect(() => {
    const findAndLogSelectedItem = () => {
      // For business unit
      if (formData.plant && formData.plant !== 0 && businessUnits.length > 0) {
        const selectedBusinessUnit = businessUnits.find(
          (bu) => bu.id === Number(formData.plant)
        );
        console.log(
          `Selected business unit: ${selectedBusinessUnit?.name || "Not found"} (ID: ${formData.plant})`
        );
      }

      // For department
      if (formData.initiateDept && formData.initiateDept !== 0 && departments.length > 0) {
        const selectedDepartment = departments.find(
          (dept) => dept.id === Number(formData.initiateDept)
        );
        console.log(
          `Selected department: ${selectedDepartment?.name || "Not found"} (ID: ${formData.initiateDept})`
        );
      }

      // For designation
      if (formData.designation && formData.designation !== 0 && designations.length > 0) {
        const selectedDesignation = designations.find(
          (desig) => desig.id === Number(formData.designation)
        );
        console.log(
          `Selected designation: ${selectedDesignation?.name || "Not found"} (ID: ${formData.designation})`
        );
      }
    };

    // Delay the check slightly to make sure we have the latest data
    const timeoutId = setTimeout(() => {
      findAndLogSelectedItem();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [formData, businessUnits, departments, designations]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

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
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-1 mb-6 bg-white p-6 rounded-lg shadow-sm"
      >
        <h3 className="text-lg font-medium text-gray-900">
          Requestor Summary
        </h3>
        <p className="text-sm text-gray-500">
          Please fill in your requestor details
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="employeeName" className="text-gray-700">Employee Name</Label>
          <Input
            id="employeeName"
            name="employeeName"
            placeholder="Enter your name"
            value={formData.employeeName || ""}
            onChange={handleChange}
            required
            className="bg-white border-gray-200 focus:border-blue-500"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="employeeCode" className="text-gray-700">Employee Code</Label>
          <Input
            id="employeeCode"
            name="employeeCode"
            placeholder="Enter your employee code"
            value={formData.employeeCode || ""}
            onChange={handleChange}
            required
            className="bg-white border-gray-200 focus:border-blue-500"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="plant" className="text-gray-700">Business Unit / Plant</Label>
          <Select
            disabled={loading}
            value={formData.plant ? formData.plant.toString() : "0"}
            onValueChange={(value) => handleSelectChange("plant", value)}
          >
            <SelectTrigger className="bg-white border-gray-200 text-gray-700">
              <SelectValue placeholder={loading ? "Loading..." : "Select Business Unit"} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="0" disabled className="text-gray-400">Select Business Unit</SelectItem>
              {businessUnits.map((bu) => (
                <SelectItem key={bu.id} value={bu.id.toString()} className="text-gray-700">
                  {bu.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="initiateDept" className="text-gray-700">Initiate Department</Label>
          <Select
            disabled={loading || !formData.plant || formData.plant.toString() === "0" || departments.length === 0}
            value={formData.initiateDept ? formData.initiateDept.toString() : "0"}
            onValueChange={(value) => handleSelectChange("initiateDept", value)}
          >
            <SelectTrigger className="bg-white border-gray-200 text-gray-700">
              <SelectValue 
                placeholder={loading 
                  ? "Loading..." 
                  : !formData.plant || formData.plant.toString() === "0"
                    ? "Select Business Unit first" 
                    : "Select Department"} 
              />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="0" disabled className="text-gray-400">Select Department</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id.toString()} className="text-gray-700">
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="designation" className="text-gray-700">Designation</Label>
          <Select
            disabled={loadingDesignations || !formData.initiateDept || formData.initiateDept.toString() === "0"}
            value={formData.designation ? formData.designation.toString() : "0"}
            onValueChange={(value) => handleSelectChange("designation", value)}
          >
            <SelectTrigger className="bg-white border-gray-200 text-gray-700">
              <SelectValue 
                placeholder={loadingDesignations 
                  ? "Loading Designations..." 
                  : !formData.initiateDept || formData.initiateDept.toString() === "0"
                    ? "Select Department first" 
                    : designations.length === 0
                      ? "No designations available"
                      : "Select Designation"} 
              />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="0" disabled className="text-gray-400">Select Designation</SelectItem>
              {designations.map((designation) => (
                <SelectItem key={designation.id} value={designation.id.toString()} className="text-gray-700">
                  {designation.name}
                </SelectItem>
              ))}
              {!loadingDesignations && formData.initiateDept && designations.length === 0 && (
                <div className="px-2 py-1 text-sm text-gray-500">No designations available</div>
              )}
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="date" className="text-gray-700">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                id="date"
                disabled
                className={cn(
                  "w-full flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 h-10",
                )}
              >
                {formData.date ? format(new Date(formData.date), "PPP") : <span>Select date</span>}
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
              <Calendar
                mode="single"
                selected={formData.date ? new Date(formData.date) : undefined}
                onSelect={(date) => {
                  if (date) {
                    handleChange({
                      target: {
                        name: "date",
                        value: format(date, "yyyy-MM-dd"),
                      },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }
                }}
                disabled
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};