import { Button } from "@/components/ui/button";
import useCookedItem from "@/hooks/useCookedItem";

type MakeReadyButtonProps = {
  orderId: string;
};

export default function MakeReadyButton({ orderId }: MakeReadyButtonProps) {
  const { isAllChecked, setOrderReady } = useCookedItem(orderId);
  if (!isAllChecked) return null;

  return <Button onClick={() => setOrderReady()}>Order Ready</Button>;
}
