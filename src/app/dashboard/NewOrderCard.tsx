import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewOrderCard() {
  return (
    <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
      <CardHeader className="pb-3">
        <CardTitle>Your Orders</CardTitle>
        <CardDescription className="max-w-lg text-balance leading-relaxed">
          Introducing Our Orders Dashboard for Seamless Management and Insightful Analysis.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild>
          <Link to="/menu">Create New Order</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
