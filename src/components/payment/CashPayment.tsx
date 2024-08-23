"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Delete } from "lucide-react";
import { useState } from "react";
// import usePayments from "@/hooks/usePayments";
import Dialer from "./Dialer";

type CashPaymentProps = {
  totalAmount: number;
};

export default function CashPayment({ totalAmount }: CashPaymentProps) {
  const [inputValue, setInputValue] = useState<string>("");
  // const { makePayment } = usePayments();

  const handlePayment = () => {
    // makePayment({
    //   billId: 1,
    //   paymentMethod: "Cash",
    //   chargedAmount: inputValue,
    //   userId: 1,
    //   tipAmount: "10",
    // });
  };

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardDescription className="flex gap-4">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            type="number"
            className="w-full"
            autoComplete="off"
            disabled={Number(inputValue) > totalAmount}
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            autoFocus
          />
          <button
            onClick={() => {
              setInputValue((prev) => prev.toString().slice(0, -1));
            }}
          >
            <Delete />
          </button>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Dialer value={totalAmount} setValue={setInputValue} />
      </CardContent>
      <CardFooter className="flex justify-center space-x-2">
        <Button
          onClick={() => setInputValue("")}
          variant="outline"
          className="w-full"
        >
          Clear
        </Button>
        <Button
          onClick={handlePayment}
          variant="outline"
          size="lg"
          color="secondary"
          className="w-full"
        >
          Pay
        </Button>
      </CardFooter>
    </Card>
  );
}
