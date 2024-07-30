import { useState, useEffect } from "react";

interface Item {
  itemId: string;
  quantity: number;
  name: string;
  price: number;
}

interface OrderData {
  tableId: string | null;
  items: Item[];
  orderId: string | null;
}

function useLocalStorageOrderData(): [
  OrderData,
  (newData: Partial<OrderData>) => void,
] {
  const [orderData, setOrderData] = useState<OrderData>(() => {
    const storedData = localStorage.getItem("orderData");
    return storedData
      ? JSON.parse(storedData)
      : { tableId: "", items: [], orderId: null };
  });

  useEffect(() => {
    localStorage.setItem("orderData", JSON.stringify(orderData));
  }, [orderData.tableId]);

  const updateOrderData = (newData: Partial<OrderData>) => {
    setOrderData((prevOrderData) => ({
      ...prevOrderData,
      ...newData,
    }));
  };

  return [orderData, updateOrderData];
}

export default useLocalStorageOrderData;
