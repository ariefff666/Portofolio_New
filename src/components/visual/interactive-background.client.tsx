"use client";

import { useEffect, useRef } from "react";

export function InteractiveBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = backgroundRef.current;
    if (!element) {
      return;
    }
    const targetElement = element;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let currentX = window.innerWidth * 0.72;
    let currentY = window.innerHeight * 0.18;
    let targetX = currentX;
    let targetY = currentY;

    function setPosition(x: number, y: number) {
      targetElement.style.setProperty("--cursor-x", `${x}px`);
      targetElement.style.setProperty("--cursor-y", `${y}px`);
    }

    function onPointerMove(event: PointerEvent) {
      targetX = event.clientX;
      targetY = event.clientY;

      if (reduceMotion.matches) {
        setPosition(targetX, targetY);
      }
    }

    function tick() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      setPosition(currentX, currentY);
      frame = window.requestAnimationFrame(tick);
    }

    setPosition(currentX, currentY);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    if (!reduceMotion.matches) {
      frame = window.requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="interactive-background pointer-events-none fixed inset-0 z-0"
      ref={backgroundRef}
    />
  );
}
