"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export function useUrlState<T>(
  key: string,
  initialValue: T | (() => T),
): [T, (value: T | ((prevValue: T) => T)) => void, () => void] {
  const router = useRouter();
  const [value, setValue] = useState<T>(() => {
    const urlValue = router.query[key];
    if (typeof urlValue === "string") {
      return JSON.parse(urlValue) as T;
    }
    return typeof initialValue === "function"
      ? (initialValue as () => T)()
      : initialValue;
  });

  useEffect(() => {
    const newQuery = {
      ...router.query,
      [key]: JSON.stringify(value),
    };
    router.replace(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true },
    );
  }, [key, router, value]);

  const updateValue = (newValue: T | ((prevValue: T) => T)) => {
    setValue((prevValue) =>
      typeof newValue === "function"
        ? (newValue as (prevValue: T) => T)(prevValue)
        : newValue,
    );
  };

  const removeValue = () => {
    const newQuery = { ...router.query };
    delete newQuery[key];
    router.replace(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true },
    );
  };

  return [value, updateValue, removeValue];
}
