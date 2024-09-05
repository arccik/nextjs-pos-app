import { useState } from "react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface PaymentModalProps {
  totalAmount: number;
  tipAmount: number | null;
  onPay: (amount: number) => void;
}

export default function CardPayment({
  totalAmount,
  tipAmount,
  onPay,
}: PaymentModalProps) {
  const [splitOption, setSplitOption] = useState("1"); // 1: 100% / 2: 50% / 3: 33% / 4: 25%;
  const [inputValue, setInputValue] = useState("");

  const calculateSplitAmount = () => {
    return ((totalAmount + Number(tipAmount)) / parseInt(splitOption)).toFixed(
      2,
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the payment processing
    const amount = calculateSplitAmount();
    console.log(`Paying: £${amount}`);
    onPay(parseFloat(amount));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="inputValue"></Label>
          <Input
            id="inputValue"
            placeholder="Enter payment amount"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <p className="text-center text-2xl text-slate-400">OR</p>
        </div>
        <div className="space-y-2">
          <Label>Payment Split</Label>
          <Tabs
            defaultValue="account"
            className="w-[400px]"
            value={splitOption}
            onValueChange={setSplitOption}
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="1">No Split</TabsTrigger>
              <TabsTrigger value="2">50%</TabsTrigger>
              <TabsTrigger value="3">33%</TabsTrigger>
              <TabsTrigger value="4">25%</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <Card className="w-full max-w-sm rounded-lg p-4 shadow-md">
          <CardContent>
            <Label className="text-lg font-bold">Payment Summary</Label>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tip:</span>
                <span>£{tipAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>{splitOption} x</span>
                <span>£{calculateSplitAmount()}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="mt-4 flex justify-between border-t pt-4 text-base font-semibold">
            <span>Total:</span>
            <span>£{totalAmount.toFixed(2)}</span>
          </CardFooter>
        </Card>
      </div>
      <div>
        <Button type="submit" className="w-full">
          Pay £{calculateSplitAmount()}
        </Button>
      </div>
    </form>
  );
}
