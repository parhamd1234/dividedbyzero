"use client";

import { useEffect, useRef } from "react";

/**
 * Generative particle field — slow orbital drift around an invisible center,
 * with gentle attraction toward the cursor. Additive violet/white glow.
 * RAF-driven, DPR-aware, pauses when the tab is hidden, honors reduced motion.
 */
export default function FieldCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    let dpr = 1;

    type P = {
      angle: number;
      radius: number;
      baseRadius: number;
      speed: number;
      size: number;
      hue: number; // 0 = white, 1 = violet
      wobble: number;
      wobbleSpeed: number;
    };

    let particles: P[] = [];
    const pointer = { x: -9999, y: -9999, active: false };

    function resize() {
      if (!canvas || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(160, Math.floor((w * h) / 11000));
      particles = Array.from({ length: count }, () => {
        const baseRadius = (0.12 + Math.random() ** 1.6 * 0.55) * Math.max(w, h);
        return {
          angle: Math.random() * Math.PI * 2,
          radius: baseRadius,
          baseRadius,
          speed: (0.00004 + Math.random() * 0.00012) * (Math.random() < 0.5 ? 1 : -1),
          size: 0.6 + Math.random() * 1.6,
          hue: Math.random(),
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.0008 + Math.random() * 0.002,
        };
      });
    }

    function tick(t: number) {
      if (!running || !ctx) return;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h * 0.45;

      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        p.angle += p.speed * 16;
        p.wobble += p.wobbleSpeed;
        const r = p.radius + Math.sin(p.wobble) * 18;
        let x = cx + Math.cos(p.angle) * r * 1.25;
        let y = cy + Math.sin(p.angle) * r * 0.78;

        if (pointer.active) {
          const dx = pointer.x - x;
          const dy = pointer.y - y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 220 * 220) {
            const f = (1 - Math.sqrt(d2) / 220) * 14;
            x += (dx / Math.sqrt(d2 + 1)) * f;
            y += (dy / Math.sqrt(d2 + 1)) * f;
          }
        }

        const twinkle = 0.5 + 0.5 * Math.sin(t * 0.001 + p.wobble * 3);
        const alpha = 0.25 + twinkle * 0.45;
        const violet = p.hue > 0.55;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = violet
          ? `rgba(168,140,255,${alpha * 0.85})`
          : `rgba(255,255,255,${alpha * 0.55})`;
        ctx.fill();

        if (p.size > 1.7) {
          ctx.beginPath();
          ctx.arc(x, y, p.size * 3.2, 0, Math.PI * 2);
          ctx.fillStyle = violet
            ? `rgba(168,140,255,${alpha * 0.07})`
            : `rgba(255,255,255,${alpha * 0.05})`;
          ctx.fill();
        }
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    }

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) raf = requestAnimationFrame(tick);
      else cancelAnimationFrame(raf);
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
