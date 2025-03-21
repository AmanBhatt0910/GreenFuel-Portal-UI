import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import useAxios from "@/app/hooks/use-axios";
import { Category } from "./types";

interface EditCategoryDialogProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
  onCategoryUpdated: (updatedCategory: Category) => void;
}

const EditCategoryDialog: React.FC<EditCategoryDialogProps> = ({
  category,
  isOpen,
  onClose,
  onCategoryUpdated,
}) => {
  const [categoryName, setCategoryName] = useState(category.name);
  const [isLoading, setIsLoading] = useState(false);
  const api = useAxios();

  const handleSave = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Editing category:", category.id);
      const response = await api.put(`/approval-request-category/${category.id}/`, {
        name: categoryName.trim(),
      });

      const updatedCategory: Category = {
        ...category,
        name: response.data.name,
      };

      onCategoryUpdated(updatedCategory);
      toast.success("Category updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category Name"
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!categoryName.trim() || isLoading}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialog; 