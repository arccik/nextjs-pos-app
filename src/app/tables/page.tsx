import TableCards from "./TableCards";

export default function TablesPage() {
  return (
    <main className="flex flex-col gap-5 md:p-2">
      <TableCards standalone={true} />
    </main>
  );
}
