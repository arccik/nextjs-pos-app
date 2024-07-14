"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type NewTable, insertTableSchema } from "@/server/db/schemas";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";

type AddTableFormProps = {
  onClose: () => void;
};

export default function AddTableForm({ onClose }: AddTableFormProps) {
  const form = useForm<NewTable>({
    resolver: zodResolver(insertTableSchema),
    defaultValues: {
      number: undefined,
      prefix: undefined,
      description: undefined,
      seats: 0,
    },
  });
  const createTable = api.table.create.useMutation({
    onError: (error) => {
      if (error instanceof Error) {
        form.setError("number", { message: error.message });
      }
      console.error("Error creating table", error);
    },
  });

  const onSubmit = (values: NewTable) => {
    createTable.mutate(values);
    onClose();
    alert(JSON.stringify(values, null, 2));
  };
  console.log(form.formState);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number</FormLabel>
              <FormControl>
                <Input
                  //   disabled={addNewTable.isPending}
                  placeholder="Table Number"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prefix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prefix (Optional)</FormLabel>
              <FormControl>
                <Input
                  //   disabled={addNewTable.isPending}
                  placeholder="Prefix"
                  type="text"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  //   disabled={addNewTable.isPending}
                  placeholder="Description"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seats"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seats</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  //   disabled={addNewTable.isPending}
                  placeholder="type here..."
                  max={50}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          variant="outline"
          //   disabled={addNewTable.isPending}
          type="submit"
        >
          Create a table
        </Button>
      </form>
    </Form>
  );
}
