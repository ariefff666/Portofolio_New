"use client";

import { useState } from "react";

type Organization = {
  description: string;
  name: string;
  slug: string;
  type: string | null;
};

type MissionTabsProps = {
  communitySummary: string;
  currentFocus: string[];
  missionObjective: string;
  organizations: Organization[];
  personalMission: string;
  researchDirection: string;
};

const tabs = [
  { id: "trajectory", label: "Trajectory" },
  { id: "principles", label: "Principles" },
  { id: "research", label: "Research" },
  { id: "community", label: "Community" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function MissionTabs({
  communitySummary,
  currentFocus,
  missionObjective,
  organizations,
  personalMission,
  researchDirection,
}: MissionTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("trajectory");
  const [activeOrganization, setActiveOrganization] = useState<string | null>(null);

  const activeOrg =
    organizations.find((organization) => organization.slug === activeOrganization) ??
    organizations[0];

  return (
    <section className="mission-tabs flex flex-col overflow-hidden rounded-panel border border-line bg-panel-solid/90 lg:h-[35.5rem]">
      <header className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-cyan">
            Mission Console
          </p>
          <h2 className="mt-1 text-lg font-semibold text-text">Signal Matrix</h2>
        </div>
        <span className="rounded-chip border border-line bg-bg-navy/70 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">
          Interactive
        </span>
      </header>

      <div className="border-b border-line p-4">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4" role="tablist" aria-label="Mission data tabs">
          {tabs.map((tab) => (
            <button
              aria-selected={activeTab === tab.id}
              className="min-h-11 rounded-control border border-line bg-bg-navy/60 px-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-muted transition duration-200 hover:border-cyan hover:text-cyan focus-visible:shadow-[var(--focus-ring)] aria-selected:border-cyan aria-selected:bg-cyan/10 aria-selected:text-cyan motion-reduce:transition-none"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mission-tab-panel flex flex-1 flex-col p-5" role="tabpanel">
        {activeTab === "trajectory" ? (
          <div className="mission-tab-content grid gap-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
            <div className="rounded-control border border-line bg-bg-navy/45 p-4">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan">
                Current trajectory
              </p>
              <p className="mt-4 text-sm leading-7 text-muted">
                {missionObjective || "Mission objective has not been published yet."}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {["Research experiments", "Product systems", "Campus initiatives"].map(
                  (item) => (
                    <div
                      className="rounded-control border border-line bg-bg-void/35 p-3"
                      key={item}
                    >
                      <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">
                        {item}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="grid gap-3">
              <div className="rounded-control border border-line bg-bg-navy/55 p-4">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                  Focus packets
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {currentFocus.length > 0 ? (
                    currentFocus.map((focus) => (
                      <span
                        className="rounded-chip border border-cyan/35 bg-cyan/10 px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-cyan"
                        key={focus}
                      >
                        {focus}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted">Focus data pending.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "principles" ? (
          <div className="mission-tab-content grid gap-5 md:grid-cols-[minmax(0,1fr)_14rem]">
            <div className="rounded-control border border-line bg-bg-navy/45 p-4">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan">
                Operating principle
              </p>
              <p className="mt-4 text-sm leading-7 text-muted">
                {personalMission || "Personal mission has not been published yet."}
              </p>
              <p className="mt-4 text-sm leading-7 text-muted">
                The portfolio is structured around traceable source content, practical
                implementation, and interfaces that keep research context readable.
              </p>
            </div>
            <div className="grid content-start gap-3">
              {["Evidence first", "Useful systems", "Readable craft"].map((item) => (
                <div
                  className="rounded-control border border-line bg-bg-navy/55 p-4"
                  key={item}
                >
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-cyan">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === "research" ? (
          <div className="mission-tab-content grid gap-5">
            <div className="rounded-control border border-line bg-bg-navy/45 p-4">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan">
                Research direction
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
                {researchDirection || "Research direction copy has not been published yet."}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["Computer Vision", "Deep Learning", "NLP"].map((item) => (
                <div
                  className="min-h-28 rounded-control border border-line bg-bg-navy/55 p-4 transition duration-200 hover:border-cyan hover:bg-cyan/10 motion-reduce:transition-none"
                  key={item}
                >
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-text">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === "community" ? (
          <div className="mission-tab-content grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan">
                Community nodes
              </p>
              <p className="mt-4 text-base leading-8 text-muted">
                {communitySummary || "Community summary has not been published yet."}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {organizations.map((organization) => (
                  <button
                    className="rounded-control border border-line bg-bg-navy/55 p-3 text-left transition duration-200 hover:border-cyan hover:bg-cyan/10 focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
                    key={organization.slug}
                    onFocus={() => setActiveOrganization(organization.slug)}
                    onMouseEnter={() => setActiveOrganization(organization.slug)}
                    type="button"
                  >
                    <span className="block text-sm font-semibold text-text">
                      {organization.name}
                    </span>
                    {organization.type ? (
                      <span className="mt-2 block font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">
                        {organization.type}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-control border border-line bg-bg-navy/55 p-4">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-cyan">
                Active context
              </p>
              {activeOrg ? (
                <>
                  <h3 className="mt-4 text-lg font-semibold text-text">{activeOrg.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {activeOrg.description || "Description has not been published yet."}
                  </p>
                </>
              ) : (
                <p className="mt-4 text-sm text-muted">Organization data pending.</p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
