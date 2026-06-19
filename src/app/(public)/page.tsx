import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PublicShell, SectionShell } from "@/components/layout";
import {
  ConsolePanel,
  DataChip,
  EmptyState,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  TextArea,
  TextField,
} from "@/components/ui";
import { HolographicPlanetCore } from "@/components/visual/holographic-planet-core.client";
import { MissionTabs } from "@/components/sections/mission-tabs.client";
import { ProfileSignalCard } from "@/components/sections/profile-signal-card.client";
import { ResearchObservatory } from "@/components/sections/research-observatory.client";
import { SkillMatrixCard } from "@/components/sections/skill-matrix-card.client";
import { cn } from "@/lib/utils";
import {
  getPortfolioContent,
  type ExperiencePreview,
  type OrganizationPreview,
  type ProjectPreview,
  type ResearchArea,
  type ResearchPreview,
  type SkillGroup,
  type SocialLink,
} from "@/lib/repository/content";

export const metadata: Metadata = {
  title: {
    absolute: "MAP // Mission Console",
  },
  description:
    "Muhammad Arief Pratama portfolio for research, engineering projects, skills, experience, contact, and moderated comments.",
};

type AnchorButtonProps = {
  children: ReactNode;
  className?: string;
  href: string;
  variant?: "primary" | "secondary";
};

function AnchorButton({
  children,
  className,
  href,
  variant = "primary",
}: AnchorButtonProps) {
  const classes =
    "inline-flex min-h-11 items-center justify-center rounded-control px-5 py-2.5 font-mono text-sm font-semibold uppercase tracking-[0.12em] transition duration-200 focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none";

  return (
    <a
      className={cn(
        classes,
        variant === "primary"
          ? "border border-cyan bg-cyan text-bg-void hover:bg-text"
          : "border border-line-strong bg-bg-navy/60 text-cyan hover:border-cyan hover:bg-cyan/10",
        className,
      )}
      href={href}
    >
      {children}
    </a>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="border-l border-line pl-5">
      <p className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-cyan">
        {children}
      </p>
    </div>
  );
}

function SocialGlyph({ label }: { label: SocialLink["label"] }) {
  if (label === "GitHub") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.9-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.31 9.31 0 0 1 12 6.93c.85 0 1.71.12 2.51.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.05 10.05 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
      </svg>
    );
  }

  if (label === "LinkedIn") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M5.37 3.5a2.37 2.37 0 1 1 0 4.74 2.37 2.37 0 0 1 0-4.74ZM3.38 9.79h3.98V20.5H3.38V9.79Zm6.1 0h3.82v1.46h.05c.53-.95 1.84-1.77 3.51-1.77 3.78 0 4.76 2.23 4.76 5.65v5.37h-3.98v-4.76c0-1.25-.05-2.85-1.91-2.85-1.92 0-2.28 1.37-2.28 2.76v4.85H9.48V9.79Z" />
      </svg>
    );
  }

  if (label === "Instagram") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <rect height="16" rx="5" stroke="currentColor" strokeWidth="2" width="16" x="4" y="4" />
        <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="2" />
        <circle cx="16.8" cy="7.2" fill="currentColor" r="1.1" />
      </svg>
    );
  }

  return <span aria-hidden="true" className="font-mono text-sm">@</span>;
}

function SocialIconLink({ href, label }: SocialLink) {
  return (
    <a
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-control border border-line bg-bg-navy/70 font-mono text-xs font-semibold uppercase tracking-normal text-muted transition duration-200 hover:border-cyan hover:text-cyan focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
      href={href}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      target={href.startsWith("http") ? "_blank" : undefined}
    >
      <SocialGlyph label={label} />
    </a>
  );
}

function VisualFallback({
  className,
  label,
}: {
  className?: string;
  label: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative isolate min-h-56 overflow-hidden rounded-panel border border-line bg-bg-navy/70",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(85,230,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(85,230,255,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan/45 bg-cyan/10 shadow-[0_0_56px_rgba(85,230,255,0.14)]" />
      <div className="absolute left-[18%] top-[24%] h-3 w-3 rounded-full bg-cyan" />
      <div className="absolute right-[20%] top-[30%] h-2 w-2 rounded-full bg-success" />
      <div className="absolute bottom-[24%] left-[28%] h-2.5 w-2.5 rounded-full bg-blue" />
      <div className="absolute bottom-[22%] right-[24%] h-3 w-3 rounded-full bg-warning" />
      <div className="absolute inset-x-8 top-1/2 border-t border-cyan/30" />
      <div className="absolute bottom-4 left-4 rounded-chip border border-line bg-bg-void/70 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.16em] text-muted">
        {label}
      </div>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="h-28 sm:h-48 md:h-[17rem] lg:h-[min(44svh,27rem)] lg:min-h-[22rem]">
      <HolographicPlanetCore />
    </div>
  );
}

function HeroSection({
  profile,
  socialLinks,
}: {
  profile: Awaited<ReturnType<typeof getPortfolioContent>>["profile"];
  socialLinks: SocialLink[];
}) {
  const heroSocials = socialLinks.filter((link) => link.label !== "Email");
  const positioning = [profile.location, profile.program, profile.university].filter(Boolean);

  return (
    <SectionShell
      className="flex min-h-[calc(100svh-73px)] items-center border-t-0 py-4 sm:py-5 lg:py-8"
      id="home"
    >
      <div className="orbital-container">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_17rem] md:items-center lg:grid-cols-[minmax(0,0.98fr)_minmax(19rem,25rem)] xl:gap-8">
          <div className="max-w-3xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <StatusBadge>{profile.availability || "Availability pending"}</StatusBadge>
              <DataChip className="hidden sm:inline-flex" variant="blue">
                {profile.role || "Role pending"}
              </DataChip>
            </div>
            <h1 className="max-w-3xl text-[clamp(2.15rem,8vw,4.65rem)] font-semibold leading-[0.98] tracking-normal text-text lg:text-[clamp(3.4rem,5.6vw,4.85rem)]">
              {profile.name || "Portfolio console"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base sm:leading-7 lg:text-lg">
              {profile.heroDescription ||
                "Portfolio for research experiments, engineering projects, and practical intelligent systems."}
            </p>
            {positioning.length > 0 ? (
              <p className="mt-3 hidden max-w-2xl font-mono text-xs uppercase leading-5 tracking-[0.16em] text-muted sm:block">
                {positioning.join(" // ")}
              </p>
            ) : null}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <AnchorButton className="col-span-2 sm:col-span-1" href="#projects">
                View Projects
              </AnchorButton>
              <AnchorButton href="#research" variant="secondary">
                Explore Research
              </AnchorButton>
              <AnchorButton href="#contact" variant="secondary">
                Contact Me
              </AnchorButton>
            </div>
            {heroSocials.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-3" aria-label="Profile links">
                {heroSocials.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <SocialIconLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <HeroVisual />
        </div>
      </div>
    </SectionShell>
  );
}

function MissionControlSection({
  profile,
  organizations,
  skills,
}: {
  organizations: OrganizationPreview[];
  profile: Awaited<ReturnType<typeof getPortfolioContent>>["profile"];
  skills: SkillGroup[];
}) {
  const preferredStack = [
    "Next.js",
    "Laravel",
    "Flutter",
    "Python",
    "PyTorch",
    "React",
    "TypeScript",
    "Git",
    "Github",
    "Figma",
    "Firebase",
    "Supabase",
  ];
  const availableSkills = skills.flatMap((group) => group.skills.map((skill) => skill.name));
  const stackItems = preferredStack
    .filter((item) => availableSkills.includes(item))
    .concat(availableSkills.filter((item) => !preferredStack.includes(item)))
    .slice(0, 10);

  return (
    <SectionShell id="about">
      <div className="orbital-container">
        <SectionLabel>Mission Control</SectionLabel>

        <div className="mt-8 grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start xl:grid-cols-[24rem_minmax(0,1fr)]">
          <ProfileSignalCard
            availability={profile.availability}
            focusItems={profile.currentFocus}
            hasPhoto={Boolean(profile.profilePhotoPath)}
            location={profile.location}
            name={profile.name}
            program={profile.program}
            role={profile.role}
            stackItems={stackItems}
            university={profile.university}
          />
          <div className="grid gap-6 lg:h-[60.5rem] lg:grid-rows-[35.5rem_23.5rem]">
            <MissionTabs
              communitySummary={profile.communitySummary}
              currentFocus={profile.currentFocus}
              missionObjective={profile.missionObjective}
              organizations={organizations}
              personalMission={profile.personalMission}
              researchDirection={profile.shortProfile}
            />
            <SkillMatrixCard groups={skills} />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function ResearchPreviewSection({
  areas,
  research,
}: {
  areas: ResearchArea[];
  research: ResearchPreview[];
}) {
  return (
    <SectionShell id="research">
      <div className="orbital-container">
        <SectionLabel>Research Observatory</SectionLabel>
        <div className="mt-8">
          <ResearchObservatory areas={areas} research={research} />
        </div>
      </div>
    </SectionShell>
  );
}

function ProjectLinks({ project }: { project: ProjectPreview }) {
  if (!project.demoHref && !project.repositoryHref && !project.repositoryLabel) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {project.demoHref ? (
        <a
          className="inline-flex min-h-9 items-center rounded-control border border-cyan/55 px-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-cyan transition duration-200 hover:bg-cyan/10 focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
          href={project.demoHref}
          rel="noreferrer"
          target="_blank"
        >
          Demo
        </a>
      ) : null}
      {project.repositoryHref ? (
        <a
          className="inline-flex min-h-9 items-center rounded-control border border-line px-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-muted transition duration-200 hover:border-cyan hover:text-cyan focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
          href={project.repositoryHref}
          rel="noreferrer"
          target="_blank"
        >
          Repository
        </a>
      ) : project.repositoryLabel ? (
        <span className="inline-flex min-h-9 items-center rounded-control border border-line bg-bg-navy/65 px-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          {project.repositoryLabel}
        </span>
      ) : null}
    </div>
  );
}

function ProjectPreviewSection({ projects }: { projects: ProjectPreview[] }) {
  return (
    <SectionShell id="projects">
      <div className="orbital-container">
        <SectionLabel>Project Preview</SectionLabel>

        {projects.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {projects.map((project) => (
              <ConsolePanel
                contentClassName="grid gap-4"
                eyebrow={project.category || "Project"}
                key={project.slug}
                title={project.title}
                variant="glass"
              >
                <VisualFallback className="min-h-44" label={project.category || "Project"} />
                <div className="flex flex-wrap gap-2">
                  <StatusBadge variant="success">
                    {project.year || "Year pending"}
                  </StatusBadge>
                  <StatusBadge variant="muted">{project.status}</StatusBadge>
                </div>
                <p className="text-sm leading-6 text-muted">{project.summary}</p>
                {project.role ? (
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-cyan">
                    Role // {project.role}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  {project.techStack.slice(0, 5).map((tech) => (
                    <DataChip key={`${project.slug}-${tech}`} variant="muted">
                      {tech}
                    </DataChip>
                  ))}
                </div>
                <ProjectLinks project={project} />
              </ConsolePanel>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState
              description="No published project preview is available from the local content source."
              eyebrow="Project bay"
              title="Project preview empty"
            />
          </div>
        )}
      </div>
    </SectionShell>
  );
}

function PublicationPreviewSection({
  publications,
}: {
  publications: Awaited<ReturnType<typeof getPortfolioContent>>["publications"];
}) {
  return (
    <SectionShell id="publications">
      <div className="orbital-container">
        <SectionLabel>Publication Preview</SectionLabel>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)]">
          <EmptyState
            description={
              publications.emptyState ||
              "Formal personal publication records are not published yet."
            }
            eyebrow="Formal publications"
            title="No publication record listed"
          />

          {publications.relatedContext ? (
            <ConsolePanel eyebrow="Related Context" title={publications.relatedContext.title}>
              <div className="flex flex-wrap gap-2">
                <StatusBadge variant="info">{publications.relatedContext.year}</StatusBadge>
                <StatusBadge variant="muted">{publications.relatedContext.venue}</StatusBadge>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted">
                {publications.relatedContext.note}
              </p>
              {publications.relatedContext.doi ? (
                <a
                  className="mt-5 inline-flex min-h-9 items-center rounded-control border border-line px-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-cyan transition duration-200 hover:border-cyan hover:bg-cyan/10 focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
                  href={publications.relatedContext.doi}
                  rel="noreferrer"
                  target="_blank"
                >
                  DOI
                </a>
              ) : null}
            </ConsolePanel>
          ) : (
            <EmptyState
              description="No related publication context is available from the local content source."
              eyebrow="Related context"
              title="Context list empty"
            />
          )}
        </div>
      </div>
    </SectionShell>
  );
}

function ExperiencePreviewSection({
  experience,
}: {
  experience: ExperiencePreview[];
}) {
  return (
    <SectionShell id="experience">
      <div className="orbital-container">
        <SectionLabel>Experience Preview</SectionLabel>

        {experience.length > 0 ? (
          <div className="mt-8 grid gap-4">
            {experience.map((item, index) => (
              <ConsolePanel
                contentClassName="grid gap-4 md:grid-cols-[10rem_minmax(0,1fr)]"
                eyebrow={item.type || "Experience"}
                key={item.slug}
                title={item.title}
              >
                <div>
                  <p className="font-mono text-sm font-semibold uppercase tracking-[0.16em] text-cyan">
                    0{index + 1}
                  </p>
                  <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                    {item.period}
                  </p>
                </div>
                <div>
                  <p className="text-base leading-7 text-muted">{item.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <DataChip key={`${item.slug}-${tag}`} variant="cyan">
                        {tag}
                      </DataChip>
                    ))}
                  </div>
                </div>
              </ConsolePanel>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState
              description="No featured experience record is available from the local content source."
              eyebrow="Flight record"
              title="Experience preview empty"
            />
          </div>
        )}
      </div>
    </SectionShell>
  );
}

function ContactTransmissionSection({
  email,
  socialLinks,
}: {
  email: null | string;
  socialLinks: SocialLink[];
}) {
  return (
    <SectionShell id="contact">
      <div className="orbital-container">
        <SectionLabel>Contact Transmission Preview</SectionLabel>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <ConsolePanel eyebrow="Direct Channel" title="Transmission Routes">
            {email ? (
              <a
                className="inline-flex min-h-11 items-center rounded-control border border-cyan bg-cyan px-4 font-mono text-sm font-semibold uppercase tracking-[0.12em] text-bg-void transition duration-200 hover:bg-text focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
                href={`mailto:${email}`}
              >
                {email}
              </a>
            ) : (
              <EmptyState
                description="A public email address has not been marked for display."
                eyebrow="Contact channel"
                title="Email unavailable"
              />
            )}
            {socialLinks.length > 0 ? (
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {socialLinks.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <a
                      className="flex min-h-11 items-center justify-between rounded-control border border-line bg-bg-navy/55 px-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-muted transition duration-200 hover:border-cyan hover:text-cyan focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
                      href={link.href}
                      rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                    >
                      <span>{link.label}</span>
                      <SocialGlyph label={link.label} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </ConsolePanel>

          <ConsolePanel eyebrow="Form Shell" title="Contact Console">
            <form className="grid gap-4">
              <TextField
                disabled
                label="Name"
                name="name"
                placeholder="Name"
              />
              <TextField
                disabled
                label="Email"
                name="email"
                placeholder="Reply address"
                type="email"
              />
              <TextArea
                disabled
                label="Message"
                name="message"
                placeholder="Message"
              />
              <PrimaryButton disabled type="submit">
                Send Transmission
              </PrimaryButton>
            </form>
          </ConsolePanel>
        </div>
      </div>
    </SectionShell>
  );
}

function CommentLogPreviewSection() {
  return (
    <SectionShell id="comments">
      <div className="orbital-container">
        <SectionLabel>Comment Log Preview</SectionLabel>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)]">
          <EmptyState
            description="No approved public comments are available from the current data source."
            eyebrow="Comment log"
            title="No entries yet"
          />
          <ConsolePanel eyebrow="Moderation Shell" title="Submission Console">
            <form className="grid gap-4">
              <TextField
                disabled
                label="Display name"
                name="comment-name"
                placeholder="Public display name"
              />
              <TextArea
                disabled
                label="Comment"
                name="comment"
                placeholder="Moderated comment submission"
              />
              <SecondaryButton disabled type="submit">
                Queue Comment
              </SecondaryButton>
            </form>
          </ConsolePanel>
        </div>
      </div>
    </SectionShell>
  );
}

export default async function HomePage() {
  const content = await getPortfolioContent();

  return (
    <PublicShell
      builtWith={content.settings.builtWith}
      copyright={content.settings.copyright}
      cvHref={content.links.cvHref}
      footerTagline={content.settings.footerTagline}
      socialLinks={content.links.socialLinks}
    >
      <main id="main-content">
        <HeroSection
          profile={content.profile}
          socialLinks={content.links.socialLinks}
        />
        <MissionControlSection
          organizations={content.organizations}
          profile={content.profile}
          skills={content.skills}
        />
        <ResearchPreviewSection
          areas={content.researchAreas}
          research={content.research}
        />
        <ProjectPreviewSection projects={content.projects} />
        <PublicationPreviewSection publications={content.publications} />
        <ExperiencePreviewSection experience={content.experience} />
        <ContactTransmissionSection
          email={content.links.email}
          socialLinks={content.links.socialLinks}
        />
        <CommentLogPreviewSection />
      </main>
    </PublicShell>
  );
}
