"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Category {
  id: number;
  name: string;
  items: string[];
}

const categories: Category[] = [
  { id: "1", name: "Category 1", items: ["Item 1", "Item 2", "Item 3"] },
  { id: "2", name: "Category 2", items: ["Item 4", "Item 5", "Item 6"] },
  { id: "3", name: "Category 3", items: ["Item 7", "Item 8", "Item 9"] },
  { id: "4", name: "Category 4", items: ["Item 10", "Item 11", "Item 12"] },
  { id: "5", name: "Category 5", items: ["Item 13", "Item 14", "Item 15"] },
  { id: "6", name: "Category 6", items: ["Item 16", "Item 17", "Item 18"] },
  { id: "7", name: "Category 7", items: ["Item 19", "Item 20", "Item 21"] },
  { id: "8", name: "Category 8", items: ["Item 22", "Item 23", "Item 24"] },
];

const CategoryGrid: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory,
  );
  const selectedRowIndex = selectedCategory
    ? Math.floor((parseInt(selectedCategory) - 1) / 4)
    : -1;

  return (
    <div className="container mx-auto p-4">
      {Array.from(
        { length: Math.ceil(categories.length / 4) },
        (_, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <div className="mb-4 grid grid-cols-4 gap-4">
              {categories
                .slice(rowIndex * 4, (rowIndex + 1) * 4)
                .map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "secondary" : "outline"
                    }
                    className="h-24 w-full text-lg font-semibold"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
            </div>
            {selectedRowIndex === rowIndex && selectedCategoryData && (
              <div className="mb-4 rounded-lg bg-secondary p-4">
                <h2 className="mb-4 text-2xl font-bold">
                  {selectedCategoryData.name} Items
                </h2>
                <ScrollArea className="h-48">
                  <ul className="space-y-2">
                    {selectedCategoryData.items.map((item, index) => (
                      <li key={index} className="rounded bg-background p-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            )}
          </React.Fragment>
        ),
      )}
    </div>
  );
};

export default CategoryGrid;
