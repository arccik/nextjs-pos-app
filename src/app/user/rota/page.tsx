import { YearlyRota } from "./YearlyRota";

export default async function RotaPage() {
  const currentMonth = new Date();

  return (
    <div className="mx-auto">
      <YearlyRota today={currentMonth} />
    </div>
  );
}
