// import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddTable from "./AddTable";
// import { getAll } from "@/api/tables";
// import Loading from "../layout/Loading";
// import Error from "../layout/Error";
import TablesDialog from "./TablesDialog";
import { cn } from "@/lib/utils";
import AddReservation from "./AddReservation";
// import { AdminMenu } from "./AdminMenu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import type {
  TableStatus,
  TableWithReservation,
} from "@/server/db/schemas/table";
import { getAll } from "@/server/db/models/table";

type TabelsGridProps = {
  standalone?: boolean;
};

export default async function TableCards({ standalone }: TabelsGridProps) {
  const [tabStatus, setTabStatus] = useState<TableStatus>();
  // const { data, isLoading, isError } = useQuery<TableWithReservation[]>({
  //   queryKey: ["tables", tabStatus],
  //   queryFn: () => getAll(tabStatus),
  // });
  // const { data: reservations, isError: isReservationError } = useQuery({
  //   queryKey: ["reservations"],
  //   queryFn: () => getUnassignedReservations(),
  // });

  // if (isLoading) return <Loading />;
  // if (isError || isReservationError) return <Error />;
  const reservations = await getUnassignedReservations();
  const tables = await getAll();
  return (
    <Card>
      <ToggleGroup
        className="text-sm text-gray-500"
        type="single"
        value={tabStatus}
        onValueChange={(e: TableStatus) => setTabStatus(e)}
      >
        <ToggleGroupItem value="available">Available</ToggleGroupItem>
        <ToggleGroupItem value="occupied"> Occupied</ToggleGroupItem>
        <ToggleGroupItem value="reserved"> Reserved</ToggleGroupItem>
      </ToggleGroup>
      {!!reservations?.length &&
        reservations.map((reservation) => (
          <p key={reservation.id}>{reservation.expireAt}</p>
        ))}
      <CardHeader className="flex flex-col items-center justify-between sm:flex-row">
        <CardTitle className="text-xl font-semibold">Tables</CardTitle>
        <div className="flex flex-col gap-3 sm:flex-row">
          <AddReservation />
          <AddTable />
        </div>
        {/* <AdminMenu /> */}
      </CardHeader>
      <CardContent>
        {data && data?.length > 0 ? (
          <div
            className={cn(
              "grid grid-flow-row grid-cols-1 gap-3 sm:grid-cols-2",
              {
                "gird-flow-col justify-center md:grid-cols-3  xl:grid-cols-4":
                  standalone,
              },
            )}
          >
            {data.map((table) => (
              <TablesDialog key={table.id} tableData={table} />
            ))}
          </div>
        ) : (
          <p className="my-10 text-center font-sans text-gray-600">
            No tables found
          </p>
        )}
      </CardContent>
    </Card>
  );
}
