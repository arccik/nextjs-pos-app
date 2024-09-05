import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StepProps } from "../type";

export default function LogoStep({ data, updateFields }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Store Logo</h2>
      <div className="space-y-2">
        <Label htmlFor="store-logo">Upload Logo</Label>
        <Input
          id="store-logo"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                updateFields({ logo: reader.result as string });
              };
              reader.readAsDataURL(file);
            }
          }}
          className="w-full"
        />
      </div>
      {data.logo && (
        <img
          src={data.logo}
          alt="Store Logo"
          className="mt-4 h-auto max-w-full rounded-lg"
        />
      )}
    </div>
  );
}
