"use client";

import { useEffect } from "react";
import { captureUtm } from "@/lib/track";

// Efectos globales mínimos: guardar UTM y aparición suave de bloques [data-reveal].
export function ClientEffects() {
  useEffect(() => {
    captureUtm();

    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
