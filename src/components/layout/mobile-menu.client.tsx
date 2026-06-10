"use client";

import { useEffect, useId, useRef, useState } from "react";
import { publicNavItems } from "./site-navigation";

type MobileMenuProps = {
  cvHref?: null | string;
};

export function MobileMenu({ cvHref }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    firstLinkRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="lg:hidden">
      <button
        aria-controls={menuId}
        aria-expanded={isOpen}
        className="inline-flex min-h-11 items-center justify-center rounded-control border border-line bg-bg-navy/80 px-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-text transition duration-200 hover:border-cyan hover:text-cyan focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
        onClick={() => setIsOpen((current) => !current)}
        ref={buttonRef}
        type="button"
      >
        Menu
      </button>

      {isOpen ? (
        <div
          className="fixed inset-x-0 top-[73px] z-40 border-b border-line bg-bg-void/95 px-5 py-5 shadow-none backdrop-blur-md"
          id={menuId}
        >
          <nav aria-label="Mobile public navigation">
            <ul className="grid gap-2">
              {publicNavItems.map((item, index) => (
                <li key={item.href}>
                  <a
                    className="flex min-h-11 items-center rounded-control border border-transparent px-3 font-mono text-sm font-medium uppercase tracking-[0.14em] text-text transition duration-200 hover:border-line hover:bg-bg-navy hover:text-cyan focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
                    href={item.href}
                    onClick={closeMenu}
                    ref={index === 0 ? firstLinkRef : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {cvHref ? (
            <a
              className="mt-4 flex min-h-11 w-full items-center justify-center rounded-control border border-cyan bg-cyan px-4 font-mono text-sm font-semibold uppercase tracking-[0.12em] text-bg-void transition duration-200 hover:bg-text focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
              href={cvHref}
              onClick={closeMenu}
            >
              Download CV
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
