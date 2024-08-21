import { Button } from "@/components/ui/button";
import useCookedItem from "@/hooks/useCookedItem";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";

type MakeReadyButtonProps = {
  orderId: string;
};

export default function MakeReadyButton({ orderId }: MakeReadyButtonProps) {
  const { isAllChecked, setOrderReady } = useCookedItem(orderId);
  if (!isAllChecked) return null;

  return <Button onClick={() => setOrderReady()}>Order Ready</Button>;
}
