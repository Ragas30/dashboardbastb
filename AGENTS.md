<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


<!-- PRD -->
# Project Requirement Document (PRD)
## Defect Management Dashboard

**Version:** 1.0  
**Status:** Draft  
**Purpose:** Pencatatan dan monitoring defect secara sederhana, cepat, dan terstruktur.

---

## 1. Overview

### 1.1 Latar Belakang

Pencatatan defect saat ini membutuhkan proses manual sehingga data defect sulit dipantau secara terpusat. Dibutuhkan sebuah dashboard sederhana yang dapat digunakan untuk mencatat jumlah defect pada setiap unit/project serta memantau status penyelesaiannya.

Sistem tidak ditujukan sebagai sistem inspeksi defect yang kompleks. Fokus utama sistem adalah:

- Mencatat **total defect**
- Mengetahui defect berdasarkan **unit/project**
- Menentukan **PIC**
- Menentukan **target repair**
- Memantau **status defect**
- Melihat perkembangan defect melalui dashboard

---

## 2. Tujuan Sistem

Sistem bertujuan untuk:

1. Mempermudah pencatatan defect.
2. Mengurangi pencatatan manual.
3. Menyediakan dashboard monitoring defect.
4. Mengetahui jumlah defect secara keseluruhan.
5. Mengetahui defect yang masih Open.
6. Mengetahui defect yang sedang dikerjakan.
7. Mengetahui defect yang sudah selesai.
8. Memudahkan monitoring berdasarkan PIC, project/cluster, dan unit.

---

## 3. Scope Sistem

### 3.1 In Scope

Fitur yang termasuk dalam sistem:

- Dashboard
- Pencatatan defect
- Edit defect
- Hapus defect
- Detail data defect
- Master PIC
- Filter defect
- Monitoring status
- Target repair
- Rekap total defect

### 3.2 Out of Scope

Fitur berikut **tidak diperlukan**:

- Priority
- Category defect
- Detail item defect satu per satu
- Sistem approval
- Manajemen user kompleks
- Modul keuangan
- Modul inventory
- Modul procurement

---

## 4. User

Sistem dirancang untuk digunakan oleh **satu pengguna utama/admin** yang bertanggung jawab melakukan pencatatan dan monitoring defect.

Tidak diperlukan role management yang kompleks pada versi awal.

---

## 5. Struktur Menu

Sidebar sederhana:

```text
Dashboard

Defect
 ├── List Defect
 └── Tambah Defect

Master
 └── PIC
```

Tidak perlu terlalu banyak menu.

---

## 6. Dashboard

Dashboard merupakan halaman utama sistem.

### 6.1 Summary Card

Dashboard menampilkan:

```text
┌────────────────┐ ┌────────────────┐
│ TOTAL DEFECT   │ │ OPEN           │
│      128       │ │       42       │
└────────────────┘ └────────────────┘

┌────────────────┐ ┌────────────────┐
│ ON PROGRESS    │ │ COMPLETED      │
│       31       │ │       55       │
└────────────────┘ └────────────────┘
```

### Card

**Total Defect**  
Jumlah seluruh defect yang tercatat.

**Open**  
Jumlah defect dengan status Open.

**On Progress**  
Jumlah defect yang sedang dalam proses perbaikan.

**Completed**  
Jumlah defect yang sudah selesai.

---

## 7. Filter Dashboard

Dashboard menyediakan filter:

### Project / Cluster

Dropdown untuk memilih project atau cluster.

### Unit

Filter berdasarkan unit.

### PIC

Mengambil data dari Master PIC.

### Status

Pilihan:

- All
- Open
- On Progress
- Completed

### Tanggal

Filter berdasarkan tanggal pencatatan.

Filter dapat digunakan secara bersamaan.

Contoh:

```text
Project : Cluster A
Unit    : A-01
PIC     : Andi
Status  : On Progress
Tanggal : 01 - 07 Oktober 2026
```

---

## 8. List Defect

Halaman utama pencatatan defect.

| No | Project / Cluster | Unit | Total Defect | PIC | Status | Target Repair | Last Update | Action |
|---|---|---|---:|---|---|---|---|---|
| 1 | Cluster A | A-01 | 5 | Andi | On Progress | 10 Okt | 7 Okt | Detail |
| 2 | Cluster A | A-02 | 3 | Budi | Open | 11 Okt | 7 Okt | Detail |
| 3 | Cluster B | B-03 | 7 | Andi | Completed | 6 Okt | 6 Okt | Detail |

### Action

Action minimal:

- Detail
- Edit
- Delete

---

## 9. Tambah Defect

Form pencatatan defect:

```text
Tambah Defect

Project / Cluster
[ Pilih Project / Cluster ]

Unit
[ Pilih Unit ]

Tanggal
[ 07 Oktober 2026 ]

Total Defect
[ 5 ]

PIC
[ Pilih PIC ]

Target Repair
[ 10 Oktober 2026 ]

Status
[ Open ]

[ Batal ] [ Simpan ]
```

### 9.1 Field

| Field | Required | Type |
|---|---|---|
| Project / Cluster | Ya | Select/Text |
| Unit | Ya | Select/Text |
| Tanggal | Ya | Date |
| Total Defect | Ya | Number |
| PIC | Ya | Select |
| Target Repair | Ya | Date |
| Status | Ya | Select |

---

## 10. Status Defect

Sistem hanya menggunakan tiga status utama:

### Open

Defect sudah dicatat tetapi belum dikerjakan.

### On Progress

Defect sedang dalam proses perbaikan.

### Completed

Defect sudah selesai diperbaiki.

Flow:

```text
OPEN
  │
  ▼
ON PROGRESS
  │
  ▼
COMPLETED
```

Untuk versi awal tidak perlu status tambahan.

---

## 11. Master PIC

PIC tidak boleh diketik secara bebas pada form defect.

Data PIC berasal dari **Master PIC**.

### 11.1 List PIC

| No | Nama PIC | Status | Action |
|---|---|---|---|
| 1 | Andi | Active | Edit |
| 2 | Budi | Active | Edit |
| 3 | Candra | Active | Edit |

### 11.2 Tambah PIC

```text
Nama PIC
[........................]

Status
[ Active ▼ ]

[ Batal ] [ Simpan ]
```

Status PIC:

- Active
- Inactive

PIC dengan status **Inactive** tidak muncul pada pilihan PIC ketika membuat defect baru.

Namun data defect lama yang menggunakan PIC tersebut tetap tersimpan.

---

## 12. Detail Defect

Ketika user memilih **Detail**, sistem menampilkan:

```text
DEFECT #001

Project / Cluster
Cluster A

Unit
A-01

Tanggal
07 Oktober 2026

Total Defect
5

PIC
Andi

Status
On Progress

Target Repair
10 Oktober 2026

Last Update
07 Oktober 2026
```

Tersedia tombol:

```text
[ Edit ]
[ Update Status ]
```

---

## 13. Edit Defect

User dapat mengubah:

- Project / Cluster
- Unit
- Tanggal
- Total Defect
- PIC
- Target Repair
- Status

Setelah perubahan disimpan, sistem memperbarui:

**Last Update**

secara otomatis.

---

## 14. Business Rules

### BR-01 Total Defect

`Total Defect` harus berupa angka.

Nilai nol atau angka negatif tidak diperbolehkan jika data tersebut merepresentasikan defect yang tercatat.

Minimal:

```text
1
```

### BR-02 PIC

PIC harus berasal dari Master PIC.

Tidak diperbolehkan memasukkan PIC secara manual.

### BR-03 Inactive PIC

PIC dengan status Inactive tidak dapat dipilih untuk defect baru.

### BR-04 Status

Status hanya:

```text
Open
On Progress
Completed
```

### BR-05 Target Repair

Target repair harus berupa tanggal yang valid.

### BR-06 Last Update

Last Update otomatis menggunakan tanggal/waktu ketika data terakhir diubah.

### BR-07 Delete

Penghapusan defect harus menggunakan confirmation dialog.

Contoh:

> Apakah Anda yakin ingin menghapus data defect ini?

---

## 15. Dashboard Calculation

### Total Defect

Menjumlahkan seluruh nilai `total_defect`.

Contoh:

```text
Unit A-01 = 5
Unit A-02 = 3
Unit A-03 = 7

Total = 15
```

### Open

Menjumlahkan `total_defect` dari data dengan status:

```text
Open
```

### On Progress

Menjumlahkan `total_defect` dari data dengan status:

```text
On Progress
```

### Completed

Menjumlahkan `total_defect` dari data dengan status:

```text
Completed
```

Jadi card dashboard menunjukkan **jumlah defect**, bukan jumlah baris data.

---

## 16. Database

Minimal membutuhkan dua tabel utama.

### 16.1 `master_pics`

```text
master_pics
-----------
id
name
status
created_at
updated_at
```

### 16.2 `defects`

```text
defects
-------
id
project_cluster
unit
defect_date
total_defect
pic_id
target_repair
status
created_at
updated_at
```

### Relasi

```text
master_pics
     │
     │ 1
     │
     │ N
     ▼
  defects
```

Satu PIC dapat memiliki banyak defect.

---

## 17. UI/UX Requirement

Dashboard harus memiliki tampilan:

- Clean
- Modern
- Minimal
- Profesional
- Responsive
- Tidak terlalu banyak warna
- Tidak menggunakan grafik yang tidak diperlukan
- Fokus pada data

### Gaya visual

Gunakan:

- Background terang
- Card dengan border/shadow tipis
- Typography sederhana
- Badge status
- Spacing yang cukup
- Table yang mudah dibaca

### Status Badge

```text
OPEN
ON PROGRESS
COMPLETED
```

Gunakan warna berbeda hanya untuk membedakan status, bukan untuk dekorasi berlebihan.

---

## 18. Responsive

Dashboard harus dapat digunakan pada:

- Desktop
- Laptop
- Tablet
- Mobile

Pada mobile, tabel dapat menggunakan horizontal scrolling atau berubah menjadi card/list.

---

## 19. Search

List defect menyediakan pencarian berdasarkan:

- Project / Cluster
- Unit
- PIC

Contoh:

```text
[ 🔍 Search defect... ]
```

Pencarian dilakukan tanpa perlu reload halaman jika menggunakan AJAX/API.

---

## 20. Pagination

List defect menggunakan pagination.

Contoh:

```text
Showing 1–10 of 128

< 1 2 3 4 5 >
```

Default:

```text
10 data / page
```

---

## 21. Empty State

Jika belum ada data:

```text
Belum ada data defect.

[ + Tambah Defect ]
```

Jangan menampilkan tabel kosong tanpa informasi.

---

## 22. Error Handling

Jika terjadi error:

### Validation

```text
Total defect wajib diisi.
```

### Server Error

```text
Terjadi kesalahan pada sistem.
Silakan coba lagi.
```

### Delete Confirmation

```text
Data defect akan dihapus.
Apakah Anda yakin?
```

Error tidak boleh menampilkan stack trace atau informasi teknis kepada user.

---

## 23. Acceptance Criteria

### Dashboard

- [ ] Total defect dapat ditampilkan.
- [ ] Total Open dapat ditampilkan.
- [ ] Total On Progress dapat ditampilkan.
- [ ] Total Completed dapat ditampilkan.
- [ ] Filter dapat digunakan.
- [ ] Data dashboard berubah sesuai filter.

### Defect

- [ ] User dapat menambahkan defect.
- [ ] User dapat melihat list defect.
- [ ] User dapat melihat detail defect.
- [ ] User dapat mengedit defect.
- [ ] User dapat menghapus defect.
- [ ] Total defect hanya menerima angka.
- [ ] Status hanya terdiri dari tiga status.

### PIC

- [ ] User dapat menambah PIC.
- [ ] User dapat mengedit PIC.
- [ ] User dapat mengubah status PIC.
- [ ] PIC inactive tidak muncul pada form defect.
- [ ] PIC defect berasal dari master.

### Data

- [ ] Last Update otomatis berubah ketika data diperbarui.
- [ ] Relasi PIC dan defect tersimpan dengan benar.
- [ ] Data yang sudah Completed tetap tersimpan sebagai histori.

---

## 24. Prioritas Development

### Phase 1 — Core

1. Database
2. Master PIC
3. CRUD Defect
4. Status Defect
5. Dashboard Summary

### Phase 2 — Monitoring

6. Filter
7. Search
8. Pagination
9. Detail Defect
10. Update Status

### Phase 3 — UI Polish

11. Responsive design
12. Empty state
13. Confirmation dialog
14. Loading state
15. Error handling

---

## 25. Prinsip Utama Sistem

> **Simple data in, clear monitoring out.**

Sistem tidak perlu dibuat seperti aplikasi enterprise yang penuh fitur. Tujuan utamanya adalah membuat pencatatan defect menjadi **cepat**, lalu membuat kondisi defect bisa **langsung terlihat dari dashboard**.

### Core Flow

```text
MASTER PIC
    │
    ▼
TAMBAH DEFECT
    │
    ├── Project / Cluster
    ├── Unit
    ├── Total Defect
    ├── PIC
    ├── Target Repair
    └── Status
            │
            ▼
       DASHBOARD
            │
       ┌────┼────┐
       ▼    ▼    ▼
      OPEN  PROGRESS  COMPLETED
```

---

## 26. Summary

Versi pertama sistem berfokus pada empat hal utama:

1. **Pencatatan total defect**
2. **Pengelolaan Master PIC**
3. **Monitoring status defect**
4. **Dashboard rekap defect**

Field **Priority** dan **Category** tidak digunakan karena tidak dibutuhkan dalam workflow saat ini.

---

# 43. Clean Architecture & Next.js Architecture Rules

Architecture wajib mengikuti **Next.js App Router** dan konvensi resmi Next.js, bukan memaksakan struktur Clean Architecture dari framework lain. App Router menggunakan file-system routing dan mendukung Server Components, Suspense, serta Server Functions. citeturn1search12

Tujuan Clean Architecture pada project ini adalah **memisahkan tanggung jawab tanpa over-engineering**.

## 43.1 Prinsip Utama

```text
UI / Route
   ↓
Application / Use Case
   ↓
Domain
   ↓
Infrastructure
   ↓
Database
```

Aturan:

- UI tidak boleh langsung melakukan query Prisma.
- Page tidak boleh berisi business logic kompleks.
- Component tidak boleh mengetahui detail database.
- Prisma tidak boleh di-import ke Client Component.
- Validation tidak boleh hanya dilakukan di browser.
- Business rule harus dapat dijalankan tanpa React.
- Infrastructure/database tidak boleh bocor ke UI.
- Server-only code harus tetap berada di server.

---

# 44. Next.js App Router Boundary

Gunakan `src/app/` sebagai routing layer utama.

```text
src/app/
├── layout.tsx
├── page.tsx
├── dashboard/
│   └── page.tsx
├── defects/
│   ├── page.tsx
│   └── new/
│       └── page.tsx
└── master/
    └── pics/
        └── page.tsx
```

`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, dan `route.ts` harus mengikuti konvensi Next.js. Folder menentukan route segment dan `page.tsx` menjadi entry point route. citeturn0search3

---

# 45. Colocation & Route Groups

Gunakan colocation untuk file yang hanya berkaitan dengan feature/route tertentu.

Contoh:

```text
src/app/defects/
├── page.tsx
├── loading.tsx
├── error.tsx
├── new/
│   └── page.tsx
└── _components/
    ├── defect-table.tsx
    ├── defect-filter.tsx
    └── defect-form.tsx
```

Private folder `_components` boleh digunakan untuk implementation detail yang tidak menjadi route.

Route Group dapat digunakan jika perlu mengelompokkan route tanpa mengubah URL:

```text
src/app/
└── (dashboard)/
    ├── dashboard/
    ├── defects/
    └── master/
```

Jangan membuat route group atau private folder jika tidak memberi manfaat nyata. Next.js memang mendukung colocation, private folders, dan route groups untuk organisasi project. citeturn1search1turn1search6

---

# 46. Recommended Architecture Structure

Gunakan feature-oriented clean architecture:

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── defects/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── _components/
│   │   │       ├── defect-table.tsx
│   │   │       ├── defect-filter.tsx
│   │   │       ├── defect-form.tsx
│   │   │       └── defect-detail.tsx
│   │   └── master/
│   │       └── pics/
│   │           ├── page.tsx
│   │           └── _components/
│   │               ├── pic-table.tsx
│   │               └── pic-form.tsx
│   └── api/
│
├── components/
│   ├── ui/
│   └── shared/
│
├── features/
│   ├── defects/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   ├── schemas/
│   │   └── types/
│   └── pics/
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       ├── schemas/
│       └── types/
│
├── lib/
│   ├── prisma.ts
│   ├── errors/
│   └── utils/
│
└── prisma/
    ├── schema.prisma
    └── seed.ts
```

`app/` = routing/composition. `features/` = business feature. `components/ui/` = reusable UI primitives. `components/shared/` = reusable application components. `lib/` = shared infrastructure utilities. `prisma/` = database schema dan seed.

---

# 47. Feature-Based Architecture

Jangan membuat seluruh logic aplikasi tersebar pada folder global seperti:

```text
services/
repositories/
controllers/
models/
validators/
```

Jika itu membuat feature sulit ditemukan, gunakan feature boundary:

```text
features/defects/
├── domain/
├── application/
├── infrastructure/
├── schemas/
└── types/
```

Defect dan PIC adalah feature yang terpisah.

---

# 48. Domain Layer Rules

Domain hanya berisi aturan bisnis dan tipe/domain model.

```text
features/defects/domain/
├── defect.ts
├── defect-status.ts
└── defect-rules.ts
```

Domain **tidak boleh** mengimpor:

- React
- Next.js
- Prisma
- Browser API
- shadcn/ui

Contoh business rule:

```text
Total defect >= 1
Status = OPEN | ON_PROGRESS | COMPLETED
```

---

# 49. Application / Use Case Layer

Application layer berisi use case:

```text
features/defects/application/
├── create-defect.ts
├── update-defect.ts
├── delete-defect.ts
├── get-defects.ts
└── get-defect-summary.ts
```

Flow:

```text
Entry Point
    ↓
Validate Input
    ↓
Use Case
    ↓
Domain Rules
    ↓
Repository
```

Application layer tidak boleh mengetahui detail implementasi Prisma.

---

# 50. Infrastructure Layer

Infrastructure menangani dependency eksternal seperti database.

```text
features/defects/infrastructure/
├── defect-repository.ts
└── prisma-defect-repository.ts
```

Flow:

```text
Application
    ↓
Repository Contract
    ↓
Prisma Repository
    ↓
Prisma
    ↓
PostgreSQL
```

UI tidak boleh melakukan:

```ts
prisma.defect.findMany()
```

secara langsung.

---

# 51. Server Components Rules

Server Components adalah default pada App Router. Gunakan Client Component hanya ketika benar-benar membutuhkan interaktivitas. citeturn0search2

Default:

```text
page.tsx
layout.tsx
data fetching
summary read-only
table read-only
```

Tetap Server Component jika memungkinkan.

Gunakan Client Component untuk:

- `useState`
- `useEffect`
- browser API
- event handler interaktif
- dialog interaktif
- filter interaktif
- form behavior yang memang membutuhkan client state

Jangan memberi `'use client'` ke seluruh page hanya karena satu child component interaktif.

---

# 52. Client Component Rules

Client Component harus sekecil mungkin.

Contoh:

```text
Server Page
 ├── SummaryCard
 ├── DefectTable
 └── DefectFilterClient
          └── 'use client'
```

Bukan:

```text
DashboardPage
└── 'use client'
    └── seluruh dashboard
```

---

# 53. Data Fetching Rules

Untuk data yang dibutuhkan saat render, gunakan:

```text
Server Component
      ↓
Application Use Case
      ↓
Repository
      ↓
Prisma
```

Hindari membuat Server Component memanggil endpoint internal melalui HTTP hanya untuk mengambil data yang sebenarnya dapat diakses langsung dari server.

Next.js mendukung data fetching langsung dari Server Components menggunakan async I/O atau ORM/database. citeturn1search13

---

# 54. Server Actions / Server Functions

Untuk mutation dari UI, gunakan Server Functions / Server Actions untuk:

- Create defect
- Update defect
- Delete defect
- Create PIC
- Update PIC
- Change PIC status

Flow:

```text
Form
 ↓
Server Action
 ↓
Zod Validation
 ↓
Use Case
 ↓
Domain Rules
 ↓
Repository
 ↓
Prisma
 ↓
Revalidate UI
```

Server Action hanya menjadi entry point, bukan tempat seluruh business logic.

Next.js saat ini mendukung form yang memanggil Server Actions melalui `action`, dan Server Functions ditujukan terutama untuk mutation. citeturn1search0turn1search3

---

# 55. Server Action Security

Server Action harus dianggap sebagai server entry point yang dapat menerima request langsung.

Tetap lakukan:

1. Server-side validation.
2. Authorization jika authentication ditambahkan.
3. Business validation.
4. Database constraint.
5. Error handling.

Jangan mempercayai data dari client hanya karena form berasal dari aplikasi sendiri. Next.js menggunakan POST untuk Server Function invocation, tetapi validation dan security tetap menjadi tanggung jawab aplikasi. citeturn1search3

---

# 56. Zod Validation Rules

Zod digunakan pada server boundary.

```text
features/defects/schemas/
└── defect-schema.ts
```

Client validation boleh digunakan untuk UX, tetapi tidak menggantikan server-side validation.

Flow:

```text
Form Input
    ↓
Client Validation (optional)
    ↓
Server Action
    ↓
Zod Server Validation
    ↓
Business Rules
    ↓
Database
```

---

# 57. Prisma Rules

Prisma hanya boleh digunakan di server/infrastructure.

Tidak boleh mengimpor Prisma ke:

- Client Component
- UI component
- browser code

Gunakan satu Prisma client instance melalui infrastructure atau `src/lib/prisma.ts`.

---

# 58. Server-Only Boundary

Module yang hanya boleh berjalan di server dapat diberi:

```ts
import 'server-only'
```

Gunakan terutama untuk data access layer, credential handling, dan internal server logic.

Next.js menyediakan `server-only` untuk mencegah module server digunakan dari Client Component. citeturn1search7

---

# 59. Route Handler Rules

Route Handler digunakan jika memang membutuhkan HTTP boundary.

Contoh:

```text
app/api/defects/route.ts
```

Flow:

```text
Route Handler
    ↓
Zod
    ↓
Use Case
    ↓
Repository
```

Jangan membuat:

```text
Route Handler
    ↓
Prisma query
    ↓
Business logic
    ↓
Response
```

Untuk internal server rendering, prioritaskan direct server data access dibanding request HTTP ke endpoint internal.

---

# 60. Error Architecture

Gunakan error hierarchy sederhana:

```text
AppError
├── ValidationError
├── NotFoundError
├── BusinessRuleError
└── InfrastructureError
```

UI hanya menerima error yang aman ditampilkan.

Jangan meneruskan:

- SQL error
- Prisma stack trace
- credential
- environment variable
- internal path
- internal server details

ke browser.

---

# 61. Next.js Error Boundaries

Gunakan convention Next.js:

```text
error.tsx
not-found.tsx
loading.tsx
```

Contoh:

```text
app/defects/
├── page.tsx
├── loading.tsx
├── error.tsx
└── not-found.tsx
```

`error.tsx` digunakan sebagai error boundary dan harus mengikuti kebutuhan Client Component Next.js.

---

# 62. Dependency Rules

Dependency yang diperbolehkan:

```text
App / UI
   ↓
Application
   ↓
Domain

Infrastructure
   ↓
Application Contracts / Domain
```

Dependency yang dilarang:

```text
domain → Prisma
domain → Next.js
domain → React

UI → Prisma
UI → PostgreSQL

Client Component → server-only module
```

---

# 63. Naming Rules

Files:

```text
kebab-case.ts
kebab-case.tsx
```

Components:

```text
PascalCase
```

Functions:

```text
camelCase
```

Database:

```text
snake_case
```

Contoh:

```text
defect-form.tsx
DefectForm
createDefect()
DefectStatus
```

---

# 64. No God File / God Component

Jangan membuat satu file yang menangani:

- create
- update
- delete
- search
- filter
- summary
- validation
- mapping
- notification

secara sekaligus.

Pisahkan berdasarkan use case ketika file mulai terlalu besar.

Contoh:

```text
application/
├── create-defect.ts
├── update-defect.ts
├── delete-defect.ts
├── get-defects.ts
└── get-defect-summary.ts
```

---

# 65. No Over-Engineering

Clean Architecture tidak berarti membuat abstraction sebanyak mungkin.

Jangan menambahkan tanpa kebutuhan:

- generic repository framework;
- CQRS;
- event bus;
- dependency injection container besar;
- microservices;
- message broker;
- factory yang tidak diperlukan;
- service layer yang hanya meneruskan satu baris tanpa manfaat.

Prinsip:

> **Clean enough to maintain, simple enough to understand.**

---

# 66. Loading & Rendering Rules

Gunakan `loading.tsx` untuk route-level loading dan skeleton untuk bagian UI tertentu jika memang diperlukan.

Jangan membuat satu global spinner untuk seluruh aplikasi jika hanya satu bagian yang sedang loading.

Gunakan Server Components untuk data yang dapat dirender di server dan Client Components hanya pada bagian yang interaktif. Next.js memang memisahkan server dan client module graph untuk pola ini. citeturn0search2

---

# 67. Final Architecture Flow

### Read

```text
Next.js Server Component
        ↓
Application Use Case
        ↓
Repository
        ↓
Prisma
        ↓
PostgreSQL
```

### Create / Update / Delete

```text
Client Form
        ↓
Server Action
        ↓
Zod Validation
        ↓
Application Use Case
        ↓
Domain Rules
        ↓
Repository
        ↓
Prisma
        ↓
PostgreSQL
        ↓
Revalidate / Refresh UI
```

### UI

```text
Server Component
       │
       ├── Shared UI
       │
       └── Small Client Component
               │
               └── Interactive behavior
```

---

# 68. Final Architecture Decision

Architecture final project:

```text
                    ┌──────────────────────┐
                    │      Next.js App     │
                    │      App Router      │
                    └──────────┬───────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
              ▼                                 ▼
       Server Components                 Client Components
              │                                 │
              └──────────────┬──────────────────┘
                             ▼
                    Application Layer
                       Use Cases
                             │
                             ▼
                       Domain Layer
                    Business Rules / Types
                             │
                             ▼
                    Infrastructure Layer
                    Repository / Prisma
                             │
                             ▼
                         PostgreSQL
```

## Wajib Dipatuhi Coding Agent

1. Next.js App Router adalah routing boundary.
2. Server Components adalah default.
3. Client Components hanya untuk interaktivitas.
4. Server Actions/Server Functions digunakan untuk mutation UI.
5. Business logic tidak berada di page atau component.
6. Prisma hanya berada di server/infrastructure.
7. Database access melalui repository.
8. Validation server menggunakan Zod.
9. Domain tidak bergantung pada Next.js, React, atau Prisma.
10. Route Handler hanya dibuat jika membutuhkan HTTP boundary.
11. Gunakan colocation untuk feature-specific UI.
12. Gunakan route groups/private folders jika memang membantu organisasi.
13. Gunakan `server-only` untuk module yang harus tetap di server.
14. Gunakan `loading.tsx`, `error.tsx`, dan `not-found.tsx` sesuai kebutuhan.
15. Jangan membuat abstraction yang tidak diperlukan.
16. Feature harus terisolasi dan mudah dikembangkan.
17. Tidak boleh ada God Component atau God Service.
18. UI tidak boleh mengetahui detail database.
19. Error internal tidak boleh bocor ke client.
20. Clean Architecture harus meningkatkan maintainability, bukan menambah kompleksitas.

---

# 69. Architecture Quality Gate

Sebelum feature dianggap selesai, developer/AI coding agent wajib memastikan:

- [ ] Tidak ada Prisma import di Client Component.
- [ ] Tidak ada database query langsung di UI.
- [ ] Business logic berada di application/domain.
- [ ] Server validation menggunakan Zod.
- [ ] Server Action hanya menjadi entry point mutation.
- [ ] Route Handler tidak mengandung business logic.
- [ ] Server-only code tidak masuk client bundle.
- [ ] Client Component hanya digunakan jika diperlukan.
- [ ] Feature-specific component ditempatkan dekat feature.
- [ ] Shared component benar-benar reusable.
- [ ] Tidak ada circular dependency.
- [ ] Tidak ada God File.
- [ ] Tidak ada abstraction yang tidak diperlukan.
- [ ] Error handling mengikuti architecture.
- [ ] Loading dan error state tersedia untuk route yang relevan.
- [ ] Dashboard calculation berasal dari use case/query yang terdefinisi.
- [ ] Tidak ada business rule yang hanya divalidasi di browser.

---

# 70. Official Next.js Reference

Architecture ini mengacu pada dokumentasi resmi Next.js mengenai App Router, project structure, Server Components, data fetching, Server Functions/Actions, forms, route groups, dan data security. citeturn1search12turn1search13turn1search3turn1search0turn1search1turn1search7

Official documentation:

- https://nextjs.org/docs/app
- https://nextjs.org/docs/app/getting-started/fetching-data
- https://nextjs.org/docs/app/getting-started/mutating-data
- https://nextjs.org/docs/app/guides/forms
- https://nextjs.org/docs/app/guides/data-security
- https://nextjs.org/docs/app/api-reference/file-conventions/route-groups

<!-- end PRD -->

---

# 71. Agent Work Log and Recovery Rules

Setiap coding agent wajib menjaga catatan kerja lokal agar pekerjaan dapat dilanjutkan jika proses terhenti.

## Lokasi dan format

- Semua catatan kerja berada di folder root `agent/`.
- Catatan harus menggunakan format Markdown (`.md`).
- File utama yang dibaca saat melanjutkan pekerjaan adalah `agent/WORKLOG.md`.
- Folder `agent/` sengaja masuk `.gitignore` karena isinya merupakan state lokal sesi agent, bukan source of truth aplikasi.
- Jangan menyimpan secret, token, credential, atau isi `.env` ke dalam catatan.

## Kewajiban pembaruan

Agent harus memperbarui `agent/WORKLOG.md`:

1. sebelum mulai pekerjaan besar;
2. setelah menyelesaikan bagian pekerjaan yang berarti;
3. ketika menemukan blocker, error, atau perubahan scope;
4. sebelum berhenti atau menyerahkan pekerjaan.

## Isi minimum catatan

Catatan harus memuat tanggal/waktu, tujuan aktif, status `Selesai`, `Belum selesai`, `Blocker`, file yang diubah, pemeriksaan yang dijalankan, dan langkah lanjutan yang konkret. Status harus berbasis kondisi repo yang benar-benar sudah diperiksa, bukan asumsi.

Saat melanjutkan sesi, agent wajib membaca `agent/WORKLOG.md`, memeriksa ulang status Git dan file terkait, kemudian melanjutkan dari bagian `Langkah berikutnya` tanpa menghapus histori catatan sebelumnya.
