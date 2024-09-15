"use client";
import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardFooter } from "../ui/card";

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
    const result = (totalAmount + Number(tipAmount)) / parseInt(splitOption);
    return result.toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = calculateSplitAmount();
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
            className="mx-auto w-[400px] sm:w-full"
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
        <Card className="mx-auto rounded-lg shadow-md">
          <CardContent>
            <Label className="text-lg font-bold">Payment Summary</Label>
            {splitOption !== "1" && (
              <div className="mt-4 space-y-2 border-b text-sm">
                <div className="flex justify-between font-semibold">
                  <span>{splitOption} x</span>
                  <span>£{calculateSplitAmount()}</span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-5">
            <div className="flex w-full justify-between">
              <span>Tip:</span>
              <span className="text-right">£{tipAmount?.toFixed(2)}</span>
            </div>
            <div className="flex w-full justify-between border-t text-base font-semibold">
              <span>Total:</span>
              <span className="text-right">
                £{(tipAmount ?? 0) + totalAmount}
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div>
        <Button type="submit" className="mt-10 w-full">
          Pay £{calculateSplitAmount()}
        </Button>
      </div>
    </form>
  );
}
