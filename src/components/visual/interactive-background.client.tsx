"use client";

import { useEffect, useRef } from "react";

type Particle = {
  amber: boolean;
  baseX: number;
  baseY: number;
  depth: number;
  phase: number;
  speed: number;
  vx: number;
  vy: number;
};

type TrailPoint = {
  age: number;
  life: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
};

type Pulse = {
  age: number;
  life: number;
  x: number;
  y: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function makeParticles(count: number, width: number, height: number) {
  return Array.from({ length: count }, (_, index): Particle => {
    const depth = 0.35 + ((index * 37) % 65) / 100;
    return {
      amber: index % 23 === 0,
      baseX: ((index * 137.508) % 1) * width,
      baseY: ((index * 89.233) % 1) * height,
      depth,
      phase: index * 0.77,
      speed: 0.18 + ((index * 11) % 24) / 100,
      vx: (((index * 17) % 11) - 5) * 0.018,
      vy: (((index * 29) % 13) - 6) * 0.016,
    };
  });
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const canvasElement = canvas;
    const context = canvasElement.getContext("2d", { alpha: true });
    if (!context) {
      return;
    }
    const ctx = context;

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const pointer = {
      active: false,
      lastMoveAt: performance.now(),
      lastTrailAt: 0,
      targetX: window.innerWidth * 0.72,
      targetY: window.innerHeight * 0.18,
      x: window.innerWidth * 0.72,
      y: window.innerHeight * 0.18,
    };
    const parallax = { x: 0, y: 0 };
    const trails: TrailPoint[] = [];
    const pulses: Pulse[] = [];
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrame = 0;
    let previousTime = performance.now();

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      canvasElement.width = Math.max(1, Math.floor(width * dpr));
      canvasElement.height = Math.max(1, Math.floor(height * dpr));
      canvasElement.style.width = `${width}px`;
      canvasElement.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const baseCount = width < 700 ? 42 : width < 1100 ? 70 : 96;
      particles = makeParticles(reduceMotionQuery.matches ? Math.ceil(baseCount * 0.45) : baseCount, width, height);
    }

    function drawGrid(time: number, spotlightRadius: number, isCoarse: boolean) {
      const grid = width < 700 ? 34 : 40;
      const breath = 0.5 + Math.sin(time * 0.72) * 0.5;
      const offsetX = ((time * 2.2 + parallax.x * 0.28) % grid) - grid;
      const offsetY = ((time * 1.5 + parallax.y * 0.24) % grid) - grid;

      ctx.save();
      ctx.translate(parallax.x * 0.35, parallax.y * 0.22);
      ctx.lineWidth = 1;

      for (let x = offsetX; x <= width + grid; x += grid) {
        const distance = Math.abs(x - pointer.x);
        const near = pointer.active ? clamp(1 - distance / spotlightRadius, 0, 1) : 0;
        ctx.strokeStyle = `rgba(85, 230, 255, ${0.035 + breath * 0.025 + near * 0.08})`;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + Math.sin(time + x * 0.008) * near * 5, height);
        ctx.stroke();
      }

      for (let y = offsetY; y <= height + grid; y += grid) {
        const distance = Math.abs(y - pointer.y);
        const near = pointer.active ? clamp(1 - distance / spotlightRadius, 0, 1) : 0;
        ctx.strokeStyle = `rgba(85, 230, 255, ${0.03 + breath * 0.02 + near * 0.07})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y + Math.cos(time + y * 0.008) * near * 4);
        ctx.stroke();
      }

      if (!isCoarse) {
        ctx.strokeStyle = "rgba(47, 123, 255, 0.05)";
        ctx.lineWidth = 1;
        for (let y = -height; y < height * 1.5; y += grid * 3.2) {
          ctx.beginPath();
          ctx.moveTo(0, y + time * 18);
          ctx.lineTo(width, y + time * 18 + width * 0.28);
          ctx.stroke();
        }
      }

      ctx.restore();
    }

    function drawParticles(time: number, delta: number, spotlightRadius: number, isCoarse: boolean) {
      particles.forEach((particle, index) => {
        const driftScale = reduceMotionQuery.matches ? 0.12 : 1;
        particle.baseX += particle.vx * delta * 60 * driftScale;
        particle.baseY += particle.vy * delta * 60 * driftScale;

        if (particle.baseX < -24) particle.baseX = width + 24;
        if (particle.baseX > width + 24) particle.baseX = -24;
        if (particle.baseY < -24) particle.baseY = height + 24;
        if (particle.baseY > height + 24) particle.baseY = -24;

        let x =
          particle.baseX +
          Math.sin(time * particle.speed + particle.phase) * 10 * particle.depth +
          parallax.x * particle.depth;
        let y =
          particle.baseY +
          Math.cos(time * particle.speed * 0.8 + particle.phase) * 8 * particle.depth +
          parallax.y * particle.depth;

        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.hypot(dx, dy);
        const influence = pointer.active && !isCoarse ? clamp(1 - distance / 220, 0, 1) : 0;

        if (influence > 0) {
          const direction = index % 3 === 0 ? -1 : 1;
          const force = influence * 15 * direction;
          x += (dx / Math.max(distance, 1)) * force;
          y += (dy / Math.max(distance, 1)) * force;
        }

        const pulse = 0.55 + Math.sin(time * 1.7 + particle.phase) * 0.45;
        const alpha = particle.amber
          ? 0.24 + pulse * 0.15 + influence * 0.2
          : 0.2 + pulse * 0.16 + influence * 0.28;
        const radius = (particle.amber ? 1.55 : 1.35) + influence * 1.45;
        const color = particle.amber ? "255, 209, 102" : "85, 230, 255";

        ctx.fillStyle = `rgba(${color}, ${alpha * (0.16 + influence * 0.18)})`;
        ctx.beginPath();
        ctx.arc(x, y, radius * (2.8 + influence * 0.9), 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function drawSpotlight(time: number, radius: number, isCoarse: boolean) {
      const idleX = width * (0.58 + Math.sin(time * 0.11) * 0.18);
      const idleY = height * (0.34 + Math.cos(time * 0.09) * 0.16);
      const x = pointer.active || !isCoarse ? pointer.x : idleX;
      const y = pointer.active || !isCoarse ? pointer.y : idleY;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, "rgba(85, 230, 255, 0.14)");
      gradient.addColorStop(0.2, "rgba(47, 123, 255, 0.075)");
      gradient.addColorStop(0.55, "rgba(85, 230, 255, 0.026)");
      gradient.addColorStop(1, "rgba(85, 230, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const scanGradient = ctx.createLinearGradient(x - radius, y, x + radius, y);
      scanGradient.addColorStop(0, "rgba(85, 230, 255, 0)");
      scanGradient.addColorStop(0.5, "rgba(85, 230, 255, 0.055)");
      scanGradient.addColorStop(1, "rgba(85, 230, 255, 0)");
      ctx.strokeStyle = scanGradient;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(
        x,
        y,
        radius * 0.42,
        radius * 0.12,
        Math.sin(time * 0.2) * 0.6,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
    }

    function drawTrails(delta: number) {
      for (let index = trails.length - 1; index >= 0; index -= 1) {
        const trail = trails[index];
        trail.age += delta;
        trail.x += trail.vx * delta;
        trail.y += trail.vy * delta;
        const progress = trail.age / trail.life;
        if (progress >= 1) {
          trails.splice(index, 1);
          continue;
        }

        ctx.fillStyle = `rgba(85, 230, 255, ${(1 - progress) * 0.22})`;
        ctx.beginPath();
        ctx.arc(trail.x, trail.y, 1.2 + (1 - progress) * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawPulses(delta: number) {
      for (let index = pulses.length - 1; index >= 0; index -= 1) {
        const pulse = pulses[index];
        pulse.age += delta;
        const progress = pulse.age / pulse.life;
        if (progress >= 1) {
          pulses.splice(index, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(85, 230, 255, ${(1 - progress) * 0.34})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, 24 + progress * 84, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    function drawRandomPulses(time: number) {
      for (let index = 0; index < 4; index += 1) {
        const phase = time * 0.18 + index * 1.9;
        const alpha = Math.max(0, Math.sin(phase)) * 0.04;
        if (alpha <= 0) continue;
        const x = width * (0.18 + ((index * 0.23 + 0.13) % 0.68));
        const y = height * (0.2 + ((index * 0.31 + 0.22) % 0.62));
        const radius = 26 + Math.sin(phase) * 26;
        ctx.strokeStyle = `rgba(85, 230, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    function animate(now: number) {
      const delta = Math.min(0.05, (now - previousTime) / 1000);
      previousTime = now;
      const time = now / 1000;
      const isCoarse = !finePointerQuery.matches;
      const reduceMotion = reduceMotionQuery.matches;
      const targetX = isCoarse ? width * (0.55 + Math.sin(time * 0.07) * 0.2) : pointer.targetX;
      const targetY = isCoarse ? height * (0.38 + Math.cos(time * 0.06) * 0.18) : pointer.targetY;
      const follow = reduceMotion ? 0.03 : pointer.active ? 0.28 : 0.08;
      pointer.x += (targetX - pointer.x) * follow;
      pointer.y += (targetY - pointer.y) * follow;
      pointer.active = isCoarse ? false : now - pointer.lastMoveAt < 1600;

      parallax.x += ((pointer.x / Math.max(width, 1) - 0.5) * -12 - parallax.x) * 0.045;
      parallax.y += ((pointer.y / Math.max(height, 1) - 0.5) * -8 - parallax.y) * 0.045;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(3, 7, 18, 0.18)";
      ctx.fillRect(0, 0, width, height);

      const spotlightRadius = clamp(Math.min(width, height) * 0.55, 300, 680);
      drawGrid(time, spotlightRadius, isCoarse || reduceMotion);
      drawParticles(time, delta, spotlightRadius, isCoarse || reduceMotion);
      drawRandomPulses(time);
      if (!reduceMotion) {
        drawTrails(delta);
      }
      drawSpotlight(time, spotlightRadius, isCoarse);
      if (!reduceMotion) {
        drawPulses(delta);
      }

      animationFrame = window.requestAnimationFrame(animate);
    }

    function onPointerMove(event: PointerEvent) {
      if (!finePointerQuery.matches) {
        return;
      }

      const dx = event.clientX - pointer.targetX;
      const dy = event.clientY - pointer.targetY;
      const speed = Math.hypot(dx, dy);
      const now = performance.now();
      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      pointer.lastMoveAt = now;

      if (!reduceMotionQuery.matches && speed > 18 && now - pointer.lastTrailAt > 28) {
        pointer.lastTrailAt = now;
        trails.push({
          age: 0,
          life: 0.55,
          vx: -dx * 0.35,
          vy: -dy * 0.35,
          x: event.clientX,
          y: event.clientY,
        });
        if (trails.length > 22) {
          trails.shift();
        }
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (!finePointerQuery.matches || reduceMotionQuery.matches) {
        return;
      }
      pulses.push({ age: 0, life: 0.72, x: event.clientX, y: event.clientY });
      if (pulses.length > 8) {
        pulses.shift();
      }
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="interactive-background pointer-events-none fixed inset-0 z-0"
    >
      <canvas className="interactive-background__canvas" ref={canvasRef} />
    </div>
  );
}
