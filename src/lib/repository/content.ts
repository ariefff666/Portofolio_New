import "server-only";

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

export type SocialLink = {
  href: string;
  label: "Email" | "GitHub" | "Instagram" | "LinkedIn";
};

export type ProfileContent = {
  availability: string;
  collaborationCopy: string;
  communitySummary: string;
  currentFocus: string[];
  heroDescription: string;
  location: string;
  missionObjective: string;
  name: string;
  personalMission: string;
  program: string;
  profilePhotoPath: string | null;
  role: string;
  shortProfile: string;
  university: string;
};

export type LinkContent = {
  cvHref: string | null;
  email: string | null;
  socialLinks: SocialLink[];
};

export type ResearchPreview = {
  areas: string[];
  coverPath: string | null;
  isFeatured: boolean;
  slug: string;
  status: string;
  summary: string;
  tags: string[];
  title: string;
  tools: string[];
  type: string;
  year: string | null;
};

export type ProjectPreview = {
  category: string;
  coverPath: string | null;
  demoHref: string | null;
  isFeatured: boolean;
  problem: string | null;
  repositoryHref: string | null;
  repositoryLabel: string | null;
  role: string | null;
  slug: string;
  status: string;
  summary: string;
  tags: string[];
  techStack: string[];
  title: string;
  year: string | null;
};

export type SkillGroup = {
  name: string;
  skills: Array<{
    level: string | null;
    name: string;
  }>;
};

export type PublicationContent = {
  emptyState: string;
  relatedContext: {
    doi: string | null;
    note: string;
    title: string;
    venue: string;
    year: string;
  } | null;
};

export type ExperiencePreview = {
  organizationSlug: string | null;
  period: string;
  slug: string;
  summary: string;
  tags: string[];
  title: string;
  type: string;
};

export type OrganizationPreview = {
  description: string;
  name: string;
  slug: string;
  type: string | null;
  url: string | null;
};

export type SiteSettings = {
  builtWith: string;
  copyright: string;
  footerTagline: string;
};

export type PortfolioContent = {
  experience: ExperiencePreview[];
  links: LinkContent;
  organizations: OrganizationPreview[];
  profile: ProfileContent;
  projects: ProjectPreview[];
  publications: PublicationContent;
  research: ResearchPreview[];
  settings: SiteSettings;
  skills: SkillGroup[];
};

const contentRoot = path.join(process.cwd(), "content");

async function readContentFile(fileName: string) {
  try {
    return await readFile(path.join(contentRoot, fileName), "utf8");
  } catch {
    return "";
  }
}

function cleanValue(value: string | undefined) {
  if (!value) {
    return "";
  }

  const trimmed = value
    .trim()
    .replace(/^`|`$/g, "")
    .replace(/\\\|/g, "|");

  if (!trimmed || trimmed.includes("{{")) {
    return "";
  }

  return trimmed;
}

function isYes(value: string | undefined) {
  return cleanValue(value).toLowerCase() === "ya";
}

function splitCsv(value: string | undefined) {
  return cleanValue(value)
    .split(",")
    .map((item) => cleanValue(item))
    .filter(Boolean);
}

function publicHref(value: string | undefined) {
  const cleaned = cleanValue(value);

  if (/^https?:\/\//i.test(cleaned)) {
    return cleaned;
  }

  return null;
}

function publicEmail(value: string | undefined) {
  const cleaned = cleanValue(value);

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
    return cleaned;
  }

  return null;
}

function assetExists(relativePath: string | undefined) {
  const cleaned = cleanValue(relativePath);

  if (!cleaned) {
    return null;
  }

  if (cleaned.startsWith("assets/")) {
    const assetPath = path.join(process.cwd(), "assets", cleaned.replace(/^assets\//, ""));
    return existsSync(assetPath) ? cleaned : null;
  }

  if (cleaned.startsWith("public/")) {
    const assetPath = path.join(process.cwd(), "public", cleaned.replace(/^public\//, ""));
    return existsSync(assetPath) ? cleaned : null;
  }

  return null;
}

function publicAssetHref(relativePath: string | null) {
  if (!relativePath?.startsWith("public/")) {
    return null;
  }

  return `/${relativePath.replace(/^public\//, "")}`;
}

function parseMarkdownTableAfterHeading(markdown: string, heading: string) {
  const start = markdown.indexOf(heading);

  if (start === -1) {
    return [] as Array<Record<string, string>>;
  }

  const lines = markdown.slice(start + heading.length).split(/\r?\n/);
  const tableStart = lines.findIndex((line) => line.trim().startsWith("|"));

  if (tableStart === -1) {
    return [];
  }

  const collected: string[] = [];

  for (const line of lines.slice(tableStart)) {
    if (!line.trim().startsWith("|")) {
      break;
    }
    collected.push(line);
  }

  if (collected.length < 3) {
    return [];
  }

  const [headerLine, , ...rowLines] = collected;
  const headers = splitTableLine(headerLine);

  return rowLines
    .map((line) => splitTableLine(line))
    .filter((cells) => cells.length >= headers.length)
    .map((cells) =>
      Object.fromEntries(
        headers.map((header, index) => [cleanValue(header), cleanValue(cells[index])]),
      ),
    );
}

function splitTableLine(line: string) {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cleanValue(cell));
}

function parseTwoColumnRows(markdown: string) {
  const rows = new Map<string, string>();

  for (const line of markdown.split(/\r?\n/)) {
    if (!line.trim().startsWith("|")) {
      continue;
    }

    const cells = splitTableLine(line);

    if (
      cells.length < 2 ||
      !cells[0] ||
      cells[0] === "---" ||
      cells[0].toLowerCase() === "field" ||
      cells[0].toLowerCase() === "jenis"
    ) {
      continue;
    }

    rows.set(cells[0], cells[1]);
  }

  return rows;
}

function getRow(rows: Map<string, string>, ...keys: string[]) {
  for (const key of keys) {
    const value = rows.get(key);
    if (value) {
      return value;
    }
  }

  return "";
}

function splitItemBlocks(markdown: string, marker: RegExp) {
  const matches = [...markdown.matchAll(marker)];

  return matches.map((match, index) => {
    const start = match.index ?? 0;
    const end = matches[index + 1]?.index ?? markdown.length;
    return markdown.slice(start, end);
  });
}

function fencedTextAfter(markdown: string, heading: string) {
  const start = markdown.indexOf(heading);

  if (start === -1) {
    return "";
  }

  const match = markdown.slice(start).match(/```text\r?\n([\s\S]*?)\r?\n```/);
  return cleanValue(match?.[1]);
}

function bulletListAfter(markdown: string, heading: string) {
  const start = markdown.indexOf(heading);

  if (start === -1) {
    return [];
  }

  const nextHeading = markdown.slice(start + heading.length).search(/\n#{2,3} /);
  const block =
    nextHeading === -1
      ? markdown.slice(start + heading.length)
      : markdown.slice(start + heading.length, start + heading.length + nextHeading);

  return block
    .split(/\r?\n/)
    .filter((line) => line.trim().startsWith("- "))
    .map((line) => cleanValue(line.replace(/^- /, "")))
    .filter(Boolean);
}

function dateLabel(start: string | undefined, end: string | undefined) {
  const startDate = cleanValue(start);
  const endDate = cleanValue(end);

  if (startDate && endDate) {
    return `${startDate} - ${endDate}`;
  }

  return startDate || endDate || "Date unavailable";
}

async function getProfile(): Promise<ProfileContent> {
  const markdown = await readContentFile("profil.md");
  const rows = parseTwoColumnRows(markdown);

  return {
    availability: fencedTextAfter(markdown, "### Availability"),
    collaborationCopy: fencedTextAfter(markdown, "Keterangan:"),
    communitySummary: getRow(rows, "Ringkasan singkat"),
    currentFocus: bulletListAfter(markdown, "### Current Focus"),
    heroDescription: fencedTextAfter(markdown, "### Deskripsi Hero"),
    location: getRow(rows, "Lokasi"),
    missionObjective: fencedTextAfter(markdown, "### Mission Objective"),
    name: getRow(rows, "Nama lengkap"),
    personalMission: fencedTextAfter(markdown, "### Personal Mission"),
    profilePhotoPath: assetExists(getRow(rows, "Foto profil")),
    program: getRow(rows, "Program studi"),
    role: fencedTextAfter(markdown, "### Role"),
    shortProfile: fencedTextAfter(markdown, "### Short Profile"),
    university: getRow(rows, "Universitas"),
  };
}

async function getLinks(): Promise<LinkContent> {
  const markdown = await readContentFile("tautan.md");
  const rows = parseTwoColumnRows(markdown);
  const email = publicEmail(rows.get("Email publik"));
  const cvPath = assetExists(rows.get("Path lokal"));
  const cvHref = publicHref(rows.get("URL publik")) ?? publicAssetHref(cvPath);
  const socialLinks: SocialLink[] = [];

  if (email) {
    socialLinks.push({ href: `mailto:${email}`, label: "Email" });
  }

  for (const label of ["GitHub", "LinkedIn", "Instagram"] as const) {
    const href = publicHref(rows.get(label));
    if (href) {
      socialLinks.push({ href, label });
    }
  }

  return {
    cvHref,
    email,
    socialLinks,
  };
}

async function getResearch(): Promise<ResearchPreview[]> {
  const markdown = await readContentFile("riset.md");

  return splitItemBlocks(markdown, /^## Research Item \d+/gm)
    .map((block) => {
      const rows = parseTwoColumnRows(block);
      return {
        areas: splitCsv(rows.get("Research area")),
        coverPath: assetExists(rows.get("Cover image opsional")),
        isFeatured: isYes(rows.get("Unggulan di homepage?")),
        slug: getRow(rows, "Slug"),
        status: getRow(rows, "Status publikasi CMS"),
        summary: getRow(rows, "Ringkasan singkat"),
        tags: splitCsv(rows.get("Tags")),
        title: getRow(rows, "Judul"),
        tools: splitCsv(rows.get("Tools atau model")),
        type: getRow(rows, "Tipe"),
        year: getRow(rows, "Tahun") || null,
      };
    })
    .filter((item) => item.status === "terbit")
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
}

async function getProjects(): Promise<ProjectPreview[]> {
  const markdown = await readContentFile("proyek.md");

  return splitItemBlocks(markdown, /^## Project Item \d+/gm)
    .map((block) => {
      const rows = parseTwoColumnRows(block);
      const repositoryRaw = rows.get("Repository");
      const repositoryHref = publicHref(repositoryRaw);

      return {
        category: getRow(rows, "Kategori"),
        coverPath: assetExists(getRow(rows, "Cover image", "Cover image opsional")),
        demoHref: publicHref(rows.get("Demo")),
        isFeatured: isYes(rows.get("Unggulan di homepage?")),
        problem: getRow(rows, "Problem") || null,
        repositoryHref,
        repositoryLabel: repositoryHref ? "Repository" : cleanValue(repositoryRaw) || null,
        role: getRow(rows, "Role") || null,
        slug: getRow(rows, "Slug"),
        status: getRow(rows, "Status CMS"),
        summary: getRow(rows, "Ringkasan singkat"),
        tags: splitCsv(rows.get("Tags")),
        techStack: splitCsv(rows.get("Tech stack")),
        title: getRow(rows, "Judul"),
        year: getRow(rows, "Tahun") || null,
      };
    })
    .filter((item) => item.status === "terbit")
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
}

async function getSkills(): Promise<SkillGroup[]> {
  const markdown = await readContentFile("keahlian.md");
  const headings = [...markdown.matchAll(/^## (?!Catatan)(.+)$/gm)];

  return headings
    .map((match, index) => {
      const start = match.index ?? 0;
      const end = headings[index + 1]?.index ?? markdown.length;
      const block = markdown.slice(start, end);
      const rows = parseMarkdownTableAfterHeading(block, match[0]);

      return {
        name: cleanValue(match[1]),
        skills: rows
          .filter((row) => isYes(row["Aktif?"]))
          .sort((a, b) => Number(a.Urutan || 0) - Number(b.Urutan || 0))
          .map((row) => ({
            level: cleanValue(row.Tingkat) || null,
            name: cleanValue(row.Nama),
          }))
          .filter((skill) => skill.name),
      };
    })
    .filter((group) => group.skills.length > 0);
}

async function getPublications(): Promise<PublicationContent> {
  const markdown = await readContentFile("publikasi.md");
  const emptyState = fencedTextAfter(markdown, "## Empty State");
  const rows = parseTwoColumnRows(markdown);

  return {
    emptyState,
    relatedContext: rows.get("Judul")
      ? {
          doi: publicHref(rows.get("DOI")),
          note: getRow(rows, "Catatan"),
          title: getRow(rows, "Judul"),
          venue: getRow(rows, "Venue"),
          year: getRow(rows, "Tahun"),
        }
      : null,
  };
}

async function getExperience(): Promise<ExperiencePreview[]> {
  const markdown = await readContentFile("pengalaman.md");

  return splitItemBlocks(markdown, /^## Experience Item \d+/gm)
    .map((block) => {
      const rows = parseTwoColumnRows(block);

      return {
        organizationSlug: getRow(rows, "Organisasi terkait") || null,
        period: dateLabel(rows.get("Tanggal mulai"), rows.get("Tanggal selesai")),
        slug: getRow(rows, "Slug"),
        summary: getRow(rows, "Ringkasan singkat"),
        tags: splitCsv(rows.get("Tags")),
        title: getRow(rows, "Judul atau role"),
        type: getRow(rows, "Tipe"),
        isFeatured: isYes(rows.get("Unggulan di homepage?")),
        status: getRow(rows, "Status CMS"),
      };
    })
    .filter((item) => item.status === "terbit" && item.isFeatured)
    .slice(0, 4);
}

async function getOrganizations(): Promise<OrganizationPreview[]> {
  const markdown = await readContentFile("organisasi.md");

  return splitItemBlocks(markdown, /^## Organization Item \d+/gm)
    .map((block) => {
      const rows = parseTwoColumnRows(block);
      return {
        description: getRow(rows, "Deskripsi singkat"),
        name: getRow(rows, "Nama organisasi"),
        slug: getRow(rows, "Slug"),
        type: getRow(rows, "Tipe") || null,
        url: publicHref(rows.get("URL opsional")),
        active: isYes(rows.get("Aktif?")),
      };
    })
    .filter((item) => item.active && item.name);
}

async function getSettings(): Promise<SiteSettings> {
  const markdown = await readContentFile("pengaturan-situs.md");
  const rows = parseTwoColumnRows(markdown);

  return {
    builtWith: getRow(rows, "Built with note"),
    copyright: getRow(rows, "Copyright"),
    footerTagline: getRow(rows, "Tagline footer"),
  };
}

export async function getPortfolioContent(): Promise<PortfolioContent> {
  const [
    experience,
    links,
    organizations,
    profile,
    projects,
    publications,
    research,
    settings,
    skills,
  ] = await Promise.all([
    getExperience(),
    getLinks(),
    getOrganizations(),
    getProfile(),
    getProjects(),
    getPublications(),
    getResearch(),
    getSettings(),
    getSkills(),
  ]);

  return {
    experience,
    links,
    organizations,
    profile,
    projects,
    publications,
    research,
    settings,
    skills,
  };
}
