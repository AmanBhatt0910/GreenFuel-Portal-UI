"use client";

import { useState, useCallback, memo, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import useAxios from "@/app/hooks/use-axios";
import { toast } from "@/lib/toast-util";
import { ROLES } from "@/lib/roles";
import { CredentialFormData, CredentialFormProps, Department, Designation, BusinessUnit, FormFieldProps } from "./types";


// Optimize FormField with better memoization and equality checking
const FormField = memo(({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  helperText = "",
  disabled = false,
}: FormFieldProps) => {
  // Convert value to string only once
  const stringValue = useMemo(() => {
    return value === null || value === undefined ? "" : String(value);
  }, [value]);
  
  // Memoize the input handler to prevent recreating on each render
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  }, [onChange]);
  
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={stringValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full"
        required={required}
        disabled={disabled}
      />
      {helperText && (
        <div className="text-xs text-gray-500">{helperText}</div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom equality check to prevent unnecessary re-renders
  return (
    prevProps.value === nextProps.value &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.name === nextProps.name
  );
});
FormField.displayName = "FormField";

// Select field component
interface SelectFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (name: string, value: string) => void;
  options: Array<{ id: string | number; name: string }>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const SelectField = memo(({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "",
  required = false,
  disabled = false,
}: SelectFieldProps) => {
  // Memoize the string value to prevent recalculation
  const stringValue = useMemo(() => {
    return value !== null && value !== undefined ? value.toString() : undefined;
  }, [value]);
  
  // Memoize the change handler
  const handleValueChange = useCallback((newValue: string) => {
    onChange(name, newValue);
  }, [name, onChange]);
  
  // Memoize filtered options to prevent filtering on every render
  const filteredOptions = useMemo(() => {
    return options.filter((option) => option.name && option.name.trim() !== "");
  }, [options]);
  
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Select
        value={stringValue}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="placeholder">Select...</SelectItem>
          {filteredOptions.map((option) => (
            <SelectItem
              key={option.id.toString()}
              value={option.id.toString()}
            >
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom equality check to prevent unnecessary re-renders
  return (
    prevProps.value === nextProps.value &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.name === nextProps.name &&
    prevProps.options.length === nextProps.options.length
  );
});
SelectField.displayName = "SelectField";

// Cascading dropdown component
interface CascadingDropdownProps {
  businessUnits: BusinessUnit[];
  departments: Department[];
  designations: Designation[];
  selectedBusinessUnit: number | null;
  selectedDepartment: number | null;
  selectedDesignation: number | null;
  onBusinessUnitChange: (value: number | null) => void;
  onDepartmentChange: (value: number | null) => void;
  onDesignationChange: (value: number | null) => void;
  isLoading: boolean;
}

// Optimize CascadingDropdowns with better memoization
const CascadingDropdowns = memo(({
  businessUnits,
  departments,
  designations,
  selectedBusinessUnit,
  selectedDepartment,
  selectedDesignation,
  onBusinessUnitChange,
  onDepartmentChange,
  onDesignationChange,
  isLoading,
}: CascadingDropdownProps) => {
  // Memoize the business unit string value
  const businessUnitValue = useMemo(() => {
    return selectedBusinessUnit !== null && selectedBusinessUnit !== undefined 
      ? selectedBusinessUnit.toString() 
      : undefined;
  }, [selectedBusinessUnit]);
  
  // Memoize the department string value
  const departmentValue = useMemo(() => {
    return selectedDepartment !== null && selectedDepartment !== undefined 
      ? selectedDepartment.toString() 
      : undefined;
  }, [selectedDepartment]);
  
  // Memoize the designation string value
  const designationValue = useMemo(() => {
    return selectedDesignation !== null && selectedDesignation !== undefined 
      ? selectedDesignation.toString() 
      : undefined;
  }, [selectedDesignation]);
  
  // Filter departments based on selected business unit
  const filteredDepartments = useMemo(() => {
    if (!selectedBusinessUnit) return [];
    return departments.filter(
      (dept) => dept.business_unit === selectedBusinessUnit
    );
  }, [departments, selectedBusinessUnit]);

  // Filter designations based on selected department
  const filteredDesignations = useMemo(() => {
    if (!selectedDepartment) return [];
    return designations.filter(
      (desig) => desig.department === selectedDepartment
    );
  }, [designations, selectedDepartment]);
  
  // Memoize handlers to prevent recreation on each render
  const handleBusinessUnitValueChange = useCallback((value: string) => {
    onBusinessUnitChange(value ? parseInt(value, 10) : null);
    // Reset department and designation when business unit changes
    onDepartmentChange(null);
    onDesignationChange(null);
  }, [onBusinessUnitChange, onDepartmentChange, onDesignationChange]);
  
  const handleDepartmentValueChange = useCallback((value: string) => {
    onDepartmentChange(value ? parseInt(value, 10) : null);
    // Reset designation when department changes
    onDesignationChange(null);
  }, [onDepartmentChange, onDesignationChange]);
  
  const handleDesignationValueChange = useCallback((value: string) => {
    onDesignationChange(value ? parseInt(value, 10) : null);
  }, [onDesignationChange]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Label htmlFor="business_unit" className="text-sm font-medium">
          Business Unit / Plant
        </Label>
        <Select
          value={businessUnitValue}
          onValueChange={handleBusinessUnitValueChange}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Business Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="placeholder">Select...</SelectItem>
            {businessUnits.map((bu) => (
              <SelectItem key={bu.id.toString()} value={bu.id.toString()}>
                {bu.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="department" className="text-sm font-medium">
          Department
        </Label>
        <Select
          value={departmentValue}
          onValueChange={handleDepartmentValueChange}
          disabled={!selectedBusinessUnit || isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                selectedBusinessUnit
                  ? "Select Department"
                  : "Select Business Unit first"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="placeholder">Select...</SelectItem>
            {filteredDepartments.map((dept) => (
              <SelectItem key={dept.id.toString()} value={dept.id.toString()}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="designation" className="text-sm font-medium">
          Designation
        </Label>
        <Select
          value={designationValue}
          onValueChange={handleDesignationValueChange}
          disabled={!selectedDepartment || isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                selectedDepartment
                  ? "Select Designation"
                  : "Select Department first"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="placeholder">Select...</SelectItem>
            {filteredDesignations.map((desig) => (
              <SelectItem
                key={desig.id.toString()}
                value={desig.id.toString()}
              >
                {desig.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom equality check to prevent unnecessary re-renders
  return (
    prevProps.selectedBusinessUnit === nextProps.selectedBusinessUnit &&
    prevProps.selectedDepartment === nextProps.selectedDepartment &&
    prevProps.selectedDesignation === nextProps.selectedDesignation &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.businessUnits.length === nextProps.businessUnits.length &&
    prevProps.departments.length === nextProps.departments.length &&
    prevProps.designations.length === nextProps.designations.length
  );
});
CascadingDropdowns.displayName = "CascadingDropdowns";

function CredentialFormContent({
  isOpen,
  onClose,
  selectedUser,
  onSubmit,
  departments = [],
  businessUnits = [],
  designations = [],
  isLoading = false,
}: CredentialFormProps) {
  // Internal form state management aligned with API response
  const [formData, setFormData] = useState<CredentialFormData>({
    username: "",
    email: "",
    name: "",
    employee_code: "",
    department: null,
    designation: null,
    business_unit: null,
    status: true,
    dob: null,
    contact: null,
    address: null,
    city: null,
    state: null,
    country: null,
    first_name: "",
    last_name: "",
    is_active: true,
    is_staff: false,
    is_superuser: false,
    is_budget_requester: false,
    role: null,
  });

  const [activeTab, setActiveTab] = useState<"basic" | "contact">("basic");
  const [loadedDesignations, setLoadedDesignations] = useState<Designation[]>([]);
  const [loadedBusinessUnits, setLoadedBusinessUnits] = useState<BusinessUnit[]>([]);
  const [loadedDepartments, setLoadedDepartments] = useState<Department[]>([]);
  const [formLoading, setFormLoading] = useState(true);
  const api = useAxios();

  // Fetch master data if not provided in props
  useEffect(() => {
    // Only fetch data if the form is open
    if (!isOpen) return;
    
    // Set loaded data from props immediately to avoid loading state
    if (designations.length > 0) {
      setLoadedDesignations(designations);
    }
    
    if (businessUnits.length > 0) {
      setLoadedBusinessUnits(businessUnits);
    }
    
    if (departments.length > 0) {
      setLoadedDepartments(departments);
    }
    
    
    const needsFetching = 
      (designations.length === 0 && loadedDesignations.length === 0) ||
      (businessUnits.length === 0 && loadedBusinessUnits.length === 0) ||
      (departments.length === 0 && loadedDepartments.length === 0);
    
    if (needsFetching) {
      const fetchData = async () => {
        setFormLoading(true);
        try {
          const promises = [];
          
          if (designations.length === 0 && loadedDesignations.length === 0) {
            promises.push(
              api.get("/designations/").then(res => setLoadedDesignations(res.data))
            );
          }
          
          if (businessUnits.length === 0 && loadedBusinessUnits.length === 0) {
            promises.push(
              api.get("/business-units/").then(res => setLoadedBusinessUnits(res.data))
            );
          }
          
          if (departments.length === 0 && loadedDepartments.length === 0) {
            promises.push(
              api.get("/departments/").then(res => setLoadedDepartments(res.data))
            );
          }
          
          await Promise.all(promises);
        } catch (error) {
          console.error("Error fetching form data:", error);
          toast.error("Failed to load form data. Please try again.");
        } finally {
          setFormLoading(false);
        }
      };
      
      fetchData();
    } else {
      // If we already have all data, just set formLoading to false
      setFormLoading(false);
    }
  }, [isOpen, designations, businessUnits, departments, loadedDesignations.length, loadedBusinessUnits.length, loadedDepartments.length]);

  
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        username: selectedUser.username || "",
        email: selectedUser.email || "",
        name: selectedUser.name || "",
        employee_code: selectedUser.employee_code || "",
        department: selectedUser.department,
        designation: selectedUser.designation,
        business_unit: selectedUser.business_unit,
        status: selectedUser.status !== undefined ? selectedUser.status : true,
        dob: selectedUser.dob || null,
        address: selectedUser.address || null,
        contact: selectedUser.contact || null,
        city: selectedUser.city || null,
        state: selectedUser.state || null,
        country: selectedUser.country || null,
        first_name: selectedUser.first_name || "",
        last_name: selectedUser.last_name || "",
        is_active:
          selectedUser.is_active !== undefined ? selectedUser.is_active : true,
        is_staff: selectedUser.is_staff || false,
        is_superuser: selectedUser.is_superuser || false,
        is_budget_requester: selectedUser.is_budget_requester || false,
        role: selectedUser.role || null,
      });
    } else {
      // Reset form when adding a new user
      setFormData({
        username: "",
        email: "",
        name: "",
        employee_code: "",
        department: null,
        designation: null,
        business_unit: null,
        status: true,
        dob: null,
        contact: null,
        address: null,
        city: null,
        state: null,
        country: null,
        first_name: "",
        last_name: "",
        is_active: true,
        is_staff: false,
        is_superuser: false,
        is_budget_requester: false,
        role: null,
      });
    }
  }, [selectedUser, isOpen]);

  // For handling individual entity selection
  const handleBusinessUnitChange = useCallback((value: number | null) => {
    setFormData((prev) => ({
      ...prev,
      business_unit: value,
      // Reset dependent fields
      department: null,
      designation: null,
    }));
  }, []);

  const handleDepartmentChange = useCallback((value: number | null) => {
    setFormData((prev) => ({
      ...prev,
      department: value,
      // Reset dependent field
      designation: null,
    }));
  }, []);

  const handleDesignationChange = useCallback((value: number | null) => {
    setFormData((prev) => ({
      ...prev,
      designation: value,
    }));
  }, []);
  
  const handleRoleChange = useCallback((value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }));
  }, []);

  // Handle input changes with performance optimization
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      // Use a functional update to ensure we're working with the latest state
      if (name === "name") {
        // For name field, update the name immediately but debounce the first/last name update
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
        
        // Use requestAnimationFrame for better performance than setTimeout
        // This will run after the browser has processed the input change
        const frameId = requestAnimationFrame(() => {
          const nameParts = value.trim().split(/\s+/);
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ");
          
          setFormData((prev) => ({
            ...prev,
            first_name: firstName,
            last_name: lastName,
          }));
        });
        
        // Cleanup animation frame on next render
        return () => cancelAnimationFrame(frameId);
      } else {
        // For all other fields, just update the value directly
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    },
    []
  );

  const handleSwitchChange = useCallback((name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  }, []);

  const isValidEmail = useCallback((email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, []);

  const validateForm = useCallback((): boolean => {
    // Basic info validation
    if (!formData.email) {
      toast.error("Please provide an email address");
      return false;
    }

    if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Validate name is provided
    if (!formData.name) {
      toast.error("Please provide a name");
      return false;
    }

    // Only validate employee code if it's provided
    if (formData.employee_code && !formData.employee_code.match(/^EMP-\d+$/)) {
      toast.error("Employee code must be in format EMP-#####");
      return false;
    }

    return true;
  }, [formData, isValidEmail]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      // Disable form submission button to prevent double-clicks
      setFormLoading(true);

      // Set username to email if not provided
      const dataForSubmit = {
        ...formData,
        username: formData.username || formData.email,
      };

      // Submit the form data
      onSubmit(dataForSubmit);
      
      // Note: We don't need to reset form loading state here
      // as the parent component will close the form or handle errors
    },
    [validateForm, onSubmit, formData]
  );

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as "basic" | "contact");
  }, []);

  const navigateTab = useCallback(
    (direction: "next" | "prev") => {
      const tabs: ["basic", "contact"] = ["basic", "contact"];
      const currentIndex = tabs.indexOf(activeTab);
      const newIndex =
        direction === "next" ? currentIndex + 1 : currentIndex - 1;
      if (newIndex >= 0 && newIndex < tabs.length) {
        setActiveTab(tabs[newIndex]);
      }
    },
    [activeTab]
  );

  // Create a memoized basic tab content
  const basicTabContent = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        label="Email Address"
        name="email"
        value={formData.email}
        type="email"
        onChange={handleInputChange}
        placeholder="john.doe@company.com"
        required
        disabled={isLoading || formLoading}
      />

      <FormField
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleInputChange}
        placeholder="Same as email if left empty"
        disabled={isLoading || formLoading}
      />

      <FormField
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="John Doe"
        required
        disabled={isLoading || formLoading}
      />

        <FormField
          label="Employee Code"
          name="employee_code"
          value={formData.employee_code || ""}
          onChange={handleInputChange}
          placeholder="EMP-12345"
          helperText="Format: EMP-#####"
          disabled={isLoading || formLoading}
        />

        <FormField
          label="Date of Birth"
          name="dob"
          type="date"
          value={formData.dob || ""}
          onChange={handleInputChange}
          disabled={isLoading || formLoading}
        />

        <div className="col-span-1">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                handleSwitchChange("is_active", checked)
              }
              disabled={isLoading || formLoading}
            />
            <Label htmlFor="is_active">Account Active</Label>
          </div>
        </div>

        <div className="col-span-1">
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              Role
            </Label>
            <Select
              value={formData.role || undefined}
              onValueChange={(value) => handleRoleChange(value)}
              disabled={isLoading || formLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder">Select...</SelectItem>
                {ROLES.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedUser && (
          <div className="col-span-1">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_budget_requester"
                checked={formData.is_budget_requester}
                onCheckedChange={(checked) =>
                  handleSwitchChange("is_budget_requester", checked)
                }
                disabled={isLoading || formLoading}
              />
              <Label htmlFor="is_budget_requester">Budget Requester</Label>
            </div>
          </div>
        )}
      </div>
    ),
    [formData, handleInputChange, handleSwitchChange, handleRoleChange, isLoading, formLoading, selectedUser]
  );

  // Create a memoized contact tab content
  const contactTabContent = useMemo(() => (
    <>
      <div className="mb-6">
        <CascadingDropdowns
          businessUnits={loadedBusinessUnits}
          departments={loadedDepartments}
          designations={loadedDesignations}
          selectedBusinessUnit={formData.business_unit}
          selectedDepartment={formData.department}
          selectedDesignation={formData.designation}
          onBusinessUnitChange={handleBusinessUnitChange}
          onDepartmentChange={handleDepartmentChange}
          onDesignationChange={handleDesignationChange}
          isLoading={isLoading || formLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Contact Number"
          name="contact"
          value={formData.contact || ""}
          onChange={handleInputChange}
          placeholder="+1 123-456-7890"
          disabled={isLoading || formLoading}
        />

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium">
            Address
          </Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address === null ? "" : formData.address || ""}
            onChange={handleInputChange}
            placeholder="Street address"
            className="w-full"
            disabled={isLoading || formLoading}
          />
        </div>

        <FormField
          label="City"
          name="city"
          value={formData.city || ""}
          onChange={handleInputChange}
          disabled={isLoading || formLoading}
        />

        <FormField
          label="State/Province"
          name="state"
          value={formData.state || ""}
          onChange={handleInputChange}
          disabled={isLoading || formLoading}
        />

        <FormField
          label="Country"
          name="country"
          value={formData.country || ""}
          onChange={handleInputChange}
          disabled={isLoading || formLoading}
        />
      </div>
    </>
  ),
    [
      formData,
      handleInputChange,
      loadedBusinessUnits,
      loadedDepartments,
      loadedDesignations,
      handleBusinessUnitChange,
      handleDepartmentChange,
      handleDesignationChange,
      isLoading,
      formLoading,
    ]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {selectedUser
              ? `Edit User: ${formData.name || formData.email}`
              : "Add New User"}
          </DialogTitle>
          <DialogDescription>
            {selectedUser
              ? "Update user information in the system."
              : "Create a new user account in the system."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="contact">Organizational Details</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="mt-4">
              {basicTabContent}
              <div className="flex justify-end mt-6">
                <Button
                  type="button"
                  onClick={() => navigateTab("next")}
                  disabled={isLoading || formLoading}
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="mt-4">
              {contactTabContent}
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  onClick={() => navigateTab("prev")}
                  variant="outline"
                  disabled={isLoading || formLoading}
                >
                  Previous
                </Button>
                <Button type="submit" disabled={isLoading || formLoading}>
                  {selectedUser ? "Update User" : "Create User"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading || formLoading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function CredentialForm(props: CredentialFormProps) {
  return <CredentialFormContent {...props} />;
}