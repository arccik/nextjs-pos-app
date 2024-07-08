import { Button } from "@/components/ui/button";
import { ReservationStepsProps } from "../ReservationSteps";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ClockIcon, XIcon } from "lucide-react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn, generateTimeSlots } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
// import { type ReservationTimeSlot } from "@/server/db/utils";
// import { fetchTimeSlots } from "@/api/reservation";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getAll } from "@/server/db/models/table";
import { timeSlots } from "@/server/db/models/reservation";
// import Loading from "@/components/layout/Loading";
// import Error from "@/components/layout/Error";
// import { useVenueSettings } from "@/hooks/useVenueSettings";

export default async function ReservationInfo({ form }: ReservationStepsProps) {
  //   const { venueTables } = useVenueSettings();
  const tables = await getAll();
  const date = form?.getValues("scheduledAt");
  const tableId = form?.getValues("tableId");
  const slots = await timeSlots({ date, tableId });
  //   const { isLoading, data, isError } = useQuery<ReservationTimeSlot[]>({
  //     queryKey: ["timeSlots"],
  //     queryFn: () =>
  //       fetchTimeSlots(
  //         form?.getValues("scheduledAt"),
  //         form?.getValues("tableId"),
  //       ),
  //     enabled: !!form?.getFieldState("scheduledAt").isDirty,
  //   });
  return (
    <div className="mb-10 space-y-4">
      <FormField
        control={form.control}
        name="tableId"
        render={({ field }) => (
          <FormItem>
            <FormLabel> Table</FormLabel>
            <FormControl>
              <div className="flex items-center gap-2">
                <Select
                  value={field.value?.toString()}
                  onValueChange={(v) => field?.onChange(Number(v))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a table" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {tables?.map((table) => (
                        <SelectItem key={table.id} value={table.id.toString()}>
                          {table.number}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {field.value && (
                  <Button
                    onClick={() => field.onChange("")}
                    size="icon"
                    variant="outline"
                    type="button"
                  >
                    <XIcon />
                  </Button>
                )}
              </div>
            </FormControl>
            <FormDescription>Reserve specific table</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="scheduledAt"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value ? (
                      format(field.value, "do MMM yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={new Date(field.value)}
                  onSelect={(v) => {
                    field.onChange(v && format(v, "P"));
                    form.clearErrors("scheduledAt");
                  }}
                  disabled={(date) =>
                    new Date(date.setDate(date.getDate() + 1)) > date
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* {isError && <Error message="Fail to fetch time slots" />}
      {isLoading && <Loading />} */}
      <FormField
        control={form.control}
        name="expireAt"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Time slot</FormLabel>
            {slots && (
              <ToggleGroup
                type="single"
                onValueChange={(v) => {
                  form.clearErrors("expireAt");
                  field.onChange(v);
                }}
                defaultValue={field.value}
                variant="outline"
                size="sm"
                className="grid grid-cols-3  gap-2"
              >
                {slots?.map((slot, index) => (
                  <ToggleGroupItem
                    key={slot.startTime + index}
                    className="flex gap-2 text-xs"
                    disabled={!slot.isAvailable}
                    value={slot.finishTime}
                  >
                    <ClockIcon />
                    {`${slot.startTime} - ${slot.finishTime}`}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
