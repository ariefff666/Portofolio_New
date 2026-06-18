"use client";

import { useMemo, useState } from "react";

type SkillGroup = {
  name: string;
  skills: Array<{
    level: string | null;
    name: string;
  }>;
};

type SkillMatrixCardProps = {
  groups: SkillGroup[];
};

const groupCopy: Record<string, string> = {
  Backend: "Server logic, API surfaces, authentication flow, and dashboard-oriented systems.",
  Database: "Relational data modeling, query work, and storage patterns used across product builds.",
  Frontend: "Interface implementation, responsive layout, component composition, and design-system work.",
  "Machine Learning": "Model experimentation, applied learning workflows, and intelligent system prototyping.",
  NLP: "Language-focused data work, text processing, and Indonesian NLP research context.",
  "Programming Languages": "Core languages used across research scripts, web systems, and mobile work.",
  Tools: "Development, collaboration, deployment, and reproducibility support tools.",
};

const itemsPerPage = 6;

function describeGroup(name: string) {
  return (
    groupCopy[name] ||
    "Capability group sourced from the local skill content file and kept descriptive."
  );
}

export function SkillMatrixCard({ groups }: SkillMatrixCardProps) {
  const visibleGroups = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          skills: group.skills.filter((skill) => !/admin/i.test(skill.name)),
        }))
        .filter((group) => group.skills.length > 0),
    [groups],
  );
  const [activeGroupName, setActiveGroupName] = useState(visibleGroups[0]?.name ?? "");
  const [page, setPage] = useState(0);
  const activeGroup =
    visibleGroups.find((group) => group.name === activeGroupName) ?? visibleGroups[0];
  const pageCount = activeGroup ? Math.ceil(activeGroup.skills.length / itemsPerPage) : 0;
  const visibleSkills = activeGroup
    ? activeGroup.skills.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage)
    : [];

  function goToPreviousPage() {
    setPage((current) => Math.max(0, current - 1));
  }

  function goToNextPage() {
    setPage((current) => Math.min(Math.max(0, pageCount - 1), current + 1));
  }

  return (
    <section
      className="skill-matrix-card flex scroll-mt-28 flex-col overflow-hidden rounded-panel border border-line bg-panel-solid/90 lg:h-[23.5rem]"
      id="skills"
    >
      <header className="flex min-h-12 flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div>
          <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-cyan">
            Skill Preview
          </p>
          <h2 className="mt-0.5 text-base font-semibold text-text">Capability Matrix</h2>
        </div>
        <span className="rounded-chip border border-line bg-bg-navy/70 px-2.5 py-0.5 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-muted">
          {visibleGroups.length || 0} clusters
        </span>
      </header>

      {activeGroup ? (
        <>
          <div className="skill-tab-rail border-b border-line p-2">
            <div
              aria-label="Skill groups"
              className="scrollbar-console flex gap-2 overflow-x-auto pb-1.5"
              role="tablist"
            >
              {visibleGroups.map((group) => (
                <button
                  aria-selected={activeGroup.name === group.name}
                  className="min-h-8 shrink-0 rounded-control border border-line bg-bg-navy/60 px-3 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-muted transition duration-200 hover:border-cyan hover:text-cyan focus-visible:shadow-[var(--focus-ring)] aria-selected:border-cyan aria-selected:bg-cyan/10 aria-selected:text-cyan motion-reduce:transition-none"
                  key={group.name}
                  onClick={() => {
                    setActiveGroupName(group.name);
                    setPage(0);
                  }}
                  role="tab"
                  type="button"
                >
                  {group.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-cyan">
                  Active cluster
                </p>
                <h3 className="mt-1 text-lg font-semibold leading-tight text-text">
                  {activeGroup.name}
                </h3>
              </div>
              <span className="rounded-chip border border-line bg-bg-void/60 px-2.5 py-1 font-mono text-[0.64rem] uppercase tracking-[0.12em] text-muted">
                {activeGroup.skills.length} skills
              </span>
            </div>
            <p className="sr-only">{describeGroup(activeGroup.name)}</p>

            <div className="mt-2 grid flex-1 content-start gap-2 sm:grid-cols-2">
              {visibleSkills.map((skill) => (
                <div
                  className="flex min-h-9 items-center justify-between gap-3 rounded-control border border-line bg-bg-navy/55 px-3 py-1.5 transition duration-200 hover:border-cyan/70 hover:bg-cyan/10 motion-reduce:transition-none"
                  key={`${activeGroup.name}-${skill.name}`}
                >
                  <span className="min-w-0 truncate text-sm font-semibold text-text">
                    {skill.name}
                  </span>
                  {skill.level ? (
                    <span className="shrink-0 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted">
                      {skill.level}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>

            {pageCount > 1 ? (
              <div
                className="mt-2 flex items-center justify-between gap-3 border-t border-line/70 pt-2"
                role="group"
                aria-label="Skill page controls"
              >
                <p className="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-muted">
                  Swipe or step cluster rows
                </p>
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Previous skill page"
                    className="grid h-8 w-8 place-items-center rounded-control border border-line bg-bg-navy/60 font-mono text-xs text-muted transition duration-200 hover:border-cyan hover:text-cyan focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                    disabled={page === 0}
                    onClick={goToPreviousPage}
                    type="button"
                  >
                    &lt;
                  </button>
                  <div className="flex gap-1" aria-hidden="true">
                    {Array.from({ length: pageCount }).map((_, index) => (
                      <span
                        className={`h-1.5 rounded-full transition-all duration-200 motion-reduce:transition-none ${
                          index === page ? "w-5 bg-cyan" : "w-1.5 bg-line-strong"
                        }`}
                        key={index}
                      />
                    ))}
                  </div>
                  <button
                    aria-label="Next skill page"
                    className="grid h-8 w-8 place-items-center rounded-control border border-line bg-bg-navy/60 font-mono text-xs text-muted transition duration-200 hover:border-cyan hover:text-cyan focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                    disabled={page >= pageCount - 1}
                    onClick={goToNextPage}
                    type="button"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <div className="grid flex-1 place-items-center p-5 text-center text-sm text-muted">
          Skill content is not available yet.
        </div>
      )}
    </section>
  );
}
