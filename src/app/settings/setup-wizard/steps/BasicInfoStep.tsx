import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { StepProps } from "../type";

export default function BasicInfoStep({ data, updateFields }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        Basic Information
      </h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="venue-name">Venue Name</Label>
          <Input
            id="venue-name"
            value={data.name}
            onChange={(e) => updateFields({ name: e.target.value })}
            placeholder="Enter venue name"
          />
        </div>
        <div>
          <Label htmlFor="venue-description">Description</Label>
          <Textarea
            id="venue-description"
            value={data.description}
            onChange={(e) => updateFields({ description: e.target.value })}
            placeholder="Describe your venue"
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="venue-capacity">Capacity</Label>
          <Input
            id="venue-capacity"
            type="number"
            value={data.capacity}
            onChange={(e) =>
              updateFields({ capacity: parseInt(e.target.value) })
            }
            placeholder="Enter venue capacity"
          />
        </div>
      </div>
    </div>
  );
}
