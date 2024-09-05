import { Button } from "@/components/ui/button";
import useCookedItem from "@/hooks/useCookedItem";
import { formatId } from "@/lib/utils";
import { api } from "@/trpc/react";

type MakeReadyButtonProps = {
  orderId: string;
  sendNotificationTo: string;
};

export default function MakeReadyButton({
  orderId,
  sendNotificationTo,
}: MakeReadyButtonProps) {
  const { isAllChecked, setOrderReady } = useCookedItem(orderId);
  const sendNotification = api.notification.create.useMutation();

  const handleClick = () => {
    setOrderReady();
    sendNotification.mutate({
      message: `Order ${formatId(orderId)} is ready`,
      title: "Order Ready",
      userId: sendNotificationTo,
    });
  };
  if (!isAllChecked) return null;

  return <Button onClick={handleClick}>Order Ready</Button>;
}
