// import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "@/components/ui/dialog";
import { type StaffStatus, type StaffStatusSelector } from "./StaffSelection";
import { api } from "@/trpc/react";
import Loading from "@/components/Loading";
type SelectedDayProps = {
  date: Date | null;
  diselect: () => void;
};

export default function SelectedDay({ date, diselect }: SelectedDayProps) {
  // const saveRota = api.rota;
  const handleStatusChange = (staffStatus: StaffStatus[]) => {
    console.log("Staff status:", staffStatus);
    // // Handle the status change (e.g., update state, send to server, etc.)
    // // You can filter this array to get working and off staff, along with their shifts
    // const workingStaff = staffStatus.filter((s) => s.working);
    // const offStaff = staffStatus.filter((s) => !s.working);
    // console.log("Working staff:", workingStaff);
    // console.log("Off staff:", offStaff);
  };
  const { data, isLoading } = api.user.getAll.useQuery();

  return (
    <Dialog open={!!date} onOpenChange={diselect}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{date?.toDateString()}</DialogTitle>
          <DialogDescription>
            Here you can add new items to the menu
          </DialogDescription>
        </DialogHeader>
        {/* <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum
          repellendus eligendi recusandae laborum ratione nesciunt laboriosam
          maiores! Assumenda, voluptatum officiis.
        </p> */}
        {isLoading && <Loading />}
        {data && (
          <StaffStatusSelector
            staffMembers={data}
            date={new Date()} // You can pass any date here
            onStatusChange={handleStatusChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
