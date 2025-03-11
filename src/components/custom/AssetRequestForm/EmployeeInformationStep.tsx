import React, { useEffect, useState } from "react";
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
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Custom handler for select components
  const handleSelectChange = (name: string, value: string) => {
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
        const response = await api.get('business-units/');
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

  // Fetch designations whenever selected department changes
  useEffect(() => {
    const fetchDesignations = async () => {
      if (!formData.initiateDept) return;
      
      setLoading(true);
      try {
        const response = await api.get(`/designations/?department=${formData.initiateDept}`);
        setDesignations(response.data);
      } catch (error) {
        console.error("Error fetching designations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDesignations();
  }, [formData.initiateDept]);

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
            disabled
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
            disabled
            onChange={handleChange}
            required
            className="bg-white border-gray-200 focus:border-blue-500"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="plant" className="text-gray-700">Business Unit / Plant</Label>
          <Select
            disabled={loading || businessUnits.length === 0}
            value={formData.plant.toString()}
            onValueChange={(value) => handleSelectChange("plant", value)}
          >
            <SelectTrigger className="bg-white border-gray-200 text-gray-700">
              <SelectValue placeholder={loading ? "Loading..." : "Select Business Unit"} />
            </SelectTrigger>
            <SelectContent className="bg-white">
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
            disabled={loading || !formData.plant || departments.length === 0}
            value={formData.initiateDept.toString()}
            onValueChange={(value) => handleSelectChange("initiateDept", value)}
          >
            <SelectTrigger className="bg-white border-gray-200 text-gray-700">
              <SelectValue 
                placeholder={loading 
                  ? "Loading..." 
                  : !formData.plant 
                    ? "Select Business Unit first" 
                    : "Select Initiate Department"} 
              />
            </SelectTrigger>
            <SelectContent className="bg-white">
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
            disabled={loading || !formData.initiateDept || designations.length === 0}
              value={formData.designation.toString()}
            onValueChange={(value) => handleSelectChange("designation", value)}
          >
            <SelectTrigger className="bg-white border-gray-200 text-gray-700">
              <SelectValue 
                placeholder={loading 
                  ? "Loading..." 
                  : !formData.initiateDept 
                    ? "Select Department first" 
                    : "Select Designation"} 
              />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {designations.map((designation) => (
                <SelectItem key={designation.id} value={designation.id.toString()} className="text-gray-700">
                  {designation.name}
                </SelectItem>
              ))}
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