import { useEffect, useRef, useState } from 'react';

export const useDebouncedState = <T>(def: T, delay: number): [T, (v: T) => void] => {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [v, setV] = useState<T>(def);

  useEffect(() => {
    return () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
    };
  }, []);

  const debouncedSetV = (v: T) => {
    const newTimer = setTimeout(() => {
      setV(v);
    }, delay);
    clearTimeout(timer.current);
    timer.current = newTimer;
  };

  return [v, debouncedSetV];
};
