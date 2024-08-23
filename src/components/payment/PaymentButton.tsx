"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Banknote, CreditCard } from "lucide-react";
import CashPayment from "./CashPayment";
// import TipsButton from "./TipsButton";
// import usePayments from "@/hooks/usePayments";
import PaymentsList from "./PaymentsList";
import { ScrollArea } from "@/components/ui/scroll-area";
import TipsButton from "./TipsButton";
import { AlertDescription } from "../ui/alert";
import { api } from "@/trpc/react";
import CardPayment from "./CardPayment";
import Loading from "../Loading";
import useBill from "@/hooks/useBill";
// import { api } from "@/trpc/react";

type PaymentButtonProps = {
  orderId: string;
};
type WhatComponentToShow = "cash" | "card" | "tip" | null;

export default function PaymentButton({ orderId }: PaymentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<WhatComponentToShow>(null);
  const [tipsAmount, setTipAmount] = useState<number | null>(null);
  const { data: settings } = api.settings.get.useQuery();
  const currency = settings?.currency || "USD";

  const {
    data: bills,
    isLoading: isBillLoading,
    isError,
  } = api.bill.getOneByOrderId.useQuery(orderId);

  const { total, pay } = useBill(orderId);

  console.log("BiLlSS<<<< ", bills);

  // const { makePayment, generateBill } = usePayments();

  const handleDialogButton = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      // generateBill({ orderId, tipsAmount });
    }
  };
  const handlePayment = (paymentMethod: WhatComponentToShow) => {
    console.log("Handle Payment: ", paymentMethod);
    if (!paymentMethod) return;
    setState(paymentMethod);
    // if (!bills?.id) return;
    // makePayment({
    //   billId: bills.id,
    //   userId: bills.userId!,
    //   chargedAmount: bills.totalAmount,
    //   paymentMethod,
    //   tipAmount: tipsAmount,
    // });
  };

  if (!total) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleDialogButton}>
      <AlertDialogTrigger asChild>
        <Button className="w-full dark:bg-gray-700 dark:text-white">
          <Banknote className="mr-2" />
          Pay
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Total: £{total?.toFixed(2)}</AlertDialogTitle>
        <AlertDialogDescription>
          Please choose payment method
        </AlertDialogDescription>
        {state && (
          <Button
            onClick={() => setState(null)}
            className="absolute right-5 top-5"
            variant="outline"
          >
            Back
          </Button>
        )}

        {!state && (
          <div className="flex justify-evenly">
            <Button
              onClick={() => handlePayment("card")}
              className="flex size-24 flex-col gap-2"
              variant="outline"
            >
              <CreditCard />
              Card
            </Button>
            <Button
              onClick={() => handlePayment("cash")}
              className="flex size-24 flex-col gap-2"
              variant="outline"
            >
              <Banknote />
              Cash
            </Button>
          </div>
        )}

        <ScrollArea className=" w-full rounded-md">
          {state === "cash" && <CashPayment totalAmount={total} />}
          {state === "card" && (
            <CardPayment tipAmount={tipsAmount} totalAmount={total} />
          )}
          {/* <PaymentsList
              payments={bills?.payments}
              total={bills?.totalAmount}
              tipsAmount={tipsAmount}
            /> */}
        </ScrollArea>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <TipsButton setValue={setTipAmount} orderId={orderId} />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
