import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
type SelectedDayProps = {
  date: Date | null;
  diselect: () => void;
};
export default function SelectedDay({ date, diselect }: SelectedDayProps) {
  return (
    <Dialog open={!!date} onOpenChange={diselect}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{date?.toDateString()}</DialogTitle>
          <DialogDescription>
            Here you can add new items to the menu
          </DialogDescription>
        </DialogHeader>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum
          repellendus eligendi recusandae laborum ratione nesciunt laboriosam
          maiores! Assumenda, voluptatum officiis.
        </p>
      </DialogContent>
    </Dialog>
  );
}
