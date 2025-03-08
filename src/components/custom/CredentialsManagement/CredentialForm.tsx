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
import { Credential, CredentialFormData, CredentialFormProps, Designation, BusinessUnit } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/lib/toast-util";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import useAxios from "@/app/hooks/use-axios";

const FormField = memo(({ 
  label, 
  name, 
  value, 
  onChange, 
  type = "text", 
  placeholder = "", 
  required = false,
  helperText = ""
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full"
        required={required}
      />
      {helperText && <div className="text-xs text-gray-500">{helperText}</div>}
    </div>
  );
});
FormField.displayName = "FormField";

const SelectField = memo(({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  placeholder = "", 
  required = false 
}: {
  label: string;
  name: string;
  value: string | number;
  onChange: (name: string, value: string) => void;
  options: Array<{ id: string | number; name: string }>;
  placeholder?: string;
  required?: boolean;
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Select
        value={value ? value.toString() : ""}
        onValueChange={(value) => onChange(name, value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.filter(option => option.name && option.name.trim() !== "").map((option) => (
            <SelectItem key={option.id.toString()} value={option.id.toString()}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});
SelectField.displayName = "SelectField";

function CredentialFormContent({
  isOpen,
  onClose,
  selectedUser,
  onSubmit,
  departments,
  businessUnits = [],
  designations = [],
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
    is_superuser: false
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [loadedDesignations, setLoadedDesignations] = useState<Designation[]>([]);
  const [loadedBusinessUnits, setLoadedBusinessUnits] = useState<BusinessUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const api = useAxios();

  // Fetch designations and business units
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Use existing designations and businessUnits if provided as props
        if (designations.length > 0) {
          setLoadedDesignations(designations);
        } else {
          const res = await api.get('designations/');
          console.log(res.data)
          setLoadedDesignations(res.data)
        }

        if (businessUnits.length > 0) {
          setLoadedBusinessUnits(businessUnits);
        } else {
          const res = await api.get('business-units/');
          console.log(res.data)
          setLoadedBusinessUnits(res.data)
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
        toast.error("Failed to load form data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, designations, businessUnits]);

  // Initialize form data when selectedUser changes or component mounts
  useEffect(() => {
    if (selectedUser) {
      // Combine first_name and last_name into name for UI display
      const combinedName = [selectedUser.first_name, selectedUser.last_name]
        .filter(Boolean)
        .join(" ");
        
      setFormData({
        username: selectedUser.username || "",
        email: selectedUser.email || "",
        name: combinedName || selectedUser.name || "",
        employee_code: selectedUser.employee_code,
        department: selectedUser.department,
        designation: selectedUser.designation,
        business_unit: selectedUser.business_unit,
        status: selectedUser.status !== undefined ? selectedUser.status : true,
        dob: selectedUser.dob,
        address: selectedUser.address,
        contact: selectedUser.contact,
        city: selectedUser.city,
        state: selectedUser.state,
        country: selectedUser.country,
        first_name: selectedUser.first_name || "",
        last_name: selectedUser.last_name || "",
        is_active: selectedUser.is_active !== undefined ? selectedUser.is_active : true,
        is_staff: selectedUser.is_staff || false,
        is_superuser: selectedUser.is_superuser || false
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
        is_superuser: false
      });
    }
  }, [selectedUser, isOpen]);

  // Handle input changes including special handling for the name field
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'name') {
      // When name changes, split it into first_name and last_name
      const nameParts = value.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ');
      
      setFormData(prev => ({
        ...prev,
        name: value,
        first_name: firstName,
        last_name: lastName
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  }, []);

  const handleSelectChange = useCallback((name: string, value: string) => {
    // Convert string value to number for IDs
    const processedValue = name === 'designation' || name === 'business_unit' 
      ? parseInt(value, 10)
      : value;
      
    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
    }));
  }, []);

  const handleSwitchChange = useCallback((name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  }, []);

  const isValidEmail = useCallback((email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, []);

  const validateForm = useCallback(() => {
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

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Set username to email if not provided
    const dataForSubmit = {
      ...formData,
      username: formData.username || formData.email
    };
    
    onSubmit(dataForSubmit);
  }, [validateForm, onSubmit, formData]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  const navigateTab = useCallback((direction: 'next' | 'prev') => {
    const tabs = ["basic", "contact"];
    const currentIndex = tabs.indexOf(activeTab);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < tabs.length) {
      setActiveTab(tabs[newIndex]);
    }
  }, [activeTab]);

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
      />

      <FormField
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleInputChange}
        placeholder="Same as email if left empty"
      />

      {/* Replaced first_name and last_name fields with a single name field */}
      <FormField
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="John Doe"
        required
      />

      <FormField
        label="Employee Code"
        name="employee_code"
        value={formData.employee_code || ""}
        onChange={handleInputChange}
        placeholder="EMP-12345"
        helperText="Format: EMP-#####"
      />

      <FormField
        label="Date of Birth"
        name="dob"
        type="date"
        value={formData.dob || ""}
        onChange={handleInputChange}
      />

      <div className="col-span-1">
        <div className="flex items-center space-x-2">
          <Switch 
            id="is_active" 
            checked={formData.is_active} 
            onCheckedChange={(checked) => handleSwitchChange('is_active', checked)} 
          />
          <Label htmlFor="is_active">Account Active</Label>
        </div>
      </div>

      <div className="col-span-1">
        <div className="flex items-center space-x-2">
          <Switch 
            id="is_staff" 
            checked={formData.is_staff} 
            onCheckedChange={(checked) => handleSwitchChange('is_staff', checked)} 
          />
          <Label htmlFor="is_staff">Staff Account</Label>
        </div>
      </div>
    </div>
  ), [formData, handleInputChange, handleSwitchChange]);

  const contactTabContent = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        label="Contact Number"
        name="contact"
        value={formData.contact || ""}
        onChange={handleInputChange}
        placeholder="+91 9876543210"
      />

      <FormField
        label="Department"
        name="department"
        value={formData.department || ""}
        onChange={handleInputChange}
        placeholder="e.g. IT, HR, Finance"
      />

      <SelectField
        label="Business Unit"
        name="business_unit"
        value={formData.business_unit || ""}
        onChange={handleSelectChange}
        options={loadedBusinessUnits}
        placeholder="Select Business Unit"
      />

      <SelectField
        label="Designation"
        name="designation"
        value={formData.designation || ""}
        onChange={handleSelectChange}
        options={loadedDesignations}
        placeholder="Select Designation"
      />

      <div className="col-span-2">
        <FormField
          label="Address"
          name="address"
          value={formData.address || ""}
          onChange={handleInputChange}
          placeholder="123 Main St"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="City"
          name="city"
          value={formData.city || ""}
          onChange={handleInputChange}
          placeholder="Mumbai"
        />

        <FormField
          label="State"
          name="state"
          value={formData.state || ""}
          onChange={handleInputChange}
          placeholder="Maharashtra"
        />
      </div>

      <FormField
        label="Country"
        name="country"
        value={formData.country || ""}
        onChange={handleInputChange}
        placeholder="India"
      />
    </div>
  ), [formData, handleInputChange, handleSelectChange, loadedBusinessUnits, loadedDesignations]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {selectedUser ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {selectedUser
              ? "Update the employee details below. Click save when you're done."
              : "Fill in the employee details below. Required fields are marked with an asterisk (*)."}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="contact">Contact & Organization</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                {basicTabContent}
              </TabsContent>

              <TabsContent value="contact" className="space-y-4">
                {contactTabContent}
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex justify-between w-full mt-6">
              <div>
                {activeTab !== "basic" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigateTab('prev')}
                  >
                    Previous
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>

                {activeTab !== "contact" ? (
                  <Button
                    type="button"
                    onClick={() => navigateTab('next')}
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="button"
                    onClick={(e) => handleSubmit(e as React.FormEvent)}
                  >
                    {selectedUser ? "Save Changes" : "Create Employee"}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
CredentialFormContent.displayName = "CredentialFormContent";

// Export as a regular function component
export function CredentialForm(props: CredentialFormProps) {
  return <CredentialFormContent {...props} />;
}