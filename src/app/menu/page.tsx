import { MenuList } from "./MenuList";
import Cart from "./cart/Cart";
import AddNewCategoryButton from "./category/AddNewCategoryButton";
import CategoryGrid from "./grid/MenuGrid";

export default function MenuPage() {
  return (
    <section className="grid w-full grid-flow-row py-12 ">
      <div className="grid gap-8 px-4 md:container md:px-6">
        <div className="items-start justify-between gap-4 md:items-center md:gap-8">
          <div className="col-span-1 grid gap-1">
            <div className="flex justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Menu</h1>
              <AddNewCategoryButton />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Smile and make customers feel homey
            </p>
          </div>
        </div>
        <div className="grid grid-flow-row gap-4 md:grid-flow-col md:grid-cols-2">
          <MenuList />
          {/* <CategoryGrid /> */}
          <div>
            <Cart />
          </div>
        </div>
      </div>
    </section>
  );
}
