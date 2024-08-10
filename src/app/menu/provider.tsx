"use client";
import { createContext, useState, useEffect, useContext } from "react";

// interface OrderDataType {
//   // Define your order data structure here
//   productId: number;
//   quantity: number;
//   // ... other properties
// }

export type ShortItem = {
  itemId: string;
  quantity: number;
  name: string;
  price: number;
};

export type OrderDataType = {
  table: { id: string; number: number } | null;
  items: ShortItem[];
  orderId: string | null;
};

const OrderContext = createContext<{
  orderData: OrderDataType | null;
  setOrderData: (orderData: OrderDataType | null) => void;
}>(null!);

const getOrderDataFromStorage = (): OrderDataType | null => {
  const orderString = localStorage.getItem("order");
  return orderString && orderString.length > 0 ? JSON.parse(orderString) : null;
};

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orderData, setOrderData] = useState<OrderDataType | null>(
    getOrderDataFromStorage(),
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setOrderData(getOrderDataFromStorage());
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <OrderContext.Provider value={{ orderData, setOrderData }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
