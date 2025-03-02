"use client"
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Save } from 'lucide-react';

// Define TypeScript interfaces
interface BusinessUnit {
  id: string;
  name: string;
  head: string;
  level: number;
  parentId: string | null;
}

interface NewUnitForm {
  name: string;
  head: string;
  level: number | string;
  parentId: string;
}

const SimpleBusinessUnitChart: React.FC = () => {
  // State for business units
  const [units, setUnits] = useState<BusinessUnit[]>([
    {
      id: "1",
      name: "Managing Director",
      head: "John Smith",
      level: 1,
      parentId: null
    },
    {
      id: "2",
      name: "Finance Department",
      head: "Sarah Johnson",
      level: 2,
      parentId: "1"
    },
    {
      id: "3",
      name: "Marketing Department",
      head: "Robert Chen",
      level: 2,
      parentId: "1"
    },
    {
      id: "4",
      name: "Accounting Team",
      head: "Michael Brown",
      level: 3,
      parentId: "2"
    },
    {
      id: "5",
      name: "Digital Marketing Team",
      head: "Anna Lee",
      level: 3,
      parentId: "3"
    }
  ]);

  // State for new unit form
  const [showForm, setShowForm] = useState<boolean>(false);
  const [newUnit, setNewUnit] = useState<NewUnitForm>({
    name: "",
    head: "",
    level: 1,
    parentId: ""
  });

  // Function to sort units by level
  const sortUnitsByLevel = (unitsArray: BusinessUnit[]): BusinessUnit[] => {
    return [...unitsArray].sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      return a.name.localeCompare(b.name);
    });
  };

  // Update level of a unit
  const updateLevel = (id: string, newLevel: string): void => {
    const levelValue = parseInt(newLevel, 10);
    if (isNaN(levelValue)) return;
    
    const updatedUnits = units.map(unit => {
      if (unit.id === id) {
        return { ...unit, level: levelValue || 1 };
      }
      return unit;
    });
    setUnits(sortUnitsByLevel(updatedUnits));
  };

  // Delete a unit
  const deleteUnit = (id: string): void => {
    // Check if any unit has this as a parent
    const hasChildren = units.some(unit => unit.parentId === id);
    if (hasChildren) {
      alert("Cannot delete a unit that has children. Remove the children first.");
      return;
    }
    setUnits(units.filter(unit => unit.id !== id));
  };

  // Add a new unit
  const addNewUnit = (): void => {
    if (!newUnit.name || !newUnit.head) {
      alert("Name and Head are required fields");
      return;
    }

    const newId = (Math.max(...units.map(u => parseInt(u.id, 10))) + 1).toString();
    const levelValue = typeof newUnit.level === 'string' ? 
      parseInt(newUnit.level, 10) : newUnit.level;
    
    const unitToAdd: BusinessUnit = {
      id: newId,
      name: newUnit.name,
      head: newUnit.head,
      level: isNaN(levelValue) ? 1 : levelValue,
      parentId: newUnit.parentId || null
    };

    setUnits(sortUnitsByLevel([...units, unitToAdd]));
    setNewUnit({ name: "", head: "", level: 1, parentId: "" });
    setShowForm(false);
  };

  // Get unit name by ID
  const getUnitName = (id: string | null): string => {
    if (!id) return "None";
    const unit = units.find(u => u.id === id);
    return unit ? unit.name : "None";
  };

  // Determine background color based on level
  const getLevelColor = (level: number): string => {
    switch (level) {
      case 1: return "bg-yellow-50";
      case 2: return "bg-blue-50";
      case 3: return "bg-green-50";
      case 4: return "bg-purple-50";
      default: return "bg-gray-50";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Business Unit Organization</h1>
      
      <Button 
        onClick={() => setShowForm(!showForm)} 
        className="mb-4"
        variant={showForm ? "outline" : "default"}
      >
        {showForm ? "Cancel" : "Add New Unit"}
      </Button>
      
      {showForm && (
        <Card className="mb-6 p-4">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg">Add New Business Unit</CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input 
                  value={newUnit.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setNewUnit({...newUnit, name: e.target.value})
                  }
                  placeholder="Unit Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Head</label>
                <Input 
                  value={newUnit.head}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setNewUnit({...newUnit, head: e.target.value})
                  }
                  placeholder="Unit Head"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Level</label>
                <Input 
                  type="number" 
                  min="1" 
                  max="4"
                  value={newUnit.level}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setNewUnit({...newUnit, level: e.target.value})
                  }
                  placeholder="Level (1-4)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Parent Unit</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={newUnit.parentId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    setNewUnit({...newUnit, parentId: e.target.value})
                  }
                >
                  <option value="">None</option>
                  {units.map(unit => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <Button onClick={addNewUnit} className="mt-2">
              <Save className="w-4 h-4 mr-2" />
              Save New Unit
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardContent className="p-4">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Head</th>
                <th className="text-left p-2">Level</th>
                <th className="text-left p-2">Parent</th>
                <th className="text-right p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortUnitsByLevel(units).map((unit) => (
                <tr key={unit.id} className={`border-b ${getLevelColor(unit.level)}`}>
                  <td className="p-2">{unit.name}</td>
                  <td className="p-2">{unit.head}</td>
                  <td className="p-2">
                    <Input
                      type="number"
                      min="1"
                      max="4"
                      className="w-16 inline-block"
                      value={unit.level}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateLevel(unit.id, e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2">{getUnitName(unit.parentId)}</td>
                  <td className="p-2 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteUnit(unit.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleBusinessUnitChart;