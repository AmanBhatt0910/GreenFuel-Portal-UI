import { BusinessUnit, Department, Designation, NewBusinessUnit, NewDepartment, NewDesignation, Approver, NewApprover } from './types';

// Since useAxios is a hook, we need to pass the api instance to these functions
// We can't call hooks directly in this file

// Business Unit API calls
export const fetchBusinessUnits = async (api: any): Promise<BusinessUnit[]> => {
  const response = await api.get('/business-units/');
  return response.data;
};

export const createBusinessUnit = async (api: any, businessUnit: NewBusinessUnit): Promise<BusinessUnit> => {
  const response = await api.post('/business-units/', businessUnit);
  return response.data;
};

export const updateBusinessUnit = async (api: any, id: string | number, businessUnit: Partial<BusinessUnit>): Promise<BusinessUnit> => {
  const response = await api.put(`/business-units/${id}/`, businessUnit);
  return response.data;
};

export const deleteBusinessUnit = async (api: any, id: string | number): Promise<void> => {
  await api.delete(`/business-units/${id}/`);
};

// Department API calls
export const fetchDepartments = async (api: any, businessUnitId?: number): Promise<Department[]> => {
  let url = '/departments/';
  if (businessUnitId) {
    url = `/departments/?business_unit=${businessUnitId}`;
  }
  const response = await api.get(url);
  return response.data;
};

export const createDepartment = async (api: any, department: NewDepartment): Promise<Department> => {
  const response = await api.post('/departments/', department);
  return response.data;
};

export const updateDepartment = async (api: any, id: string | number, department: Partial<Department>): Promise<Department> => {
  const response = await api.put(`/departments/${id}/`, department);
  return response.data;
};

export const deleteDepartment = async (api: any, id: string | number): Promise<void> => {
  await api.delete(`/departments/${id}/`);
};

// Designation API calls (for employee roles)
export const fetchDesignations = async (api: any, departmentId?: number): Promise<Designation[]> => {
  let url = '/designations/';
  if (departmentId) {
    url = `/designations/?department=${departmentId}`;
  }
  const response = await api.get(url);
  return response.data;
};

export const createDesignation = async (api: any, designation: NewDesignation): Promise<Designation> => {
  const response = await api.post('/designations/', designation);
  return response.data;
};

export const updateDesignation = async (api: any, id: string | number, designation: Partial<Designation>): Promise<Designation> => {
  const response = await api.put(`/designations/${id}/`, designation);
  return response.data;
};

export const deleteDesignation = async (api: any, id: string | number): Promise<void> => {
  await api.delete(`/designations/${id}/`);
};

// Approver API calls
export const createApprover = async (api: any, approver: NewApprover): Promise<Approver> => {
  const response = await api.post('/approvers/', approver);
  return response.data;
}; 