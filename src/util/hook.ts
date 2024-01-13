import { useEffect, useState } from "react";

export const useLocalStorage = <T>(
  initialValue: T,
  key: string
): [T, React.Dispatch<T>] => {
  const [value, setValue] = useState<T>(() => {
    const item = window.localStorage.getItem(key);
    try {
      return item ? JSON.parse(item) : initialValue;
    } catch (e) {
      return item || initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
