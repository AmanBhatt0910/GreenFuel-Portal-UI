import { Credential, CredentialFormData } from "./types";

/**
 * Converts backend data to frontend Credential format
 */
export function backendToFrontend(backendData: any): Credential {
  return {
    id: backendData.id,
    email: backendData.email,
    name: backendData.name || "",
    dob: backendData.dob || "",
    employee_code: backendData.employee_code || "",
    designation: backendData.designation?.name || backendData.designation || "",
    business_unit: backendData.business_unit?.name || backendData.business_unit || "",
    department: backendData.department || "",
    contact: backendData.contact || "",
    address: backendData.address || "",
    city: backendData.city || "",
    state: backendData.state || "",
    country: backendData.country || "",
    status: typeof backendData.status === "boolean" 
      ? backendData.status ? "active" : "inactive" 
      : backendData.status || "active",
    
    // Additional frontend fields that may not be in backend
    // role: backendData.role || "",
    // joiningDate: backendData.joining_date || "",
    // emergencyContact: backendData.emergency_contact || "",
    // postalCode: backendData.postal_code || "",
    // notes: backendData.notes || "",
    // reportingManager: backendData.reporting_manager || "",
    // lastLogin: backendData.last_login || "",
    // lastModified: backendData.last_modified || "",
    // modifiedBy: backendData.modified_by || "",
    // profileImage: backendData.profile_image || "",
  };
}

/**
 * Converts frontend form data to backend format
 */
export function frontendToBackend(formData: CredentialFormData): any {
  return {
    email: formData.email,
    name: formData.name,
    dob: formData.dob,
    employee_code: formData.employee_code,
    designation: formData.designation,
    business_unit: formData.business_unit,
    department: formData.department,
    contact:  formData.contact,
    address: formData.address,
    city: formData.city,
    state: formData.state,
    country: formData.country,
    status: typeof formData.status === "string" 
      ? formData.status === "active" 
      : formData.status,
    
    // Additional fields that might be needed by backend
    // role: formData.role,
    // joining_date: formData.joiningDate,
    // emergency_contact: formData.emergencyContact,
    // postal_code: formData.postalCode,
    // notes: formData.notes,
    // reporting_manager: formData.reportingManager,
  };
}

/**
 * Helper function to convert status boolean values to strings for the UI
 */
export function formatStatus(status: boolean | string): string {
  if (typeof status === "boolean") {
    return status ? "active" : "inactive";
  }
  return status;
}