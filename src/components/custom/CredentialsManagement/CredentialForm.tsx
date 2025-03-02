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
import { CredentialFormData } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/lib/toast-util";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Individual pure form field components to prevent unnecessary re-renders
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
  value: string;
  onChange: (name: string, value: string) => void;
  options: Array<{ id: string; name: string }>;
  placeholder?: string;
  required?: boolean;
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Select
        value={value || ""}
        onValueChange={(value) => onChange(name, value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.filter(option => option.name && option.name.trim() !== "").map((option) => (
            <SelectItem key={option.id} value={option.name}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});
SelectField.displayName = "SelectField";

// Notes field component
const NotesField = memo(({ 
  value, 
  onChange
}: {
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) => (
  <div className="space-y-2">
    <Label htmlFor="notes" className="text-sm font-medium">
      Additional Notes
    </Label>
    <Textarea
      id="notes"
      name="notes"
      value={value || ""}
      onChange={onChange}
      placeholder="Any additional information about the employee..."
      className="min-h-[80px]"
    />
  </div>
));
NotesField.displayName = "NotesField";

// Update the props to remove formData and onChange
interface NewCredentialFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: any | null;
  onSubmit: (formData: CredentialFormData) => void;
  departments: Array<{ id: string; name: string }>;
  roles: Array<{ id: string; name: string }>;
}

function CredentialFormContent({
  isOpen,
  onClose,
  selectedUser,
  onSubmit,
  departments,
  roles,
}: NewCredentialFormProps) {
  // Internal form state management
  const [formData, setFormData] = useState<CredentialFormData>({
    name: "",
    email: "",
    employeeCode: "",
    department: "",
    designation: "",
    role: "",
    status: "active",
    joiningDate: "",
    dob: "",
    contactNumber: "",
    emergencyContact: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    reportingManager: "",
    notes: "",
  });
  
  const [activeTab, setActiveTab] = useState("basic");
  const [requirePasswordChange, setRequirePasswordChange] = useState(true);
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);

  // Initialize form data when selectedUser changes or component mounts
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        employeeCode: selectedUser.employeeCode || "",
        department: selectedUser.department || "",
        designation: selectedUser.designation || "",
        role: selectedUser.role || "",
        status: selectedUser.status || "active",
        joiningDate: selectedUser.joiningDate || "",
        dob: selectedUser.dob || "",
        contactNumber: selectedUser.contactNumber || "",
        emergencyContact: selectedUser.emergencyContact || "",
        address: selectedUser.address || "",
        city: selectedUser.city || "",
        state: selectedUser.state || "",
        country: selectedUser.country || "",
        postalCode: selectedUser.postalCode || "",
        reportingManager: selectedUser.reportingManager || "",
        notes: selectedUser.notes || "",
      });
    } else {
      // Reset form when adding a new user
      setFormData({
        name: "",
        email: "",
        employeeCode: "",
        department: "",
        designation: "",
        role: "",
        status: "active",
        joiningDate: "",
        dob: "",
        contactNumber: "",
        emergencyContact: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        reportingManager: "",
        notes: "",
      });
    }
  }, [selectedUser, isOpen]);

  // Use useCallback to memoize event handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const isValidEmail = useCallback((email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, []);

  const validateForm = useCallback(() => {
    if (!formData.email || !formData.name || !formData.employeeCode || !formData.department || !formData.role) {
      toast.error("Please fill in all required fields");
      return false;
    }

    if (formData.email && !isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (formData.employeeCode && !formData.employeeCode.match(/^EMP-\d+$/)) {
      toast.error("Employee code must be in format EMP-#####");
      return false;
    }

    return true;
  }, [formData, isValidEmail]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  }, [validateForm, onSubmit, formData]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  const navigateTab = useCallback((direction: 'next' | 'prev') => {
    const tabs = ["basic", "contact", "role"];
    const currentIndex = tabs.indexOf(activeTab);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < tabs.length) {
      setActiveTab(tabs[newIndex]);
    }
  }, [activeTab]);

  // Memoize the tab content to prevent unnecessary re-renders
  const basicTabContent = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="John Doe"
        required
      />

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
        label="Employee Code"
        name="employeeCode"
        value={formData.employeeCode}
        onChange={handleInputChange}
        placeholder="EMP-12345"
        required
        helperText="Format: EMP-#####"
      />

      <FormField
        label="Date of Birth"
        name="dob"
        type="date"
        value={formData.dob}
        onChange={handleInputChange}
      />

      <FormField
        label="Joining Date"
        name="joiningDate"
        type="date"
        value={formData.joiningDate}
        onChange={handleInputChange}
        required
      />

      <div className="space-y-2">
        <Label htmlFor="status" className="text-sm font-medium">
          Status <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleSelectChange("status", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ), [formData.name, formData.email, formData.employeeCode, formData.dob, formData.joiningDate, formData.status, handleInputChange, handleSelectChange]);

  const contactTabContent = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        label="Contact Number"
        name="contactNumber"
        value={formData.contactNumber}
        onChange={handleInputChange}
        placeholder="+91 9876543210"
      />

      <FormField
        label="Emergency Contact"
        name="emergencyContact"
        value={formData.emergencyContact}
        onChange={handleInputChange}
        placeholder="+91 9876543210"
      />

      <FormField
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        placeholder="123 Main St"
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="City"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          placeholder="Mumbai"
        />

        <FormField
          label="State"
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          placeholder="Maharashtra"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          placeholder="India"
        />

        <FormField
          label="Postal Code"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleInputChange}
          placeholder="400001"
        />
      </div>

      <NotesField 
        value={formData.notes}
        onChange={handleInputChange}
      />
    </div>
  ), [formData.contactNumber, formData.emergencyContact, formData.address, formData.city, formData.state, formData.country, formData.postalCode, formData.notes, handleInputChange]);

  const roleTabContent = useMemo(() => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleSelectChange}
          options={departments}
          placeholder="Select department"
          required
        />

        <FormField
          label="Designation"
          name="designation"
          value={formData.designation}
          onChange={handleInputChange}
          placeholder="Senior Engineer"
          required
        />

        <SelectField
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleSelectChange}
          options={roles}
          placeholder="Select role"
          required
        />

        <FormField
          label="Reporting Manager"
          name="reportingManager"
          value={formData.reportingManager}
          onChange={handleInputChange}
          placeholder="Jane Smith"
        />
      </div>

      {!selectedUser && (
        <div className="pt-4 space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="pwd-change">Require Password Change</Label>
              <div className="text-xs text-muted-foreground">
                User will be prompted to change password on first login
              </div>
            </div>
            <Switch
              id="pwd-change"
              checked={requirePasswordChange}
              onCheckedChange={setRequirePasswordChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="welcome-email">Send Welcome Email</Label>
              <div className="text-xs text-muted-foreground">
                Send account details to the user's email address
              </div>
            </div>
            <Switch
              id="welcome-email"
              checked={sendWelcomeEmail}
              onCheckedChange={setSendWelcomeEmail}
            />
          </div>
        </div>
      )}
    </>
  ), [formData.department, formData.designation, formData.role, formData.reportingManager, handleInputChange, handleSelectChange, departments, roles, selectedUser, requirePasswordChange, sendWelcomeEmail]);

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

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <Tabs 
            defaultValue="basic" 
            value={activeTab} 
            onValueChange={handleTabChange} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="contact">Contact Details</TabsTrigger>
              <TabsTrigger value="role">Role & Access</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              {basicTabContent}
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              {contactTabContent}
            </TabsContent>

            <TabsContent value="role" className="space-y-4">
              {roleTabContent}
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
              
              {activeTab !== "role" ? (
                <Button
                  type="button"
                  onClick={() => navigateTab('next')}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit">
                  {selectedUser ? "Save Changes" : "Create Employee"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
CredentialFormContent.displayName = "CredentialFormContent";

// Export as a regular function component
export function CredentialForm(props: NewCredentialFormProps) {
  return <CredentialFormContent {...props} />;
}