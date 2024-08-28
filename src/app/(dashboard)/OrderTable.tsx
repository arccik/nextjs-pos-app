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
import { File, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { formatCurrency, formatId } from "@/lib/utils";
import Link from "next/link";
import { api } from "@/trpc/server";

export default async function OrderTable() {
  const data = await api.order.getAll();
  console.log("Recent orders: ", data);

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
            {data && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">Role</TableHead>
                    <TableHead className="hidden sm:table-cell">Paid</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((order) => (
                    <Link
                      href={`/orders/${order.id}`}
                      prefetch={false}
                      key={order.id}
                    >
                      <TableRow className="cursor-pointer">
                        <TableCell>
                          <div className="font-medium">
                            {formatId(order.id)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {order.creator?.name}
                          </div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {order.creator?.role}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant="secondary">
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {order.isPaid ? "Yes" : "No"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {order.createdAt?.toDateString()}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {formatCurrency(order.bill?.totalAmount)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {formatCurrency(order.bill?.totalAmount)}
                        </TableCell>
                      </TableRow>
                    </Link>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
