import type { StepProps } from "../type";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AddressStep({ data, updateFields }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Store Address</h2>
      <div className="space-y-2">
        <Label htmlFor="store-address">Address</Label>
        <Textarea
          id="store-address"
          placeholder="Enter store address"
          value={data.address}
          onChange={(e) => updateFields({ address: e.target.value })}
          rows={3}
          className="w-full"
        />
      </div>
    </div>
  );
}
