"use client";

import { useEffect, useRef } from "react";

/**
 * A soft radial glow that follows the cursor (or touch).
 * Pure RAF-throttled transform updates — no React state, no rerenders.
 */
export default function MouseGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let curX = targetX;
    let curY = targetY;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      // ease toward target
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      el.style.transform = `translate3d(${curX - 250}px, ${curY - 250}px, 0)`;
      if (Math.abs(targetX - curX) > 0.5 || Math.abs(targetY - curY) > 0.5) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    // initial center
    el.style.transform = `translate3d(${curX - 250}px, ${curY - 250}px, 0)`;
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed top-0 left-0 w-[500px] h-[500px] pointer-events-none z-0 will-change-transform"
      style={{
        background:
          "radial-gradient(circle at center, rgba(168,140,255,0.22) 0%, rgba(168,140,255,0.05) 35%, rgba(168,140,255,0) 70%)",
        mixBlendMode: "screen",
      }}
    />
  );
}
