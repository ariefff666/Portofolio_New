"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import profilePhoto from "../../../assets/foto-profil/Arief.jpeg";

type ProfileMode = "profile" | "stack" | "focus";

type ProfileSignalCardProps = {
  availability: string;
  focusItems: string[];
  hasPhoto: boolean;
  location: string;
  name: string;
  program: string;
  role: string;
  stackItems: string[];
  university: string;
};

const modes: Array<{ id: ProfileMode; label: string }> = [
  { id: "profile", label: "Profile" },
  { id: "stack", label: "Stack" },
  { id: "focus", label: "Focus" },
];

const modeSummary: Record<ProfileMode, string | null> = {
  focus: null,
  profile: "Identity, academic base, and operating context for the public portfolio.",
  stack: "Practical technology surface used across research prototypes and application builds.",
};

export function ProfileSignalCard({
  availability,
  focusItems,
  hasPhoto,
  location,
  name,
  program,
  role,
  stackItems,
  university,
}: ProfileSignalCardProps) {
  const [mode, setMode] = useState<ProfileMode>("profile");
  const cardRef = useRef<HTMLDivElement>(null);

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--profile-tilt-x", `${y * -10}deg`);
    card.style.setProperty("--profile-tilt-y", `${x * 12}deg`);
    card.style.setProperty("--profile-depth-x", `${x * 16}px`);
    card.style.setProperty("--profile-depth-y", `${y * 16}px`);
    card.style.setProperty("--profile-layer-x", `${x * -12}px`);
    card.style.setProperty("--profile-layer-y", `${y * -12}px`);
    card.style.setProperty("--profile-glow-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--profile-glow-y", `${event.clientY - rect.top}px`);
  }

  function onPointerLeave() {
    const card = cardRef.current;
    if (!card) {
      return;
    }

    card.style.setProperty("--profile-tilt-x", "0deg");
    card.style.setProperty("--profile-tilt-y", "0deg");
    card.style.setProperty("--profile-depth-x", "0px");
    card.style.setProperty("--profile-depth-y", "0px");
    card.style.setProperty("--profile-layer-x", "0px");
    card.style.setProperty("--profile-layer-y", "0px");
  }

  const activeItems =
    mode === "profile"
      ? [program, university, location, role].filter(Boolean)
      : mode === "stack"
        ? stackItems
        : focusItems;

  return (
    <section
      className="profile-signal-card flex overflow-hidden rounded-panel border border-line bg-panel-solid/90 lg:h-[60.5rem]"
      data-cursor="PROFILE SCAN"
      onPointerLeave={onPointerLeave}
      onPointerMove={onPointerMove}
      ref={cardRef}
    >
      <div className="flex min-h-0 w-full flex-col">
        <header className="flex min-h-14 items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-cyan">
              Operator
            </p>
            <h2 className="mt-1 text-lg font-semibold text-text">Profile Signal</h2>
          </div>
          <span className="rounded-full border border-success/40 bg-success/10 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-success">
            Live
          </span>
        </header>

        <div className="flex min-h-0 flex-1 flex-col p-5">
          <div className="profile-signal-frame relative overflow-hidden rounded-[0.7rem] border border-line bg-bg-navy/80 p-3 lg:max-h-[34rem]">
            <div className="profile-radar" aria-hidden="true" />
            <div className="profile-photo-layer relative overflow-hidden rounded-control border border-line bg-bg-void">
              {hasPhoto ? (
                <Image
                  alt={name ? `Portrait of ${name}` : "Profile portrait"}
                  className="aspect-[4/5] h-auto w-full object-cover"
                  placeholder="blur"
                  sizes="(min-width: 1024px) 22rem, 100vw"
                  src={profilePhoto}
                />
              ) : (
                <div className="aspect-[4/5] bg-[radial-gradient(circle_at_center,rgba(85,230,255,0.16),transparent_55%),linear-gradient(135deg,rgba(47,123,255,0.18),transparent)]" />
              )}
              <span className="profile-scanline" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-5 shrink-0">
            <h3 className="text-2xl font-semibold leading-tight text-text">{name}</h3>
            {program || university ? (
              <p className="mt-2 text-sm leading-6 text-muted">
                {[program, university].filter(Boolean).join(" // ")}
              </p>
            ) : null}
            {location ? (
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-cyan">
                {location}
              </p>
            ) : null}
          </div>

          <div className="mt-5 grid shrink-0 grid-cols-3 gap-2" role="tablist" aria-label="Profile signal modes">
            {modes.map((item) => (
              <button
                aria-selected={mode === item.id}
                className="min-h-10 rounded-control border border-line bg-bg-navy/65 px-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted transition duration-200 hover:border-cyan hover:text-cyan focus-visible:shadow-[var(--focus-ring)] aria-selected:border-cyan aria-selected:text-cyan motion-reduce:transition-none"
                key={item.id}
                onClick={() => setMode(item.id)}
                role="tab"
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex min-h-[13.5rem] shrink-0 flex-col rounded-control border border-line bg-bg-navy/55 p-4" role="tabpanel">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-cyan">
                {mode} data
              </p>
              {availability ? (
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">
                  {availability}
                </p>
              ) : null}
            </div>
            {modeSummary[mode] ? (
              <p className="mt-3 text-sm leading-6 text-muted">{modeSummary[mode]}</p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {activeItems.length > 0 ? (
                activeItems.slice(0, 12).map((item) => (
                  <span
                    className="rounded-chip border border-line bg-bg-void/60 px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted"
                    key={item}
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted">Source data is not available yet.</span>
              )}
            </div>
            <div className="profile-waveform mt-auto pt-4" aria-hidden="true">
              {Array.from({ length: 18 }).map((_, index) => (
                <span
                  key={index}
                  style={{ "--bar": `${18 + ((index * 11) % 34)}%` } as CSSProperties}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
