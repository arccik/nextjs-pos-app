import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StepProps } from "../type";

export default function StoreInfoStep({ data, updateFields }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">
        Store Information
      </h2>
      <div className="space-y-2">
        <Label htmlFor="store-name">Store Name</Label>
        <Input
          id="store-name"
          placeholder="Enter store name"
          value={data.name}
          onChange={(e) => updateFields({ name: e.target.value })}
          className="w-full"
        />
      </div>
    </div>
  );
}
