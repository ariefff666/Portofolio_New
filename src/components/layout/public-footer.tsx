import { footerQuickLinks } from "./site-navigation";

type FooterSocialLink = {
  href: string;
  label: string;
};

type PublicFooterProps = {
  builtWith?: string;
  copyright?: string;
  footerTagline?: string;
  socialLinks?: FooterSocialLink[];
};

export function PublicFooter({
  builtWith,
  copyright,
  footerTagline,
  socialLinks = [],
}: PublicFooterProps) {
  return (
    <footer className="border-t border-line bg-bg-void/80">
      <div className="orbital-container grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="max-w-xl">
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
            MAP // Mission Console
          </p>
          <p className="mt-3 text-base leading-7 text-muted">
            {footerTagline ||
              "Public portfolio shell for research, engineering work, experience, contact, and moderated comments."}
          </p>
          {socialLinks.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Social links">
              {socialLinks.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <a
                    className="inline-flex min-h-9 items-center rounded-control border border-line bg-bg-navy/70 px-3 font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted transition duration-200 hover:border-cyan hover:text-cyan focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
                    href={link.href}
                    rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          {builtWith || copyright ? (
            <div className="mt-5 grid gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted">
              {builtWith ? <p>{builtWith}</p> : null}
              {copyright ? <p>{copyright}</p> : null}
            </div>
          ) : null}
        </div>

        <nav aria-label="Footer quick links">
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {footerQuickLinks.map((item) => (
              <li key={item.href}>
                <a
                  className="inline-flex min-h-9 items-center rounded-control px-2 font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted transition duration-200 hover:bg-bg-navy hover:text-cyan focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
