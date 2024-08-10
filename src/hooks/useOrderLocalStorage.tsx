import { useState, useEffect } from "react";

export type ShortItem = {
  itemId: string;
  quantity: number;
  name: string;
  price: number;
};

export type OrderData = {
  table: { id: string; number: number } | null;
  items: ShortItem[];
  orderId: string | null;
};

export default function useOrderLocalStorage(
  key: string,
  initialValue: OrderData = { table: null, items: [], orderId: null },
) {
  const [storedValue, setStoredValue] = useState<OrderData>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error parsing OrderData from localStorage", error);
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
