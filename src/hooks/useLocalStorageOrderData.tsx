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

function useLocalStorageOrderData(): [
  OrderData,
  (newData: Partial<OrderData>) => void,
] {
  const [orderData, setOrderData] = useState<OrderData>(() => {
    const storedData = localStorage.getItem("orderData");
    return storedData
      ? JSON.parse(storedData)
      : { tableId: { id: null, number: null }, items: [], orderId: null };
  });

  useEffect(() => {
    localStorage.setItem("orderData", JSON.stringify(orderData));
  }, [orderData.table?.id, orderData.items[0]?.quantity, orderData.orderId]);

  const updateOrderData = (newData: Partial<OrderData>) => {
    setOrderData((prevOrderData) => ({
      ...prevOrderData,
      ...newData,
    }));
  };

  return [orderData, updateOrderData];
}

export default useLocalStorageOrderData;
