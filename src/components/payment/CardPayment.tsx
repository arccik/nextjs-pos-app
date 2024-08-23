import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface PaymentModalProps {
  totalAmount: number;
  tipAmount: number | null;
}

export default function CardPayment({
  totalAmount,
  tipAmount = 0,
}: PaymentModalProps) {
  const [splitOption, setSplitOption] = useState("1");
  const [inputValue, setInputValue] = useState("");

  const calculateSplitAmount = () => {
    return ((totalAmount + Number(tipAmount)) / parseInt(splitOption)).toFixed(
      2,
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the payment processing
    console.log("Processing payment:", {
      splitOption,
      inputValue,
      amount: calculateSplitAmount(),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inputValue"></Label>
            <Input
              id="inputValue"
              placeholder="Enter payment amount"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
            />
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
          <div className="space-y-2">
            <Label>Payment Summary</Label>
            <div className="text-sm">
              {tipAmount && <p>Tip: £{tipAmount}</p>}
              <p className="font-semibold">
                {splitOption} x £{calculateSplitAmount()}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Pay £{calculateSplitAmount()}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
