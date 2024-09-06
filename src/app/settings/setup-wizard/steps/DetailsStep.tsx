import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StepProps } from "../type";
import { Label } from "@/components/ui/label";

export default function DetailsStep({ data, updateFields }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Venue Details</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="venue-amenities">Amenities</Label>
          <Textarea
            id="venue-amenities"
            value={data.amenities}
            onChange={(e) => updateFields({ amenities: e.target.value })}
            placeholder="List venue amenities"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="venue-accessibility">Accessibility Information</Label>
          <Textarea
            id="venue-accessibility"
            value={data.accessibilityInformation}
            onChange={(e) =>
              updateFields({ accessibilityInformation: e.target.value })
            }
            placeholder="Describe accessibility features"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="venue-logo">Logo URL</Label>
          <Input
            id="venue-logo"
            value={data.logo}
            onChange={(e) => updateFields({ logo: e.target.value })}
            placeholder="Enter logo URL"
          />
        </div>
      </div>
    </div>
  );
}
