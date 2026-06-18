"use client";

import { useEffect, useRef } from "react";

type CursorMode =
  | "drag"
  | "external"
  | "filter"
  | "inspect"
  | "lock"
  | "native"
  | "navigate"
  | "text"
  | "trace"
  | "track";

const sectionCodes: Record<string, string> = {
  "#about": "SEC.01 / ABOUT",
  "#research": "SEC.02 / RESEARCH",
  "#projects": "SEC.03 / PROJECTS",
  "#skills": "SEC.04 / SKILLS",
  "#publications": "SEC.05 / PUBLICATIONS",
  "#experience": "SEC.06 / EXPERIENCE",
  "#contact": "SEC.07 / CONTACT",
  "#comments": "SEC.08 / COMMENTS",
  "#home": "HOME / MAP",
};

function closestInteractive(element: Element | null) {
  return element?.closest<HTMLElement>(
    "a, button, [role='button'], [role='tab'], [data-cursor], .hero-core, input, textarea, select, [contenteditable='true']",
  ) ?? null;
}

function isTextElement(element: Element | null) {
  return Boolean(
    element?.closest(
      "p, h1, h2, h3, h4, h5, h6, li, label, blockquote, code, pre, textarea, input",
    ),
  );
}

function resolveCursorLabel(target: HTMLElement | null, isDragging: boolean) {
  if (!target) {
    return { label: "", mode: "track" as CursorMode };
  }

  const explicitCursor = target.closest<HTMLElement>("[data-cursor]");
  const explicitLabel = explicitCursor?.dataset.cursor;
  if (explicitLabel) {
    const normalized = explicitLabel.toUpperCase();
    if (normalized.includes("FILTER")) {
      return { label: "FILTER", mode: "filter" as CursorMode };
    }
    if (normalized.includes("NAVIGATE")) {
      return { label: "NAVIGATE", mode: "navigate" as CursorMode };
    }
    if (normalized.includes("TRACE")) {
      return { label: "TRACE", mode: "trace" as CursorMode };
    }
    if (normalized.includes("EXTERNAL")) {
      return { label: "EXTERNAL", mode: "external" as CursorMode };
    }
    if (normalized.includes("DOSSIER")) {
      return { label: normalized, mode: "inspect" as CursorMode };
    }
    if (normalized.includes("SIGNAL")) {
      return { label: normalized, mode: "lock" as CursorMode };
    }
    if (normalized.includes("INSPECT")) {
      return { label: "INSPECT", mode: "inspect" as CursorMode };
    }
    if (normalized.includes("CLOSE")) {
      return { label: "CLOSE", mode: "lock" as CursorMode };
    }
  }

  if (
    target.matches("input, textarea, [contenteditable='true']") ||
    target.closest("input, textarea, [contenteditable='true']")
  ) {
    return { label: "", mode: "native" as CursorMode };
  }

  if (target.closest(".hero-core")) {
    return {
      label: isDragging ? "ROTATING" : "DRAG TO ROTATE",
      mode: "drag" as CursorMode,
    };
  }

  const link = target.closest<HTMLAnchorElement>("a[href]");
  if (link) {
    const href = link.getAttribute("href") || "";
    if (sectionCodes[href]) {
      if (link.closest("nav")) {
        return { label: sectionCodes[href], mode: "lock" as CursorMode };
      }
      if (href === "#projects") return { label: "VIEW", mode: "lock" as CursorMode };
      if (href === "#research") return { label: "INSPECT", mode: "inspect" as CursorMode };
      if (href === "#contact") return { label: "TRANSMIT", mode: "lock" as CursorMode };
      return { label: sectionCodes[href], mode: "lock" as CursorMode };
    }

    if (href.startsWith("http") || link.target === "_blank" || href.startsWith("mailto:")) {
      return { label: "EXTERNAL", mode: "external" as CursorMode };
    }
  }

  const text = target.textContent?.trim().toUpperCase() || "";
  if (text.includes("SEND") || text.includes("CONTACT")) {
    return { label: "TRANSMIT", mode: "lock" as CursorMode };
  }
  if (text.includes("EXPLORE") || text.includes("RESEARCH")) {
    return { label: "INSPECT", mode: "inspect" as CursorMode };
  }
  if (text.includes("VIEW") || text.includes("PROJECT") || text.includes("DEMO")) {
    return { label: "VIEW", mode: "lock" as CursorMode };
  }
  if (target.matches("button, [role='button'], [role='tab']")) {
    return { label: "SWITCH", mode: "inspect" as CursorMode };
  }

  return { label: "OPEN", mode: "lock" as CursorMode };
}

export function MissionControlCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLSpanElement>(null);
  const reticleRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pulseRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const core = coreRef.current;
    const reticle = reticleRef.current;
    const label = labelRef.current;
    const pulseRoot = pulseRef.current;

    if (!cursor || !core || !reticle || !label || !pulseRoot) {
      return;
    }
    const cursorElement = cursor;
    const coreElement = core;
    const reticleElement = reticle;
    const labelElement = label;
    const pulseRootElement = pulseRoot;

    const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointerQuery.matches) {
      cursorElement.dataset.enabled = "false";
      return;
    }

    document.body.classList.add("cursor-reticle-enabled");

    const pointer = {
      down: false,
      lastMoveAt: performance.now(),
      lastTrailAt: 0,
      mode: "track" as CursorMode,
      target: null as HTMLElement | null,
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
    };
    const follower = { x: pointer.x, y: pointer.y };
    let animationFrame = 0;
    let lockedElement: HTMLElement | null = null;

    function clearMagnet() {
      if (lockedElement) {
        lockedElement.style.removeProperty("--cursor-magnet-x");
        lockedElement.style.removeProperty("--cursor-magnet-y");
        lockedElement = null;
      }
    }

    function updateScrollProgress() {
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
      reticleElement.style.setProperty("--cursor-progress", `${progress * 360}deg`);
    }

    function emitPulse(x: number, y: number) {
      if (reduceMotionQuery.matches) {
        return;
      }
      const pulse = document.createElement("span");
      pulse.className = "mission-cursor__pulse";
      pulse.style.left = `${x}px`;
      pulse.style.top = `${y}px`;
      pulseRootElement.appendChild(pulse);
      window.setTimeout(() => pulse.remove(), 620);
    }

    function emitTrail(x: number, y: number) {
      if (reduceMotionQuery.matches) {
        return;
      }
      const now = performance.now();
      if (now - pointer.lastTrailAt < 55) {
        return;
      }
      pointer.lastTrailAt = now;
      const trail = document.createElement("span");
      trail.className = "mission-cursor__trail";
      trail.style.left = `${x}px`;
      trail.style.top = `${y}px`;
      pulseRootElement.appendChild(trail);
      window.setTimeout(() => trail.remove(), 460);
    }

    function onPointerMove(event: PointerEvent) {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.lastMoveAt = performance.now();
      coreElement.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;

      const interactive = closestInteractive(event.target as Element | null);
      pointer.target = interactive;
      const resolved = resolveCursorLabel(interactive, pointer.down);
      pointer.mode = resolved.mode;

      if (!interactive && isTextElement(event.target as Element | null)) {
        pointer.mode = "text";
        resolved.label = "";
      }

      cursorElement.dataset.mode = pointer.mode;
      labelElement.textContent = resolved.label;
      if (event.movementX || event.movementY) {
        const speed = Math.hypot(event.movementX, event.movementY);
        if (speed > 30) {
          emitTrail(event.clientX, event.clientY);
        }
      }
    }

    function onPointerDown(event: PointerEvent) {
      pointer.down = true;
      if (pointer.target?.closest(".hero-core")) {
        pointer.mode = "drag";
        cursorElement.dataset.active = "true";
        labelElement.textContent = "ROTATING";
      }
      emitPulse(event.clientX, event.clientY);
    }

    function onPointerUp() {
      pointer.down = false;
      cursorElement.dataset.active = "false";
    }

    function onPointerLeave() {
      cursorElement.dataset.visible = "false";
      clearMagnet();
    }

    function onPointerEnter() {
      cursorElement.dataset.visible = "true";
    }

    function animate() {
      const now = performance.now();
      const reduceMotion = reduceMotionQuery.matches;
      const targetRect = pointer.target?.getBoundingClientRect();
      let targetX = pointer.x;
      let targetY = pointer.y;
      let magnetStrength = 0;

      if (
        targetRect &&
        pointer.mode !== "native" &&
        pointer.mode !== "text" &&
        pointer.mode !== "filter" &&
        pointer.target?.dataset.cursorMagnetic !== "false" &&
        !reduceMotion
      ) {
        const centerX = targetRect.left + targetRect.width / 2;
        const centerY = targetRect.top + targetRect.height / 2;
        const distance = Math.hypot(pointer.x - centerX, pointer.y - centerY);
        magnetStrength = Math.max(0, 1 - distance / 132);
        targetX += (centerX - pointer.x) * magnetStrength * 0.38;
        targetY += (centerY - pointer.y) * magnetStrength * 0.38;

        if (magnetStrength > 0.05 && pointer.target) {
          if (lockedElement !== pointer.target) {
            clearMagnet();
            lockedElement = pointer.target;
          }
          const moveX = (pointer.x - centerX) * 0.025 * magnetStrength;
          const moveY = (pointer.y - centerY) * 0.025 * magnetStrength;
          pointer.target.style.setProperty("--cursor-magnet-x", `${moveX}px`);
          pointer.target.style.setProperty("--cursor-magnet-y", `${moveY}px`);
        } else {
          clearMagnet();
        }
      } else {
        clearMagnet();
      }

      const follow = reduceMotion ? 1 : 0.24;
      follower.x += (targetX - follower.x) * follow;
      follower.y += (targetY - follower.y) * follow;

      const velocityX = targetX - follower.x;
      const velocityY = targetY - follower.y;
      const speed = Math.hypot(velocityX, velocityY);
      const skew = reduceMotion ? 0 : Math.min(7, speed * 0.05);
      const angle = Math.atan2(velocityY, velocityX) * (180 / Math.PI);

      reticleElement.style.transform = `translate3d(${follower.x}px, ${follower.y}px, 0) rotate(${angle}deg) skewX(${skew}deg)`;
      reticleElement.style.setProperty("--cursor-lock", `${magnetStrength}`);
      reticleElement.style.setProperty("--cursor-label-rotate", `${-angle}deg`);

      if (now - pointer.lastMoveAt > 2000 && pointer.mode === "track") {
        cursorElement.dataset.scan = "true";
        labelElement.textContent = `X:${Math.round(pointer.x).toString().padStart(4, "0")} / Y:${Math.round(
          pointer.y,
        )
          .toString()
          .padStart(4, "0")}`;
      } else {
        cursorElement.dataset.scan = "false";
      }

      animationFrame = window.requestAnimationFrame(animate);
    }

    updateScrollProgress();
    cursorElement.dataset.enabled = "true";
    cursorElement.dataset.visible = "true";
    cursorElement.dataset.mode = "track";
    coreElement.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
    reticleElement.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.documentElement.addEventListener("pointerenter", onPointerEnter);
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove("cursor-reticle-enabled");
      clearMagnet();
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.documentElement.removeEventListener("pointerenter", onPointerEnter);
      window.removeEventListener("scroll", updateScrollProgress);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="mission-cursor"
      data-enabled="false"
      data-mode="track"
      data-scan="false"
      data-visible="false"
      ref={cursorRef}
    >
      <span className="mission-cursor__core" ref={coreRef} />
      <span className="mission-cursor__reticle" ref={reticleRef}>
        <span className="mission-cursor__ring" />
        <span className="mission-cursor__progress" />
        <span className="mission-cursor__tick mission-cursor__tick--top" />
        <span className="mission-cursor__tick mission-cursor__tick--right" />
        <span className="mission-cursor__tick mission-cursor__tick--bottom" />
        <span className="mission-cursor__tick mission-cursor__tick--left" />
        <span className="mission-cursor__label" ref={labelRef} />
      </span>
      <span className="mission-cursor__effects" ref={pulseRef} />
    </div>
  );
}
