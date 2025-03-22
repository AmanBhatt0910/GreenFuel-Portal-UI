import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { slideVariants } from "./animations";
import { AssetDetailsProps } from "./types";
import { ChevronDown, Search, X, Check } from "lucide-react";
import useAxios from "@/app/hooks/use-axios";

// Dummy data for dropdowns
const approvalCategories = [
  { value: "Capex", label: "Capex" },
  { value: "Opex", label: "Opex" },
  { value: "Service", label: "Service" },
];

const approvalTypes = [
  { value: "Type A", label: "Type A" },
  { value: "Type B", label: "Type B" },
  { value: "Type C", label: "Type C" },
];

export const AssetDetailsStep: React.FC<AssetDetailsProps> = ({
  formData,
  handleChange,
  direction,
  navigateToStep,
  handleCheckboxChange,
  user
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const departmentDropdownRef = useRef<HTMLDivElement>(null);
  const api = useAxios();
  
  // Find the selected user's name for display
  const selectedUser = user.find((u: any) => u.id === formData.notifyTo && u.name);
  
  // Find the selected category name for display
  const selectedCategory = categories.find((c) => c.id === Number(formData.category));
  
  // Find the selected department name for display
  const selectedDepartment = departments.find((d) => d.id === Number(formData.concerned_department));
  
  // Filter users based on search term
  const filteredUsers = user.filter((u: any) => 
    u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter categories based on search term
  const filteredCategories = categories.filter((c) => 
    c.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );
  
  // Filter departments based on search term
  const filteredDepartments = departments.filter((d) => 
    d.name.toLowerCase().includes(departmentSearchTerm.toLowerCase())
  );

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await api.get("/approval-request-category/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);
  
  // Fetch departments from API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoadingDepartments(true);
        const response = await api.get("/departments/");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setIsLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  // Handle selecting a user
  const handleUserSelect = (userId: string) => {
    // Create a synthetic event object to work with existing handleChange
    const event = {
      target: {
        name: "notifyTo",
        value: userId
      }
    } as React.ChangeEvent<HTMLSelectElement>;
    
    handleChange(event);
    setIsOpen(false);
    setSearchTerm("");
  };
  
  // Handle selecting a category
  const handleCategorySelect = (categoryId: number) => {
    console.log("Selected category ID:", categoryId);
    
    // Create a synthetic event object to work with existing handleChange
    const event = {
      target: {
        name: "category",
        value: categoryId.toString()
      }
    } as unknown as React.ChangeEvent<HTMLSelectElement>;
    
    handleChange(event);
    setIsCategoryOpen(false);
    setCategorySearchTerm("");
    
    // Directly set the value for immediate UI update
    setTimeout(() => {
      console.log("Updated form data category:", formData.category);
    }, 100);
  };
  
  // Handle selecting a department
  const handleDepartmentSelect = (departmentId: number) => {
    console.log("Selected concerned department ID:", departmentId);
    
    // Create a synthetic event object to work with existing handleChange
    const event = {
      target: {
        name: "concerned_department",
        value: departmentId.toString()
      }
    } as unknown as React.ChangeEvent<HTMLSelectElement>;
    
    handleChange(event);
    setIsDepartmentOpen(false);
    setDepartmentSearchTerm("");
    
    // Directly set the value for immediate UI update
    setTimeout(() => {
      console.log("Updated form data concerned_department:", formData.concerned_department);
    }, 100);
  };

  // Handle clicking outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Handle clicking outside to close category dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Handle clicking outside to close department dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (departmentDropdownRef.current && !departmentDropdownRef.current.contains(event.target as Node)) {
        setIsDepartmentOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clear user selection
  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    const event = {
      target: {
        name: "notifyTo",
        value: ""
      }
    } as React.ChangeEvent<HTMLSelectElement>;
    
    handleChange(event);
  };
  
  // Clear category selection
  const clearCategorySelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    const event = {
      target: {
        name: "category",
        value: ""
      }
    } as React.ChangeEvent<HTMLSelectElement>;
    
    handleChange(event);
  };
  
  // Clear department selection
  const clearDepartmentSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    const event = {
      target: {
        name: "concerned_department",
        value: ""
      }
    } as React.ChangeEvent<HTMLSelectElement>;
    
    handleChange(event);
  };

  return (
    <motion.div
      key="step3"
      custom={direction}
      variants={slideVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="space-y-1 mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Asset Details
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Verify your asset list and provide additional details
        </p>
      </div>

      {/* Asset List Table */}
      {formData.assets.length > 0 ? (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
          <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Asset Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price/Unit
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {formData.assets.map((asset, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {asset.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {asset.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {asset.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    ₹{asset.pricePerUnit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    ₹{asset.total}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 dark:bg-gray-800 font-medium">
                <td colSpan={4} className="px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                  Total
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  ₹{formData.assetAmount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No assets have been added yet. Please go back and add at least one asset.</p>
          <Button
            type="button"
            onClick={() => navigateToStep(1)}
            className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
          >
            Go Back to Asset Selection
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="reason"
            className="text-sm font-medium"
          >
            Reason for Request <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="reason"
            name="reason"
            value={formData.reason || ""}
            onChange={handleChange}
            placeholder="Please provide the reason for requesting the assets"
            className="min-h-32 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="benefitToOrg"
            className="text-sm font-medium"
          >
            Benefit to Organization <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="benefitToOrg"
            name="benefitToOrg"
            value={formData.benefitToOrg || ""}
            onChange={handleChange}
            placeholder="Please explain how this request benefits the organization"
            className="min-h-32 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Grid layout for dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Dropdown - First column */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Request Category <span className="text-red-500">*</span>
            </Label>
            <div className="relative" ref={categoryDropdownRef}>
              {/* Category Combobox Trigger */}
              <div 
                className={`h-10 w-full rounded-md border ${
                  isCategoryOpen 
                    ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                    : 'border-gray-300 dark:border-gray-700'
                } bg-white px-3 py-2 flex items-center justify-between cursor-pointer focus:outline-none hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-150 dark:bg-gray-800 dark:text-gray-200`}
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              >
                <div className="flex items-center w-full">
                  {selectedCategory ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <span className="text-xs font-medium text-green-700 dark:text-green-300">
                            {selectedCategory.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="truncate">{selectedCategory.name}</span>
                      </div>
                      <button 
                        onClick={clearCategorySelection}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ml-1"
                        aria-label="Clear selection"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">Select Request Category</span>
                  )}
                </div>
                <ChevronDown size={18} className={`transition-transform duration-200 text-gray-500 ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Category Dropdown Menu */}
              {isCategoryOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Category Search Input */}
                  <div className="p-2 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={categorySearchTerm}
                        onChange={(e) => setCategorySearchTerm(e.target.value)}
                        placeholder="Search categories..."
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Category List */}
                  <div className="py-1">
                    {isLoadingCategories ? (
                      <div className="px-4 py-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-current border-t-transparent text-blue-600"></div>
                        <p className="mt-2 text-sm text-gray-500">Loading categories...</p>
                      </div>
                    ) : filteredCategories.length > 0 ? (
                      filteredCategories.map((category) => (
                        <div
                          key={category.id}
                          className={`px-3 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors ${
                            Number(formData.category) === category.id ? 'bg-blue-50 dark:bg-gray-600' : ''
                          }`}
                          onClick={() => handleCategorySelect(category.id)}
                        >
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex-shrink-0 mr-2 flex items-center justify-center ${
                              Number(formData.category) === category.id 
                                ? 'bg-green-100 dark:bg-green-900' 
                                : 'bg-gray-100 dark:bg-gray-800'
                            }`}>
                              <span className={`text-xs font-medium ${
                                Number(formData.category) === category.id 
                                  ? 'text-green-700 dark:text-green-300' 
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {category.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className={`text-sm ${
                                Number(formData.category) === category.id 
                                  ? 'text-green-700 font-medium dark:text-green-300' 
                                  : 'text-gray-800 dark:text-gray-200'
                              }`}>
                                {category.name}
                              </span>
                            </div>
                            {Number(formData.category) === category.id && (
                              <div className="ml-auto">
                                <Check size={16} className="text-green-500" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-gray-500 dark:text-gray-400 text-center flex flex-col items-center">
                        <Search className="h-6 w-6 mb-2 text-gray-400 opacity-50" />
                        <p>No categories found matching "{categorySearchTerm}"</p>
                        <button 
                          className="mt-2 text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => setCategorySearchTerm('')}
                        >
                          Clear search
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Notify To Dropdown - Second column */}
          <div className="space-y-2">
            <Label htmlFor="notifyTo" className="text-sm font-medium">
              Notify To <span className="text-red-500">*</span>
            </Label>
            <div className="relative" ref={dropdownRef}>
              {/* Combobox Trigger */}
              <div 
                className={`h-10 w-full rounded-md border ${
                  isOpen 
                    ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                    : 'border-gray-300 dark:border-gray-700'
                } bg-white px-3 py-2 flex items-center justify-between cursor-pointer focus:outline-none hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-150 dark:bg-gray-800 dark:text-gray-200`}
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="flex items-center w-full">
                  {selectedUser ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                            {selectedUser.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="truncate">{selectedUser.name}</span>
                      </div>
                      <button 
                        onClick={clearSelection}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ml-1"
                        aria-label="Clear selection"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">Select Person to Notify</span>
                  )}
                </div>
                <ChevronDown size={18} className={`transition-transform duration-200 text-gray-500 ${isOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Search Input */}
                  <div className="p-2 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search users..."
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* User List */}
                  <div className="py-1">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((person: any) => (
                        <div
                          key={person.id}
                          className={`px-3 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors ${
                            formData.notifyTo === person.id ? 'bg-blue-50 dark:bg-gray-600' : ''
                          }`}
                          onClick={() => handleUserSelect(person.id)}
                        >
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex-shrink-0 mr-2 flex items-center justify-center ${
                              formData.notifyTo === person.id 
                                ? 'bg-blue-100 dark:bg-blue-900' 
                                : 'bg-gray-100 dark:bg-gray-800'
                            }`}>
                              <span className={`text-xs font-medium ${
                                formData.notifyTo === person.id 
                                  ? 'text-blue-700 dark:text-blue-300' 
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {person.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className={`text-sm ${
                                formData.notifyTo === person.id 
                                  ? 'text-blue-700 font-medium dark:text-blue-300' 
                                  : 'text-gray-800 dark:text-gray-200'
                              }`}>
                                {person.name}
                              </span>
                              {person.email && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                  {person.email}
                                </span>
                              )}
                            </div>
                            {formData.notifyTo === person.id && (
                              <div className="ml-auto">
                                <Check size={16} className="text-blue-500" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-gray-500 dark:text-gray-400 text-center flex flex-col items-center">
                        <Search className="h-6 w-6 mb-2 text-gray-400 opacity-50" />
                        <p>No users found matching "{searchTerm}"</p>
                        <button 
                          className="mt-2 text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => setSearchTerm('')}
                        >
                          Clear search
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Concerned Department Dropdown - Full width below */}
        <div className="space-y-2">
          <Label htmlFor="concerned_department" className="text-sm font-medium">
            Concerned Department <span className="text-red-500">*</span>
          </Label>
          <div className="relative" ref={departmentDropdownRef}>
            {/* Department Combobox Trigger */}
            <div 
              className={`h-10 w-full rounded-md border ${
                isDepartmentOpen 
                  ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                  : 'border-gray-300 dark:border-gray-700'
              } bg-white px-3 py-2 flex items-center justify-between cursor-pointer focus:outline-none hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-150 dark:bg-gray-800 dark:text-gray-200`}
              onClick={() => setIsDepartmentOpen(!isDepartmentOpen)}
            >
              <div className="flex items-center w-full">
                {selectedDepartment ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                          {selectedDepartment.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="truncate">{selectedDepartment.name}</span>
                    </div>
                    <button 
                      onClick={clearDepartmentSelection}
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ml-1"
                      aria-label="Clear selection"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">Select Concerned Department</span>
                )}
              </div>
              <ChevronDown size={18} className={`transition-transform duration-200 text-gray-500 ${isDepartmentOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Department Dropdown Menu */}
            {isDepartmentOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Department Search Input */}
                <div className="p-2 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={departmentSearchTerm}
                      onChange={(e) => setDepartmentSearchTerm(e.target.value)}
                      placeholder="Search departments..."
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Department List */}
                <div className="py-1">
                  {isLoadingDepartments ? (
                    <div className="px-4 py-8 text-center">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-current border-t-transparent text-purple-600"></div>
                      <p className="mt-2 text-sm text-gray-500">Loading departments...</p>
                    </div>
                  ) : filteredDepartments.length > 0 ? (
                    filteredDepartments.map((department) => (
                      <div
                        key={department.id}
                        className={`px-3 py-2 cursor-pointer hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors ${
                          Number(formData.concerned_department) === department.id ? 'bg-purple-50 dark:bg-gray-600' : ''
                        }`}
                        onClick={() => handleDepartmentSelect(department.id)}
                      >
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex-shrink-0 mr-2 flex items-center justify-center ${
                            Number(formData.concerned_department) === department.id 
                              ? 'bg-purple-100 dark:bg-purple-900' 
                              : 'bg-gray-100 dark:bg-gray-800'
                          }`}>
                            <span className={`text-xs font-medium ${
                              Number(formData.concerned_department) === department.id 
                                ? 'text-purple-700 dark:text-purple-300' 
                                : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {department.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-sm ${
                              Number(formData.concerned_department) === department.id 
                                ? 'text-purple-700 font-medium dark:text-purple-300' 
                                : 'text-gray-800 dark:text-gray-200'
                            }`}>
                              {department.name}
                            </span>
                          </div>
                          {Number(formData.concerned_department) === department.id && (
                            <div className="ml-auto">
                              <Check size={16} className="text-purple-500" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-gray-500 dark:text-gray-400 text-center flex flex-col items-center">
                      <Search className="h-6 w-6 mb-2 text-gray-400 opacity-50" />
                      <p>No departments found matching "{departmentSearchTerm}"</p>
                      <button 
                        className="mt-2 text-xs text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                        onClick={() => setDepartmentSearchTerm('')}
                      >
                        Clear search
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="approvalCategory" className="text-sm font-medium">
              Approval Category <span className="text-red-500">*</span>
            </Label>
            <select
              id="approvalCategory"
              name="approvalCategory"
              value={formData.approvalCategory || ""}
              onChange={handleChange}
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-100 dark:focus:border-blue-100"
            >
              <option value="">Select Budget Approval Category</option>
              {approvalCategories.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="approvalType" className="text-sm font-medium">
              Approval Type <span className="text-red-500">*</span>
            </Label>
            <select
              id="approvalType"
              name="approvalType"
              value={formData.approvalType || ""}
              onChange={handleChange}
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-100 dark:focus:border-blue-100"
            >
              <option value="">Select Approval Type</option>
              {approvalTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-start mt-4">
          <input
            type="checkbox"
            id="policyAgreement"
            name="policyAgreement"
            checked={Boolean(formData.policyAgreement)}
            onChange={(e) => {
              if (handleCheckboxChange) {
                handleCheckboxChange(e.target.checked);
              }
            }}
            className="mr-2 mt-1"
          />
          <Label
            htmlFor="policyAgreement"
            className="text-sm"
          >
            I agree to the company's asset usage policy and understand
            that I am responsible for the proper use and maintenance of
            these assets.
          </Label>
        </div>
      </div>
    </motion.div>
  );
};