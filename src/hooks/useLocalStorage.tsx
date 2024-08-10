import { useState, useEffect } from "react";

interface UseLocalStorageOptions<T> {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
}

function useLocalStorage<T>(
  key: string,
  initialValue?: T | (() => T),
  options?: UseLocalStorageOptions<T>,
) {
  const { serializer, deserializer } = options || {};

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue instanceof Function ? initialValue() : initialValue;
    }

    try {
      const item = localStorage.getItem(key);
      return item
        ? deserializer
          ? deserializer(item)
          : JSON.parse(item)
        : initialValue instanceof Function
          ? initialValue()
          : initialValue;
    } catch (error) {
      console.error("Error parsing item from localStorage", error);
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  });

  const setValue = (value: T | ((prevValue: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          key,
          serializer ? serializer(valueToStore) : JSON.stringify(valueToStore),
        );
      }
    } catch (error) {
      console.error("Error storing item in localStorage", error);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const jsonValue = serializer
      ? serializer(storedValue)
      : JSON.stringify(storedValue);
    localStorage.setItem(key, jsonValue);
  }, [key, storedValue, serializer]);

  return [storedValue, setValue];
}

export default useLocalStorage;
