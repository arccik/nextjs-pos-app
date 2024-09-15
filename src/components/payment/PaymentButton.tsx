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
import { ArrowRight, Banknote, CreditCard } from "lucide-react";
import CashPayment from "./CashPayment";
import PaymentsList from "./PaymentsList";
import TipsButton from "./TipsButton";
import CardPayment from "./CardPayment";
import useBill from "@/hooks/useBill";

type PaymentButtonProps = {
  orderId: string;
};
type WhatComponentToShow = "Cash" | "Card";

export default function PaymentButton({ orderId }: PaymentButtonProps) {
  const { total, pay, billId, tips } = useBill(orderId);

  const [isOpen, setIsOpen] = useState(false);
  const [showMethod, setShowMethod] = useState<WhatComponentToShow | null>(
    null,
  );

  const handlePayment = (
    paymentMethod: WhatComponentToShow,
    paidAmount: number,
  ) => {
    pay(paymentMethod, paidAmount);

    if (paidAmount === total) setIsOpen(false);
  };

  if (!total) return null;

  console.log("PaymentButton", total);

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
        {!showMethod && (
          <AlertDialogDescription>
            Please choose payment method
          </AlertDialogDescription>
        )}
        {showMethod ? (
          <Button onClick={() => setShowMethod(null)} variant="outline">
            Back <ArrowRight className="size-5" />
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
              <TipsButton orderId={orderId} />
            </AlertDialogFooter>
          </>
        )}

        {showMethod === "Cash" && (
          <CashPayment
            totalAmount={total}
            tipsAmount={tips}
            onPay={(amount) => handlePayment("Cash", amount)}
          />
        )}
        {showMethod === "Card" && (
          <CardPayment
            tipAmount={tips}
            totalAmount={total}
            onPay={(amount) => handlePayment("Card", amount)}
          />
        )}
        {billId && (
          <PaymentsList billId={billId} tipsAmount={tips} total={total} />
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
