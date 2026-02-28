"use client";
import { CardContent, CardHeader } from "@/components/ui/card";
import { reservationColumns } from "./columns";
import { api } from "@/trpc/react";
import AddReservation from "@/components/reservations/AddReservation/AddReservation";
import { DataTable } from "@/components/DataTable";
import { Loader2 } from "lucide-react";

export default function Reservations() {
  const { data, isLoading, isError } = api.reservation.getAll.useQuery();

  return (
    <div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <h1 className="text-4xl font-semibold">Reservations</h1>
          <p className="mt-2 text-gray-400">Manage all reservations.</p>
        </div>
        <AddReservation />
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        )}
        {isError && (
          <p className="p-4 text-center text-lg text-red-500">
            Failed to load reservations. Please try again.
          </p>
        )}
        {data && !data.length && (
          <p className="p-4 text-center text-lg text-gray-400">
            No reservations found
          </p>
        )}
        {data && data.length > 0 && (
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
