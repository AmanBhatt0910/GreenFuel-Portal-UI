'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { BriefcaseIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { BusinessUnit, Designation, NewDesignation } from './types';

interface DesignationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDesignation: (designation: NewDesignation) => Promise<Designation>;
  selectedDepartmentId: string;
  businessUnits: BusinessUnit[];
}

export const DesignationDialog: React.FC<DesignationDialogProps> = ({
  isOpen,
  onClose,
  onAddDesignation,
  selectedDepartmentId,
  businessUnits,
}) => {
  const [designationName, setDesignationName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get current department and business unit
  const selectedDepartment = React.useMemo(() => {
    return businessUnits
      .flatMap(bu => bu.departments || [])
      .find(dept => dept.id?.toString() === selectedDepartmentId);
  }, [businessUnits, selectedDepartmentId]);

  const businessUnit = React.useMemo(() => {
    return businessUnits.find(bu => 
      (bu.departments || []).some(dept => dept.id?.toString() === selectedDepartmentId)
    );
  }, [businessUnits, selectedDepartmentId]);

  // Clear state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Reset form state when dialog closes
      setDesignationName('');
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!designationName.trim()) {
      setError('Please enter a designation name');
      return;
    }

    if (!selectedDepartmentId) {
      setError('No department selected');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const newDesignation: NewDesignation = {
        name: designationName,
        department: Number(selectedDepartmentId)
      };

      await onAddDesignation(newDesignation);
      setSuccess('Designation added successfully');
      setDesignationName('');
      
      // Close dialog after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to add designation:', err);
      setError('Failed to add designation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BriefcaseIcon className="mr-2 h-5 w-5 text-blue-600" />
            Add Designation
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 p-3 rounded-md flex items-start mb-3">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 p-3 rounded-md flex items-start mb-3">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-green-800">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {selectedDepartment && (
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">Department</div>
              <div className="flex items-center mb-2">
                <span className="font-medium">{selectedDepartment.name}</span>
                {businessUnit && (
                  <>
                    <span className="mx-2 text-gray-400">in</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {businessUnit.name}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="designationName" className="block text-sm font-medium text-gray-700 mb-1">
              Designation Name
            </label>
            <Input
              id="designationName"
              value={designationName}
              onChange={e => setDesignationName(e.target.value)}
              disabled={isLoading}
              placeholder="Enter designation name"
              className="w-full"
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!designationName.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Adding...
                </>
              ) : 'Add Designation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 