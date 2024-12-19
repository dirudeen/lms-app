import React from "react";

interface UseDebounceProps<T> {
  value: T;
  delay?: number;
}

export default function useDebouce<T>({ value, delay }: UseDebounceProps<T>) {
  const [debounceValue, setDebounceValue] = React.useState<T>(value);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay || 500);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return debounceValue;
}
