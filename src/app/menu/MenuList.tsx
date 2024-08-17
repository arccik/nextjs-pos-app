import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import MenuItem from "./MenuItem";

import { api } from "@/trpc/server";
import DeleteCategory from "./category/DeleteCategory";

export async function MenuList() {
  const categories = await api.category.getAll();
  const items = await api.item.getAll();

  const getByCategory = (categoryId: string) => {
    if (!items) return;
    return items.filter((item) => item.categoryId == categoryId);
  };

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
