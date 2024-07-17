"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { type Item, itemsSchema } from "@/server/db/schemas";

import { Button } from "@/components/ui/button";
import { ItemFields } from "./ItemFields";
import { Form } from "@/components/ui/form";

import { useEffect } from "react";
import { defaultValues } from "./defaultValues";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

export default function EditItem() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const id = params.get("id");
  const router = useRouter();

  const { data, isLoading: isItemLoading } = api.item.getOne.useQuery(
    { id },
    { enabled: !!id },
  );
  const { mutate: update } = api.item.update.useMutation({
    onSuccess: () => {
      toast({ title: `Successfully update ${form.getValues("name")}` });
      router.back();
    },
    onError: (error) => {
      console.error("error Updating item: ", error);
    },
  });
  const form = useForm<Item>({
    resolver: zodResolver(itemsSchema),
    defaultValues,
  });
  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data]);

  const onSubmit = (values: Item) => {
    update(values);
    console.log("SUBMITTING");
  };

  if (isItemLoading) return <Loading />;
  if (!data) return <p>Item cannot be found</p>;
  return (
    <main>
      <div className="container mx-auto flex flex-col gap-4 p-2 md:p-10 lg:w-1/2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <h1 className="text-xl font-bold">
                <small>Edit:</small> {data.name}
              </h1>
            </div>
            <ItemFields form={form} />

            <div>
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
              <Button
                // onClick={() => navigate(-1)}
                type="reset"
                variant="secondary"
                className="w-full"
              >
                Back
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
