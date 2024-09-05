import type { StepProps } from "../type";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ServiceFeeStep({ data, updateFields }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Service Fee</h2>
      <div className="space-y-2">
        <Label htmlFor="service-fee">Service Fee (%)</Label>
        <Input
          id="service-fee"
          type="number"
          placeholder="Enter service fee"
          value={data.serviceFee}
          onChange={(e) =>
            updateFields({ serviceFee: parseFloat(e.target.value) })
          }
          className="w-full"
        />
      </div>
    </div>
  );
}
