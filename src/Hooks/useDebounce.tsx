import { useEffect, useRef, useState } from "react";

export const useDebounce = (value: any, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState<string>('')
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => setDebouncedValue(value), delay)

    return () => {
      clearTimeout(timerRef.current as NodeJS.Timeout);
    }
  }, [value, delay])

  return debouncedValue
}