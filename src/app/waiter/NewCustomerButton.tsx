import { PlusIcon } from "@radix-ui/react-icons";

export default function NewCustomerButton() {
  return (
    <div className="group">
      <div className="flex h-40 w-40 items-center justify-center rounded-xl border-2  drop-shadow-sm hover:border-green-400 hover:bg-green-50">
        <PlusIcon className="h-24 w-24 text-slate-600 group-hover:text-black" />
      </div>
      <p className="text-center text-slate-400 group-hover:text-black">
        New Customer
      </p>
    </div>
  );
}
