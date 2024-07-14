import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function AddNewOrderButton() {
  return (
    <Link href="/menu">
      <Button variant="outline" size="sm">
        <PlusIcon size="1rem" className="mr-1" />
        Add New
      </Button>
    </Link>
  );
}
