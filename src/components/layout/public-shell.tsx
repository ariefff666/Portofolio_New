import type { ReactNode } from "react";
import { PublicFooter } from "./public-footer";
import { PublicHeader } from "./public-header";

type FooterSocialLink = {
  href: string;
  label: string;
};

type PublicShellProps = {
  children: ReactNode;
  builtWith?: string;
  copyright?: string;
  cvHref?: null | string;
  footerTagline?: string;
  socialLinks?: FooterSocialLink[];
};

export function PublicShell({
  builtWith,
  children,
  copyright,
  cvHref,
  footerTagline,
  socialLinks,
}: PublicShellProps) {
  return (
    <div className="min-h-dvh">
      <PublicHeader cvHref={cvHref} />
      {children}
      <PublicFooter
        builtWith={builtWith}
        copyright={copyright}
        footerTagline={footerTagline}
        socialLinks={socialLinks}
      />
    </div>
  );
}
