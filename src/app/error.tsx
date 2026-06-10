"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-dvh place-items-center px-5">
      <section className="w-full max-w-lg rounded-xl border border-line bg-panel-solid p-6">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-red">
          System fault
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-text">
          Something went wrong.
        </h1>
        <p className="mt-3 text-base leading-7 text-muted">
          The route failed to render. Try the recovery action below.
        </p>
        <button
          className="mt-6 min-h-11 rounded-lg bg-cyan px-5 py-2 font-mono text-sm font-semibold uppercase tracking-[0.12em] text-bg-void"
          onClick={reset}
          type="button"
        >
          Retry
        </button>
      </section>
    </main>
  );
}
