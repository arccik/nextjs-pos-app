"use client";
import { useState } from "react";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { cn } from "@/lib/utils";
import TablesDialog from "./TablesDialog";
import AddTable from "./AddTable";
import type { TableStatus } from "@/server/db/schemas/table";
import Loading from "@/components/Loading";

import AddReservation from "@/components/reservations/AddReservation/AddReservation";
import { Button } from "@/components/ui/button";
import { AdminMenu } from "./AdminMenu";
// import { getUnAssignedReservations } from "@/server/models/reservation";

type TabelsGridProps = {
  standalone?: boolean;
};

export default function TableCards({ standalone }: TabelsGridProps) {
  const [status, setStatus] = useState<TableStatus | undefined>();

  const {
    data: tables,
    refetch,
    isLoading,
  } = api.table.getAll.useQuery(status);

  // console.log("TableCards", tables);

  // const { data: reservations } =
  //   api.reservation.getUnAssignedReservations.useQuery();

  return (
    <Card>
      <ToggleGroup
        className="text-sm text-gray-500"
        type="single"
        value={status}
        onValueChange={(e: TableStatus) => setStatus(e)}
      >
        <Button onClick={() => setStatus(undefined)} variant="ghost">
          All
        </Button>
        <ToggleGroupItem value="available">Available</ToggleGroupItem>
        <ToggleGroupItem value="occupied"> Occupied</ToggleGroupItem>
        <ToggleGroupItem value="reserved"> Reserved</ToggleGroupItem>
      </ToggleGroup>
      {/* {!!reservations?.length &&
        reservations.map((reservation) => (
          <p key={reservation.id}>{reservation.expireAt}</p>
        ))} */}
      <CardHeader className="flex flex-col items-center justify-between sm:flex-row">
        <CardTitle className="text-xl font-semibold">Tables</CardTitle>
        <div className="flex flex-col gap-3 sm:flex-row">
          <AddReservation />
          <AddTable onComplete={refetch} />
        </div>
        <AdminMenu />
      </CardHeader>

      <CardContent>
        {!!tables?.length ? (
          <div
            className={cn(
              "grid grid-flow-row grid-cols-1 gap-3 sm:grid-cols-2",
              {
                "gird-flow-col justify-center md:grid-cols-3 xl:grid-cols-4":
                  standalone,
              },
            )}
          >
            {tables.map((table) => (
              <TablesDialog key={table.id} tableData={table} />
            ))}
          </div>
        ) : isLoading ? (
          <Loading />
        ) : (
          <p className="my-10 text-center font-sans text-gray-600">
            No {status} tables found
          </p>
        )}
      </CardContent>
    </Card>
  );
}
