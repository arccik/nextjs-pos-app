"use client";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

// import { updateUserSchema, type NewUser } from "@/server/db/schemas";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Loading from "@/components/Loading";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";
import Fields from "./Fields";
import { type UpdateUser, updateUserSchema } from "@/server/db/schemas";
import { useSession } from "next-auth/react";

export default function EditUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { update } = useSession();

  const id = searchParams.get("id")!;
  const { data: user, isLoading } = api.user.getOne.useQuery(id, {
    enabled: !!id,
  });

  const form = useForm<UpdateUser>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      image: "",
      role: "user",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image ?? "",
      });
    }
  }, [user]);

  const updateUser = api.user.update.useMutation({
    onSuccess: async (response) => {
      const [user] = response ?? [];
      toast({ title: `Successfully update ${form.getValues("name")}` });
      await update({ name: user?.name, image: user?.image });
      router.refresh();
      router.back();
    },
  });

  const onSubmit = (values: UpdateUser) => {
    updateUser.mutate({ id, ...values });
  };

  if (isLoading) return <Loading />;
  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800">User Not Found</h1>
        <p className="mt-4 text-lg text-gray-600">
          The item you are looking for does not exist.
        </p>
        <Button
          onClick={() => router.back()}
          size="lg"
          className="mt-8 font-bold"
        >
          Back to Menu
        </Button>
      </div>
    );
  }
  return (
    <main>
      <div className="container mx-auto flex flex-col gap-4 p-2 md:p-10 lg:w-1/2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <h1 className="text-xl font-bold">
                <small>Editing</small> {user.name}
              </h1>
            </div>
            <Fields form={form} />

            <div className="flex gap-4">
              <Button
                onClick={() => router.back()}
                type="reset"
                variant="secondary"
                className="w-full"
              >
                Back
              </Button>
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
