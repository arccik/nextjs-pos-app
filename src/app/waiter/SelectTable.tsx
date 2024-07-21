"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { useNavigate } from "react-router-dom";
// import { useStore } from "@/store";
import ChooseTable from "./ChooseTable";
import { NewCustomerButton } from "./NewCustomerButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type NewCustomerProps = {
  buttonTrigger?: React.ReactNode;
};

export default function NewCustomer({ buttonTrigger }: NewCustomerProps) {
  const [show, setShow] = useState(false);
  // const navigate = useNavigate();

  // const router = useRouter();
  // const { selectedTable } = useStore();
  const selectedTable = { tableId: 1 };

  // useEffect(() => {
  //   if (selectedTable?.tableId) router.push("/menu");
  // }, [selectedTable?.tableId]);

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild={!!buttonTrigger}>
        {buttonTrigger ?? <NewCustomerButton />}
      </DialogTrigger>
      <DialogContent className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Customer</DialogTitle>
          <DialogDescription>Choose Table</DialogDescription>
        </DialogHeader>
        <ChooseTable close={() => setShow(false)} />
      </DialogContent>
    </Dialog>
  );
}
