import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { StepProps } from "../type";

export default function PaymentsStep({ data, updateFields }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Payment Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="accept-cash">Accept Cash</Label>
          <Switch
            id="accept-cash"
            checked={data.acceptCash}
            onCheckedChange={(checked) => updateFields({ acceptCash: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="accept-credit">Accept Credit Cards</Label>
          <Switch
            id="accept-credit"
            checked={data.acceptCredit}
            onCheckedChange={(checked) =>
              updateFields({ acceptCredit: checked })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="accept-mobile">Accept Mobile Payments</Label>
          <Switch
            id="accept-mobile"
            checked={data.acceptMobilePayment}
            onCheckedChange={(checked) =>
              updateFields({ acceptMobilePayment: checked })
            }
          />
        </div>
        <div>
          <Label htmlFor="service-fee">Service Fee (%)</Label>
          <Input
            id="service-fee"
            type="number"
            value={data.serviceFee}
            onChange={(e) =>
              updateFields({ serviceFee: parseFloat(e.target.value) })
            }
            placeholder="Enter service fee percentage"
          />
        </div>
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select onValueChange={(value) => updateFields({ currency: value })}>
            <SelectTrigger id="currency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              {/* Add more currencies as needed */}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
