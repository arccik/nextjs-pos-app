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
// import { AlertDescription } from "../ui/alert";
import CardPayment from "./CardPayment";
// import Loading from "../Loading";
import useBill from "@/hooks/useBill";
// import { api } from "@/trpc/react";

type PaymentButtonProps = {
  orderId: string;
};
type WhatComponentToShow = "Cash" | "Card";

export default function PaymentButton({ orderId }: PaymentButtonProps) {
  const { total, pay, addTips, billId, tips } = useBill(orderId);
  const [isOpen, setIsOpen] = useState(false);
  const [showMethod, setShowMethod] = useState<WhatComponentToShow | null>(
    null,
  );
  const [tipsAmount, setTipAmount] = useState<number>(tips);
  // const { data: settings } = api.settings.get.useQuery();
  // const currency = settings?.currency ?? "USD";

  // const { makePayment, generateBill } = usePayments();

  const handleAddTips = () => {
    if (!tipsAmount) return;
    addTips(tipsAmount);
    setTipAmount(tipsAmount);
  };

  const handleDialogButton = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      // generateBill({ orderId, tipsAmount });
    }
  };
  const handlePayment = (
    paymentMethod: WhatComponentToShow,
    paidAmount: number,
  ) => {
    pay(paymentMethod, paidAmount);

    if (paidAmount === total) setIsOpen(false);
  };

  if (!total) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
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
        {showMethod ? (
          <Button
            onClick={() => setShowMethod(null)}
            className="absolute right-5 top-5"
            variant="outline"
          >
            Back
          </Button>
        ) : (
          <>
            <div className="flex justify-evenly">
              <Button
                onClick={() => setShowMethod("Card")}
                className="flex size-24 flex-col gap-2"
                variant="outline"
              >
                <CreditCard />
                Card
              </Button>
              <Button
                onClick={() => setShowMethod("Cash")}
                className="flex size-24 flex-col gap-2"
                variant="outline"
              >
                <Banknote />
                Cash
              </Button>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <TipsButton setValue={handleAddTips} orderId={orderId} />
            </AlertDialogFooter>
          </>
        )}

        {showMethod === "Cash" && (
          <CashPayment
            totalAmount={total}
            tipsAmount={tipsAmount}
            onPay={(amount) => handlePayment("Cash", amount)}
          />
        )}
        {showMethod === "Card" && (
          <CardPayment
            tipAmount={tipsAmount}
            totalAmount={total}
            onPay={(amount) => handlePayment("Card", amount)}
          />
        )}
        {billId && <PaymentsList billId={billId} tipsAmount={tipsAmount} />}
      </AlertDialogContent>
    </AlertDialog>
  );
}
