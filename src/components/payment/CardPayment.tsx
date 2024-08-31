"use client";
import { useState } from "react";

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
    <form onSubmit={handleSubmit}>
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
        <div className="space-y-2">
          <Label>Payment Summary</Label>
          <div className="text-sm">
            {tipAmount && <p>Tip: £{tipAmount}</p>}
            <p className="font-semibold">
              {splitOption} x £{calculateSplitAmount()}
            </p>
          </div>
        </div>
      </div>
      <footer>
        <Button type="submit" className="w-full">
          Pay £{calculateSplitAmount()}
        </Button>
      </footer>
    </form>
  );
}
