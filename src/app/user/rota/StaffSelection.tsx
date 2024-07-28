// components/StaffStatusSelector.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Rota, User } from "@/server/db/schemas";

type Shift = "morning" | "evening" | "night";

interface StaffStatus {
  id: string;
  working: boolean;
  shift: Shift | null;
}

interface StaffStatusSelectorProps {
  staffMembers: User[];
  date: Date;
  onStatusChange: (staffStatus: StaffStatus[]) => void;
}

export function StaffStatusSelector({
  staffMembers,
  date,
  onStatusChange,
}: StaffStatusSelectorProps) {
  const [staffStatus, setStaffStatus] = useState<StaffStatus[]>(
    staffMembers.map((staff) => ({
      id: staff.id,
      working: false,
      shift: null,
    })),
  );

  const toggleStaffStatus = (staffId: string) => {
    setStaffStatus((prev) =>
      prev.map((status) =>
        status.id === staffId
          ? {
              ...status,
              working: !status.working,
              shift: !status.working ? null : status.shift,
            }
          : status,
      ),
    );
  };

  const updateStaffShift = (staffId: string, shift: Shift) => {
    setStaffStatus((prev) =>
      prev.map((status) =>
        status.id === staffId ? { ...status, shift } : status,
      ),
    );
  };

  const handleStatusChange = () => {
    onStatusChange(staffStatus);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold">
        Staff Status for {date.toDateString()}
      </h2>
      <div className="space-y-4">
        {staffMembers.map((staff) => {
          const status = staffStatus.find((s) => s.id === staff.id);
          return (
            <div key={staff.id} className="flex items-center space-x-2">
              <Button
                variant={status?.working ? "default" : "outline"}
                onClick={() => toggleStaffStatus(staff.id)}
                className="rounded-full text-sm"
              >
                {staff.name}
              </Button>
              {status?.working && (
                <Select
                  value={status.shift || ""}
                  onValueChange={(value: Shift) =>
                    updateStaffShift(staff.id, value)
                  }
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          );
        })}
        <div className="flex justify-between text-sm text-gray-600">
          <div>
            <strong>Working:</strong>{" "}
            {staffStatus.filter((s) => s.working).length}
          </div>
          <div>
            <strong>Off:</strong> {staffStatus.filter((s) => !s.working).length}
          </div>
        </div>
        <Button onClick={handleStatusChange} className="w-full">
          Save Status
        </Button>
      </div>
    </div>
  );
}
