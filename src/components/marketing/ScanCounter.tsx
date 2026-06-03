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

  return null;
}
