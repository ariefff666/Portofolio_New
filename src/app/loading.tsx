import { LoadingSkeleton } from "@/components/ui";

export default function Loading() {
  return (
    <main
      aria-busy="true"
      className="orbital-container grid min-h-dvh place-items-center py-16"
      id="main-content"
    >
      <div className="w-full max-w-xl">
        <p className="mb-4 font-mono text-sm uppercase tracking-[0.2em] text-cyan">
          Loading mission console
        </p>
        <LoadingSkeleton lines={5} />
      </div>
    </main>
  );
}
