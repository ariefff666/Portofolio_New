export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type StatusKonten = "draf" | "terbit" | "arsip";
export type StatusKomentar =
  | "menunggu"
  | "terbit"
  | "tolak"
  | "sembunyi"
  | "spam";
export type StatusTransmisi =
  | "baru"
  | "dibaca"
  | "dibalas"
  | "arsip"
  | "spam";
export type TipeRiset =
  | "eksperimen"
  | "catatan"
  | "dataset"
  | "evaluasi-model"
  | "metodologi"
  | "milestone";
export type TahapPublikasi =
  | "terbit"
  | "preprint"
  | "ditinjau"
  | "berjalan"
  | "draf"
  | "catatan-baca";

type TableDefinition<Row> = {
  Insert: Partial<Row>;
  Relationships: [];
  Row: Row;
  Update: Partial<Row>;
};

type TimestampColumns = {
  created_at: string;
  updated_at: string;
};

type NoArgs = Record<PropertyKey, never>;

export type Database = {
  private: {
    CompositeTypes: Record<string, never>;
    Enums: Record<string, never>;
    Functions: {
      is_admin: {
        Args: NoArgs;
        Returns: boolean;
      };
    };
    Tables: Record<string, never>;
    Views: Record<string, never>;
  };
  public: {
    CompositeTypes: Record<string, never>;
    Enums: {
      status_konten: StatusKonten;
      status_komentar: StatusKomentar;
      status_transmisi: StatusTransmisi;
      tahap_publikasi: TahapPublikasi;
      tipe_riset: TipeRiset;
    };
    Functions: {
      set_updated_at: {
        Args: NoArgs;
        Returns: unknown;
      };
    };
    Tables: {
      admin: TableDefinition<
        {
          id: string;
          nama: string;
          peran: "admin";
        } & TimestampColumns
      >;
      area_riset: TableDefinition<
        {
          aktif: boolean;
          deskripsi: string | null;
          id: string;
          nama: string;
          slug: string;
          urutan: number;
        } & TimestampColumns
      >;
      catatan_riset: TableDefinition<
        {
          id: string;
          judul: string;
          konten: string | null;
          published_at: string | null;
          ringkasan: string;
          riset_id: string | null;
          slug: string;
          status: StatusKonten;
          tanggal: string | null;
          tipe: string;
          unggulan: boolean;
          urutan: number;
        } & TimestampColumns
      >;
      gambar_proyek: TableDefinition<
        {
          aktif: boolean;
          alt_text: string;
          caption: string | null;
          id: string;
          media_id: string | null;
          proyek_id: string;
          url: string | null;
          urutan: number;
        } & TimestampColumns
      >;
      keahlian: TableDefinition<
        {
          aktif: boolean;
          deskripsi: string | null;
          id: string;
          ikon_url: string | null;
          kelompok_keahlian_id: string | null;
          nama: string;
          slug: string;
          tingkat: string | null;
          urutan: number;
          warna: string | null;
        } & TimestampColumns
      >;
      kategori_proyek: TableDefinition<
        {
          aktif: boolean;
          deskripsi: string | null;
          id: string;
          nama: string;
          slug: string;
          urutan: number;
        } & TimestampColumns
      >;
      kelompok_keahlian: TableDefinition<
        {
          aktif: boolean;
          deskripsi: string | null;
          id: string;
          nama: string;
          slug: string;
          urutan: number;
        } & TimestampColumns
      >;
      komentar: TableDefinition<
        {
          id: string;
          isi: string;
          nama: string;
          parent_id: string | null;
          pinned: boolean;
          status: StatusKomentar;
        } & TimestampColumns
      >;
      media: TableDefinition<
        {
          aktif: boolean;
          alt_text: string | null;
          bucket: string;
          id: string;
          metadata: Json;
          mime_type: string | null;
          path: string;
          ukuran_byte: number | null;
        } & TimestampColumns
      >;
      metrik: TableDefinition<
        {
          aktif: boolean;
          id: string;
          kode: string;
          label: string;
          nilai: string;
          unit: string | null;
          urutan: number;
        } & TimestampColumns
      >;
      moderasi_komentar: TableDefinition<
        {
          alasan: string | null;
          ditinjau_oleh: string | null;
          ditinjau_pada: string | null;
          email_hash: string | null;
          ip_hash: string | null;
          komentar_id: string;
          user_agent: string | null;
        } & TimestampColumns
      >;
      organisasi: TableDefinition<
        {
          aktif: boolean;
          deskripsi: string | null;
          id: string;
          lokasi: string | null;
          logo_media_id: string | null;
          nama: string;
          slug: string;
          tipe: string | null;
          url: string | null;
          urutan: number;
        } & TimestampColumns
      >;
      pengalaman: TableDefinition<
        {
          id: string;
          judul: string;
          konten: string | null;
          lokasi: string | null;
          metadata: Json;
          organisasi_id: string | null;
          published_at: string | null;
          ringkasan: string;
          slug: string;
          status: StatusKonten;
          tanggal_mulai: string | null;
          tanggal_selesai: string | null;
          tipe: string;
          unggulan: boolean;
          urutan: number;
        } & TimestampColumns
      >;
      pengalaman_tag: TableDefinition<
        {
          pengalaman_id: string;
          tag_id: string;
        } & TimestampColumns
      >;
      pengarang: TableDefinition<
        {
          id: string;
          nama: string;
          orcid: string | null;
          url: string | null;
        } & TimestampColumns
      >;
      pengaturan: TableDefinition<
        {
          kunci: string;
          nilai: Json;
          publik: boolean;
        } & TimestampColumns
      >;
      profil: TableDefinition<
        {
          availability: string | null;
          email_publik: string | null;
          headline: string;
          id: string;
          kode: "utama";
          lokasi: string | null;
          metadata: Json;
          misi: string | null;
          nama: string;
          program_studi: string | null;
          ringkasan: string;
          tagline: string | null;
          tautan: Json;
          universitas: string | null;
        } & TimestampColumns
      >;
      proyek: TableDefinition<
        {
          cover_media_id: string | null;
          dampak: string | null;
          demo_url: string | null;
          id: string;
          judul: string;
          kategori_proyek_id: string | null;
          konten: string | null;
          masalah: string | null;
          metadata: Json;
          peran: string | null;
          published_at: string | null;
          repository_url: string | null;
          ringkasan: string;
          slug: string;
          solusi: string | null;
          status: StatusKonten;
          tahun: number | null;
          tanggal_mulai: string | null;
          tanggal_selesai: string | null;
          unggulan: boolean;
          urutan: number;
        } & TimestampColumns
      >;
      proyek_keahlian: TableDefinition<
        {
          keahlian_id: string;
          proyek_id: string;
        } & TimestampColumns
      >;
      proyek_tag: TableDefinition<
        {
          proyek_id: string;
          tag_id: string;
        } & TimestampColumns
      >;
      publikasi: TableDefinition<
        {
          abstrak: string | null;
          arxiv_url: string | null;
          doi: string | null;
          id: string;
          judul: string;
          metadata: Json;
          published_at: string | null;
          slug: string;
          status: StatusKonten;
          tahap: TahapPublikasi;
          tanggal_terbit: string | null;
          target: string | null;
          tipe: string;
          unggulan: boolean;
          url: string | null;
          urutan: number;
          venue: string | null;
        } & TimestampColumns
      >;
      publikasi_pengarang: TableDefinition<
        {
          pengarang_id: string;
          publikasi_id: string;
          urutan: number;
        } & TimestampColumns
      >;
      publikasi_tag: TableDefinition<
        {
          publikasi_id: string;
          tag_id: string;
        } & TimestampColumns
      >;
      riset: TableDefinition<
        {
          cover_media_id: string | null;
          dataset: string | null;
          demo_url: string | null;
          hasil: string | null;
          id: string;
          judul: string;
          konten: string | null;
          metadata: Json;
          metode: string | null;
          metrik: Json;
          paper_url: string | null;
          published_at: string | null;
          repository_url: string | null;
          ringkasan: string;
          slug: string;
          status: StatusKonten;
          tanggal_mulai: string | null;
          tanggal_selesai: string | null;
          tipe: TipeRiset;
          tujuan: string | null;
          unggulan: boolean;
          urutan: number;
        } & TimestampColumns
      >;
      riset_area: TableDefinition<
        {
          area_riset_id: string;
          riset_id: string;
        } & TimestampColumns
      >;
      riset_keahlian: TableDefinition<
        {
          keahlian_id: string;
          riset_id: string;
        } & TimestampColumns
      >;
      riset_tag: TableDefinition<
        {
          riset_id: string;
          tag_id: string;
        } & TimestampColumns
      >;
      tag: TableDefinition<
        {
          aktif: boolean;
          id: string;
          jenis: string | null;
          nama: string;
          slug: string;
          warna: string | null;
        } & TimestampColumns
      >;
      transmisi: TableDefinition<
        {
          email_pengirim: string;
          id: string;
          ip_hash: string | null;
          nama_pengirim: string;
          pesan: string;
          status: StatusTransmisi;
          subjek: string;
          user_agent: string | null;
        } & TimestampColumns
      >;
    };
    Views: Record<string, never>;
  };
};
