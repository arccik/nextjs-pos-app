import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddItem from "./form/AddItem";

type AddNewItemButtonProps = {
  refetch: () => void;
};
export default function AddNewItemButton({ refetch }: AddNewItemButtonProps) {
  return (
    <Dialog onOpenChange={() => refetch()}>
      <DialogTrigger asChild>
        <Button size="sm">Add Item</Button>
      </DialogTrigger>
      <DialogContent className="h-[calc(100%-2rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
          <DialogDescription>
            Here you can add new items to the menu
          </DialogDescription>
        </DialogHeader>
        <AddItem
          onClose={() => {
            refetch();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
