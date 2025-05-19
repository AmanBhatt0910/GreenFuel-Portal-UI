'use client'
import React, { useState, useEffect } from 'react';
import useAxios from '@/app/hooks/use-axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BusinessUnit, User as UserType } from './types';
import { User, Building, FolderIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Define temporary interface for User while waiting for updated types
interface User {
  id: number;
  name: string;
  username?: string;
  email?: string;
  employee_code?: string;
}

interface ApproverDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddApprover: (approverData: any) => Promise<any>;
  businessUnit: BusinessUnit | undefined;
  selectedDepartmentId: string;
}

export const ApproverDialog: React.FC<ApproverDialogProps> = ({
  isOpen,
  onClose,
  onAddApprover,
  businessUnit,
  selectedDepartmentId,
}) => {
  const api = useAxios();
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [level, setLevel] = useState<number>(1);
  
  // Get current department and approvers
  const currentDepartment = businessUnit?.departments?.find(
    d => d.id?.toString() === selectedDepartmentId
  );
  
  const currentApprovers = currentDepartment?.approvers || [];
  
  // Calculate the next available level
  const getNextAvailableLevel = () => {
    if (!currentApprovers || currentApprovers.length === 0) return 1;
    
    // Check for gaps in sequence
    const sortedLevels = [...currentApprovers]
      .map(a => a.level)
      .sort((a, b) => a - b);
    
    // Find the first gap in sequence starting from 1
    for (let i = 0; i < sortedLevels.length; i++) {
      if (sortedLevels[i] !== i+1) {
        return i+1; // Return the first missing level
      }
    }
    
    // If no gaps, return next level after the highest
    return sortedLevels.length + 1;
  };
  
  // Reset form and set default values when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedUser(null);
      setError(null);
      setSuccessMessage(null);
      const nextLevel = getNextAvailableLevel();
      setLevel(nextLevel);
      
      const loadUsers = async () => {
        setIsLoading(true);
        try {
          const response = await api.get('/userInfo/');
          if (response.data && Array.isArray(response.data)) {
            setUsers(response.data);
          } else {
            setUsers([]);
          }
        } catch (err) {
          console.error("Failed to load users:", err);
          setError("Failed to load users. Please try again.");
          setUsers([]);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadUsers();
    }
  }, [isOpen]);
  
  // Handle submission
  const handleSubmit = async () => {
    if (!selectedUser) {
      setError("Please select a user");
      return;
    }
    
    if (!businessUnit?.id) {
      setError("Business unit is missing");
      return;
    }
    
    if (!selectedDepartmentId) {
      setError("Department is missing");
      return;
    }
    
    // Validate level
    if (level < 1) {
      setError("Level must be at least 1");
      return;
    }
    
    // Check if level already exists
    const levelExists = currentApprovers.some(a => a.level === level);
    if (levelExists) {
      setError(`Level ${level} already exists. Please choose a different level.`);
      return;
    }
    
    // Check for sequential levels - if adding level > 1, ensure level - 1 exists
    if (level > 1) {
      const previousLevelExists = currentApprovers.some(a => a.level === level - 1);
      if (!previousLevelExists) {
        setError(`Cannot add level ${level} because level ${level - 1} does not exist.`);
        return;
      }
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const approverData = {
        user: selectedUser,
        business_unit: businessUnit.id,
        department: Number(selectedDepartmentId),
        level: level
      };
      
      await onAddApprover(approverData);
      setSuccessMessage("Approver added successfully");
      
      // Reset form and close after delay
      setTimeout(() => {
        setSelectedUser(null);
        onClose();
        setSuccessMessage(null);
      }, 1500);
    } catch (err) {
      console.error("Failed to add approver:", err);
      setError("Failed to add approver. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Approval Level</DialogTitle>
        </DialogHeader>
        
        {currentDepartment && (
          <div className="mb-6">
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="p-4 space-y-3">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Building className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500">Business Unit</div>
                    <div className="font-medium text-gray-800">{businessUnit?.name || "N/A"}</div>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <FolderIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500">Department</div>
                    <div className="font-medium text-gray-800">{currentDepartment.name}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <Alert className="mb-4 bg-red-50 border-red-200 text-red-800">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {successMessage && (
          <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user">Select User</Label>
            <Select
              value={selectedUser?.toString() || ''}
              onValueChange={(value) => setSelectedUser(Number(value))}
              disabled={isLoading}
            >
              <SelectTrigger id="user" className="w-full">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-600" />
                      {user.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="level">Approval Level</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="level"
                type="number"
                min={1}
                value={level}
                onChange={(e) => setLevel(Number(e.target.value) || 1)}
                disabled={isLoading}
                className="w-24"
              />
              <div className="text-sm text-gray-500">
                {level === 1 ? "First approver" : `Level ${level} approver`}
              </div>
            </div>
            
            {currentApprovers.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                Current levels: {currentApprovers
                  .map(a => a.level)
                  .sort((a, b) => a - b)
                  .join(', ')}
              </div>
            )}
          </div>
          
          {selectedUser && (
            <div className="pt-2">
              <div className="text-sm font-medium mb-1">Selected User:</div>
              <div className="flex items-center p-2 border rounded-md bg-gray-50">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">
                    {users.find(u => u.id === selectedUser)?.name || `User #${selectedUser}`}
                  </div>
                  <div className="text-xs text-gray-500">
                    {users.find(u => u.id === selectedUser)?.email || ''}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !selectedUser}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? 'Adding...' : 'Add Approver'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 