import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import useAxios from "@/app/hooks/use-axios";
import { Category } from "./types";

interface AddCategoryFormProps {
  onCategoryAdded: (category: Category) => void;
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({ onCategoryAdded }) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const api = useAxios();

  /**
   * Handle adding a new category
   * Validates input and makes API call to create category
   */
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post("/approval-request-category/", {
        name: newCategoryName.trim(),
      });

      const newCategory: Category = {
        id: response.data.id,
        name: response.data.name,
        created_at: response.data.created_at,
      };

      onCategoryAdded(newCategory);
      setNewCategoryName("");
      toast.success("Category added successfully!");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Add New Category</CardTitle>
        <CardDescription>Create a new category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category Name"
            className="flex-1"
          />
          <Button
            onClick={handleAddCategory}
            disabled={!newCategoryName.trim() || isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddCategoryForm; 