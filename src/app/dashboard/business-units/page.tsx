"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Save,
  Trash2,
  Plus,
  Edit,
  X,
  Check,
  Building,
  Info,
} from "lucide-react";
import { CustomBreadcrumb } from "@/components/custom/ui/Breadcrumb.custom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAxios from "@/app/hooks/use-axios";

/**
 * Interface for Designation data structure
 */
interface Designation {
  id: string;
  name: string;
  level: number;
  business_unit: string;
}

/**
 * Interface for BusinessUnit data structure
 */
interface BusinessUnit {
  id: string;
  name: string;
  designations: Designation[];
}

/**
 * State interface for new business unit
 */
interface NewUnitState {
  name: string;
}

/**
 * State interface for new designation
 */
interface NewDesignationState {
  name: string;
  level: number;
}

/**
 * Level styling configuration - determines color scheme based on level value
 */
const getLevelColor = (level:number) => {
  // Colors based on level groups - can be expanded for more levels
  if (level <= 2) {
    return "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300";
  } else if (level <= 4) {
    return "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300";
  } else if (level <= 6) {
    return "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-900 dark:text-green-300";
  } else {
    return "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300";
  }
};

/**
 * BusinessUnitHierarchy Component - Manages the organization structure
 */
const BusinessUnitHierarchy: React.FC = () => {
  // Main state for business units data
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State for new business unit form
  const [newUnit, setNewUnit] = useState<NewUnitState>({
    name: "",
  });

  // State for new designation form
  const [newDesignation, setNewDesignation] = useState<NewDesignationState>({
    name: "",
    level: 1,
  });

  // State for active and editing business units/designations
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [editingDesignationId, setEditingDesignationId] = useState<
    string | null
  >(null);
  const [editingName, setEditingName] = useState<string>("");
  const [editingLevel, setEditingLevel] = useState<number>(1);

  // API instance from custom hook
  const api = useAxios();

  // State for validated hierarchy display
  const [validatedHierarchy, setValidatedHierarchy] = useState<
    {
      unitName: string;
      title: string;
      level: number;
    }[]
  >([]);

  /**
   * Fetch business units on component mount
   */
  useEffect(() => {
    fetchBusinessUnits();
  }, []);

  /**
   * Fetches all business units from the API
   */
  const fetchBusinessUnits = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get("business-units/");
      console.log("Fetched business units:", response.data);

      const unitsWithDesignations: BusinessUnit[] = [];

      for (const unit of response.data) {
        const unitWithDesignations = {
          ...unit,
          designations: await fetchDesignationsForUnit(unit.id),
        };
        unitsWithDesignations.push(unitWithDesignations);
      }

      setBusinessUnits(unitsWithDesignations);
    } catch (err) {
      console.error("Error fetching business units:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching business units"
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetches designations for a specific business unit
   * @param businessUnitId - ID of the business unit
   */
  const fetchDesignationsForUnit = async (
    businessUnitId: string
  ): Promise<Designation[]> => {
    try {
      const response = await api.get(
        `designations/?business_unit=${businessUnitId}`
      );
      console.log(
        `Fetched designations for unit ${businessUnitId}:`,
        response.data
      );
      return response.data;
    } catch (err) {
      console.error(
        `Error fetching designations for business unit ${businessUnitId}:`,
        err
      );
      return [];
    }
  };

  /**
   * Creates a new business unit
   */
  const addNewUnit = async () => {
    if (!newUnit.name) {
      alert("Please enter a business unit name");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("business-units/", {
        name: newUnit.name,
      });

      console.log("Created business unit:", response.data);

      const newBusinessUnit = {
        id: response.data.id,
        name: response.data.name,
        designations: [],
      };
      setBusinessUnits([...businessUnits, newBusinessUnit]);
      setNewUnit({ name: "" });
    } catch (err) {
      console.error("Error creating business unit:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while creating the business unit"
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Deletes a business unit
   * @param id - ID of the business unit to delete
   */
  const deleteUnit = async (id: string) => {
    try {
      await api.delete(`business-units/${id}/`);
      setBusinessUnits(businessUnits.filter((unit) => unit.id !== id));
      if (activeUnitId === id) {
        setActiveUnitId(null);
      }
    } catch (err) {
      console.error("Error deleting business unit:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while deleting the business unit"
      );
    }
  };

  /**
   * Starts editing a business unit
   * @param unit - Business unit to edit
   */
  const startEditingUnit = (unit: BusinessUnit) => {
    setEditingUnitId(unit.id);
    setEditingName(unit.name);
  };

  /**
   * Saves the edited business unit
   */
  const saveEditedUnit = async () => {
    if (!editingUnitId || !editingName.trim()) return;

    try {
      const response = await api.put(`business-units/${editingUnitId}/`, {
        name: editingName,
      });

      setBusinessUnits(
        businessUnits.map((unit) =>
          unit.id === editingUnitId ? { ...unit, name: editingName } : unit
        )
      );

      setEditingUnitId(null);
      setEditingName("");
    } catch (err) {
      console.error("Error updating business unit:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while updating the business unit"
      );
    }
  };

  /**
   * Cancels editing a business unit
   */
  const cancelEditingUnit = () => {
    setEditingUnitId(null);
    setEditingName("");
  };

  /**
   * Adds a new designation to a business unit
   * @param unitId - ID of the business unit
   */
  const addNewDesignation = async (unitId: string) => {
    if (!newDesignation.name) {
      alert("Please fill in all designation fields");
      return;
    }

    if (newDesignation.level < 1) {
      alert("Level must be at least 1");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const designationData = {
        name: newDesignation.name,
        level: newDesignation.level,
        business_unit: unitId,
      };

      const response = await api.post("designations/", designationData);
      console.log("Created designation:", response.data);

      const updatedDesignations = await fetchDesignationsForUnit(unitId);

      setBusinessUnits(
        businessUnits.map((unit) =>
          unit.id === unitId
            ? { ...unit, designations: updatedDesignations }
            : unit
        )
      );

      setNewDesignation({ name: "", level: 1 });
    } catch (err) {
      console.error("Error creating designation:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while creating the designation"
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Deletes a designation
   * @param unitId - ID of the business unit
   * @param designationId - ID of the designation to delete
   */
  const deleteDesignation = async (unitId: string, designationId: string) => {
    try {
      await api.delete(`designations/${designationId}/`);

      setBusinessUnits(
        businessUnits.map((unit) =>
          unit.id === unitId
            ? {
                ...unit,
                designations: unit.designations.filter(
                  (d) => d.id !== designationId
                ),
              }
            : unit
        )
      );
    } catch (err) {
      console.error("Error deleting designation:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while deleting the designation"
      );
    }
  };

  /**
   * Starts editing a designation
   * @param unitId - ID of the business unit
   * @param designation - Designation to edit
   */
  const startEditingDesignation = (
    unitId: string,
    designation: Designation
  ) => {
    setEditingDesignationId(designation.id);
    setEditingName(designation.name);
    setEditingLevel(designation.level);
  };

  /**
   * Saves the edited designation
   * @param unitId - ID of the business unit
   */
  const saveEditedDesignation = async (unitId: string) => {
    if (!editingDesignationId || !editingName.trim()) return;

    try {
      const updatedDesignation = {
        name: editingName,
        level: editingLevel,
        business_unit: unitId,
      };

      await api.put(
        `designations/${editingDesignationId}/`,
        updatedDesignation
      );

      setBusinessUnits(
        businessUnits.map((unit) =>
          unit.id === unitId
            ? {
                ...unit,
                designations: unit.designations.map((d) =>
                  d.id === editingDesignationId
                    ? { ...d, name: editingName, level: editingLevel }
                    : d
                ),
              }
            : unit
        )
      );

      setEditingDesignationId(null);
      setEditingName("");
      setEditingLevel(1);
    } catch (err) {
      console.error("Error updating designation:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while updating the designation"
      );
    }
  };

  /**
   * Cancels editing a designation
   */
  const cancelEditingDesignation = () => {
    setEditingDesignationId(null);
    setEditingName("");
    setEditingLevel(1);
  };

  /**
   * Sorts designations by level
   * @param designations - Designations to sort
   */
  const getSortedDesignations = (designations: Designation[]) => {
    return [...designations].sort((a, b) => a.level - b.level);
  };

  /**
   * Validates the organization hierarchy
   */
  const validateHierarchy = () => {
    const flattenedHierarchy: {
      unitName: string;
      title: string;
      level: number;
    }[] = [];

    businessUnits.forEach((unit) => {
      unit.designations.forEach((designation) => {
        flattenedHierarchy.push({
          unitName: unit.name,
          title: designation.name,
          level: designation.level,
        });
      });
    });

    flattenedHierarchy.sort((a, b) => a.level - b.level);

    setValidatedHierarchy(flattenedHierarchy);
  };

  /**
   * Handles level input change for both new and editing designations
   * @param e - Change event
   * @param isEditing - Whether in editing mode
   */
  const handleLevelInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEditing: boolean = false
  ) => {
    const value = parseInt(e.target.value) || 1;
    // Only enforce minimum value of 1, no maximum restriction
    const level = Math.max(value, 1);

    if (isEditing) {
      setEditingLevel(level);
    } else {
      setNewDesignation({
        ...newDesignation,
        level,
      });
    }
  };

  return (
    <div
      className="container mx-auto "
      data-component="business-unit-hierarchy"
    >
      {/* Main container */}
      <div className="container py-4 mx-auto max-w-[95%] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        {/* Breadcrumb navigation */}
        <CustomBreadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Business Units", href: "/dashboard/business-units" },
          ]}
          aria-label="Breadcrumb Navigation"
        />

        {/* Page header */}
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-6 mt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" >
              Business Unit Hierarchy
            </h1>
            <p className="text-green-700 dark:text-green-400 text-sm font-medium mt-1">
              Manage and visualize your organization's hierarchical structure
            </p>
          </div>

          {/* Info tooltip */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center"
                  aria-label="How It Works"
                >
                  <Info className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span>How It Works</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-md p-4">
                <p>
                  Create business units and add designations with specific
                  levels. The validated hierarchy will display your
                  organizational structure sorted by level.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md dark:bg-red-900/30 dark:border-red-800 dark:text-red-400"
            role="alert"
            aria-live="assertive"
          >
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Add New Business Unit Section */}
        <Card
          className="mb-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm"
          data-section="new-business-unit"
        >
          <CardHeader>
            <CardTitle className="text-xl text-gray-800 dark:text-gray-100">
              Add New Business Unit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-grow">
                <Input
                  placeholder="Business Unit Name"
                  value={newUnit.name}
                  onChange={(e) => setNewUnit({ name: e.target.value })}
                  className="bg-white dark:bg-gray-700"
                  aria-label="Business unit name"
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={addNewUnit}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                aria-label="Add business unit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                    Add Unit
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Business Units Display Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-section="business-units-list"
        >
          {businessUnits.map((unit) => (
            <Card
              key={unit.id}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm"
              data-unit-id={unit.id}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                {editingUnitId === unit.id ? (
                  // Edit mode for business unit
                  <div className="flex items-center gap-2 flex-grow">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="bg-white dark:bg-gray-700"
                      placeholder="Business Unit Name"
                      aria-label="Edit business unit name"
                    />
                    <Button
                      onClick={saveEditedUnit}
                      variant="ghost"
                      size="icon"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                      aria-label="Save changes"
                    >
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      onClick={cancelEditingUnit}
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      aria-label="Cancel editing"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                ) : (
                  // Display mode for business unit
                  <div className="flex items-center">
                    <Building
                      className="h-5 w-5 text-green-600 dark:text-green-400 mr-2"
                      aria-hidden="true"
                    />
                    <CardTitle className="text-xl text-gray-800 dark:text-gray-100">
                      {unit.name}
                    </CardTitle>
                  </div>
                )}
                {editingUnitId !== unit.id && (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => startEditingUnit(unit)}
                      variant="ghost"
                      size="icon"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      aria-label={`Edit ${unit.name}`}
                    >
                      <Edit className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      onClick={() => deleteUnit(unit.id)}
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      aria-label={`Delete ${unit.name}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  Designations
                </h3>
                <div className="space-y-4">
                  {/* Designations List */}
                  <div
                    className="grid grid-cols-1 gap-2"
                    data-section="designations-list"
                  >
                    {getSortedDesignations(unit.designations).map(
                      (designation) => (
                        <div
                          key={designation.id}
                          className={`relative flex items-center justify-between p-3 border rounded-md ${getLevelColor(
                            designation.level
                          )}`}
                          data-designation-id={designation.id}
                          data-level={designation.level}
                        >
                          {editingDesignationId === designation.id ? (
                            // Edit mode for designation
                            <div className="flex flex-1 items-center gap-2">
                              <Input
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="bg-white dark:bg-gray-700 flex-grow"
                                placeholder="Designation Title"
                                aria-label="Edit designation title"
                              />
                              <div className="flex items-center gap-2">
                                <span className="text-xs whitespace-nowrap">
                                  Level:
                                </span>
                                <Input
                                  type="number"
                                  min="1"
                                  value={editingLevel}
                                  onChange={(e) =>
                                    handleLevelInputChange(e, true)
                                  }
                                  className="bg-white dark:bg-gray-700 w-16"
                                  placeholder="Level"
                                  aria-label="Edit designation level"
                                />
                              </div>
                              <Button
                                onClick={() => saveEditedDesignation(unit.id)}
                                variant="ghost"
                                size="icon"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                                aria-label="Save designation changes"
                              >
                                <Check className="h-4 w-4" aria-hidden="true" />
                              </Button>
                              <Button
                                onClick={cancelEditingDesignation}
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                aria-label="Cancel designation editing"
                              >
                                <X className="h-4 w-4" aria-hidden="true" />
                              </Button>
                            </div>
                          ) : (
                            // Display mode for designation
                            <>
                              <div className="flex-grow">
                                <span className="font-medium">
                                  {designation.name}
                                </span>
                                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-white/50 dark:bg-black/20">
                                  Level {designation.level}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  onClick={() =>
                                    startEditingDesignation(
                                      unit.id,
                                      designation
                                    )
                                  }
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                  aria-label={`Edit ${designation.name}`}
                                >
                                  <Edit
                                    className="h-3 w-3"
                                    aria-hidden="true"
                                  />
                                </Button>
                                <Button
                                  onClick={() =>
                                    deleteDesignation(unit.id, designation.id)
                                  }
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  aria-label={`Delete ${designation.name}`}
                                >
                                  <Trash2
                                    className="h-3 w-3"
                                    aria-hidden="true"
                                  />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      )
                    )}
                  </div>

                  {/* Add New Designation Form */}
                  <div
                    className="flex flex-col sm:flex-row gap-3 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-md border border-gray-100 dark:border-gray-700"
                    data-section="add-designation"
                  >
                    <Input
                      placeholder="Designation Title"
                      value={newDesignation.name}
                      onChange={(e) =>
                        setNewDesignation({
                          ...newDesignation,
                          name: e.target.value,
                        })
                      }
                      className="bg-white dark:bg-gray-700 flex-grow"
                      aria-label="New designation title"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs whitespace-nowrap">Level:</span>
                      <Input
                        type="number"
                        min="1"
                        value={newDesignation.level}
                        onChange={handleLevelInputChange}
                        className="bg-white dark:bg-gray-700 w-16"
                        placeholder="Level"
                        aria-label="New designation level"
                      />
                    </div>
                    <Button
                      onClick={() => addNewDesignation(unit.id)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                      aria-label={`Add designation to ${unit.name}`}
                    >
                      <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Hierarchy Validation Section */}
        <Card
          className="mt-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm"
          data-section="hierarchy-validation"
        >
          <CardHeader>
            <CardTitle className="text-xl text-gray-800 dark:text-gray-100">
              Validated Organization Hierarchy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={validateHierarchy}
              className="bg-purple-600 hover:bg-purple-700 text-white mb-4"
              aria-label="Validate hierarchy"
            >
              Validate Hierarchy
            </Button>

            {validatedHierarchy.length > 0 && (
              <div className="overflow-x-auto">
                <table
                  className="w-full border-collapse"
                  aria-label="Organization hierarchy"
                >
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                      <th className="px-4 py-3 border-b" scope="col">
                        Level
                      </th>
                      <th className="px-4 py-3 border-b" scope="col">
                        Business Unit
                      </th>
                      <th className="px-4 py-3 border-b" scope="col">
                        Designation
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {validatedHierarchy.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getLevelColor(
                              item.level
                            )}`}
                          >
                            {item.level}
                          </span>
                        </td>
                        <td className="px-4 py-3">{item.unitName}</td>
                        <td className="px-4 py-3">{item.title}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {validatedHierarchy.length === 0 && (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                Click 'Validate Hierarchy' to view your organization structure
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessUnitHierarchy;
