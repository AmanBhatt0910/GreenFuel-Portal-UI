import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Pencil, 
  Save, 
  X, 
  Loader2, 
  Building, 
  Briefcase, 
  IdCard 
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';

interface WorkInfoSectionProps {
  userData: any;
  businessUnit: any;
  department: any;
  designation: any;
  businessUnits: any[];
  departments: any[];
  designations: any[];
  updateUserData: (data: any) => Promise<void>;
  updating: boolean;
}

const WorkInfoSection: React.FC<WorkInfoSectionProps> = ({ 
  userData, 
  businessUnit,
  department,
  designation,
  businessUnits,
  departments,
  designations,
  updateUserData,
  updating
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    business_unit: userData?.business_unit || '',
    department: userData?.department || '',
    designation: userData?.designation || '',
    employee_code: userData?.employee_code || '',
  });

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      business_unit: userData?.business_unit || '',
      department: userData?.department || '',
      designation: userData?.designation || '',
      employee_code: userData?.employee_code || '',
    });
    setIsEditing(false);
  };

  // Filter departments based on selected business unit
  const filteredDepartments = departments.filter(
    dept => !formData.business_unit || dept.business_unit === Number(formData.business_unit)
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
          Work Information
        </CardTitle>
        {!isEditing ? (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4 text-indigo-600" />
            <span className="sr-only">Edit</span>
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCancel}
              className="h-8 w-8 p-0"
              disabled={updating}
            >
              <X className="h-4 w-4 text-gray-600" />
              <span className="sr-only">Cancel</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSubmit}
              className="h-8 w-8 p-0"
              disabled={updating}
            >
              {updating ? (
                <Loader2 className="h-4 w-4 text-indigo-600 animate-spin" />
              ) : (
                <Save className="h-4 w-4 text-indigo-600" />
              )}
              <span className="sr-only">Save</span>
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="employee_code">Employee Code</Label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="employee_code"
                  name="employee_code"
                  value={formData.employee_code}
                  onChange={handleInputChange}
                  className="pl-10"
                  placeholder="Enter employee code"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business_unit">Business Unit</Label>
              <Select
                value={formData.business_unit?.toString()}
                onValueChange={(value) => handleChange('business_unit', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select business unit" />
                </SelectTrigger>
                <SelectContent>
                  {businessUnits.map((bu) => (
                    <SelectItem key={bu.id} value={bu.id.toString()}>
                      {bu.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department?.toString()}
                onValueChange={(value) => handleChange('department', value)}
                disabled={!formData.business_unit}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {filteredDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Select
                value={formData.designation?.toString()}
                onValueChange={(value) => handleChange('designation', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select designation" />
                </SelectTrigger>
                <SelectContent>
                  {designations.map((desig) => (
                    <SelectItem key={desig.id} value={desig.id.toString()}>
                      {desig.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start">
              <IdCard className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Employee Code</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {userData?.employee_code || 'Not assigned'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Building className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Business Unit</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {businessUnit?.name || `ID: ${userData?.business_unit || 'Not assigned'}`}
                </p>
                {businessUnit?.code && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Code: {businessUnit.code}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-start">
              <Briefcase className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {department?.name || `ID: ${userData?.department || 'Not assigned'}`}
                </p>
                {department?.code && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Code: {department.code}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-start">
              <IdCard className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Designation</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {designation?.name || `ID: ${userData?.designation || 'Not assigned'}`}
                </p>
                {designation?.code && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Code: {designation.code}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkInfoSection;