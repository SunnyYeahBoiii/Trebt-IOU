// web/src/components/Clock.tsx
import { useState, useEffect } from "react";

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <time className="text-sm text-(--clr)" dateTime={time.toISOString()}>
      {time.toLocaleTimeString("vi-VN")}
    </time>
  );
}
