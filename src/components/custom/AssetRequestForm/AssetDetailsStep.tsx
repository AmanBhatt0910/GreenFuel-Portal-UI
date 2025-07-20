import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { slideVariants } from "./animations";
import { AssetDetailsProps } from "./types";
import { ChevronDown, Search, X, Check, FileIcon, Upload } from "lucide-react";
import useAxios from "@/app/hooks/use-axios";

// Dummy data for dropdowns
const approvalCategories = [
  { value: "Capex", label: "Capex" },
  { value: "Opex", label: "Opex" },
  { value: "Service", label: "Service" },
  { value: "AMC Renewal", label: "AMC Renewal" },
  { value: "Cost Saving Initiative", label: "Cost Saving Initiative" },
  { value: "Non WOM Service", label: "Non WOM Service" },
  { value: "Non BOM Material", label: "Non BOM Material" },
  { value: "Other", label: "Other" },
];

const approvalTypes = [
  { value: "Capex", label: "Capex" },
  { value: "Opex", label: "Opex" },
  { value: "Service", label: "Service" },
];

export const AssetDetailsStep: React.FC<AssetDetailsProps> = ({
  formData,
  handleChange,
  direction,
  navigateToStep,
  user,
  formAttachments,
  setFormAttachments,
  assetAttachments,
  setAssetAttachments,
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
  const selectedUser = user.find(
    (u: any) => u.id === formData.notifyTo && u.name
  );

  // Find the selected category name for display
  const selectedCategory = categories.find(
    (c) => c.id === Number(formData.category)
  );

  // Find the selected department name for display
  const selectedDepartment = departments.find(
    (d) => d.id === Number(formData.concerned_department)
  );

  // Filter users based on search term
  const filteredUsers = user.filter(
    (u: any) =>
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

  const handleFormAttachmentsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormAttachments((prev) => [...prev, ...filesArray]);
    }
  };

  const removeFormAttachment = (index: number) => {
    setFormAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Asset attachment handlers
  const handleAssetAttachmentsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAssetAttachments((prev) => [...prev, ...filesArray]);
    }
  };

  const removeAssetAttachment = (index: number) => {
    setAssetAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle selecting a user
  const handleUserSelect = (userId: string) => {
    // Create a synthetic event object to work with existing handleChange
    const event = {
      target: {
        name: "notifyTo",
        value: userId,
      },
    } as React.ChangeEvent<HTMLSelectElement>;

    handleChange(event);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Handle selecting a categoryf
  const handleCategorySelect = (categoryId: number) => {
    const event = {
      target: {
        name: "category",
        value: categoryId.toString(),
      },
    } as unknown as React.ChangeEvent<HTMLSelectElement>;

    handleChange(event);
    setIsCategoryOpen(false);
    setCategorySearchTerm("");
  };

  // Handle selecting a department
  const handleDepartmentSelect = (departmentId: number) => {
    const event = {
      target: {
        name: "concerned_department",
        value: departmentId.toString(),
      },
    } as unknown as React.ChangeEvent<HTMLSelectElement>;

    handleChange(event);
    setIsDepartmentOpen(false);
    setDepartmentSearchTerm("");
  };

  // Handle clicking outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
      if (
        departmentDropdownRef.current &&
        !departmentDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDepartmentOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clear selections
  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    const event = {
      target: {
        name: "notifyTo",
        value: "",
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    handleChange(event);
  };

  const clearCategorySelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    const event = {
      target: {
        name: "category",
        value: "",
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    handleChange(event);
  };

  const clearDepartmentSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    const event = {
      target: {
        name: "concerned_department",
        value: "",
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    handleChange(event);
  };

  const paybackPeriodOptions = [
    { value: "1 Year", label: "1 Year" },
    { value: "2 Year", label: "2 Years" },
    { value: "3 Year", label: "3 Years" },
    { value: "4 Year", label: "4 Years" },
    { value: "5 Year", label: "5 Years" },
    { value: "6 Year", label: "6 Years" },
    { value: "7 Year", label: "7 Years" },
    { value: "8 Year", label: "8 Years" },
    { value: "9 Year", label: "9 Years" },
    { value: "10 Year", label: "10 Years" },
  ];

  // Dropdown item renderer
  const renderDropdownItem = (
    item: any,
    selected: boolean,
    onClick: () => void,
    bgColorClass: string,
    textColorClass: string,
    checkColorClass: string
  ) => (
    <div
      key={item?.id}
      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
        selected ? `${bgColorClass} dark:bg-gray-600` : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div
          className={`w-6 h-6 rounded-full flex-shrink-0 mr-2 flex items-center justify-center ${
            selected
              ? `${bgColorClass} dark:bg-gray-700`
              : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          <span
            className={`text-xs font-medium ${
              selected
                ? `${textColorClass} dark:text-gray-300`
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {item.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col">
          <span
            className={`text-sm ${
              selected
                ? `${textColorClass} font-medium dark:text-gray-200`
                : "text-gray-800 dark:text-gray-200"
            }`}
          >
            {item.name}
          </span>
          {item.email && (
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
              {item.email}
            </span>
          )}
        </div>
        {selected && (
          <div className="ml-auto">
            <Check size={16} className={checkColorClass} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      key="step3"
      custom={direction}
      variants={slideVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Asset Details
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Verify your asset list and provide additional details
        </p>
      </div>

      {/* Asset List Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h4 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-3">
          1. Asset Summary
        </h4>

        {formData.assets.length > 0 ? (
          <div className="bg-white border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Asset Title
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Price/Unit
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {formData.assets.map((asset, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {asset.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      {asset.description}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 text-center">
                      {asset.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 text-right">
                      ₹{asset.pricePerUnit}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white text-right">
                      ₹{asset.total}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 dark:bg-gray-800 font-medium border-t-2 border-gray-200 dark:border-gray-700">
                  <td colSpan={4} className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                    Total
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white text-right">
                    ₹{formData.assetAmount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No assets have been added yet. Please go back and add at least one asset.
            </p>
            <Button
              type="button"
              onClick={() => navigateToStep(1)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Go Back to Asset Selection
            </Button>
          </div>
        )}
      </motion.div>

      {/* Request Classification Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6"
      >
        <h4 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-3">
          2. Request Classification
        </h4>

        <div className="bg-white border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Request Category <span className="text-red-500">*</span>
              </Label>
              <div className="relative" ref={categoryDropdownRef}>
                <div
                  className={`h-10 w-full rounded border ${
                    isCategoryOpen
                      ? "border-gray-400 ring-1 ring-blue-200"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white px-3 py-2 flex items-center justify-between cursor-pointer hover:border-gray-400 transition-colors dark:bg-gray-800 dark:text-gray-200`}
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  <div className="flex items-center w-full">
                    {selectedCategory ? (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {selectedCategory.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="truncate">
                            {selectedCategory.name}
                          </span>
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
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Select Request Category
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 text-gray-500 ${
                      isCategoryOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Category Dropdown Menu */}
                {isCategoryOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-2 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={categorySearchTerm}
                          onChange={(e) =>
                            setCategorySearchTerm(e.target.value)
                          }
                          placeholder="Search categories..."
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="py-1">
                      {isLoadingCategories ? (
                        <div className="px-4 py-8 text-center">
                          <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-current border-t-transparent text-gray-600"></div>
                          <p className="mt-2 text-sm text-gray-500">
                            Loading categories...
                          </p>
                        </div>
                      ) : filteredCategories.length > 0 ? (
                        filteredCategories.map((category) =>
                          renderDropdownItem(
                            category,
                            Number(formData.category) === category.id,
                            () => handleCategorySelect(category.id),
                            "bg-gray-100",
                            "text-gray-700",
                            "text-gray-600"
                          )
                        )
                      ) : (
                        <div className="px-4 py-8 text-gray-500 dark:text-gray-400 text-center flex flex-col items-center">
                          <Search className="h-6 w-6 mb-2 text-gray-400 opacity-50" />
                          <p>
                            No categories found matching "{categorySearchTerm}"
                          </p>
                          <button
                            className="mt-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            onClick={() => setCategorySearchTerm("")}
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

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="concerned_department" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Concerned Department <span className="text-red-500">*</span>
              </Label>
              <div className="relative" ref={departmentDropdownRef}>
                <div
                  className={`h-10 w-full rounded border ${
                    isDepartmentOpen
                      ? "border-gray-400 ring-1 ring-blue-200"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white px-3 py-2 flex items-center justify-between cursor-pointer hover:border-gray-400 transition-colors dark:bg-gray-800 dark:text-gray-200`}
                  onClick={() => setIsDepartmentOpen(!isDepartmentOpen)}
                >
                  <div className="flex items-center w-full">
                    {selectedDepartment ? (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {selectedDepartment.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="truncate">
                            {selectedDepartment.name}
                          </span>
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
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Select Concerned Department
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 text-gray-500 ${
                      isDepartmentOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Department Dropdown Menu */}
                {isDepartmentOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-2 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={departmentSearchTerm}
                          onChange={(e) =>
                            setDepartmentSearchTerm(e.target.value)
                          }
                          placeholder="Search departments..."
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="py-1">
                      {isLoadingDepartments ? (
                        <div className="px-4 py-8 text-center">
                          <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-current border-t-transparent text-gray-600"></div>
                          <p className="mt-2 text-sm text-gray-500">
                            Loading departments...
                          </p>
                        </div>
                      ) : filteredDepartments.length > 0 ? (
                        filteredDepartments.map((department) =>
                          renderDropdownItem(
                            department,
                            Number(formData.concerned_department) ===
                              department.id,
                            () => handleDepartmentSelect(department.id),
                            "bg-gray-100",
                            "text-gray-700",
                            "text-gray-600"
                          )
                        )
                      ) : (
                        <div className="px-4 py-8 text-gray-500 dark:text-gray-400 text-center flex flex-col items-center">
                          <Search className="h-6 w-6 mb-2 text-gray-400 opacity-50" />
                          <p>
                            No departments found matching "
                            {departmentSearchTerm}"
                          </p>
                          <button
                            className="mt-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            onClick={() => setDepartmentSearchTerm("")}
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

            {/* Approval Category */}
            <div className="space-y-2">
              <Label htmlFor="approvalCategory" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Budget Approval Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.approvalCategory || ""}
                onValueChange={(value) => {
                  const event = {
                    target: { name: "approvalCategory", value }
                  } as React.ChangeEvent<HTMLSelectElement>;
                  handleChange(event);
                }}
              >
                <SelectTrigger className="w-full h-10 border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-blue-200 focus:border-blue-400">
                  <SelectValue placeholder="Select Budget Approval Category" />
                </SelectTrigger>
                <SelectContent>
                  {approvalCategories.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Approval Type */}
            <div className="space-y-2">
              <Label htmlFor="approvalType" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Approval Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.approvalType || ""}
                onValueChange={(value) => {
                  const event = {
                    target: { name: "approvalType", value }
                  } as React.ChangeEvent<HTMLSelectElement>;
                  handleChange(event);
                }}
              >
                <SelectTrigger className="w-full h-10 border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-blue-200 focus:border-blue-400">
                  <SelectValue placeholder="Select Approval Type" />
                </SelectTrigger>
                <SelectContent>
                  {approvalTypes.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Request Details */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mb-6"
      >
        <h4 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-3">
          3. Request Details
        </h4>

        <div className="bg-white border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="space-y-4">
            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Reason for Request <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reason"
                name="reason"
                placeholder="Enter reason for request"
                value={formData.reason || ""}
                onChange={handleChange}
                rows={4}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Notify To */}
            <div className="space-y-2">
              <Label htmlFor="notifyTo" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Notify Request to <span className="text-red-500">*</span>
              </Label>
              <div className="relative" ref={dropdownRef}>
                <div
                  className={`h-10 w-full rounded border ${
                    isOpen
                      ? "border-gray-400 ring-1 ring-blue-200"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white px-3 py-2 flex items-center justify-between cursor-pointer hover:border-gray-400 transition-colors dark:bg-gray-800 dark:text-gray-200`}
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
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Select user to notify
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 text-gray-500 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-2 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search users..."
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="py-1">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((u: any) =>
                          renderDropdownItem(
                            u,
                            formData.notifyTo === u.id,
                            () => handleUserSelect(u.id),
                            "bg-blue-100",
                            "text-blue-700",
                            "text-blue-600"
                          )
                        )
                      ) : (
                        <div className="px-4 py-8 text-gray-500 dark:text-gray-400 text-center flex flex-col items-center">
                          <Search className="h-6 w-6 mb-2 text-gray-400 opacity-50" />
                          <p>No users found matching "{searchTerm}"</p>
                          <button
                            className="mt-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            onClick={() => setSearchTerm("")}
                          >
                            Clear search
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                The selected user will be notified about this request
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Attachments */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="mb-6"
      >
        <h4 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-3">
          4. Attachments
        </h4>

        <div className="bg-white border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form Attachments */}
            <div className="space-y-3">
              <Label htmlFor="formAttachments" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Request Form Attachments
              </Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 transition-colors hover:border-gray-400 dark:hover:border-gray-500">
                <div className="flex flex-col items-center justify-center text-center">
                  <Upload className="h-6 w-6 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Drag & drop files or
                  </p>
                  <div className="mt-2 relative">
                    <label
                      htmlFor="form-attachments-uploader"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    >
                      <span>Browse files</span>
                      <input
                        id="form-attachments-uploader"
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFormAttachmentsChange}
                        multiple
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    PDF, DOCX, XLSX files up to 10MB
                  </p>
                </div>
              </div>

              {/* Attached files list */}
              {formAttachments.length > 0 && (
                <div className="space-y-2 mt-3">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {formAttachments.length} file(s) attached
                  </p>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {formAttachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 px-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md"
                      >
                        <div className="flex items-center space-x-2">
                          <FileIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFormAttachment(index)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                          aria-label="Remove file"
                        >
                          <X size={14} className="text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Asset Attachments */}
            <div className="space-y-3">
              <Label htmlFor="assetAttachments" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Asset Attachments
              </Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 transition-colors hover:border-gray-400 dark:hover:border-gray-500">
                <div className="flex flex-col items-center justify-center text-center">
                  <Upload className="h-6 w-6 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Drag & drop files or
                  </p>
                  <div className="mt-2 relative">
                    <label
                      htmlFor="asset-attachments-uploader"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    >
                      <span>Browse files</span>
                      <input
                        id="asset-attachments-uploader"
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleAssetAttachmentsChange}
                        multiple
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    PDF, Images, CAD files up to 10MB
                  </p>
                </div>
              </div>

              {/* Attached files list */}
              {assetAttachments.length > 0 && (
                <div className="space-y-2 mt-3">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {assetAttachments.length} file(s) attached
                  </p>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {assetAttachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 px-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md"
                      >
                        <div className="flex items-center space-x-2">
                          <FileIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAssetAttachment(index)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                          aria-label="Remove file"
                        >
                          <X size={14} className="text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Benefit to Organization */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mb-6"
      >
        <h4 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-3">
          5. Benefit to Organization
        </h4>
        <div className="bg-white border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="space-y-2">
            <Label htmlFor="benefitToOrg" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Organizational Benefits
            </Label>
            <Textarea
              id="benefitToOrg"
              name="benefitToOrg"
              value={formData.benefitToOrg || ""}
              onChange={handleChange}
              placeholder="Please explain how this request benefits the organization"
              rows={4}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
      </motion.div>

      {/* Additional Information */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mb-8"
      >
        <h4 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-3">
          6. Additional Information
        </h4>

        <div className="bg-white border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Payback Year Select */}
            <div className="space-y-2">
              <Label htmlFor="paybackmonth" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Payback Year
              </Label>
              <Select
                value={formData.paybackmonth || ""}
                onValueChange={(value) => {
                  const event = {
                    target: { name: "paybackmonth", value }
                  } as React.ChangeEvent<HTMLSelectElement>;
                  handleChange(event);
                }}
              >
                <SelectTrigger className="w-full h-10 border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-blue-200 focus:border-blue-400">
                  <SelectValue placeholder="Select Payback Year" />
                </SelectTrigger>
                <SelectContent>
                  {paybackPeriodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Document Enclosed Summary Textarea */}
            <div className="space-y-2">
              <Label htmlFor="documentsSummary" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Document Enclosed Summary
              </Label>
              <Textarea
                id="documentsSummary"
                name="documentsSummary"
                value={formData.documentsSummary || ""}
                onChange={handleChange}
                placeholder="Enter document enclosed summary"
                rows={4}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
