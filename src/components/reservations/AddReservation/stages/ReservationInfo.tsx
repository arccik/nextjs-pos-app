"use client";
import { Button } from "@/components/ui/button";
import { type ReservationStepsProps } from "../ReservationSteps";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { XIcon, ClockIcon } from "lucide-react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { api } from "@/trpc/react";

export default function ReservationInfo({ form }: ReservationStepsProps) {
  const { data: tables } = api.table.getAll.useQuery();

  const scheduledAt = form.watch("scheduledAt");
  const tableId = form.watch("tableId");

  const { data: slots, isLoading: slotsLoading } =
    api.reservation.timeSlots.useQuery(
      { tableId: tableId ?? undefined, date: scheduledAt },
      { enabled: !!scheduledAt },
    );

  return (
    <div className="mb-10 space-y-4">
      {/* Table selection */}
      <FormField
        control={form.control}
        name="tableId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Table</FormLabel>
            <FormControl>
              <div className="flex items-center gap-2">
                <Select
                  value={field.value ?? ""}
                  onValueChange={(v) => {
                    field.onChange(v || undefined);
                    form.setValue("expireAt", undefined);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a table" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {tables?.map((table) => (
                        <SelectItem key={table.id} value={table.id}>
                          Table {table.number}
                          {table.prefix ? ` (${table.prefix})` : ""}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {field.value && (
                  <Button
                    onClick={() => {
                      field.onChange(undefined);
                      form.setValue("expireAt", undefined);
                    }}
                    size="icon"
                    variant="outline"
                    type="button"
                  >
                    <XIcon />
                  </Button>
                )}
              </div>
            </FormControl>
            <FormDescription>Reserve a specific table (optional)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Date picker */}
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
                      format(new Date(field.value), "do MMM yyyy")
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
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(v) => {
                    field.onChange(v ? format(v, "P") : undefined);
                    form.setValue("expireAt", undefined);
                    form.clearErrors("scheduledAt");
                  }}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Time slot selection — shown when a date is selected and store settings exist */}
      {scheduledAt && (
        <FormField
          control={form.control}
          name="expireAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Time slot</FormLabel>
              {slotsLoading && (
                <p className="text-sm text-muted-foreground">
                  Loading available slots…
                </p>
              )}
              {!slotsLoading && !slots && (
                <p className="text-sm text-muted-foreground">
                  No time slots available. Store schedule may not be configured.
                </p>
              )}
              {slots && slots.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No available slots for this date.
                </p>
              )}
              {slots && slots.length > 0 && (
                <ToggleGroup
                  type="single"
                  value={field.value ?? ""}
                  onValueChange={(v) => {
                    form.clearErrors("expireAt");
                    field.onChange(v || undefined);
                  }}
                  variant="outline"
                  size="sm"
                  className="grid grid-cols-3 gap-2"
                >
                  {slots.map((slot, index) => (
                    <ToggleGroupItem
                      key={slot.startTime + index}
                      className="flex gap-1 text-xs"
                      disabled={!slot.isAvailable}
                      value={slot.finishTime}
                    >
                      <ClockIcon className="h-3 w-3" />
                      {`${slot.startTime} – ${slot.finishTime}`}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
