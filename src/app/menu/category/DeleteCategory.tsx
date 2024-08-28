"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

type DeleteCategoryProps = {
  id: string;
  name: string;
};

export default function DeleteCategory({ id, name }: DeleteCategoryProps) {
  const router = useRouter();
  const { mutate: deleteCategory } = api.category.delete.useMutation({
    onSuccess: () => {
      console.log("Category deleted successfully");
      // revalidatePath("/menu", "layout");
      router.refresh();
    },
  });
  const handleDelete = () => {
    console.log("Delete Category: ", id);
    deleteCategory({ id });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full text-destructive">
          Delete category
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deleting category: {name} </AlertDialogTitle>
          <AlertDialogDescription>
            Are you absolutely sure? This action cannot be undone. This will
            permanently delete the category and{" "}
            <b>all items associated with it.</b>
            You will not be able to recover.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
