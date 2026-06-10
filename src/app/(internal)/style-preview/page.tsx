import type { Metadata } from "next";
import {
  ConfirmDialog,
  ConsolePanel,
  DangerButton,
  DataChip,
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  PrimaryButton,
  SecondaryButton,
  SectionHeading,
  Select,
  StatusBadge,
  TextArea,
  TextField,
  Toast,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Style Preview",
  description: "Internal ORBITAL CONSOLE V2 design system preview.",
};

const colorTokens = [
  ["Void", "bg-bg-void", "#030712"],
  ["Navy", "bg-bg-navy", "#071426"],
  ["Panel", "bg-panel-solid", "#0A1A2D"],
  ["Cyan", "bg-cyan", "#55E6FF"],
  ["Blue", "bg-blue", "#2F7BFF"],
  ["Success", "bg-success", "#63E6BE"],
  ["Warning", "bg-warning", "#FFD166"],
  ["Red", "bg-red", "#FF5C6C"],
] as const;

export default function StylePreviewPage() {
  return (
    <main id="main-content" className="orbital-container orbital-section">
      <SectionHeading
        eyebrow="ORBITAL CONSOLE V2"
        headingLevel={1}
        intro="Internal QA surface for tokens, base components, accessibility states, and responsive behavior."
        title="Design System Preview"
      />

      <div className="mt-12 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <ConsolePanel
          eyebrow="Foundation"
          title="Tokens and Typography"
          variant="glass"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {colorTokens.map(([name, className, value]) => (
              <div className="rounded-control border border-line bg-bg-navy/70 p-3" key={name}>
                <div className={`h-16 rounded-control border border-line ${className}`} />
                <p className="mt-3 text-sm font-semibold text-text">{name}</p>
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan">
                Space Grotesk
              </p>
              <p className="mt-2 text-[clamp(2rem,5vw,4rem)] font-semibold leading-none text-text">
                Calm Technical UI
              </p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan">
                JetBrains Mono
              </p>
              <p className="mt-3 font-mono text-sm uppercase tracking-[0.14em] text-muted">
                TELEMETRY // STATUS // COORDINATE
              </p>
            </div>
          </div>
        </ConsolePanel>

        <ConsolePanel eyebrow="Status" title="Badges and Chips">
          <div className="flex flex-wrap gap-3">
            <StatusBadge>System Online</StatusBadge>
            <StatusBadge variant="success">Published</StatusBadge>
            <StatusBadge variant="info">Draft</StatusBadge>
            <StatusBadge variant="warning">Review</StatusBadge>
            <StatusBadge variant="error">Blocked</StatusBadge>
            <StatusBadge variant="muted">Disabled</StatusBadge>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <DataChip>Computer Vision</DataChip>
            <DataChip variant="blue">Next.js</DataChip>
            <DataChip variant="success">Accessible</DataChip>
            <DataChip variant="warning">Pending</DataChip>
            <DataChip variant="red">Error</DataChip>
            <DataChip variant="muted">Archive</DataChip>
          </div>
        </ConsolePanel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ConsolePanel eyebrow="Controls" title="Buttons">
          <div className="flex flex-wrap gap-3">
            <PrimaryButton>Primary</PrimaryButton>
            <SecondaryButton>Secondary</SecondaryButton>
            <DangerButton>Danger</DangerButton>
            <PrimaryButton disabled>Disabled</PrimaryButton>
          </div>
          <p className="mt-5 text-sm leading-6 text-muted">
            Buttons use 44px minimum target height, visible focus rings, hover states,
            disabled opacity, and reduced-motion transition guards.
          </p>
        </ConsolePanel>

        <ConsolePanel eyebrow="Forms" title="Input States">
          <div className="grid gap-4">
            <TextField
              helperText="Helper text remains visible below the control."
              label="Text Field"
              name="preview-text"
              placeholder="Console input"
            />
            <TextField
              error="Use a valid value before submitting."
              label="Error Field"
              name="preview-error"
              placeholder="Invalid state"
            />
            <Select
              defaultValue="all"
              helperText="Native select keeps keyboard and screen-reader behavior."
              label="Select"
              name="preview-select"
              options={[
                { label: "All categories", value: "all" },
                { label: "Research", value: "research" },
                { label: "Project", value: "project" },
              ]}
            />
            <TextArea
              label="Text Area"
              name="preview-message"
              placeholder="Longer plain-text input"
            />
            <TextField
              disabled
              label="Disabled Field"
              name="preview-disabled"
              placeholder="Unavailable"
            />
          </div>
        </ConsolePanel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <ConsolePanel eyebrow="Empty" title="Empty State">
          <EmptyState
            action={<SecondaryButton>Review Source</SecondaryButton>}
            description="Use neutral copy when content is not available yet."
            title="No public records"
          />
        </ConsolePanel>

        <ConsolePanel eyebrow="Loading" title="Skeleton">
          <LoadingSkeleton lines={5} />
        </ConsolePanel>

        <ConsolePanel eyebrow="Error" title="Error State">
          <ErrorState
            action={<SecondaryButton>Retry</SecondaryButton>}
            description="Errors use red only for the alert state and keep generic messaging."
          />
        </ConsolePanel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ConsolePanel eyebrow="Dialog" title="Confirm Dialog Shell">
          <ConfirmDialog
            description="This inline preview shows the shell style. Future flows can wire the same shell to real client-side interaction."
            inline
            open
            title="Confirm this operation?"
          />
        </ConsolePanel>

        <ConsolePanel eyebrow="Toast" title="Toast Shell">
          <div className="grid gap-3">
            <Toast
              description="The informational shell uses the standard panel surface."
              title="Transmission queued"
            />
            <Toast
              description="Success messaging uses green without becoming decorative."
              title="Saved"
              variant="success"
            />
            <Toast
              description="Error messaging uses red and alert semantics."
              title="Failed"
              variant="error"
            />
          </div>
        </ConsolePanel>
      </div>
    </main>
  );
}
