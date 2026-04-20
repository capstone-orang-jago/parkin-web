<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## ParkIn Web — konteks proyek

### Kebijakan desain (wajib)

**Semua desain tampilan** (layout halaman, komposisi KPI/chart/tabel padat, hierarki visual, spacing makro) **harus melalui Stitch MCP**, bukan dirancang langsung di editor. Agen **tidak boleh** “membuat desain sendiri” di kode sebagai sumber kebenaran visual.

- **Alur wajib:** baca `.stitch/SITE.md` + `.stitch/next-prompt.md` → **Stitch MCP** (skill **`stitch-design`**: `text-to-design` / `edit-design`) → aset di **`.stitch/designs/`** → **`design-md`** → **`.stitch/DESIGN.md`** → **`stitch-loop`** (baton). Implementasi Next = **translasi** PRD + `DESIGN.md` + export Stitch; skill **`react-components`** untuk jembatan ke React.
- **Larangan:** menambah atau mengubah komposisi UI kaya hanya dari Tailwind/React tanpa referensi Stitch untuk layar tersebut.
- **Pengecualian:** kode tanpa komposisi visual baru (auth, API, redirect, tipe data) atau perbaikan aksesibilitas yang tidak mengubah layout.

### Kebijakan PRD (ruang lingkup produk)

**Jangan** menambah kolom, field, filter, atau alur bisnis di UI/data yang **tidak tertulis** di `docs/PRD/` untuk modul tersebut. Jika kebutuhan baru muncul, **perbarui PRD dulu** atau minta persetujuan eksplisit pengguna — bukan mengisi sendiri di kode.

Aturan teknis lengkap: [`.cursor/rules/stitch-design-first.mdc`](.cursor/rules/stitch-design-first.mdc).

- **Produk & alur:** `docs/PRD/` (overview `01`, navigasi `03`, modul `04`–`06`).
- **Token & spesifikasi:** `docs/design-specification/` (materi prompt Stitch + implementasi).
- **MCP:** **StitchMCP** harus dapat dipanggil dari Cursor (global atau proyek); set `STITCH_GOOGLE_API_KEY` / kunci Google Stitch di environment. Tanpa MCP aktif, **hentikan** pekerjaan UI dan minta pengguna mengaktifkannya — jangan mengganti dengan desain improvisasi. MCP lain (mis. context7, shadcn) boleh tetap di pengaturan user Cursor.
- **Perencanaan (PAUL):** `.paul/PROJECT.md`, `.paul/ROADMAP.md`, `.paul/STATE.md` — `/paul:plan`. **UI + PAUL:** [`.paul/UI-STITCH.md`](.paul/UI-STITCH.md) mengikat setiap fase yang mengubah komposisi layar ke Stitch sebelum implementasi.
