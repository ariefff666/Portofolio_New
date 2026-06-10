import Image from "next/image";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PublicShell, SectionShell } from "@/components/layout";
import {
  ConsolePanel,
  DataChip,
  EmptyState,
  PrimaryButton,
  SectionHeading,
  SecondaryButton,
  StatusBadge,
  TextArea,
  TextField,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  getPortfolioContent,
  type ExperiencePreview,
  type OrganizationPreview,
  type ProjectPreview,
  type ResearchPreview,
  type SkillGroup,
  type SocialLink,
} from "@/lib/repository/content";
import profilePhoto from "../../../assets/foto-profil/Arief.jpeg";

export const metadata: Metadata = {
  title: {
    absolute: "MAP // Mission Console",
  },
  description:
    "Muhammad Arief Pratama portfolio for research, engineering projects, skills, experience, contact, and moderated comments.",
};

type AnchorButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
};

function AnchorButton({ children, href, variant = "primary" }: AnchorButtonProps) {
  const classes =
    "inline-flex min-h-11 items-center justify-center rounded-control px-5 py-2.5 font-mono text-sm font-semibold uppercase tracking-[0.12em] transition duration-200 focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none";

  return (
    <a
      className={cn(
        classes,
        variant === "primary"
          ? "border border-cyan bg-cyan text-bg-void hover:bg-text"
          : "border border-line-strong bg-bg-navy/60 text-cyan hover:border-cyan hover:bg-cyan/10",
      )}
      href={href}
    >
      {children}
    </a>
  );
}

function socialMark(label: SocialLink["label"]) {
  const marks: Record<SocialLink["label"], string> = {
    Email: "@",
    GitHub: "GH",
    Instagram: "IG",
    LinkedIn: "IN",
  };

  return marks[label];
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
      <span aria-hidden="true">{socialMark(label)}</span>
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
    <ConsolePanel
      className="min-h-full"
      contentClassName="p-0"
      eyebrow="Orbital Console"
      title="Holographic Data Core"
      variant="glass"
    >
      <div className="relative isolate min-h-[30rem] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(85,230,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(85,230,255,0.08)_1px,transparent_1px)] bg-[size:34px_34px]" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan/40 bg-cyan/10 shadow-[0_0_80px_rgba(85,230,255,0.16)]" />
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue/45 bg-blue/10" />
        <div className="absolute left-[17%] top-[22%] h-4 w-4 rounded-full bg-cyan shadow-[0_0_24px_rgba(85,230,255,0.7)]" />
        <div className="absolute right-[18%] top-[30%] h-3 w-3 rounded-full bg-success shadow-[0_0_20px_rgba(99,230,190,0.6)]" />
        <div className="absolute bottom-[25%] left-[26%] h-3 w-3 rounded-full bg-blue shadow-[0_0_22px_rgba(47,123,255,0.62)]" />
        <div className="absolute bottom-[20%] right-[22%] h-4 w-4 rounded-full bg-warning shadow-[0_0_24px_rgba(255,209,102,0.5)]" />
        <div className="absolute left-[18%] right-[18%] top-[35%] border-t border-cyan/35" />
        <div className="absolute left-[25%] right-[24%] top-[64%] border-t border-blue/35" />
        <div className="absolute left-[28%] top-[24%] h-[52%] w-px rotate-[28deg] bg-cyan/25" />
        <div className="absolute right-[29%] top-[27%] h-[48%] w-px rotate-[-31deg] bg-success/25" />
        <div className="absolute bottom-5 left-5 rounded-chip border border-line bg-bg-void/70 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.16em] text-muted">
          Neural constellation
        </div>
      </div>
    </ConsolePanel>
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
    <SectionShell className="border-t-0 pt-14 sm:pt-20 lg:pt-24" id="home">
      <div className="orbital-container">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,30rem)] lg:items-center">
          <div className="max-w-4xl">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <StatusBadge>{profile.availability || "Availability pending"}</StatusBadge>
              <DataChip variant="blue">{profile.role || "Role pending"}</DataChip>
            </div>
            <p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-cyan">
              MAP // Mission Console
            </p>
            <h1 className="mt-4 max-w-4xl text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.98] tracking-normal text-text">
              {profile.name || "Portfolio console"}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted sm:text-xl">
              {profile.heroDescription ||
                "Portfolio for research experiments, engineering projects, and practical intelligent systems."}
            </p>
            {positioning.length > 0 ? (
              <p className="mt-5 max-w-2xl font-mono text-sm uppercase tracking-[0.16em] text-muted">
                {positioning.join(" // ")}
              </p>
            ) : null}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <AnchorButton href="#projects">View Projects</AnchorButton>
              <AnchorButton href="#research" variant="secondary">
                Explore Research
              </AnchorButton>
              <AnchorButton href="#contact" variant="secondary">
                Contact Me
              </AnchorButton>
            </div>
            {heroSocials.length > 0 ? (
              <ul className="mt-7 flex flex-wrap gap-3" aria-label="Profile links">
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
}: {
  organizations: OrganizationPreview[];
  profile: Awaited<ReturnType<typeof getPortfolioContent>>["profile"];
}) {
  return (
    <SectionShell id="about">
      <div className="orbital-container">
        <SectionHeading
          eyebrow="Mission Control"
          index="01"
          intro={profile.shortProfile}
          title="Research direction, engineering discipline, and community context."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[24rem_minmax(0,1fr)]">
          <ConsolePanel
            contentClassName="p-0"
            eyebrow="Operator"
            title="Profile Signal"
            variant="glass"
          >
            {profile.profilePhotoPath ? (
              <div className="relative aspect-[4/5] overflow-hidden bg-bg-navy">
                <Image
                  alt={profile.name ? `Portrait of ${profile.name}` : "Profile portrait"}
                  className="h-full w-full object-cover"
                  placeholder="blur"
                  sizes="(min-width: 1024px) 24rem, 100vw"
                  src={profilePhoto}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg-void/92 to-transparent p-5">
                  {profile.location ? (
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan">
                      {profile.location}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : (
              <VisualFallback className="aspect-[4/5]" label="Profile signal" />
            )}
          </ConsolePanel>

          <div className="grid gap-6">
            <ConsolePanel eyebrow="Mission Objective" title="Current Trajectory">
              <p className="text-base leading-7 text-muted">
                {profile.missionObjective ||
                  "Portfolio content is being prepared from verified local source files."}
              </p>
              {profile.currentFocus.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {profile.currentFocus.map((focus) => (
                    <DataChip key={focus} variant="cyan">
                      {focus}
                    </DataChip>
                  ))}
                </div>
              ) : null}
            </ConsolePanel>

            <div className="grid gap-6 md:grid-cols-2">
              <ConsolePanel eyebrow="Personal Mission" title="Operating Principle">
                <p className="text-sm leading-7 text-muted">
                  {profile.personalMission ||
                    "Personal mission copy has not been published yet."}
                </p>
              </ConsolePanel>
              <ConsolePanel eyebrow="Community" title="Active Nodes">
                {organizations.length > 0 ? (
                  <ul className="grid gap-3">
                    {organizations.slice(0, 4).map((organization) => (
                      <li
                        className="rounded-control border border-line bg-bg-navy/55 p-3"
                        key={organization.slug}
                      >
                        <p className="text-sm font-semibold text-text">
                          {organization.name}
                        </p>
                        {organization.type ? (
                          <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                            {organization.type}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    description="Community and organization data has not been published."
                    eyebrow="No active nodes"
                    title="Organization list empty"
                  />
                )}
              </ConsolePanel>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function ResearchPreviewSection({ research }: { research: ResearchPreview[] }) {
  return (
    <SectionShell id="research">
      <div className="orbital-container">
        <SectionHeading
          eyebrow="Research Preview"
          index="02"
          intro="Selected research records are rendered only from published local content, without invented benchmarks or outcome claims."
          title="Experiments moving from question to evidence."
        />

        {research.length > 0 ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {research.slice(0, 2).map((item) => (
              <ConsolePanel
                contentClassName="grid gap-5"
                eyebrow={item.type || "Research"}
                key={item.slug}
                title={item.title}
              >
                <VisualFallback label="Research signal" />
                <div className="flex flex-wrap gap-2">
                  <StatusBadge variant="info">{item.year || "Year pending"}</StatusBadge>
                  <StatusBadge variant="muted">{item.status}</StatusBadge>
                </div>
                <p className="text-base leading-7 text-muted">{item.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {[...item.areas, ...item.tools, ...item.tags].slice(0, 8).map((tag) => (
                    <DataChip key={`${item.slug}-${tag}`} variant="blue">
                      {tag}
                    </DataChip>
                  ))}
                </div>
              </ConsolePanel>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState
              description="No published research preview is available from the local content source."
              eyebrow="Research queue"
              title="Research preview empty"
            />
          </div>
        )}
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
        <SectionHeading
          eyebrow="Project Preview"
          index="03"
          intro="Engineering work is presented from local content with missing demo, repository, dataset, and stack fields left intentionally unresolved."
          title="Systems built for practical workflows."
        />

        {projects.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {projects.slice(0, 4).map((project) => (
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

function SkillPreviewSection({ skills }: { skills: SkillGroup[] }) {
  const publicSkillGroups = skills
    .map((group) => ({
      ...group,
      skills: group.skills.filter((skill) => !/admin/i.test(skill.name)),
    }))
    .filter((group) => group.skills.length > 0);

  return (
    <SectionShell id="skills">
      <div className="orbital-container">
        <SectionHeading
          eyebrow="Skill Preview"
          index="04"
          intro="Skill groups use descriptive levels from the source content. No numeric proficiency score is inferred."
          title="Capability matrix for research and product work."
        />

        {publicSkillGroups.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {publicSkillGroups.map((group) => (
              <ConsolePanel eyebrow="Capability Cluster" key={group.name} title={group.name}>
                <ul className="grid gap-3">
                  {group.skills.map((skill) => (
                    <li
                      className="flex min-h-12 items-center justify-between gap-4 rounded-control border border-line bg-bg-navy/55 px-3 py-2"
                      key={`${group.name}-${skill.name}`}
                    >
                      <span className="text-sm font-semibold text-text">{skill.name}</span>
                      {skill.level ? (
                        <span className="shrink-0 font-mono text-xs uppercase tracking-[0.12em] text-muted">
                          {skill.level}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </ConsolePanel>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState
              description="No active skill group is available from the local content source."
              eyebrow="Capability matrix"
              title="Skill preview empty"
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
        <SectionHeading
          eyebrow="Publication Preview"
          index="05"
          intro="Formal publication entries are shown only when the source file marks them as personal publication records."
          title="Publication pipeline with explicit attribution boundaries."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)]">
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
        <SectionHeading
          eyebrow="Experience Preview"
          index="06"
          intro="Featured roles and activities are listed from published experience content without invented rankings or impact metrics."
          title="Operational record across research, community, and mentoring."
        />

        {experience.length > 0 ? (
          <div className="mt-10 grid gap-4">
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
  profile,
  socialLinks,
}: {
  email: null | string;
  profile: Awaited<ReturnType<typeof getPortfolioContent>>["profile"];
  socialLinks: SocialLink[];
}) {
  return (
    <SectionShell id="contact">
      <div className="orbital-container">
        <SectionHeading
          eyebrow="Contact Transmission Preview"
          index="07"
          intro={profile.collaborationCopy || profile.availability}
          title="Open a verified communication channel."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
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
                      <span aria-hidden="true">{socialMark(link.label)}</span>
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
        <SectionHeading
          eyebrow="Comment Log Preview"
          index="08"
          intro="The comment surface is reserved for moderated entries and does not seed fabricated messages."
          title="Visitor log prepared for verified submissions."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)]">
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
        />
        <ResearchPreviewSection research={content.research} />
        <ProjectPreviewSection projects={content.projects} />
        <SkillPreviewSection skills={content.skills} />
        <PublicationPreviewSection publications={content.publications} />
        <ExperiencePreviewSection experience={content.experience} />
        <ContactTransmissionSection
          email={content.links.email}
          profile={content.profile}
          socialLinks={content.links.socialLinks}
        />
        <CommentLogPreviewSection />
      </main>
    </PublicShell>
  );
}
