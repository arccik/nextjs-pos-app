"use client";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
// import UploadFile from "./UploadFile";
import { type Item } from "@/server/db/schemas";

type ItemFieldsProps = {
  form: UseFormReturn<Required<Item>>;
};

export default function ItemFields({ form }: ItemFieldsProps) {
  const { data: categories } = api.category.getAll.useQuery();

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="type here..." />
            </FormControl>
            <FormDescription>This is item public display name.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="type here..."
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
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.1"
                placeholder="type here..."
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* <UploadFile form={form} /> */}
      <FormField
        control={form.control}
        name="categoryId"
        defaultValue={form.getValues("categoryId")}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Select
                onValueChange={(e) => field.onChange(e)}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="preparationTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preparation time</FormLabel>

            <FormControl>
              <Input
                placeholder="type here..."
                value={field.value}
                onChange={field.onChange}
                type="number"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-flow-col">
        <FormField
          control={form.control}
          name="isVegan"
          render={({ field }) => (
            <FormItem className="items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Vegan</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isGlutenFree"
          render={({ field }) => (
            <FormItem className="items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Gluten Free</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isVegetarian"
          render={({ field }) => (
            <FormItem className="space-x-2">
              <FormControl>
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Vegetarian</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isSpicy"
          render={({ field }) => (
            <FormItem className="space-x-2">
              <FormControl>
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Spicy</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
