"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { ResearchArea, ResearchPreview } from "@/lib/repository/content";
import { cn } from "@/lib/utils";

type ResearchObservatoryProps = {
  areas: ResearchArea[];
  research: ResearchPreview[];
};

type SignalLine = {
  id: string;
  path: string;
};

const pageSize = 3;

function stageVariant(stage: string) {
  if (/progress|experimental|preparation/i.test(stage)) return "text-warning border-warning/40 bg-warning/10";
  if (/involvement/i.test(stage)) return "text-success border-success/35 bg-success/10";
  return "text-cyan border-cyan/35 bg-cyan/10";
}

function ownershipCode(ownership: ResearchPreview["ownership"]) {
  if (ownership === "Research Involvement") return "INVOLVEMENT";
  if (ownership === "Exploratory Log") return "EXPLORATORY";
  if (ownership === "Collaborative Research") return "COLLAB";
  return "PERSONAL";
}

function compactType(type: string) {
  return type.toUpperCase().replace(/\s+/g, " ");
}

function ResearchInstrument({ item }: { item: ResearchPreview }) {
  if (item.visualKind === "cxr") {
    return (
      <div className="research-instrument research-instrument--cxr" aria-hidden="true">
        <span className="research-scan-plane" />
        <span className="research-cxr-box research-cxr-box--primary" />
        <span className="research-cxr-box research-cxr-box--secondary" />
        <span className="research-feature-dot research-feature-dot--a" />
        <span className="research-feature-dot research-feature-dot--b" />
        <span className="research-feature-dot research-feature-dot--c" />
      </div>
    );
  }

  if (item.visualKind === "nlp") {
    return (
      <div className="research-instrument research-instrument--nlp" aria-hidden="true">
        {["SELECT", "nama", "FROM", "dataset", "WHERE"].map((token, index) => (
          <span
            className="research-token"
            key={token}
            style={{ "--token-index": index } as CSSProperties}
          >
            {token}
          </span>
        ))}
        <span className="research-attention-line research-attention-line--a" />
        <span className="research-attention-line research-attention-line--b" />
      </div>
    );
  }

  if (item.visualKind === "dataset") {
    return (
      <div className="research-instrument research-instrument--dataset" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            className="research-cluster-point"
            key={index}
            style={
              {
                "--point-left": `${12 + ((index * 17) % 76)}%`,
                "--point-top": `${18 + ((index * 29) % 62)}%`,
                "--point-delay": `${index * 120}ms`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    );
  }

  if (item.visualKind === "evaluation") {
    return (
      <div className="research-instrument research-instrument--evaluation" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            className="research-metric-bar"
            key={index}
            style={{ "--bar-width": `${34 + ((index * 19) % 48)}%` } as CSSProperties}
          />
        ))}
      </div>
    );
  }

  if (item.visualKind === "methodology") {
    return (
      <div className="research-instrument research-instrument--methodology" aria-hidden="true">
        {["Data", "Model", "Eval"].map((node, index) => (
          <span
            className="research-pipeline-node"
            key={node}
            style={{ "--node-index": index } as CSSProperties}
          >
            {node}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="research-instrument research-instrument--vision" aria-hidden="true">
      <span className="research-vision-box research-vision-box--a" />
      <span className="research-vision-box research-vision-box--b" />
      <span className="research-feature-dot research-feature-dot--a" />
      <span className="research-feature-dot research-feature-dot--b" />
      <span className="research-feature-dot research-feature-dot--c" />
    </div>
  );
}

function DossierBlock({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  if (!children) return null;

  return (
    <div className="rounded-control border border-line bg-bg-navy/48 p-4">
      <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-cyan">
        {label}
      </p>
      <div className="mt-3 text-sm leading-7 text-muted">{children}</div>
    </div>
  );
}

function ResearchDossier({
  item,
  onClose,
}: {
  item: ResearchPreview;
  onClose: () => void;
}) {
  const hasLinks =
    item.repositoryHref ||
    item.repositoryLabel ||
    item.paperHref ||
    item.datasetHref ||
    item.demoHref;

  return (
    <section
      className="research-dossier mt-6 rounded-panel border border-cyan/45 bg-panel-solid/95 p-5"
      id={`research-dossier-${item.slug}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-cyan">
            Research Dossier
          </p>
          <h3 className="mt-2 text-2xl font-semibold leading-tight text-text">{item.title}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-chip border border-line bg-bg-navy/70 px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">
              {item.ownership}
            </span>
            <span className={cn("rounded-chip border px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em]", stageVariant(item.stage))}>
              {item.stage}
            </span>
          </div>
        </div>
        <button
          className="inline-flex min-h-10 items-center rounded-control border border-line bg-bg-navy/70 px-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-muted transition duration-200 hover:border-cyan hover:text-cyan focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
          data-cursor="CLOSE"
          onClick={onClose}
          type="button"
        >
          Close Dossier
        </button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <DossierBlock label="Objective">{item.objective}</DossierBlock>
        <DossierBlock label="Method">{item.method}</DossierBlock>
        <DossierBlock label="Dataset">
          {item.datasetHref ? (
            <a
              className="text-cyan underline decoration-cyan/40 underline-offset-4 hover:text-text"
              data-cursor="EXTERNAL"
              href={item.datasetHref}
              rel="noreferrer"
              target="_blank"
            >
              {item.dataset || item.datasetHref}
            </a>
          ) : (
            item.dataset
          )}
        </DossierBlock>
        <DossierBlock label={item.metrics.length > 0 ? "Verified Metrics" : "Experiment Status"}>
          {item.metrics.length > 0 ? (
            <ul className="grid gap-2">
              {item.metrics.map((metric) => (
                <li
                  className="rounded-control border border-line bg-bg-void/45 p-3"
                  key={`${item.slug}-${metric.label}`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-text">{metric.label}</span>
                    {metric.isVerified ? (
                      <span className="rounded-chip border border-success/35 bg-success/10 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-success">
                        Verified
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.12em] text-muted">
                    {metric.value}
                    {metric.unit ? ` ${metric.unit}` : ""}
                    {metric.evaluationSplit ? ` / ${metric.evaluationSplit}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            item.resultSummary || "Evaluation context has not been published yet."
          )}
        </DossierBlock>
        <DossierBlock label="Limitations">{item.limitations}</DossierBlock>
        <DossierBlock label="Next Validation Step">{item.reproducibilityNote}</DossierBlock>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {item.tools.length > 0 ? (
          <div className="rounded-control border border-line bg-bg-navy/48 p-4">
            <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-cyan">
              Related Skills
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tools.slice(0, 8).map((tool) => (
                <a
                  className="rounded-chip border border-line bg-bg-void/55 px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted transition duration-200 hover:border-cyan hover:text-cyan focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
                  data-cursor="TRACE"
                  data-research-signal-for={item.slug}
                  href="#skills"
                  key={`${item.slug}-${tool}`}
                >
                  {tool}
                </a>
              ))}
            </div>
          </div>
        ) : null}

        {hasLinks ? (
          <div className="rounded-control border border-line bg-bg-navy/48 p-4">
            <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-cyan">
              Reference Nodes
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.paperHref ? (
                <a
                  className="rounded-chip border border-cyan/40 bg-cyan/10 px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-cyan transition duration-200 hover:bg-cyan/20 focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
                  data-cursor="EXTERNAL"
                  data-research-signal-for={item.slug}
                  href={item.paperHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  Context Paper
                </a>
              ) : null}
              {item.repositoryHref ? (
                <a
                  className="rounded-chip border border-line bg-bg-void/55 px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted transition duration-200 hover:border-cyan hover:text-cyan focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
                  data-cursor="EXTERNAL"
                  href={item.repositoryHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  Repository
                </a>
              ) : item.repositoryLabel ? (
                <span className="rounded-chip border border-line bg-bg-void/55 px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">
                  Repository: {item.repositoryLabel}
                </span>
              ) : null}
              {item.demoHref ? (
                <a
                  className="rounded-chip border border-line bg-bg-void/55 px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted transition duration-200 hover:border-cyan hover:text-cyan focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
                  data-cursor="EXTERNAL"
                  href={item.demoHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  Demo
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ResearchCard({
  featured,
  isSelected,
  item,
  onInspect,
  onSignal,
}: {
  featured?: boolean;
  isSelected: boolean;
  item: ResearchPreview;
  onInspect: (slug: string) => void;
  onSignal: (slug: string | null) => void;
}) {
  return (
    <article
      className={cn(
        "research-card group relative overflow-hidden rounded-panel border border-line bg-panel-solid/90 transition duration-200 motion-reduce:transition-none",
        "focus-within:border-cyan hover:border-cyan/70",
        featured && "lg:grid lg:grid-cols-[minmax(18rem,0.95fr)_minmax(0,1fr)]",
        isSelected && "research-card--selected border-cyan/80",
      )}
      data-card-slug={item.slug}
      data-cursor="INSPECT"
      data-cursor-magnetic="false"
      onFocus={() => onSignal(item.slug)}
      onMouseEnter={() => onSignal(item.slug)}
      onMouseLeave={() => onSignal(null)}
    >
      <span className="research-corner research-corner--tl" aria-hidden="true" />
      <span className="research-corner research-corner--tr" aria-hidden="true" />
      <span className="research-corner research-corner--bl" aria-hidden="true" />
      <span className="research-corner research-corner--br" aria-hidden="true" />
      <div className={cn("p-4", featured && "lg:p-5")}>
        <ResearchInstrument item={item} />
      </div>
      <div className={cn("flex flex-col p-5 pt-0", featured && "lg:p-5 lg:pl-0")}>
        <div className="flex flex-wrap gap-2">
          <span
            className="rounded-chip border border-cyan/35 bg-cyan/10 px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-cyan"
            data-research-signal-for={item.slug}
          >
            {item.areas[0] || "Research"}
          </span>
          <span className="rounded-chip border border-line bg-bg-navy/75 px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">
            {compactType(item.typeLabel)}
          </span>
        </div>
        <h3 className={cn("mt-4 font-semibold leading-tight text-text", featured ? "text-2xl" : "text-lg")}>
          {item.title}
        </h3>
        <p className={cn("mt-3 text-sm leading-6 text-muted", featured ? "line-clamp-3" : "line-clamp-2")}>
          {item.summary}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className={cn("rounded-chip border px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em]", stageVariant(item.stage))} data-research-signal-for={item.slug}>
            {item.stage}
          </span>
          <span className="rounded-chip border border-line bg-bg-navy/70 px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">
            {ownershipCode(item.ownership)}
          </span>
          {item.year ? (
            <span className="rounded-chip border border-line bg-bg-navy/70 px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">
              {item.year}
            </span>
          ) : null}
        </div>
        <button
          aria-controls={`research-dossier-${item.slug}`}
          aria-expanded={isSelected}
          className="mt-5 inline-flex min-h-10 w-fit items-center rounded-control border border-cyan/55 bg-cyan/10 px-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-cyan transition duration-200 hover:bg-cyan hover:text-bg-void focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
          data-cursor={isSelected ? "SIGNAL ACQUIRED" : "OPEN DOSSIER"}
          onClick={() => onInspect(item.slug)}
          type="button"
        >
          {isSelected ? "Signal Acquired" : "Open Dossier"}
        </button>
      </div>
    </article>
  );
}

export function ResearchObservatory({ areas, research }: ResearchObservatoryProps) {
  const [activeArea, setActiveArea] = useState(() => {
    if (typeof window === "undefined") return "all";
    const requestedArea = new URLSearchParams(window.location.search).get("researchArea");
    return requestedArea && areas.some((area) => area.slug === requestedArea)
      ? requestedArea
      : "all";
  });
  const [activeSignalSlug, setActiveSignalSlug] = useState<string | null>(null);
  const [isInView, setIsInView] = useState(true);
  const [page, setPage] = useState(() => {
    if (typeof window === "undefined") return 1;
    const requestedPage = Number(
      new URLSearchParams(window.location.search).get("researchPage") || "1",
    );
    return Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  });
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [signalLines, setSignalLines] = useState<SignalLine[]>([]);
  const lastSelectedButtonRef = useRef<HTMLButtonElement | null>(null);
  const listHeadingRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const activeExperiments = research.filter((item) => /progress/i.test(item.stage)).length;
  const filteredResearch = useMemo(
    () =>
      activeArea === "all"
        ? research
        : research.filter((item) => item.areaSlugs.includes(activeArea)),
    [activeArea, research],
  );
  const pageCount = Math.max(1, Math.ceil(filteredResearch.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageItems = filteredResearch.slice((safePage - 1) * pageSize, safePage * pageSize);
  const featuredItem = pageItems.find((item) => item.isFeatured);
  const standardItems = featuredItem
    ? pageItems.filter((item) => item.slug !== featuredItem.slug)
    : pageItems;
  const selectedItem = research.find((item) => item.slug === selectedSlug) ?? null;
  const activeAreaName = areas.find((area) => area.slug === activeArea)?.name ?? "All Research Areas";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (activeArea === "all") {
      params.delete("researchArea");
    } else {
      params.set("researchArea", activeArea);
    }

    if (safePage <= 1) {
      params.delete("researchPage");
    } else {
      params.set("researchPage", String(safePage));
    }

    const next = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", next);
  }, [activeArea, safePage]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.12 },
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const activeSlug = activeSignalSlug ?? selectedSlug;
    const section = sectionRef.current;

    if (!activeSlug || !section) return;

    function updateLines() {
      const currentSection = sectionRef.current;
      if (!currentSection) return;

      const sectionRect = currentSection.getBoundingClientRect();
      const card = currentSection.querySelector<HTMLElement>(`[data-card-slug="${activeSlug}"]`);
      const anchors = Array.from(
        currentSection.querySelectorAll<HTMLElement>(`[data-research-signal-for="${activeSlug}"]`),
      ).slice(0, 5);

      if (!card || anchors.length === 0) {
        setSignalLines([]);
        return;
      }

      const cardRect = card.getBoundingClientRect();
      const startX = cardRect.left - sectionRect.left + cardRect.width * 0.5;
      const startY = cardRect.top - sectionRect.top + cardRect.height * 0.32;

      setSignalLines(
        anchors.map((anchor, index) => {
          const rect = anchor.getBoundingClientRect();
          const endX = rect.left - sectionRect.left + rect.width / 2;
          const endY = rect.top - sectionRect.top + rect.height / 2;
          const controlOffset = 42 + index * 9;
          return {
            id: `${activeSlug}-${index}`,
            path: `M ${startX} ${startY} C ${startX + controlOffset} ${startY - 28}, ${endX - controlOffset} ${endY + 24}, ${endX} ${endY}`,
          };
        }),
      );
    }

    const frame = window.requestAnimationFrame(updateLines);
    window.addEventListener("resize", updateLines);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateLines);
    };
  }, [activeSignalSlug, selectedSlug, activeArea, safePage]);

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape" || !selectedSlug) return;
      event.preventDefault();
      setSelectedSlug(null);
      setActiveSignalSlug(null);
      window.requestAnimationFrame(() => lastSelectedButtonRef.current?.focus());
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedSlug]);

  function setArea(value: string) {
    setActiveArea(value);
    setPage(1);
    setSelectedSlug(null);
    setActiveSignalSlug(null);
  }

  function setArchivePage(value: number) {
    setPage(Math.max(1, Math.min(pageCount, value)));
    setSelectedSlug(null);
    setActiveSignalSlug(null);
    window.requestAnimationFrame(() => listHeadingRef.current?.focus());
  }

  function inspectResearch(slug: string) {
    setSelectedSlug((current) => (current === slug ? null : slug));
    setActiveSignalSlug(slug);
    lastSelectedButtonRef.current = document.activeElement instanceof HTMLButtonElement ? document.activeElement : null;
  }

  function setSignal(slug: string | null) {
    setActiveSignalSlug(slug);
    if (!slug && !selectedSlug) {
      setSignalLines([]);
    }
  }

  return (
    <section
      className="research-observatory relative overflow-hidden rounded-panel border border-line bg-bg-void/40 p-4 sm:p-5 lg:p-6"
      data-in-view={isInView}
      ref={sectionRef}
    >
      <svg className="research-signal-overlay" aria-hidden="true">
        {signalLines.map((line) => (
          <path className="research-signal-line" d={line.path} key={line.id} />
        ))}
      </svg>

      <div className="relative z-10 grid gap-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-cyan">
              Research Observatory
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-text sm:text-4xl">
              Exploring Intelligent Systems
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">
              Experiments, research logs, dataset exploration, model evaluation,
              methodology notes, and milestones rendered from public research signals.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="research-console-indicator">
                <span>Entries</span>
                <strong>{research.length}</strong>
              </span>
              <span className="research-console-indicator" data-research-signal-for={activeSignalSlug ?? undefined}>
                <span>Areas</span>
                <strong>{areas.length}</strong>
              </span>
              <span className="research-console-indicator">
                <span>Active</span>
                <strong>{activeExperiments}</strong>
              </span>
            </div>
          </div>

          <div className="rounded-panel border border-line bg-bg-navy/70 p-4">
            <label
              className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-cyan"
              htmlFor="research-area-filter"
            >
              Filter Channel
            </label>
            <div className="relative mt-2">
              <select
                className="min-h-11 w-full appearance-none rounded-control border border-line bg-bg-void/78 px-3.5 py-2.5 pr-10 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-text transition duration-200 hover:border-cyan focus:border-cyan focus:outline-none focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
                data-cursor="FILTER"
                id="research-area-filter"
                onChange={(event) => setArea(event.target.value)}
                value={activeArea}
              >
                <option value="all">All Research Areas</option>
                {areas.map((area) => (
                  <option key={area.slug} value={area.slug}>
                    {area.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-cyan">
                v
              </span>
            </div>
            <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">
              Active taxonomy: {activeAreaName}
            </p>
          </div>
        </div>

        <div aria-live="polite" className="sr-only">
          {filteredResearch.length} research signals detected for {activeAreaName}.
        </div>

        <h3
          className="sr-only"
          ref={listHeadingRef}
          tabIndex={-1}
        >
          Research signal list
        </h3>

        {filteredResearch.length > 0 ? (
          <>
            <div className="grid gap-5">
              {featuredItem ? (
                <ResearchCard
                  featured
                  isSelected={selectedSlug === featuredItem.slug}
                  item={featuredItem}
                  onInspect={inspectResearch}
                  onSignal={setSignal}
                />
              ) : null}

              {standardItems.length > 0 ? (
                <div
                  className={cn(
                    "grid gap-5",
                    standardItems.length > 1 && "md:grid-cols-2 xl:grid-cols-3",
                  )}
                >
                  {standardItems.map((item) => (
                    <ResearchCard
                      isSelected={selectedSlug === item.slug}
                      item={item}
                      key={item.slug}
                      onInspect={inspectResearch}
                      onSignal={setSignal}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            {selectedItem ? (
              <ResearchDossier
                item={selectedItem}
                onClose={() => {
                  setSelectedSlug(null);
                  setActiveSignalSlug(null);
                  window.requestAnimationFrame(() => lastSelectedButtonRef.current?.focus());
                }}
              />
            ) : null}

            {pageCount > 1 ? (
              <nav
                aria-label="Research archive pagination"
                className="research-pagination mt-2 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5"
              >
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">
                  Archive page {String(safePage).padStart(2, "0")} /{" "}
                  {String(pageCount).padStart(2, "0")}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    className="research-page-button"
                    data-cursor="NAVIGATE"
                    disabled={safePage === 1}
                    onClick={() => setArchivePage(safePage - 1)}
                    type="button"
                  >
                    Prev
                  </button>
                  {Array.from({ length: pageCount }).map((_, index) => (
                    <button
                      aria-current={safePage === index + 1 ? "page" : undefined}
                      className="research-page-button research-page-button--number"
                      data-cursor="NAVIGATE"
                      key={index}
                      onClick={() => setArchivePage(index + 1)}
                      type="button"
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    className="research-page-button"
                    data-cursor="NAVIGATE"
                    disabled={safePage === pageCount}
                    onClick={() => setArchivePage(safePage + 1)}
                    type="button"
                  >
                    Next
                  </button>
                </div>
              </nav>
            ) : null}
          </>
        ) : (
          <div className="rounded-panel border border-line bg-panel-solid/90 p-8 text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
              No Research Signals Detected
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted">
              No public research entry is connected to this taxonomy channel yet.
            </p>
            <button
              className="mt-5 inline-flex min-h-10 items-center rounded-control border border-cyan/55 bg-cyan/10 px-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-cyan transition duration-200 hover:bg-cyan hover:text-bg-void focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
              data-cursor="FILTER"
              onClick={() => setArea("all")}
              type="button"
            >
              Restore All Research Areas
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
