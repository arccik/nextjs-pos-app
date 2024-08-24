import { api } from "@/trpc/server";
import { YearlyRota } from "./YearlyRota";

export default async function App() {
  const currentMonth = new Date();

  const data = await api.rota.getAll();
  return (
    <div className="container mx-auto p-4">
      <YearlyRota rotaData={data} today={currentMonth} />
    </div>
  );
}
