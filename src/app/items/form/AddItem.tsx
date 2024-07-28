"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type NewItem, newItemSchema } from "@/server/db/schemas";

import { ItemFields } from "./ItemFields";
import { Form } from "@/components/ui/form";
import { defaultValues } from "./defaultValues";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";

type AddItemProps = {
  onClose: () => void;
};

export default function AddItem({ onClose }: AddItemProps) {
  const form = useForm<NewItem>({
    resolver: zodResolver(newItemSchema),
    defaultValues,
  });
  const saveItem = api.item.create.useMutation({
    onSuccess: () => {
      form.reset();
      toast({
        title: `${form.getValues("name")} successfully saved`,
        description: "Item successfully saved",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Saving item went wrong", error);
      toast({
        title: "Uh oh! Something went wrong.",
      });
    },
  });

  const onSubmit = (values: NewItem) => {
    saveItem.mutate(values);
  };

  return (
    <section className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <ItemFields form={form} />
          <Button type="submit" className="w-full">
            Save
          </Button>
          <Button
            onClick={() => form.reset()}
            type="reset"
            variant="secondary"
            className="w-full"
          >
            Clear
          </Button>
        </form>
      </Form>
    </section>
  );
}
