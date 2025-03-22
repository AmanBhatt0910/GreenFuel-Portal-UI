import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import useAxios from "@/app/hooks/use-axios";
import { Category } from './types';

interface CategoryFormProps {
  onCategoryAdded: (category: Category) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onCategoryAdded }) => {
  const [categoryName, setCategoryName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const api = useAxios();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');

    try {
      // Call the API to create a new category
      const response = await api.post("/approval-request-category/", {
        name: categoryName.trim(),
      });

      const newCategory: Category = {
        id: response.data.id,
        name: response.data.name,
        created_at: response.data.created_at,
      };

      onCategoryAdded(newCategory);
      setCategoryName('');
      toast.success(`Category "${newCategory.name}" added successfully!`);
    } catch (error) {
      console.error('Error creating category:', error);
      setError('Failed to create category. Please try again.');
      toast.error('Failed to create category');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Add New Category</CardTitle>
          <CardDescription>
            Create a new approval request category that users can select when submitting requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="categoryName" className="text-sm font-medium">
                Category Name
              </Label>
              <Input
                id="categoryName"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="h-10 border-gray-300 dark:border-gray-700"
                disabled={isCreating}
              />
              {error && (
                <div className="text-sm text-red-500 mt-1">{error}</div>
              )}
            </div>
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isCreating || !categoryName.trim()} 
                className="px-4 py-2"
              >
                {isCreating ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Add Category
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryForm; 