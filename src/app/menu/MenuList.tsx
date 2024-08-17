"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import MenuItem from "./MenuItem";

import Cart from "./cart/Cart";
import { api } from "@/trpc/react";
import DeleteCategory from "./category/DeleteCategory";

type MenuListProps = {
  closeMenu?: () => void;
};
export function MenuList({ closeMenu }: MenuListProps) {
  // const categories = await api.category.getAll();
  // const items = await api.item.getAll();
  const { data: categories } = api.category.getAll.useQuery();
  const { data: items } = api.item.getAll.useQuery();

  const getByCategory = (categoryId: string) => {
    if (!items) return;
    return items.filter((item) => item.categoryId == categoryId);
  };

  return (
    <Accordion type="single" collapsible>
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
  );
}
