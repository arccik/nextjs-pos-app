"use client";
import TableIcon from "@/components/navbar/TableIcon";
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
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Trash2Icon } from "lucide-react";

type Props = {
  tableNumber: number;
  unsetTable: () => void;
};

export default function SelectedTableCard({ tableNumber, unsetTable }: Props) {
  return (
    <AlertDialog>
      <Card>
        <CardContent className=" mt-auto flex items-center gap-2 border-none text-base">
          <TableIcon className="size-8 dark:text-gray-400" />
          <CardTitle className="mt-auto text-base">{`Table  ${tableNumber} selected `}</CardTitle>
          <AlertDialogTrigger asChild>
            <Button className="ml-auto bg-red-500" size="icon">
              <Trash2Icon className="size-4" />
            </Button>
          </AlertDialogTrigger>
        </CardContent>
      </Card>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm table removal?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={unsetTable}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
