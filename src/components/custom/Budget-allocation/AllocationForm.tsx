import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BusinessUnit, Department, FormData } from './types';

interface AllocationFormProps {
  businessUnits: BusinessUnit[];
  filteredDepartments: Department[];
  categories: string[];
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  loading: boolean;
  handleSubmit: () => Promise<void>;
}

export const AllocationForm = ({ 
  businessUnits, 
  filteredDepartments, 
  categories, 
  formData, 
  setFormData,
  loading,
  handleSubmit
}: AllocationFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Budget Allocation</CardTitle>
        <CardDescription>Allocate budget to departments for specific categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="business_unit">Business Unit <span className="text-red-500">*</span></Label>
            <Select
              value={formData.business_unit ? formData.business_unit.toString() : "0"}
              onValueChange={(value) => setFormData(prev => ({ ...prev, business_unit: parseInt(value) }))}
            >
              <SelectTrigger className="h-10">
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

          <div className="space-y-2">
            <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
            <Select
              value={formData.department ? formData.department.toString() : "0"}
              onValueChange={(value) => setFormData(prev => ({ ...prev, department: parseInt(value) }))}
              disabled={!formData.business_unit || formData.business_unit === 0}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder={!formData.business_unit || formData.business_unit === 0 ? "Select Business Unit first" : "Select Department"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0" disabled>Select Department</SelectItem>
                {filteredDepartments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget Amount <span className="text-red-500">*</span></Label>
            <Input
              id="budget"
              type="number"
              min="0"
              step="100"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              placeholder="Enter amount"
              className="h-10"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading || !formData.business_unit || !formData.department || !formData.category || !formData.budget}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Create Allocation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
