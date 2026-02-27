"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Overview } from "../Overview";
import { api } from "@/trpc/react";

export default function TabsNav() {
  const { data: soldTotal } = api.payment.getTotalSoldItems.useQuery();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Most Sold Items</CardTitle>
            <CardDescription>
              You made {soldTotal} sales this month.
            </CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
      </div>
    </div>
  );
}
