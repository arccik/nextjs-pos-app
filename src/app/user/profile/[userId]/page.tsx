"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings } from "lucide-react";
import { api } from "@/trpc/react";
import { newUserSchema } from "@/server/db/schemas";
import { toast } from "@/components/ui/use-toast";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";

type ProfileFormValues = z.infer<typeof newUserSchema>;

type ProfilePageProps = {
  params: {
    userId: string;
  };
};

export default function ProfilePage({ params: { userId } }: ProfilePageProps) {
  const { data: session, update } = useSession();
  const { data: userData, isLoading } = api.user.getOne.useQuery(userId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(
    "/placeholder.svg?height=100&width=100",
  );
  const updateProfile = api.user.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Profile updated successfully",
        description: "Your profile has been updated.",
      });
    },
  });
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "waiter",
      password: "",
      employeeId: "",
      shiftPreference: "morning",
    },
  });

  useEffect(() => {
    if (userData) {
      form.reset({
        name: userData.name ?? "",
        email: userData.email ?? "",
        role: userData.role,
        password: "",
        employeeId: userData.employeeId ?? "",
        shiftPreference: userData.shiftPreference as
          | "morning"
          | "afternoon"
          | "evening"
          | "night",
      });
      setImageUrl(userData.image ?? "/placeholder.svg?height=100&width=100");
    }
  }, [userData, form]);

  const onSubmit: SubmitHandler<ProfileFormValues> = (data) => {
    console.log("onSubmit: ", data);
    delete data.role;
    if (data.name !== session?.user.name) {
      update({ name: data.name });
    }
    updateProfile.mutate({ id: userId, ...data, image: imageUrl });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarEdit = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="p-2">
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">User Profile</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={imageUrl} alt="User avatar" />
                    <AvatarFallback>UN</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    type="button"
                    variant="outline"
                    className="absolute bottom-0 right-0"
                    onClick={handleAvatarEdit}
                  >
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Edit profile image</span>
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            autoComplete="username"
                            {...field}
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            autoComplete="email"
                            placeholder="john.doe@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input
                            type="role"
                            disabled
                            placeholder="john.doe@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        {/* <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="waiter">Waiter</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select> */}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="employeeId"
                    disabled
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="EMP12345"
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
                    name="shiftPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shift Preference</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select shift" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="morning">Morning</SelectItem>
                            <SelectItem value="afternoon">Afternoon</SelectItem>
                            <SelectItem value="evening">Evening</SelectItem>
                            <SelectItem value="night">Night</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="ml-auto">
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </main>
  );
}
