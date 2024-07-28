import { YearlyRota } from "./YearlyRota";

export default function App() {
  const currentMonth = new Date();
  const rotaData = [
    { date: new Date(2024, 6, 1), name: "John Doe", shift: "Morning" },
    { date: new Date(2024, 6, 2), name: "Jane Smith", shift: "Evening" },
    { date: new Date(2024, 6, 3), name: "Max Xos", shift: "Morning" },
    { date: new Date(2024, 6, 4), name: "Sonya Smh", shift: "Evening" },
    { date: new Date(2024, 6, 5), name: "Jana", shift: "Morning" },
    { date: new Date(2024, 6, 6), name: "Smith", shift: "Evening" },
    { date: new Date(2024, 6, 6), name: "Mike", shift: "Morning" },
    { date: new Date(2024, 6, 6), name: "Stacy", shift: "Evening" },
    // ... more rota data
  ];

  return (
    <div className="container mx-auto p-4">
      <YearlyRota rotaData={rotaData} today={currentMonth} />
    </div>
  );
}
