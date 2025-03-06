"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Trash2, Grip } from 'lucide-react';
import { CustomBreadcrumb } from '@/components/custom/ui/Breadcrumb.custom';

// Define interfaces
interface BusinessUnit {
  id: string;
  name: string;
  head: string;
  level: number;
}

interface NewUnitState {
  name: string;
  head: string;
  level: number;
}

const BusinessUnitHierarchy: React.FC = () => {
  // Initial state with predefined business units
  const [units, setUnits] = useState<BusinessUnit[]>([
    { id: '1', name: 'CEO', head: 'John Doe', level: 1 },
    { id: '2', name: 'Finance Director', head: 'Sarah Smith', level: 2 },
    { id: '3', name: 'Marketing Director', head: 'Mike Johnson', level: 2 },
    { id: '4', name: 'Finance Manager', head: 'Emma Brown', level: 3 },
    { id: '5', name: 'Marketing Manager', head: 'Alex Lee', level: 3 },
    { id: '6', name: 'Accounting Team Lead', head: 'David Wilson', level: 4 },
    { id: '7', name: 'Digital Marketing Lead', head: 'Lisa Chen', level: 4 }
  ]);

  // State for new unit form
  const [newUnit, setNewUnit] = useState<NewUnitState>({
    name: '',
    head: '',
    level: 1
  });

  // State to track dragged unit
  const [draggedUnit, setDraggedUnit] = useState<string | null>(null);

  // State to store validated hierarchy
  const [validatedHierarchy, setValidatedHierarchy] = useState<BusinessUnit[]>([]);

  // Add new unit
  const addNewUnit = () => {
    if (!newUnit.name || !newUnit.head) {
      alert('Please fill in all fields');
      return;
    }

    const newUnitEntry: BusinessUnit = {
      id: (units.length + 1).toString(),
      ...newUnit
    };

    setUnits([...units, newUnitEntry]);
    setNewUnit({ name: '', head: '', level: 1 });
  };

  // Delete unit
  const deleteUnit = (id: string) => {
    setUnits(units.filter(unit => unit.id !== id));
  };

  // Drag start handler
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, unitId: string) => {
    event.dataTransfer?.setData('text/plain', unitId);
    setDraggedUnit(unitId);
  };

  // Drag over handler to allow dropping
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // Drop handler
  const handleDrop = (event: React.DragEvent<HTMLDivElement>, targetLevel: number) => {
    event.preventDefault();
    const droppedUnitId = event.dataTransfer?.getData('text/plain');
    
    if (droppedUnitId) {
      const droppedUnit = units.find(unit => unit.id === droppedUnitId);
      
      if (droppedUnit) {
        // Update the unit's level
        const updatedUnits = units.map(unit => 
          unit.id === droppedUnitId 
            ? { ...unit, level: targetLevel }
            : unit
        );
        
        setUnits(updatedUnits);
        setDraggedUnit(null);
      }
    }
  };

  // Validate and update hierarchy
  const validateHierarchy = () => {
    // Sort units by level and name
    const sortedUnits = [...units].sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      return a.name.localeCompare(b.name);
    });

    setValidatedHierarchy(sortedUnits);
  };

  // Render levels
  const renderLevels = () => {
    const maxLevel = Math.max(...units.map(unit => unit.level));
    
    return Array.from({ length: maxLevel }, (_, index) => {
      const levelUnits = units.filter(unit => unit.level === index + 1);
      
      return (
        <div 
          key={`level-${index + 1}`} 
          className={`border p-4 rounded-lg ${
            draggedUnit ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index + 1)}
        >
          <h3 className="font-bold mb-2">Level {index + 1}</h3>
          <AnimatePresence>
            {levelUnits.map(unit => (
              <motion.div
                key={unit.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {/* Regular div for drag and drop */}
                <div 
                  className={`flex items-center justify-between p-2 border rounded mb-2 ${
                    draggedUnit === unit.id ? 'opacity-50' : 'opacity-100'
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, unit.id)}
                >
                  <div className="flex items-center space-x-2">
                    <Grip className="text-gray-400 cursor-move" />
                    <div>
                      <div className="font-medium">{unit.name}</div>
                      <div className="text-sm text-gray-500">{unit.head}</div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteUnit(unit.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      );
    });
  };

  return (
    <div className="container mx-auto py-8 px-3">
      <div className="container py-4 mx-auto max-w-[95%] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <CustomBreadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Business Units", href: "/dashboard/business-units" },
          ]}
        />

        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-6 mt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Business Unit Hierarchy</h1>
            <p className="text-green-700 dark:text-green-400 text-sm font-medium mt-1">
              Manage and visualize your organization's hierarchical structure
            </p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Business Unit Hierarchy Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <Input 
                placeholder="Unit Name" 
                value={newUnit.name}
                onChange={(e) => setNewUnit(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input 
                placeholder="Unit Head" 
                value={newUnit.head}
                onChange={(e) => setNewUnit(prev => ({ ...prev, head: e.target.value }))}
              />
              <Input 
                type="number" 
                placeholder="Level (1-4)" 
                min="1" 
                max="4"
                value={newUnit.level}
                onChange={(e) => setNewUnit(prev => ({ 
                  ...prev, 
                  level: parseInt(e.target.value, 10) || 1 
                }))}
              />
              <Button onClick={addNewUnit} className='bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'>
                <Save className="mr-2 w-4 h-4" /> Add Unit
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {renderLevels()}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Validated Hierarchy</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={validateHierarchy} className="mb-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">
              <Save className="mr-2 w-4 h-4" /> Validate Hierarchy
            </Button>
            
            {validatedHierarchy.length > 0 && (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Level</th>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Head</th>
                  </tr>
                </thead>
                <tbody>
                  {validatedHierarchy.map(unit => (
                    <motion.tr 
                      key={unit.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="p-2 border text-center">{unit.level}</td>
                      <td className="p-2 border">{unit.name}</td>
                      <td className="p-2 border">{unit.head}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessUnitHierarchy;