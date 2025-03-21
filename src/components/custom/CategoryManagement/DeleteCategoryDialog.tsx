import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import useAxios from "@/app/hooks/use-axios";
import { Category } from "./types";

interface DeleteCategoryDialogProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
  onCategoryDeleted: (categoryId: number) => void;
}

const DeleteCategoryDialog: React.FC<DeleteCategoryDialogProps> = ({
  category,
  isOpen,
  onClose,
  onCategoryDeleted,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const api = useAxios();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await api.delete(`/approval-request-category/${category.id}/`);
      
      onCategoryDeleted(category.id);
      toast.success("Category deleted successfully");
      onClose();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the category "{category.name}". 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={handleDelete}>
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCategoryDialog; 