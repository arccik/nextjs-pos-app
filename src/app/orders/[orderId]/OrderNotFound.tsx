import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
export default function OrderNotFound() {
  return (
    <div className="flex  items-center justify-center">
      <Card className="max-w-md p-4 text-center">
        <CardHeader>
          <CardTitle>Order Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>We couldn&apos;t find the order you&apos;re looking for.</p>
        </CardContent>
        <CardFooter>
          <Link href="/orders">
            <Button variant="outline">Back to Orders</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
