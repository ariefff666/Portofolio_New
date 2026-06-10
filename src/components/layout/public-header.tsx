import { MobileMenu } from "./mobile-menu.client";
import { publicNavItems } from "./site-navigation";

type PublicHeaderProps = {
  cvHref?: null | string;
};

export function PublicHeader({ cvHref }: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg-void/86 backdrop-blur-md">
      <div className="orbital-container flex min-h-[72px] items-center justify-between gap-4">
        <a
          aria-label="MAP // Mission Console home"
          className="group flex min-h-11 items-center gap-3 rounded-control pr-2 focus-visible:shadow-[var(--focus-ring)]"
          href="#home"
        >
          <span className="grid h-10 w-12 place-items-center rounded-control border border-line bg-panel-solid font-mono text-base font-bold tracking-normal text-cyan transition duration-200 group-hover:border-cyan motion-reduce:transition-none">
            MAP
          </span>
          <span className="hidden font-mono text-xs uppercase tracking-[0.18em] text-muted sm:inline">
            Mission Console
          </span>
        </a>

        <nav aria-label="Public navigation" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {publicNavItems.map((item) => (
              <li key={item.href}>
                <a
                  className="inline-flex min-h-11 items-center rounded-control px-3 font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted transition duration-200 hover:bg-bg-navy hover:text-cyan focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {cvHref ? (
            <a
              className="hidden min-h-11 items-center justify-center rounded-control border border-cyan bg-cyan px-4 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-bg-void transition duration-200 hover:bg-text focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none sm:inline-flex"
              href={cvHref}
            >
              Download CV
            </a>
          ) : null}
          <MobileMenu cvHref={cvHref} />
        </div>
      </div>
    </header>
  );
}
