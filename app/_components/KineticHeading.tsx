"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

export default function KineticHeading({
  as: Tag = "h2" as ElementType,
  className = "",
  children,
  stagger = 70,
  duration = 700,
  delay = 0,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  stagger?: number;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const tokens: Array<{ key: string; node: ReactNode; isSpace?: boolean }> = [];
  let idx = 0;
  const childArray = Array.isArray(children) ? children : [children];

  childArray.forEach((child) => {
    if (typeof child === "string") {
      const parts = child.split(/(\s+)/);
      parts.forEach((part) => {
        if (part === "") return;
        if (/^\s+$/.test(part)) {
          tokens.push({ key: `s-${idx++}`, node: part, isSpace: true });
        } else {
          tokens.push({ key: `w-${idx++}`, node: part });
        }
      });
    } else {
      tokens.push({ key: `j-${idx++}`, node: child });
    }
  });

  const wordIdxs: number[] = [];
  tokens.forEach((t, i) => {
    if (!t.isSpace) wordIdxs.push(i);
  });

  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className}>
      {tokens.map((t, i) => {
        if (t.isSpace) return <span key={t.key}>{t.node}</span>;
        const order = wordIdxs.indexOf(i);
        return (
          <span
            key={t.key}
            className="inline-block will-change-transform"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(0.4em)",
              transition: `opacity ${duration}ms cubic-bezier(.2,.7,.2,1), transform ${duration}ms cubic-bezier(.2,.7,.2,1)`,
              transitionDelay: `${delay + order * stagger}ms`,
            }}
          >
            {t.node}
          </span>
        );
      })}
    </Tag>
  );
}
