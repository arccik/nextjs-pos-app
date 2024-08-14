import { useState } from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
  // Retrieve the value from localStorage or use the initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Function to update the value both in state and localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so it can mirror useState API
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Update the state
      setStoredValue(valueToStore);

      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;
