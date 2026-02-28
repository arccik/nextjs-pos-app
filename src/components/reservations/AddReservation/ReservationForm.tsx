"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { newReservationSchema } from "@/server/db/schemas";
import { Form } from "@/components/ui/form";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import ReservationSteps from "./ReservationSteps";

export type ReservationFormValues = z.infer<typeof newReservationSchema>;

type NewReservationProps = {
  onComplete: () => void;
};

export default function NewReservation({ onComplete }: NewReservationProps) {
  const { toast } = useToast();
  const utils = api.useUtils();

  const createReservation = api.reservation.create.useMutation({
    onSuccess: (data) => {
      const reservationId = data?.[0]?.id;
      void utils.reservation.getAll.invalidate();
      toast({
        title: "Reservation created",
        description: reservationId
          ? `Reservation ID: ${reservationId.slice(0, 8)}...`
          : "Reservation has been created successfully.",
      });
      onComplete();
    },
    onError: (error) => {
      toast({
        title: "Failed to create reservation",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(newReservationSchema),
    defaultValues: {
      tableId: undefined,
      customerName: "",
      customerPhoneNumber: "",
      customerEmail: "",
      guestsPredictedNumber: 1,
      specialRequests: "",
      notes: "",
      scheduledAt: "",
      expireAt: undefined,
    },
  });

  const onSubmit = (values: ReservationFormValues) => {
    createReservation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ReservationSteps form={form} isPending={createReservation.isPending} />
      </form>
    </Form>
  );
}
