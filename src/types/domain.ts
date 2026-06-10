export type ContentStatus = "draf" | "terbit" | "arsip";

export type CommentStatus =
  | "menunggu"
  | "terbit"
  | "tolak"
  | "sembunyi"
  | "spam";

export type TransmissionStatus =
  | "baru"
  | "dibaca"
  | "dibalas"
  | "arsip"
  | "spam";

export type ResearchType =
  | "eksperimen"
  | "catatan"
  | "dataset"
  | "evaluasi-model"
  | "metodologi"
  | "milestone";

export type PublicationStage =
  | "terbit"
  | "preprint"
  | "ditinjau"
  | "berjalan"
  | "draf"
  | "catatan-baca";

export type NavigationAnchor =
  | "about"
  | "research"
  | "projects"
  | "skills"
  | "publications"
  | "experience"
  | "contact"
  | "comments";
