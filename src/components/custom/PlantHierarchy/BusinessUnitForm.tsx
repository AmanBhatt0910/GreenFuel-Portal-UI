import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BusinessUnit, NewBusinessUnit, generateId } from './types';

interface BusinessUnitFormProps {
  businessUnits: BusinessUnit[];
  setBusinessUnits: React.Dispatch<React.SetStateAction<BusinessUnit[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  onAddBusinessUnit?: (name: string) => Promise<BusinessUnit | null>;
}

export const BusinessUnitForm: React.FC<BusinessUnitFormProps> = ({ 
  businessUnits, 
  setBusinessUnits, 
  setError,
  onAddBusinessUnit
}) => {
  const [newBusinessUnit, setNewBusinessUnit] = useState<NewBusinessUnit>({
    name: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const addNewBusinessUnit = async () => {
    if (!newBusinessUnit.name.trim()) {
      setError('Business unit name is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (onAddBusinessUnit) {
        // Use the API function provided by the parent
        await onAddBusinessUnit(newBusinessUnit.name);
      } else {
        // Fallback to local state management (for testing without API)
        const newBusinessUnitObj: BusinessUnit = {
          id: generateId(),
          name: newBusinessUnit.name,
          departments: [],
        };
        setBusinessUnits([...businessUnits, newBusinessUnitObj]);
      }

      setNewBusinessUnit({ name: '' });
    } catch (error) {
      console.error('Error adding business unit:', error);
      setError('Failed to add business unit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-gray-800 dark:text-gray-100">
          Add New Business Unit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Business Unit Name"
            value={newBusinessUnit.name}
            onChange={(e) => setNewBusinessUnit({ name: e.target.value })}
            className="bg-white dark:bg-gray-700 flex-1"
            aria-label="Business Unit name"
          />
          <Button
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
            onClick={addNewBusinessUnit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                Add Business Unit
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 