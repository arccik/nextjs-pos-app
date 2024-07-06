import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { startOfDay, endOfDay } from "date-fns";
import { File, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
// import Loading from "@/components/layout/Loading";
// import Error from "@/components/layout/Error";
// import { recentOrders } from "@/api/orders";
// import type { OrderWithUserAndBill } from "@server/src/schemas";
// import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";
import { db } from "@/server/db";
import { and, gte, lt } from "drizzle-orm";
import { orders } from "@/server/db/schema";
import Link from "next/link";

// import { PDFDownloadLink } from "@react-pdf/renderer";
// import TablePDF from "./TablePDF";

export default async function OrderTable() {
  const today = new Date();
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);

  const data = await db.query.orders.findMany({
    where: and(
      gte(orders.createdAt, startOfToday),
      lt(orders.createdAt, endOfToday),
    ),

    with: { user: { columns: { name: true, role: true } }, bill: true },
  });

  // const navigate = useNavigate();
  // const { data, isLoading, isError } = useQuery<OrderWithUserAndBill[]>({
  //   queryKey: ["orders"],
  //   queryFn: recentOrders,
  // });
  // if (isLoading) return <Loading />;
  // if (isError) return <Error message="Fail to fetch orders" />;
  // const tableData: any[] = [
  //   { column1: "Value 1", column2: "Value 2", column3: "Value 3", column4: "Value 4" },
  //   { column1: "Value 5", column2: "Value 6", column3: "Value 7", column4: "Value 8" },
  //   // Add more rows as needed
  // ];

  return (
    <Tabs defaultValue="week">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Fulfilled
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Refunded</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Export</span>
            {/* <PDFDownloadLink document={<TablePDF data={tableData} />} fileName="table.pdf">
              {({ blob, url, loading, error }) => (loading ? "Loading PDF..." : "Download PDF")}
            </PDFDownloadLink> */}
          </Button>
        </div>
      </div>
      <TabsContent value="week">
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>Orders</CardTitle>
            <CardDescription>Recent orders from your store.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Paid</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!!data?.length &&
                  data.map((order) => (
                    <Link href={`/order?id=${order.id}`}>
                      <TableRow
                        // onClick={() => redirect(`/order?id=${order.id}`)}
                        key={order.id}
                        className="cursor-pointer"
                      >
                        <TableCell>
                          <div className="font-medium">{order.id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{order.user?.name}</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {order.user?.role}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant="secondary">
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {order.isPaid ? "YEs" : "No"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {order.createdAt?.toDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(order.bill?.totalAmount)}
                        </TableCell>
                      </TableRow>
                    </Link>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
