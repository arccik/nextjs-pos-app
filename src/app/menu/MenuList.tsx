import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import MenuItem from "./MenuItem";

import Cart from "./cart/Cart";
import { api } from "@/trpc/server";
import DeleteCategory from "./category/DeleteCategory";

type MenuListProps = {
  closeMenu?: () => void;
};
export async function MenuList({ closeMenu }: MenuListProps) {
  const categories = await api.category.getAll();
  const items = await api.item.getAll();

  const getByCategory = (categoryId: string) => {
    if (!items) return;
    return items.filter((item) => item.categoryId == categoryId);
  };

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
      <div className="col-span-2">
        <Accordion type="single" collapsible className="mb-10 w-full">
          {!!categories?.length &&
            categories?.map((category) => {
              return (
                <AccordionItem value={String(category.id)} key={category.id}>
                  <AccordionTrigger className="text-3xl font-semibold">
                    {category.name}
                  </AccordionTrigger>

                  <AccordionContent className="space-y-5">
                    {getByCategory(category.id)?.map((item) => (
                      <MenuItem item={item} key={item.id} />
                    ))}
                    <DeleteCategory id={category.id} name={category.name} />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
        </Accordion>
      </div>
      <div className="right-5 top-20  col-span-1 md:col-span-2">
        <Cart onComplete={closeMenu} />
      </div>
    </div>
  );
}
