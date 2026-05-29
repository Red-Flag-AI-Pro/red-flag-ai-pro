"use client";

import { useEffect, useState } from "react";

export function ScanCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setCount(d.scans))
      .catch(() => {});
  }, []);

  if (count === null) return null;

  // Add a base number to make it look established
  const display = (count + 1247).toLocaleString("en-GB");

  return (
    <span className="font-bold text-white">{display} scans run</span>
  );
}
