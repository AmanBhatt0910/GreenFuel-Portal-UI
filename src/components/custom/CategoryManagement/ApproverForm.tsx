import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import useAxios from "@/app/hooks/use-axios";
import { UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, X, Check, Search } from "lucide-react";
import { 
  User, 
  BusinessUnit, 
  Department, 
  Category, 
  Approver 
} from "./types";

interface ApproverFormProps {
  users: User[];
  businessUnits: BusinessUnit[];
  categories: Category[];
  onApproverAdded: (newApprover: Approver) => void;
}

const ApproverForm: React.FC<ApproverFormProps> = ({ 
  users, 
  businessUnits, 
  categories, 
  onApproverAdded 
}) => {
  const api = useAxios();
  
  // State for user selection dropdown
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Omit<Approver, 'id'>>({
    user: 0,
    business_unit: 0,
    department: 0,
    level: 1,
    approver_request_category: 0
  });

  // Selected user for display
  const selectedUser = users.find(u => u.id === formData.user);
  
  // Selected category for display
  const selectedCategory = categories.find(c => c.id === formData.approver_request_category);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Update departments when business unit changes - now moved to direct handling in the business unit selection
  // to make the department selection more responsive
  useEffect(() => {
    // Only run this on component mount to initialize any needed state
    // The department fetching is now handled directly in the business unit selection handler
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!formData.user) {
      toast.error('Please select a user');
      return;
    }
    
    if (!formData.business_unit) {
      toast.error('Please select a business unit');
      return;
    }
    
    if (!formData.department) {
      toast.error('Please select a department');
      return;
    }
    
    if (!formData.approver_request_category) {
      toast.error('Please select a category');
      return;
    }
    
    setLoading(true);
    try {
      // Create the approver data for submission
      const approverData = {
        user: formData.user,
        business_unit: formData.business_unit,
        department: formData.department,
        level: formData.level,
        approver_request_category: formData.approver_request_category,
        type: "category" 
      };
      
      console.log('Submitting approver data:', approverData);
      const response = await api.post('/approver/', approverData);
      console.log('Approver creation response:', response.data);
      
      // Find user, business unit, and department details for display
      const user_details = users.find(u => u.id === formData.user);
      const business_unit_details = businessUnits.find(bu => bu.id === formData.business_unit);
      const department_details = departments.find(dept => dept.id === formData.department);
      const category_details = categories.find(cat => cat.id === formData.approver_request_category);
      
      // Create enriched approver with details
      const newApprover: Approver = {
        ...response.data,
        user_details: user_details ? { 
          name: user_details.name,
          email: user_details.email 
        } : undefined,
        business_unit_details: business_unit_details ? { 
          name: business_unit_details.name 
        } : undefined,
        department_details: department_details ? { 
          name: department_details.name 
        } : undefined,
        category_details: category_details ? { 
          name: category_details.name 
        } : undefined
      };
      
      // Notify parent component
      onApproverAdded(newApprover);
      
      // Reset form
      setFormData({
        user: 0,
        business_unit: 0,
        department: 0,
        level: 1,
        approver_request_category: 0
      });
      
      toast.success('Approver added successfully');
    } catch (error) {
      console.error('Error adding approver:', error);
      toast.error('Failed to add approver. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle user selection
  const handleUserSelect = (userId: number) => {
    setFormData(prev => ({
      ...prev,
      user: userId
    }));
    setIsUserDropdownOpen(false);
    setSearchTerm('');
  };
  
  // Clear user selection
  const clearUserSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData(prev => ({
      ...prev,
      user: 0
    }));
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Add New Approver</CardTitle>
        <CardDescription>Assign users to categories with appropriate access levels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* User Selection */}
          <div className="space-y-2">
            <Label htmlFor="user" className="text-sm font-medium">User <span className="text-red-500">*</span></Label>
            <Popover open={isUserDropdownOpen} onOpenChange={setIsUserDropdownOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isUserDropdownOpen}
                  className="w-full justify-between h-10 border-gray-300 dark:border-gray-700"
                >
                  {selectedUser ? (
                    <div className="flex items-center gap-2 w-full overflow-hidden">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs">
                          {selectedUser.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{selectedUser.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">Select User</span>
                  )}
                  <ChevronDown size={16} className={`ml-auto shrink-0 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start" sideOffset={4}>
                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search users..."
                      className="w-full pl-8"
                    />
                  </div>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto py-2">
                  {loading ? (
                    <div className="py-6 flex flex-col items-center justify-center text-sm text-gray-500">
                      <div className="animate-spin h-5 w-5 text-blue-500 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <span>Loading users...</span>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="py-6 flex flex-col items-center justify-center text-sm text-gray-500">
                      <Search className="h-5 w-5 mb-2 text-gray-400 opacity-50" />
                      <p>No users found matching "{searchTerm}"</p>
                      {searchTerm && (
                        <button 
                          className="mt-2 text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => setSearchTerm('')}
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  ) : (
                    <div>
                      {filteredUsers.map((person) => (
                        <div
                          key={person.id}
                          className={`px-3 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors ${
                            formData.user === person.id ? 'bg-blue-50 dark:bg-gray-600' : ''
                          }`}
                          onClick={() => handleUserSelect(person.id)}
                        >
                          <div className="flex items-center">
                            <Avatar className="h-7 w-7 shrink-0 mr-2">
                              <AvatarFallback className={`text-xs ${
                                formData.user === person.id 
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                              }`}>
                                {person.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col overflow-hidden">
                              <span className={`text-sm truncate ${
                                formData.user === person.id ? 'font-medium' : ''
                              }`}>
                                {person.name}
                              </span>
                              {person.email && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {person.email}
                                </span>
                              )}
                            </div>
                            {formData.user === person.id && (
                              <div className="ml-auto">
                                <Check size={16} className="text-blue-500" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {selectedUser && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-xs text-gray-500 hover:text-red-600 justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearUserSelection(e);
                        setIsUserDropdownOpen(false);
                      }}
                    >
                      <X size={14} className="mr-1" />
                      Clear selection
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Business Unit Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="business_unit" className="text-sm font-medium">Business Unit <span className="text-red-500">*</span></Label>
            <Select
              value={formData.business_unit ? formData.business_unit.toString() : "0"}
              onValueChange={(value) => {
                console.log('Business unit selected:', value);
                const buId = parseInt(value);
                setFormData(prev => ({ 
                  ...prev, 
                  business_unit: buId,
                  // Reset department when business unit changes
                  department: 0
                }));
                // Immediately fetch departments for this business unit
                if (buId) {
                  setLoading(true);
                  api.get(`/departments/?business_unit=${buId}`)
                    .then(response => {
                      console.log('Departments fetched directly:', response.data);
                      setDepartments(response.data);
                    })
                    .catch(error => {
                      console.error('Error fetching departments:', error);
                      toast.error('Failed to load departments. Please try again.');
                    })
                    .finally(() => {
                      setLoading(false);
                    });
                }
              }}
            >
              <SelectTrigger className="h-10 border-gray-300 dark:border-gray-700">
                <SelectValue placeholder="Select Business Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0" disabled>Select Business Unit</SelectItem>
                {businessUnits.map((bu) => (
                  <SelectItem key={bu.id} value={bu.id.toString()}>
                    {bu.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Department Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="department" className="text-sm font-medium">Department <span className="text-red-500">*</span></Label>
            <Select
              value={formData.department ? formData.department.toString() : "0"}
              onValueChange={(value) => {
                console.log('Department selected:', value);
                setFormData(prev => ({ ...prev, department: parseInt(value) }));
              }}
              disabled={!formData.business_unit || formData.business_unit === 0 || loading}
            >
              <SelectTrigger className="h-10 border-gray-300 dark:border-gray-700">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-b-transparent rounded-full animate-spin border-primary"></div>
                    <span>Loading departments...</span>
                  </div>
                ) : (
                  <SelectValue placeholder={!formData.business_unit || formData.business_unit === 0 ? "Select Business Unit first" : "Select Department"} />
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0" disabled>Select Department</SelectItem>
                {departments && departments.length > 0 ? (
                  departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-4 text-sm text-gray-500 text-center">
                    {loading ? "Loading departments..." : "No departments available for the selected business unit"}
                  </div>
                )}
              </SelectContent>
            </Select>
            {formData.business_unit && formData.business_unit !== 0 && departments.length === 0 && !loading && (
              <p className="text-xs text-amber-600 mt-1">
                No departments found for this business unit. Please select a different business unit or contact the administrator.
              </p>
            )}
          </div>
          
          {/* Level Input */}
          <div className="space-y-2">
            <Label htmlFor="level" className="text-sm font-medium">Access Level <span className="text-red-500">*</span></Label>
            <Input
              id="level"
              type="number"
              min="1"
              max="10"
              value={formData.level}
              onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) || 1 }))}
              className="h-10 border-gray-300 dark:border-gray-700"
            />
            <p className="text-xs text-gray-500 mt-1">
              Higher levels have greater permissions (1-10)
            </p>
          </div>
          
          {/* Category Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">Category <span className="text-red-500">*</span></Label>
            <Select
              value={formData.approver_request_category ? formData.approver_request_category.toString() : "0"}
              onValueChange={(value) => setFormData(prev => ({ ...prev, approver_request_category: parseInt(value) }))}
            >
              <SelectTrigger className="h-10 border-gray-300 dark:border-gray-700">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0" disabled>Select Category</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit}
            disabled={loading || 
              !formData.user || 
              !formData.business_unit || 
              !formData.department || 
              !formData.approver_request_category}
            className="flex items-center gap-2 px-6"
            variant="default"
          >
            <UserPlus size={16} />
            Add Approver
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApproverForm; 