# Asset Directory Guide

Folder ini menyimpan asset manual untuk portofolio. Implementasi harus selalu mengambil
path dari data konten atau Supabase. Jika file belum tersedia, UI harus memakai fallback
visual sesuai design system.

## Struktur

| Folder | Isi | Status saat ini |
| --- | --- | --- |
| `foto-profil/` | Foto profil final | `Arief.jpeg` tersedia |
| `cv/` | CV PDF final | belum tersedia |
| `cover-riset/` | Cover riset atau poster riset | belum tersedia |
| `screenshot-proyek/` | Cover dan screenshot proyek | belum tersedia |
| `logo-organisasi/` | Logo organisasi | belum tersedia |
| `visual/` | Hero poster, 3D fallback, visual dekoratif | belum tersedia |
| `og/` | Open Graph dan social preview image | belum tersedia |
| `website-ui/` | Referensi visual UI atau hasil desain | opsional |

## Nama File Target

```text
foto-profil/Arief.jpeg
cv/cv-muhammad-arief-pratama.pdf
visual/hero-data-core-poster.webp
og/portfolio-og-image.webp
og/portfolio-card-image.webp
cover-riset/rfdetr-pneumonia-domain-adaptation.webp
cover-riset/idspider-text-to-sql.webp
cover-riset/text-to-emotion-exploration.webp
screenshot-proyek/informatics-department-system/cover.webp
screenshot-proyek/neurossistant/cover.webp
screenshot-proyek/habivault/cover.webp
screenshot-proyek/srifoton-2025/cover.webp
screenshot-proyek/hmif-2024/cover.webp
screenshot-proyek/mywatchlist/cover.webp
screenshot-proyek/feel-da-beats/cover.webp
screenshot-proyek/ryunify/cover.webp
logo-organisasi/hmif-unsri.webp
logo-organisasi/gdg-on-campus-unsri.webp
logo-organisasi/airlab-unsri.webp
logo-organisasi/informatika-unsri.webp
```

## Fallback Implementasi

- Missing profile photo: gunakan neutral profile console frame.
- Missing CV: sembunyikan tombol `Download CV`.
- Missing research cover: gunakan research-area console card.
- Missing project screenshot: gunakan fallback frame sesuai kategori proyek.
- Missing organization logo: gunakan monogram atau line icon.
- Missing hero poster: gunakan DOM-only holographic data core.
- Missing OG image: generate social image sederhana dari metadata.

Jangan tampilkan teks seperti `PROFILE IMAGE`, `PLACEHOLDER`, atau bracketed metric
pada UI publik.
