import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepProps } from "../type";

export default function ContactStep({ data, updateFields }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        Contact Information
      </h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="venue-address">Address</Label>
          <Input
            id="venue-address"
            value={data.address}
            onChange={(e) => updateFields({ address: e.target.value })}
            placeholder="Enter venue address"
          />
        </div>
        <div>
          <Label htmlFor="venue-phone">Phone</Label>
          <Input
            id="venue-phone"
            value={data.phone}
            onChange={(e) => updateFields({ phone: e.target.value })}
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <Label htmlFor="venue-email">Email</Label>
          <Input
            id="venue-email"
            type="email"
            value={data.email}
            onChange={(e) => updateFields({ email: e.target.value })}
            placeholder="Enter email address"
          />
        </div>
        <div>
          <Label htmlFor="venue-website">Website</Label>
          <Input
            id="venue-website"
            value={data.website}
            onChange={(e) => updateFields({ website: e.target.value })}
            placeholder="Enter website URL"
          />
        </div>
        <div>
          <Label htmlFor="venue-manager">Manager Name</Label>
          <Input
            id="venue-manager"
            value={data.managerName}
            onChange={(e) => updateFields({ managerName: e.target.value })}
            placeholder="Enter manager's name"
          />
        </div>
      </div>
    </div>
  );
}
