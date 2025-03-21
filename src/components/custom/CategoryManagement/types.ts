/**
 * Types for Category Management
 */

/**
 * Interface for Category data structure
 */
export interface Category {
  id: number;
  name: string;
  created_at: string;
}

/**
 * Interface for User data structure
 */
export interface User {
  id: number;
  name: string;
  email?: string;
}

/**
 * Interface for BusinessUnit data structure
 */
export interface BusinessUnit {
  id: number;
  name: string;
}

/**
 * Interface for Department data structure
 */
export interface Department {
  id: number;
  name: string;
  business_unit: number;
}

/**
 * Interface for Approver data structure
 * Represents a user who has approval permissions for specific categories
 */
export interface Approver {
  id: number;
  user: number;
  business_unit: number;
  department: number;
  level: number;
  user_details?: {
    name: string;
    email?: string;
  };
  business_unit_details?: {
    name: string;
  };
  department_details?: {
    name: string;
  };
  approver_request_category?: number | null;
  category_details?: {
    name: string;
  };
}

/**
 * Filter types for categories
 */
export interface CategoryFilters {
  name: string | null;
}

/**
 * Filter types for approvers
 */
export interface ApproverFilters {
  user: number | null;
  business_unit: number | null;
  department: number | null;
  level: number | null;
  category: number | null;
} 