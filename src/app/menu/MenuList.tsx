"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import MenuItem from "./MenuItem";

import { api } from "@/trpc/react";
import DeleteCategory from "./category/DeleteCategory";
import Loading from "@/components/Loading";

export function MenuList() {
  // const categories = await api.category.getAll();
  // const items = await api.item.getAll();
  const { data: categories, isLoading: isCategoryLoading } =
    api.category.getAll.useQuery();
  const { data: items, isLoading: isItemsLoading } = api.item.getAll.useQuery();

  const getByCategory = (categoryId: string) => {
    if (!items) return;
    return items.filter((item) => item.categoryId == categoryId);
  };

  if (isCategoryLoading || isItemsLoading) return <Loading />;

  return (
    <Accordion type="single" collapsible>
      {categories?.map((category) => (
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
      ))}
    </Accordion>
  );
}
