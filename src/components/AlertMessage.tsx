"use client";
import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Cross2Icon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { api } from "@/trpc/react";
import { Info, MessageCircleWarning } from "lucide-react";
import { Notification } from "@/server/db/schemas";
import { Button } from "./ui/button";
import Loading from "./Loading";
import { useRouter } from "next/navigation";

type AlertMessageProps = {
  notification: Notification;
};

export default function AlertMessage({ notification }: AlertMessageProps) {
  const router = useRouter();
  const markAsRead = api.notification.markAsRead.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const iconVariant = {
    info: <Info className="size-6" />,
    warning: <MessageCircleWarning className="size-6" />,
    error: <ExclamationTriangleIcon className="size-6" />,
  };
  const handleClose = (id: string) => {
    markAsRead.mutate({ id });
  };
  if (markAsRead.isPending) return <Loading />;

  return (
    <Alert variant={notification.type === "error" ? "destructive" : "default"}>
      {iconVariant[notification.type]}
      <AlertTitle>{notification.title}</AlertTitle>
      <AlertDescription>
        <div className="flex items-center justify-between">
          <p>{notification.message}</p>
          <Button
            size="icon"
            variant="outline"
            className="absolute right-2 top-2 h-6 w-6 shrink-0 rounded-full p-0"
            onClick={() => handleClose(notification.id)}
          >
            <Cross2Icon />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
