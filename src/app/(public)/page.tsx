const foundationItems = [
  ["Framework", "Next.js App Router"],
  ["Language", "React TypeScript"],
  ["Styling", "Tailwind CSS"],
  ["Data Layer", "Supabase-ready"],
] as const;

export default function HomePage() {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center px-5 py-16 sm:px-8 lg:px-12"
    >
      <section
        aria-labelledby="foundation-heading"
        className="rounded-xl border border-line bg-panel-solid/80 p-6 shadow-none sm:p-8 lg:p-10"
      >
        <p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-cyan">
          Foundation // Phase 00
        </p>
        <div className="mt-6 max-w-3xl">
          <h1
            id="foundation-heading"
            className="text-4xl font-semibold tracking-normal text-text sm:text-5xl"
          >
            MAP // Mission Console
          </h1>
          <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
            The application scaffold is ready for the portfolio public route,
            protected admin route structure, shared components, typed utilities, and
            future Supabase integration.
          </p>
        </div>

        <dl className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {foundationItems.map(([label, value]) => (
            <div
              className="rounded-lg border border-line bg-bg-navy/80 p-4"
              key={label}
            >
              <dt className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                {label}
              </dt>
              <dd className="mt-2 text-sm font-medium text-text">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
