"use client";

import { ErrorState } from "@/components/ui";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      className="orbital-container grid min-h-dvh place-items-center py-16"
      id="main-content"
    >
      <div className="w-full max-w-xl">
        <ErrorState
          action={
            <button
              className="min-h-11 rounded-control bg-cyan px-5 py-2 font-mono text-sm font-semibold uppercase tracking-[0.12em] text-bg-void transition duration-200 hover:bg-text focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
              onClick={reset}
              type="button"
            >
              Retry
            </button>
          }
          description="The route failed to render. Try the recovery action below."
          title="Something went wrong."
        />
      </div>
    </main>
  );
}
