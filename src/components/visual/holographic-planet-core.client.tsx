"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type PulseLabel = {
  label: string;
  x: string;
  y: string;
};

const pulseLabels: PulseLabel[] = [
  { label: "AI", x: "24%", y: "26%" },
  { label: "CV", x: "68%", y: "22%" },
  { label: "NLP", x: "18%", y: "68%" },
  { label: "WEB", x: "72%", y: "66%" },
  { label: "MOBILE", x: "45%", y: "14%" },
];

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }

    const material = mesh.material;
    if (Array.isArray(material)) {
      material.forEach((item) => item.dispose());
    } else if (material) {
      material.dispose();
    }
  });
}

export function HolographicPlanetCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const shell = shellRef.current;

    if (!canvas || !shell) {
      return;
    }
    const shellElement = shell;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const root = new THREE.Group();
    const core = new THREE.Group();
    scene.add(root);
    root.add(core);

    const cyan = new THREE.Color("#55e6ff");
    const blue = new THREE.Color("#2f7bff");
    const success = new THREE.Color("#63e6be");

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.34, 48, 32),
      new THREE.MeshBasicMaterial({
        blending: THREE.AdditiveBlending,
        color: cyan,
        opacity: 0.34,
        transparent: true,
        wireframe: true,
      }),
    );
    core.add(sphere);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.42, 48, 32),
      new THREE.MeshBasicMaterial({
        blending: THREE.AdditiveBlending,
        color: blue,
        opacity: 0.08,
        transparent: true,
      }),
    );
    core.add(atmosphere);

    const nodeMaterial = new THREE.MeshBasicMaterial({
      blending: THREE.AdditiveBlending,
      color: success,
      transparent: true,
      opacity: 0.78,
    });
    const nodeGeometry = new THREE.SphereGeometry(0.035, 12, 12);
    const nodes: THREE.Vector3[] = [];

    for (let index = 0; index < 22; index += 1) {
      const phi = Math.acos(1 - 2 * ((index + 0.5) / 22));
      const theta = index * 2.399963229728653;
      const radius = 0.24 + ((index * 37) % 90) / 100;
      const position = new THREE.Vector3(
        Math.cos(theta) * Math.sin(phi) * radius,
        Math.sin(theta) * Math.sin(phi) * radius,
        Math.cos(phi) * radius,
      );
      nodes.push(position);

      const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
      node.position.copy(position);
      core.add(node);
    }

    const linePositions: number[] = [];
    for (let a = 0; a < nodes.length; a += 1) {
      for (let b = a + 1; b < nodes.length; b += 1) {
        if (nodes[a].distanceTo(nodes[b]) < 0.82) {
          linePositions.push(
            nodes[a].x,
            nodes[a].y,
            nodes[a].z,
            nodes[b].x,
            nodes[b].y,
            nodes[b].z,
          );
        }
      }
    }

    const neuralLines = new THREE.LineSegments(
      new THREE.BufferGeometry().setAttribute(
        "position",
        new THREE.Float32BufferAttribute(linePositions, 3),
      ),
      new THREE.LineBasicMaterial({
        blending: THREE.AdditiveBlending,
        color: cyan,
        opacity: 0.25,
        transparent: true,
      }),
    );
    core.add(neuralLines);

    const ringMaterial = new THREE.MeshBasicMaterial({
      blending: THREE.AdditiveBlending,
      color: cyan,
      opacity: 0.34,
      transparent: true,
      wireframe: true,
    });
    const rings = [1.72, 2.02, 2.28].map((radius, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.008, 8, 120),
        ringMaterial.clone(),
      );
      ring.rotation.x = Math.PI / 2.4 + index * 0.46;
      ring.rotation.y = index * 0.78;
      core.add(ring);
      return ring;
    });

    const satelliteGeometry = new THREE.SphereGeometry(0.045, 12, 12);
    const satelliteMaterial = new THREE.MeshBasicMaterial({
      blending: THREE.AdditiveBlending,
      color: "#ffd166",
      opacity: 0.86,
      transparent: true,
    });
    const satellites = Array.from({ length: 7 }, (_, index) => {
      const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial.clone());
      satellite.userData = {
        axis: index % rings.length,
        phase: index * 0.92,
        radius: 1.72 + (index % 3) * 0.28,
        speed: 0.34 + index * 0.035,
      };
      core.add(satellite);
      return satellite;
    });

    let animationFrame = 0;
    let isPointerInside = false;
    let isDragging = false;
    let pointerStart = { x: 0, y: 0 };
    let rotationStart = { x: 0, y: 0 };
    let dragRotation = { x: 0, y: 0 };
    let targetTilt = { x: 0, y: 0 };
    const startedAt = performance.now();

    function resize() {
      const rect = shellElement.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function updatePointer(event: PointerEvent) {
      const rect = shellElement.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      targetTilt = {
        x: (0.5 - y) * 0.42,
        y: (x - 0.5) * 0.58,
      };
    }

    function onPointerMove(event: PointerEvent) {
      isPointerInside = true;
      updatePointer(event);

      if (isDragging) {
        dragRotation = {
          x: rotationStart.x + (event.clientY - pointerStart.y) * 0.01,
          y: rotationStart.y + (event.clientX - pointerStart.x) * 0.01,
        };
      }
    }

    function onPointerLeave() {
      isPointerInside = false;
      targetTilt = { x: 0, y: 0 };
    }

    function onPointerDown(event: PointerEvent) {
      isDragging = true;
      pointerStart = { x: event.clientX, y: event.clientY };
      rotationStart = { ...dragRotation };
      shellElement.setPointerCapture(event.pointerId);
      setPulseKey((current) => current + 1);
    }

    function onPointerUp(event: PointerEvent) {
      isDragging = false;
      if (shellElement.hasPointerCapture(event.pointerId)) {
        shellElement.releasePointerCapture(event.pointerId);
      }
    }

    function animate() {
      const elapsed = (performance.now() - startedAt) / 1000;
      const motionScale = reduceMotion.matches ? 0 : 1;

      root.rotation.x += (targetTilt.x - root.rotation.x) * 0.08;
      root.rotation.y += (targetTilt.y - root.rotation.y) * 0.08;
      core.rotation.x = dragRotation.x + Math.sin(elapsed * 0.35) * 0.06 * motionScale;
      core.rotation.y =
        dragRotation.y + elapsed * 0.18 * motionScale + (isDragging ? 0 : 0.16);
      core.rotation.z = Math.sin(elapsed * 0.22) * 0.04 * motionScale;

      sphere.scale.setScalar(isPointerInside ? 1.04 : 1);
      atmosphere.scale.setScalar(1 + Math.sin(elapsed * 1.4) * 0.025 * motionScale);

      rings.forEach((ring, index) => {
        ring.rotation.z += (0.003 + index * 0.0018) * motionScale;
        const material = ring.material as THREE.MeshBasicMaterial;
        material.opacity += ((isPointerInside ? 0.58 : 0.34) - material.opacity) * 0.08;
      });

      satellites.forEach((satellite) => {
        const data = satellite.userData as {
          axis: number;
          phase: number;
          radius: number;
          speed: number;
        };
        const theta = elapsed * data.speed * motionScale + data.phase;
        satellite.position.set(
          Math.cos(theta) * data.radius,
          Math.sin(theta) * 0.18 + Math.sin(theta * 0.7) * 0.16,
          Math.sin(theta) * data.radius * 0.42,
        );
        satellite.rotation.y = theta;
      });

      const lineMaterial = neuralLines.material as THREE.LineBasicMaterial;
      lineMaterial.opacity += ((isPointerInside ? 0.52 : 0.25) - lineMaterial.opacity) * 0.08;

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(shellElement);
    resize();

    shellElement.addEventListener("pointermove", onPointerMove);
    shellElement.addEventListener("pointerleave", onPointerLeave);
    shellElement.addEventListener("pointerdown", onPointerDown);
    shellElement.addEventListener("pointerup", onPointerUp);
    shellElement.addEventListener("pointercancel", onPointerUp);
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      shellElement.removeEventListener("pointermove", onPointerMove);
      shellElement.removeEventListener("pointerleave", onPointerLeave);
      shellElement.removeEventListener("pointerdown", onPointerDown);
      shellElement.removeEventListener("pointerup", onPointerUp);
      shellElement.removeEventListener("pointercancel", onPointerUp);
      disposeObject(scene);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      aria-label="Interactive holographic neural planet core"
      className="hero-core group relative h-full min-h-0 cursor-grab overflow-hidden rounded-panel border border-line bg-bg-navy/72 active:cursor-grabbing"
      ref={shellRef}
      role="img"
    >
      <canvas className="h-full w-full" ref={canvasRef} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_34%,rgba(3,7,18,0.18)_70%)]" />
      <div className="pointer-events-none absolute left-4 top-4 rounded-chip border border-line bg-bg-void/70 px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">
        Holographic Neural Planet Core
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">
        <span>Hover tilt</span>
        <span>Drag rotate</span>
      </div>
      <div className="pointer-events-none absolute inset-0" key={pulseKey}>
        {pulseKey > 0
          ? pulseLabels.map((item) => (
              <span
                className="planet-pulse-label absolute rounded-chip border border-cyan/50 bg-bg-void/78 px-2 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-cyan"
                key={item.label}
                style={{ left: item.x, top: item.y }}
              >
                {item.label}
              </span>
            ))
          : null}
        {pulseKey > 0 ? <span className="planet-pulse-ring" /> : null}
      </div>
    </div>
  );
}
