import { YearlyRota } from "./YearlyRota";

export default async function App() {
  const currentMonth = new Date();

  return (
    <div className="container mx-auto p-4">
      <YearlyRota today={currentMonth} />
    </div>
  );
}
