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
import { CredentialFormData, CredentialFormProps, Department, Designation, BusinessUnit, FormFieldProps } from "./types";



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
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value === null || value === undefined ? "" : String(value)}
        onChange={onChange}
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
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Select
        value={value !== null && value !== undefined ? value.toString() : undefined}
        onValueChange={(value) => onChange(name, value)}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="placeholder">Select...</SelectItem>
          {options
            .filter((option) => option.name && option.name.trim() !== "")
            .map((option) => (
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Label htmlFor="business_unit" className="text-sm font-medium">
          Business Unit / Plant
        </Label>
        <Select
          value={selectedBusinessUnit !== null && selectedBusinessUnit !== undefined ? selectedBusinessUnit.toString() : undefined}
          onValueChange={(value) => {
            onBusinessUnitChange(value ? parseInt(value, 10) : null);
            // Reset department and designation when business unit changes
            onDepartmentChange(null);
            onDesignationChange(null);
          }}
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
          value={selectedDepartment !== null && selectedDepartment !== undefined ? selectedDepartment.toString() : undefined}
          onValueChange={(value) => {
            onDepartmentChange(value ? parseInt(value, 10) : null);
            // Reset designation when department changes
            onDesignationChange(null);
          }}
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
          value={selectedDesignation !== null && selectedDesignation !== undefined ? selectedDesignation.toString() : undefined}
          onValueChange={(value) =>
            onDesignationChange(value ? parseInt(value, 10) : null)
          }
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
  });

  const [activeTab, setActiveTab] = useState<"basic" | "contact">("basic");
  const [loadedDesignations, setLoadedDesignations] = useState<Designation[]>([]);
  const [loadedBusinessUnits, setLoadedBusinessUnits] = useState<BusinessUnit[]>([]);
  const [loadedDepartments, setLoadedDepartments] = useState<Department[]>([]);
  const [formLoading, setFormLoading] = useState(true);
  const api = useAxios();

  // Fetch master data if not provided in props
  useEffect(() => {
    const fetchData = async () => {
      setFormLoading(true);
      try {
        // Use existing data if provided as props
        if (designations.length > 0) {
          setLoadedDesignations(designations);
        } else {
          const res = await api.get("/designations/");
          setLoadedDesignations(res.data);
        }

        if (businessUnits.length > 0) {
          setLoadedBusinessUnits(businessUnits);
        } else {
          const res = await api.get("/business-units/");
          setLoadedBusinessUnits(res.data);
        }

        if (departments.length > 0) {
          setLoadedDepartments(departments);
        } else {
          const res = await api.get("/departments/");
          setLoadedDepartments(res.data);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
        toast.error("Failed to load form data. Please try again.");
      } finally {
        setFormLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, designations, businessUnits, departments]);

  // Initialize form data when selectedUser changes or component mounts
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

  // Handle input changes including special handling for the name field
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      if (name === "name") {
        // When name changes, split it into first_name and last_name
        const nameParts = value.trim().split(/\s+/);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ");

        setFormData((prev) => ({
          ...prev,
          name: value,
          first_name: firstName,
          last_name: lastName,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    },
    []
  );

  const handleSelectChange = useCallback((name: string, value: string) => {
    // If user selects the placeholder, treat it as null
    if (value === "placeholder") {
      setFormData((prev) => ({
        ...prev,
        [name]: null,
      }));
      return;
    }
    
    // Convert string value to number for IDs, or keep as null if empty
    const processedValue = ["designation", "business_unit", "department"].includes(name)
      ? value ? parseInt(value, 10) : null
      : value;
  
    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  }, []);

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

      // Set username to email if not provided
      const dataForSubmit = {
        ...formData,
        username: formData.username || formData.email,
      };

      onSubmit(dataForSubmit);
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

  const basicTabContent = useMemo(
    () => (
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
    [formData, handleInputChange, handleSwitchChange, isLoading, formLoading, selectedUser]
  );

  const contactTabContent = useMemo(
    () => (
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