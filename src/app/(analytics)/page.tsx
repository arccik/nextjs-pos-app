"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDateRangePicker } from "./DateRangePicker";
import { RecentSales } from "./RecentSales";
import ScoreCard from "./ScoreCard";
import {
  CircleDashed,
  DollarSign,
  PanelsTopLeft,
  SubscriptIcon,
} from "lucide-react";
import { api } from "@/trpc/react";
import Link from "next/link";
import { formatId } from "@/lib/utils";
import { Overview } from "./Overview";

export default function DashboardPage() {
  const { data: monthlySales } = api.bill.getMonthlySales.useQuery();
  const { data: weeklySales } = api.bill.getWeeklySales.useQuery();
  const { data: soldTotal } = api.payment.getTotalSoldItems.useQuery();
  const { data: orders } = api.order.getAllByToday.useQuery();

  const activeOrders = orders?.filter((order) => order.status !== "Completed");

  const activeOrderUsers = orders?.map((order) => (
    <Link key={order.id} href={"/orders/" + order.userId}>
      {formatId(order.userId)}
    </Link>
  ));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Button>Download</Button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {monthlySales !== undefined && (
              <ScoreCard
                title="Monthly Revenue"
                icon={<DollarSign />}
                value={`£${monthlySales}`}
              />
            )}
            {weeklySales !== undefined && (
              <ScoreCard
                title="Weekly Revenue"
                icon={<DollarSign />}
                value={`£${weeklySales}`}
              />
            )}
            <ScoreCard
              title="Sold Dishes"
              value={soldTotal ? soldTotal.toString() : "0"}
              icon={<SubscriptIcon />}
            />
            <ScoreCard
              title="Sales"
              value={String(orders?.length ?? 0)}
              icon={<CircleDashed />}
            />
            {!!activeOrders?.length && (
              <ScoreCard
                title="Active Now"
                change={activeOrderUsers}
                value={activeOrders.length + ""}
                icon={<PanelsTopLeft />}
              />
            )}
          </div>
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
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
