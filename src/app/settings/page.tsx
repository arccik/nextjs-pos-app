"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  NewVenueSettings,
  type VenueSettings,
  venueSettingsSchema,
  newVenueSettingsSchema,
} from "@/server/db/schemas";
import { useMutation, useQuery } from "@tanstack/react-query";
// import { getVenueSettings, updateVenueSettings } from "@/api/venueSettings";
// import Loading from "@/components/layout/Loading";
// import Error from "@/components/layout/Error";
import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import Loading from "@/components/Loading";

export default function SettingsPage() {
  //   const { data, isLoading, isError } = useQuery({
  //     queryKey: ["venueSettings"],
  //     queryFn: getVenueSettings,
  //   });
  const mutateFunc = (str: string) => ({
    onSuccess: () => {
      toast({
        title: `Venue Settings successfully saved`,
      });
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const createSettings = api.settings.create.useMutation(mutateFunc("create"));
  const { data, isLoading } = api.settings.get.useQuery();

  const form = useForm<NewVenueSettings>({
    resolver: zodResolver(newVenueSettingsSchema),
    defaultValues: data,
  });
  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  function onSubmit(data: NewVenueSettings) {
    createSettings.mutate(data);
  }
  if (isLoading) {
    return <Loading />;
  }
  return (
    <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold text-slate-400">Settings</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <section className="col-span-3 row-span-1 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900 md:col-span-1 md:row-span-3">
              <h2 className="mb-4 text-xl font-semibold">Restaurant Details</h2>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Restaurant Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          className="border-none"
                          placeholder="type here.."
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Address</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          className="border-none"
                          placeholder="type here.."
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          className="border-none"
                          placeholder="type here.."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          className="border-none"
                          placeholder="type here.."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          className="border-none"
                          placeholder="type here.."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className="col-span-3 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900 md:col-span-1 md:h-[250px]">
              <h2 className="mb-4 text-xl font-semibold">Payment Options</h2>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="acceptCash"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Accept Cash</FormLabel>
                      <FormControl>
                        <Switch
                          onCheckedChange={(e) => field.onChange(e)}
                          checked={field.value ?? undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="acceptCredit"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Accept Credit Cards</FormLabel>
                      <FormControl>
                        <Switch
                          onCheckedChange={(e) => field.onChange(e)}
                          checked={field.value ?? undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="acceptMobilePayment"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Accept Mobile payment</FormLabel>
                      <FormControl>
                        <Switch
                          onCheckedChange={(e) => field.onChange(e)}
                          checked={field.value ?? undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className="col-span-3 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900 sm:h-[250px] md:col-span-1">
              <h2 className="mb-4 text-xl font-semibold">User Permissions</h2>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="alloweManagerToEditMenu"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Allow Managers to Edit Menu</FormLabel>
                      <FormControl>
                        <Switch
                          onCheckedChange={(e) => field.onChange(e)}
                          checked={field.value ?? undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allowedChashierToRefund"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Allow Cashiers to Process Refunds</FormLabel>
                      <FormControl>
                        <Switch
                          onCheckedChange={(e) => field.onChange(e)}
                          checked={field.value ?? undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="allowedServersToModifyOrder"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Allow Servers to Modify Orders</FormLabel>
                      <FormControl>
                        <Switch
                          onCheckedChange={(e) => field.onChange(e)}
                          checked={field.value ?? undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>
            <section className="col-span-3 w-full md:col-span-2">
              <h2 className="mb-4 text-xl font-semibold">
                Capacity & Amenities
              </h2>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="serviceFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Fee</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          type="number"
                          className="border-none"
                          placeholder="type here.."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amenities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venue amenities</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          className="border-none"
                          placeholder="type here.."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          type="number"
                          className="border-none"
                          placeholder="type here.."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>
          </div>
          <div className="flex justify-end p-6">
            <Button className="w-full sm:w-max">Save</Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
