import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { StepProps } from "../type";

export default function PermissionsStep({ data, updateFields }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Permissions</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="manager-edit-menu">Allow Manager to Edit Menu</Label>
          <Switch
            id="manager-edit-menu"
            checked={data.alloweManagerToEditMenu}
            onCheckedChange={(checked) =>
              updateFields({ alloweManagerToEditMenu: checked })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="cashier-refund">Allow Cashier to Refund</Label>
          <Switch
            id="cashier-refund"
            checked={data.allowedChashierToRefund}
            onCheckedChange={(checked) =>
              updateFields({ allowedChashierToRefund: checked })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="servers-modify-order">
            Allow Servers to Modify Orders
          </Label>
          <Switch
            id="servers-modify-order"
            checked={data.allowedServersToModifyOrder}
            onCheckedChange={(checked) =>
              updateFields({ allowedServersToModifyOrder: checked })
            }
          />
        </div>
      </div>
    </div>
  );
}
