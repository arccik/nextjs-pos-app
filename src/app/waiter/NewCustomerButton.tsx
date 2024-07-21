import { PlusIcon } from "@radix-ui/react-icons";

export function NewCustomerButton() {
  return (
    <div className="group">
      <div className="w-40 h-40 border-2 drop-shadow-sm rounded-xl hover:border-green-400 hover:bg-green-50  flex items-center justify-center">
        <PlusIcon className="w-24 h-24 text-slate-600 group-hover:text-black" />
      </div>
      <p className="text-center text-slate-400 group-hover:text-black">
        New Customer
      </p>
    </div>
  );
}
