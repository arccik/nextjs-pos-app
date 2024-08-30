"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import Loading from "@/components/Loading";
import { toast } from "@/components/ui/use-toast";
import { Rota } from "@/server/db/schemas";

type Shift = "morning" | "evening" | "night";

export interface StaffStatus {
  userId: string;
  working: boolean;
  shift: Shift | null;
  date: Date;
}

interface StaffStatusSelectorProps {
  date: Date | null;
  onComplete: () => void;
  rotaData?: Rota[];
}

export function StaffStatusSelector({
  date,
  onComplete,
  rotaData,
}: StaffStatusSelectorProps) {
  const [staffStatus, setStaffStatus] = useState<StaffStatus[] | undefined>();
  console.log("ROTA DATA: ", rotaData);
  const saveRota = api.rota.saveRota.useMutation({
    onSuccess: async () => {
      toast({
        title: "Rota saved successfully",
        description: "The rota has been saved to the database",
      });
      onComplete();
    },
  });

  const { data: staffMembers, isLoading } = api.user.getAll.useQuery();
  console.log({ staffMembers });
  useEffect(() => {
    setStaffStatus(
      staffMembers?.map((staff) => {
        const item = rotaData?.find((v) => {
          return v.userId === staff.id && v.date.getDate() === date?.getDate();
        });
        return {
          userId: staff.id,
          working: !!item?.working,
          shift: item?.shift!,
          name: staff.name,
          date: date ?? item?.date!,
        };
      }),
    );
  }, [staffMembers]);

  const handleStatusChange = () => {
    staffStatus && saveRota.mutate(staffStatus);
  };
  const toggleStaffStatus = (staffId: string) => {
    setStaffStatus((prev) =>
      prev?.map((status) =>
        status.userId === staffId
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
      prev?.map((status) =>
        status.userId === staffId ? { ...status, shift } : status,
      ),
    );
  };

  if (isLoading) return <Loading />;
  return (
    <div className="rounded-lg bg-white">
      <div className="space-y-4">
        {staffMembers?.map((staff) => {
          const status = staffStatus?.find((s) => s.userId === staff.id);
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
                  value={status.shift ?? ""}
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
            {staffStatus?.filter((s) => s.working).length}
          </div>
          <div>
            <strong>Off:</strong>{" "}
            {staffStatus?.filter((s) => !s.working).length}
          </div>
        </div>
        <Button onClick={handleStatusChange} className="w-full">
          Save Status
        </Button>
      </div>
    </div>
  );
}
