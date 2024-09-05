"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "./DateRangePicker";
import { Overview } from "./Overview";
import { RecentSales } from "./RecentSales";
import ScoreCard from "./ScoreCard";
import {
  CircleDashed,
  DollarSign,
  PanelsTopLeft,
  SubscriptIcon,
} from "lucide-react";
import { api } from "@/trpc/react";

export default function DashboardPage() {
  const { data: totalSales } = api.payment.getTotalSales.useQuery();
  const { data: soldTotal } = api.payment.getTotalSoldItems.useQuery();
  const { data: orders } = api.order.getAllByToday.useQuery();

  const activeOrders = orders?.filter((order) => order.status !== "Completed");

  const activeOrderUsers = orders?.map((order) => order.userId);


  return (
    <div className="hidden flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Button>Download</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" disabled>
              Reports
            </TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Notifications
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {totalSales && (
                <ScoreCard
                  title="Total Revenue"
                  icon={<DollarSign />}
                  change="+20.1% from last month"
                  value={`£${totalSales}`}
                />
              )}
              <ScoreCard
                title="Sold Dishes"
                change="+3.7% from last month"
                value={soldTotal ? soldTotal.toString() : "0"}
                icon={<SubscriptIcon />}
              />
              <ScoreCard
                title="Sales"
                change="+5.2% from last month"
                value="+12,234"
                icon={<CircleDashed />}
              />
              {!!activeOrders?.length && (
                <ScoreCard
                  title="Active Now"
                  change={activeOrderUsers?.join(" ")}
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
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
