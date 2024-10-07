import { useEffect, useRef, useState } from "react"

export const useDebouncedState = (def, delay) => {
  const timer = useRef();
  const [v, setV] = useState(def);

  useEffect(() => {
    return () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
    };
  }, []);

  const debouncedSetV = (v) => {
    const newTimer = setTimeout(() => {
      setV(v)
    }, delay)
    clearTimeout(timer.current)
    timer.current = newTimer
  }

  return [v, debouncedSetV]

}
