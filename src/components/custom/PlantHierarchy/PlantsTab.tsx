import React from 'react';
import { Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

import { BusinessUnit, BusinessUnitActionsProps } from './types';
import { BusinessUnitForm } from './BusinessUnitForm';
import { BusinessUnitCard } from './BusinessUnitCard';

interface PlantsTabProps extends BusinessUnitActionsProps {
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  onAddBusinessUnit?: (name: string) => Promise<BusinessUnit | null>;
}

export const PlantsTab: React.FC<PlantsTabProps> = ({
  businessUnits,
  setBusinessUnits,
  activeBusinessUnitId,
  setActiveBusinessUnitId,
  setActiveTab,
  setError,
  onAddBusinessUnit,
}) => {
  const handleBusinessUnitClick = (id: string | number) => {
    setActiveBusinessUnitId(id);
    setActiveTab('departments'); // Navigate to departments tab
  };

  return (
    <>
      <BusinessUnitForm
        businessUnits={businessUnits}
        setBusinessUnits={setBusinessUnits}
        setError={setError}
        onAddBusinessUnit={onAddBusinessUnit}
      />
      
      {businessUnits.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <Building2 className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No Business Units Found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create your first business unit using the form above
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {businessUnits.map((businessUnit) => (
            <div key={businessUnit.id} className="mb-4">
              <BusinessUnitCard
                businessUnit={businessUnit}
                businessUnits={businessUnits}
                setBusinessUnits={setBusinessUnits}
                activeBusinessUnitId={activeBusinessUnitId}
                setActiveBusinessUnitId={setActiveBusinessUnitId}
                setActiveTab={setActiveTab}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}; 