"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type NewCategory, newCategoriesSchema } from "@/server/db/schemas";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Form } from "@/components/ui/form";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

type AddNewCategoryProps = {
  onClose: () => void;
};

export default function AddNewCategory({ onClose }: AddNewCategoryProps) {
  const form = useForm<NewCategory>({
    resolver: zodResolver(newCategoriesSchema),
    defaultValues: {
      name: "",
    },
  });
  const saveCategory = api.category.create.useMutation({
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

  const onSubmit = (values: NewCategory) => {
    saveCategory.mutate(values);
  };

  return (
    <section className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="type here..." value={field.value ?? ""} />
                </FormControl>
                <FormDescription>
                  This is item public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
