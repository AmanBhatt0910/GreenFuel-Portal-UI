"use client"
import React, { useState, useEffect } from "react";
import {
  Building2,
  ChevronDown,
  ChevronUp,
  Edit,
  Factory,
  Info,
  LayoutGrid,
  Plus,
  Trash2,
  Users,
  X,
  Check,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Types
interface Employee {
  id: string;
  name: string;
  designation: string;
  level: number;
}

interface Department {
  id: string;
  name: string;
  employees: Employee[];
}

interface Plant {
  id: string;
  name: string;
  location: string;
  departments: Department[];
}

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function PlantHierarchyManagement() {
  // State
  const [plants, setPlants] = useState<Plant[]>([]);
  const [activePlantId, setActivePlantId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("plants");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // New entity states
  const [newPlant, setNewPlant] = useState<{ name: string; location: string }>({
    name: "",
    location: "",
  });
  const [newDepartment, setNewDepartment] = useState<{ name: string }>({
    name: "",
  });

  // Get the highest level in a department + 1 (for auto-increment)
  const getNextLevel = (employees: Employee[]) => {
    if (employees.length === 0) return 1;
    const maxLevel = Math.max(...employees.map((e) => e.level));
    return maxLevel + 1;
  };

  const [newEmployee, setNewEmployee] = useState<{
    name: string;
    designation: string;
    level: number;
  }>({
    name: "",
    designation: "",
    level: 1,
  });

  // Dialog states
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");

  // Editing states
  const [editingPlantId, setEditingPlantId] = useState<string>("");
  const [editingDepartmentId, setEditingDepartmentId] = useState<string>("");
  const [editingEmployeeId, setEditingEmployeeId] = useState<string>("");
  const [editingName, setEditingName] = useState("");
  const [editingLocation, setEditingLocation] = useState("");
  const [editingDesignation, setEditingDesignation] = useState("");
  const [editingLevel, setEditingLevel] = useState(1);

  // Department expansion state
  const [expandedDepartments, setExpandedDepartments] = useState<
    Record<string, boolean>
  >({});

  // Hierarchy validation
  const [validatedHierarchy, setValidatedHierarchy] = useState<any[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem("plantHierarchyData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setPlants(parsedData);
      } catch (err) {
        console.error("Failed to parse saved data", err);
      }
    }
  }, []);

  // Save data to localStorage whenever plants change
  useEffect(() => {
    localStorage.setItem("plantHierarchyData", JSON.stringify(plants));
  }, [plants]);

  // Helper function to get active plant
  const getActivePlant = () => {
    return plants.find((plant) => plant.id === activePlantId);
  };

  // Plant CRUD operations
  const addNewPlant = () => {
    try {
      setIsLoading(true);
      if (!newPlant.name.trim()) {
        setError("Plant name is required");
        return;
      }

      const newPlantObj: Plant = {
        id: generateId(),
        name: newPlant.name,
        location: newPlant.location,
        departments: [],
      };

      setPlants([...plants, newPlantObj]);
      setNewPlant({ name: "", location: "" });
      setError(null);
    } catch (err) {
      setError("Failed to add plant");
    } finally {
      setIsLoading(false);
    }
  };

  const startEditingPlant = (plant: Plant) => {
    setEditingPlantId(plant.id);
    setEditingName(plant.name);
    setEditingLocation(plant.location);
  };

  const saveEditedPlant = () => {
    if (!editingName.trim()) {
      setError("Plant name is required");
      return;
    }

    setPlants(
      plants.map((plant) =>
        plant.id === editingPlantId
          ? { ...plant, name: editingName, location: editingLocation }
          : plant
      )
    );

    cancelEditingPlant();
  };

  const cancelEditingPlant = () => {
    setEditingPlantId("");
    setEditingName("");
    setEditingLocation("");
  };

  const deletePlant = (plantId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this plant? This will delete all departments and employees within it."
      )
    ) {
      setPlants(plants.filter((plant) => plant.id !== plantId));
      if (activePlantId === plantId) {
        setActivePlantId("");
      }
    }
  };

  // Department CRUD operations
  const addNewDepartment = (plantId: string) => {
    if (!newDepartment.name.trim()) {
      setError("Department name is required");
      return;
    }

    const newDepartmentObj: Department = {
      id: generateId(),
      name: newDepartment.name,
      employees: [],
    };

    setPlants(
      plants.map((plant) =>
        plant.id === plantId
          ? { ...plant, departments: [...plant.departments, newDepartmentObj] }
          : plant
      )
    );

    setNewDepartment({ name: "" });
    setError(null);

    // Auto-expand the newly created department
    setExpandedDepartments({
      ...expandedDepartments,
      [newDepartmentObj.id]: true,
    });
  };

  const startEditingDepartment = (plantId: string, department: Department) => {
    setEditingDepartmentId(department.id);
    setEditingName(department.name);
  };

  const saveEditedDepartment = (plantId: string) => {
    if (!editingName.trim()) {
      setError("Department name is required");
      return;
    }

    setPlants(
      plants.map((plant) =>
        plant.id === plantId
          ? {
              ...plant,
              departments: plant.departments.map((dept) =>
                dept.id === editingDepartmentId
                  ? { ...dept, name: editingName }
                  : dept
              ),
            }
          : plant
      )
    );

    cancelEditingDepartment();
  };

  const cancelEditingDepartment = () => {
    setEditingDepartmentId("");
    setEditingName("");
  };

  const deleteDepartment = (plantId: string, departmentId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this department? This will delete all employees within it."
      )
    ) {
      setPlants(
        plants.map((plant) =>
          plant.id === plantId
            ? {
                ...plant,
                departments: plant.departments.filter(
                  (dept) => dept.id !== departmentId
                ),
              }
            : plant
        )
      );
    }
  };

  const toggleDepartmentExpansion = (departmentId: string) => {
    setExpandedDepartments({
      ...expandedDepartments,
      [departmentId]: !expandedDepartments[departmentId],
    });
  };

  // Employee CRUD operations
  const openAddEmployeeDialog = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);

    // Find the department to get next level
    const plant = getActivePlant();
    if (plant) {
      const department = plant.departments.find((d) => d.id === departmentId);
      if (department) {
        // Auto-increment level for new employee
        const nextLevel = getNextLevel(department.employees);
        setNewEmployee({
          name: "",
          designation: "",
          level: nextLevel,
        });
      }
    }

    setIsAddEmployeeDialogOpen(true);
  };

  const addNewEmployee = () => {
    if (!newEmployee.name.trim()) {
      setError("Employee name is required");
      return;
    }

    if (!newEmployee.designation.trim()) {
      setError("Designation is required");
      return;
    }

    const newEmployeeObj: Employee = {
      id: generateId(),
      name: newEmployee.name,
      designation: newEmployee.designation,
      level: newEmployee.level,
    };

    setPlants(
      plants.map((plant) =>
        plant.id === activePlantId
          ? {
              ...plant,
              departments: plant.departments.map((dept) =>
                dept.id === selectedDepartmentId
                  ? { ...dept, employees: [...dept.employees, newEmployeeObj] }
                  : dept
              ),
            }
          : plant
      )
    );

    setIsAddEmployeeDialogOpen(false);
    setError(null);
  };

  const startEditingEmployee = (
    plantId: string,
    departmentId: string,
    employee: Employee
  ) => {
    setEditingEmployeeId(employee.id);
    setEditingName(employee.name);
    setEditingDesignation(employee.designation);
    setEditingLevel(employee.level);
  };

  const saveEditedEmployee = (plantId: string, departmentId: string) => {
    if (!editingName.trim()) {
      setError("Employee name is required");
      return;
    }

    if (!editingDesignation.trim()) {
      setError("Designation is required");
      return;
    }

    setPlants(
      plants.map((plant) =>
        plant.id === plantId
          ? {
              ...plant,
              departments: plant.departments.map((dept) =>
                dept.id === departmentId
                  ? {
                      ...dept,
                      employees: dept.employees.map((emp) =>
                        emp.id === editingEmployeeId
                          ? {
                              ...emp,
                              name: editingName,
                              designation: editingDesignation,
                              level: editingLevel,
                            }
                          : emp
                      ),
                    }
                  : dept
              ),
            }
          : plant
      )
    );

    cancelEditingEmployee();
  };

  const cancelEditingEmployee = () => {
    setEditingEmployeeId("");
    setEditingName("");
    setEditingDesignation("");
    setEditingLevel(1);
  };

  const deleteEmployee = (
    plantId: string,
    departmentId: string,
    employeeId: string
  ) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setPlants(
        plants.map((plant) =>
          plant.id === plantId
            ? {
                ...plant,
                departments: plant.departments.map((dept) =>
                  dept.id === departmentId
                    ? {
                        ...dept,
                        employees: dept.employees.filter(
                          (emp) => emp.id !== employeeId
                        ),
                      }
                    : dept
                ),
              }
            : plant
        )
      );
    }
  };

  // Level operations
  const handleLevelInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEditing = false
  ) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) return;

    if (isEditing) {
      setEditingLevel(value);
    } else {
      setNewEmployee({ ...newEmployee, level: value });
    }
  };

  const moveEmployeeUp = (
    plantId: string,
    departmentId: string,
    employeeId: string
  ) => {
    setPlants(
      plants.map((plant) =>
        plant.id === plantId
          ? {
              ...plant,
              departments: plant.departments.map((dept) =>
                dept.id === departmentId
                  ? {
                      ...dept,
                      employees: dept.employees.map((emp) =>
                        emp.id === employeeId && emp.level > 1
                          ? { ...emp, level: emp.level - 1 }
                          : emp
                      ),
                    }
                  : dept
              ),
            }
          : plant
      )
    );
  };

  const moveEmployeeDown = (
    plantId: string,
    departmentId: string,
    employeeId: string
  ) => {
    setPlants(
      plants.map((plant) =>
        plant.id === plantId
          ? {
              ...plant,
              departments: plant.departments.map((dept) =>
                dept.id === departmentId
                  ? {
                      ...dept,
                      employees: dept.employees.map((emp) =>
                        emp.id === employeeId
                          ? { ...emp, level: emp.level + 1 }
                          : emp
                      ),
                    }
                  : dept
              ),
            }
          : plant
      )
    );
  };

  // Helpers
  const getSortedEmployees = (employees: Employee[]) => {
    return [...employees].sort((a, b) => a.level - b.level);
  };

  const getLevelColor = (level: number) => {
    const colors = [
      "bg-blue-50 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
      "bg-green-50 text-green-800 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800",
      "bg-purple-50 text-purple-800 dark:bg-purple-900/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800",
      "bg-amber-50 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
      "bg-red-50 text-red-800 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800",
    ];

    // Use modulo to cycle through colors for higher levels
    return colors[(level - 1) % colors.length];
  };

  const validateHierarchy = () => {
    const hierarchyData: any[] = [];

    plants.forEach((plant) => {
      plant.departments.forEach((department) => {
        const sortedEmployees = getSortedEmployees(department.employees);

        sortedEmployees.forEach((employee) => {
          hierarchyData.push({
            level: employee.level,
            plantName: plant.name,
            departmentName: department.name,
            employeeName: employee.name,
            designation: employee.designation,
          });
        });
      });
    });

    // Sort by level
    hierarchyData.sort((a, b) => a.level - b.level);
    setValidatedHierarchy(hierarchyData);
  };

  // Custom breadcrumb component
  const CustomBreadcrumb = ({
    items,
    ...props
  }: {
    items: { label: string; href: string }[];
  }) => (
    <nav className="flex" aria-label="Breadcrumb" {...props}>
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && <span className="mx-2 text-gray-400">/</span>}
            <a
              href={item.href}
              className="text-sm font-medium text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );

  return (
    <div
      className="container mx-auto"
      data-component="plant-hierarchy-management"
    >
      {/* Main container */}
      <div className="container py-4 mx-auto max-w-[95%] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        {/* Breadcrumb navigation */}
        <CustomBreadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Plant Management", href: "/dashboard/plants" },
          ]}
          aria-label="Breadcrumb Navigation"
        />

        {/* Page header */}
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-6 mt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Plant Hierarchy Management
            </h1>
            <p className="text-green-700 dark:text-green-400 text-sm font-medium mt-1">
              Manage plants, departments, and employee hierarchies
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
                  Create plants, add departments within each plant, and manage
                  employees with their designations and levels. You can directly
                  input employee level numbers or use the up/down arrows to
                  adjust levels.
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

        {/* Main Tabs */}
        <Tabs
          defaultValue="plants"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="plants" className="flex items-center gap-2">
              <Factory className="w-4 h-4" />
              Plants
            </TabsTrigger>
            <TabsTrigger
              value="departments"
              className="flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Departments
            </TabsTrigger>
            <TabsTrigger value="hierarchy" className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              Hierarchy
            </TabsTrigger>
          </TabsList>

          {/* Plants Tab */}
          <TabsContent value="plants">
            {/* Add New Plant Section */}
            <Card
              className="mb-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm"
              data-section="new-plant"
            >
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 dark:text-gray-100">
                  Add New Plant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="plantName"
                      className="text-sm font-medium mb-1 block"
                    >
                      Plant Name
                    </label>
                    <Input
                      id="plantName"
                      placeholder="e.g., Greenfuel CNG"
                      value={newPlant.name}
                      onChange={(e) =>
                        setNewPlant({ ...newPlant, name: e.target.value })
                      }
                      className="bg-white dark:bg-gray-700"
                      aria-label="Plant name"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="plantLocation"
                      className="text-sm font-medium mb-1 block"
                    >
                      Location (Optional)
                    </label>
                    <Input
                      id="plantLocation"
                      placeholder="e.g., West Industrial Zone"
                      value={newPlant.location}
                      onChange={(e) =>
                        setNewPlant({ ...newPlant, location: e.target.value })
                      }
                      className="bg-white dark:bg-gray-700"
                      aria-label="Plant location"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Button
                  onClick={addNewPlant}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  aria-label="Add plant"
                  disabled={isLoading}
                >
                  <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                  Add Plant
                </Button>
              </CardContent>
            </Card>

            {/* Plants List */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              data-section="plants-list"
            >
              {plants.map((plant) => (
                <Card
                  key={plant.id}
                  className={`bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm transition hover:shadow-md ${
                    activePlantId === plant.id ? "ring-2 ring-green-500" : ""
                  }`}
                  data-plant-id={plant.id}
                  onClick={() => setActivePlantId(plant.id)}
                >
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    {editingPlantId === plant.id ? (
                      // Edit mode for plant
                      <div className="flex flex-col gap-3 w-full">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="bg-white dark:bg-gray-700"
                          placeholder="Plant Name"
                          aria-label="Edit plant name"
                        />
                        <Input
                          value={editingLocation}
                          onChange={(e) => setEditingLocation(e.target.value)}
                          className="bg-white dark:bg-gray-700"
                          placeholder="Location (Optional)"
                          aria-label="Edit plant location"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              saveEditedPlant();
                            }}
                            variant="ghost"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                            aria-label="Save changes"
                          >
                            <Check
                              className="h-4 w-4 mr-1"
                              aria-hidden="true"
                            />
                            Save
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelEditingPlant();
                            }}
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            aria-label="Cancel editing"
                          >
                            <X className="h-4 w-4 mr-1" aria-hidden="true" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View mode for plant
                      <div>
                        <CardTitle className="text-xl text-gray-800 dark:text-gray-100">
                          {plant.name}
                        </CardTitle>
                        {plant.location && (
                          <CardDescription className="text-green-700 dark:text-green-400">
                            {plant.location}
                          </CardDescription>
                        )}
                      </div>
                    )}

                    {editingPlantId !== plant.id && (
                      <div className="flex gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditingPlant(plant);
                                }}
                                aria-label="Edit plant"
                              >
                                <Edit className="h-4 w-4" aria-hidden="true" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit Plant</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deletePlant(plant.id);
                                }}
                                aria-label="Delete plant"
                              >
                                <Trash2
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete Plant</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Departments:
                        </span>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800">
                          {plant.departments.length}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Total Employees:
                        </span>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                          {plant.departments.reduce(
                            (sum, dept) => sum + dept.employees.length,
                            0
                          )}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      variant="outline"
                      className="w-full border-gray-200 dark:border-gray-700 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20 dark:hover:text-green-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePlantId(plant.id);
                        setActiveTab("departments");
                      }}
                      aria-label="View departments"
                    >
                      View Departments
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {plants.length === 0 && (
              <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Building2
                  className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600"
                  aria-hidden="true"
                />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                  No Plants Added
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Start by adding your first plant using the form above.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments">
            {activePlantId ? (
              <>
                <Card className="mb-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800 dark:text-gray-100">
                      Add New Department to {getActivePlant()?.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="departmentName"
                          className="text-sm font-medium mb-1 block"
                        >
                          Department Name
                        </label>
                        <Input
                          id="departmentName"
                          placeholder="e.g., Production"
                          value={newDepartment.name}
                          onChange={(e) =>
                            setNewDepartment({ name: e.target.value })
                          }
                          className="bg-white dark:bg-gray-700"
                          aria-label="Department name"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => addNewDepartment(activePlantId)}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                      aria-label="Add department"
                    >
                      <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                      Add Department
                    </Button>
                  </CardContent>
                </Card>

                {/* Departments List */}
                <div className="space-y-4" data-section="departments-list">
                  {getActivePlant()?.departments.map((department) => (
                    <Collapsible
                      key={department.id}
                      open={expandedDepartments[department.id]}
                      onOpenChange={() =>
                        toggleDepartmentExpansion(department.id)
                      }
                      className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
                      data-department-id={department.id}
                    >
                      <div className="flex items-center justify-between p-4">
                        {editingDepartmentId === department.id ? (
                          // Edit mode for department
                          <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <Input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="bg-white dark:bg-gray-700 flex-grow"
                              placeholder="Department Name"
                              aria-label="Edit department name"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() =>
                                  saveEditedDepartment(activePlantId)
                                }
                                variant="ghost"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                                aria-label="Save changes"
                              >
                                <Check
                                  className="h-4 w-4 mr-1"
                                  aria-hidden="true"
                                />
                                Save
                              </Button>
                              <Button
                                onClick={cancelEditingDepartment}
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                aria-label="Cancel editing"
                              >
                                <X
                                  className="h-4 w-4 mr-1"
                                  aria-hidden="true"
                                />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // View mode for department
                          <div className="flex items-center space-x-2">
                            <Building2
                              className="h-5 w-5 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                            />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                              {department.name}
                            </h3>
                            <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                              {department.employees.length} Employees
                            </Badge>
                          </div>
                        )}

                        <div className="flex items-center">
                          {editingDepartmentId !== department.id && (
                            <>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                      onClick={() =>
                                        startEditingDepartment(
                                          activePlantId,
                                          department
                                        )
                                      }
                                      aria-label="Edit department"
                                    >
                                      <Edit
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                      />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Edit Department
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                      onClick={() =>
                                        deleteDepartment(
                                          activePlantId,
                                          department.id
                                        )
                                      }
                                      aria-label="Delete department"
                                    >
                                      <Trash2
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                      />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Delete Department
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </>
                          )}

                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                              aria-label={
                                expandedDepartments[department.id]
                                  ? "Collapse department"
                                  : "Expand department"
                              }
                            >
                              {expandedDepartments[department.id] ? (
                                <ChevronUp
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                              ) : (
                                <ChevronDown
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                      </div>

                      <CollapsibleContent>
                        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                              <Users
                                className="h-4 w-4 mr-2"
                                aria-hidden="true"
                              />
                              Employees
                            </h4>
                            <Button
                              onClick={() =>
                                openAddEmployeeDialog(department.id)
                              }
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              aria-label="Add employee"
                            >
                              <Plus
                                className="h-3.5 w-3.5 mr-1"
                                aria-hidden="true"
                              />
                              Add Employee
                            </Button>
                          </div>

                          {department.employees.length > 0 ? (
                            <div className="space-y-3">
                              {getSortedEmployees(department.employees).map(
                                (employee) => (
                                  <div
                                    key={employee.id}
                                    className="border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-gray-50 dark:bg-gray-900/50"
                                    data-employee-id={employee.id}
                                  >
                                    {editingEmployeeId === employee.id ? (
                                      // Edit mode for employee
                                      <div className="grid grid-cols-1 gap-3 w-full">
                                        <Input
                                          value={editingName}
                                          onChange={(e) =>
                                            setEditingName(e.target.value)
                                          }
                                          className="bg-white dark:bg-gray-700"
                                          placeholder="Employee Name"
                                          aria-label="Edit employee name"
                                        />
                                        <Input
                                          value={editingDesignation}
                                          onChange={(e) =>
                                            setEditingDesignation(
                                              e.target.value
                                            )
                                          }
                                          className="bg-white dark:bg-gray-700"
                                          placeholder="Designation"
                                          aria-label="Edit employee designation"
                                        />
                                        <div className="flex items-center gap-2">
                                          <label
                                            htmlFor="editLevel"
                                            className="text-sm font-medium whitespace-nowrap"
                                          >
                                            Level:
                                          </label>
                                          <Input
                                            id="editLevel"
                                            type="number"
                                            min="1"
                                            value={editingLevel}
                                            onChange={(e) =>
                                              handleLevelInputChange(e, true)
                                            }
                                            className="bg-white dark:bg-gray-700 w-20"
                                            aria-label="Edit employee level"
                                          />
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                          <Button
                                            onClick={() =>
                                              saveEditedEmployee(
                                                activePlantId,
                                                department.id
                                              )
                                            }
                                            variant="ghost"
                                            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                                            aria-label="Save changes"
                                          >
                                            <Check
                                              className="h-4 w-4 mr-1"
                                              aria-hidden="true"
                                            />
                                            Save
                                          </Button>
                                          <Button
                                            onClick={cancelEditingEmployee}
                                            variant="ghost"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            aria-label="Cancel editing"
                                          >
                                            <X
                                              className="h-4 w-4 mr-1"
                                              aria-hidden="true"
                                            />
                                            Cancel
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      // View mode for employee
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                          <div className="font-medium text-gray-800 dark:text-gray-200">
                                            {employee.name}
                                          </div>
                                          <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {employee.designation}
                                          </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                          <Badge
                                            className={`${getLevelColor(
                                              employee.level
                                            )}`}
                                          >
                                            Level {employee.level}
                                          </Badge>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                            onClick={() =>
                                              moveEmployeeUp(
                                                activePlantId,
                                                department.id,
                                                employee.id
                                              )
                                            }
                                            disabled={employee.level <= 1}
                                            aria-label="Move employee up one level"
                                          >
                                            <ChevronUp
                                              className="h-4 w-4"
                                              aria-hidden="true"
                                            />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                            onClick={() =>
                                              moveEmployeeDown(
                                                activePlantId,
                                                department.id,
                                                employee.id
                                              )
                                            }
                                            aria-label="Move employee down one level"
                                          >
                                            <ChevronDown
                                              className="h-4 w-4"
                                              aria-hidden="true"
                                            />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                            onClick={() =>
                                              startEditingEmployee(
                                                activePlantId,
                                                department.id,
                                                employee
                                              )
                                            }
                                            aria-label="Edit employee"
                                          >
                                            <Edit
                                              className="h-4 w-4"
                                              aria-hidden="true"
                                            />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                            onClick={() =>
                                              deleteEmployee(
                                                activePlantId,
                                                department.id,
                                                employee.id
                                              )
                                            }
                                            aria-label="Delete employee"
                                          >
                                            <Trash2
                                              className="h-4 w-4"
                                              aria-hidden="true"
                                            />
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
                              <Users
                                className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-600"
                                aria-hidden="true"
                              />
                              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                No employees added yet. Add your first employee
                                to this department.
                              </p>
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}

                  {getActivePlant()?.departments.length === 0 && (
                    <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <Building2
                        className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600"
                        aria-hidden="true"
                      />
                      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                        No Departments Added
                      </h3>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Start by adding your first department using the form
                        above.
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Factory
                  className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600"
                  aria-hidden="true"
                />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                  No Plant Selected
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Please select a plant from the Plants tab first.
                </p>
                <Button
                  className="mt-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  onClick={() => setActiveTab("plants")}
                  aria-label="Go to plants tab"
                >
                  Go to Plants
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Hierarchy Tab */}
          <TabsContent value="hierarchy">
            <Card className="mb-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 dark:text-gray-100">
                  Employee Hierarchy View
                </CardTitle>
                <CardDescription>
                  View your organization's employee hierarchy across all plants
                  and departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={validateHierarchy}
                  className="mb-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  aria-label="Generate hierarchy view"
                >
                  <LayoutGrid className="w-4 h-4 mr-2" aria-hidden="true" />
                  Generate Hierarchy View
                </Button>

                {validatedHierarchy.length > 0 ? (
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {Array.from(
                        new Set(validatedHierarchy.map((item) => item.level))
                      )
                        .sort((a, b) => a - b)
                        .map((level) => (
                          <div key={level} className="mb-4">
                            <h3
                              className={`text-lg font-medium mb-2 ${getLevelColor(
                                level
                              )} inline-block px-3 py-1 rounded-full`}
                            >
                              Level {level}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {validatedHierarchy
                                .filter((item) => item.level === level)
                                .map((item, index) => (
                                  <div
                                    key={index}
                                    className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-800 shadow-sm"
                                  >
                                    <div className="font-medium text-gray-800 dark:text-gray-200">
                                      {item.employeeName}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                      {item.designation}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                      <span className="font-medium">
                                        {item.plantName}
                                      </span>{" "}
                                      &rsaquo; {item.departmentName}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <LayoutGrid
                      className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600"
                      aria-hidden="true"
                    />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                      Hierarchy Not Generated
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Click the "Generate Hierarchy View" button to see your
                      organization's structure.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Employee Dialog */}
      <Dialog
        open={isAddEmployeeDialogOpen}
        onOpenChange={setIsAddEmployeeDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Add a new employee to the department. Level determines hierarchy
              position.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="employeeName" className="text-sm font-medium">
                Employee Name
              </label>
              <Input
                id="employeeName"
                placeholder="e.g., John Smith"
                value={newEmployee.name}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, name: e.target.value })
                }
                className="bg-white dark:bg-gray-700"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="designation" className="text-sm font-medium">
                Designation
              </label>
              <Input
                id="designation"
                placeholder="e.g., Plant Supervisor"
                value={newEmployee.designation}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    designation: e.target.value,
                  })
                }
                className="bg-white dark:bg-gray-700"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="level" className="text-sm font-medium">
                Hierarchy Level
              </label>
              <div className="flex items-center gap-3">
                <Input
                  id="level"
                  type="number"
                  min="1"
                  value={newEmployee.level}
                  onChange={(e) => handleLevelInputChange(e)}
                  className="bg-white dark:bg-gray-700 w-20"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Lower number = higher position
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md dark:bg-red-900/30 dark:border-red-800 dark:text-red-400 mb-4">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddEmployeeDialogOpen(false);
                setError(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={addNewEmployee}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
            >
              Add Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
