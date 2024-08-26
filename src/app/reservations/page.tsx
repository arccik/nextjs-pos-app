import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { reservationColumns } from "./columns";
// import AddReservation from "../addReservation/AddReservation";
import { api } from "@/trpc/server";
import AddReservation from "@/components/reservations/AddReservation/AddReservation";
import { DataTable } from "@/components/DataTable";

export default async function Reservations() {
  const data = await api.reservation.getAll();

  return (
    <div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <h1 className="text-4xl font-semibold">Reservations</h1>
          <p className="mt-2 text-gray-400">This is the reservation page.</p>
        </div>
        <AddReservation />
      </CardHeader>
      <CardContent>
        {!data.length ? (
          <p className="p-4 text-center text-lg text-gray-400">
            No reservation was found
          </p>
        ) : (
          <DataTable
            data={data}
            columns={reservationColumns}
            searchField="customerName"
          />
        )}
      </CardContent>
    </div>
  );
}
