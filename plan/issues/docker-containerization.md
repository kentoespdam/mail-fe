# Plan: Docker Containerization (Next.js + Bun)

## Context

Aplikasi `mail-fe` (Next.js 16.2.1, React 19, Bun, Tailwind v4) belum punya artefak Docker apa pun — tidak ada `Dockerfile`, `compose.yaml`, `.dockerignore`, maupun pipeline CI/CD. Tim membutuhkan image deterministik untuk run lokal, staging, dan produksi.

Plan ini menargetkan setup container minimal (single-service frontend) yang:
- Reproducible via `bun.lock` (frozen lockfile)
- Lean (multi-stage build + Next.js standalone output)
- Aman (user non-root, secret via `.env`)
- Konsisten dengan middleware existing (`src/proxy.ts` jalan in-process di Next.js, tidak butuh container terpisah)

API backend (`API_BASE_URL`) **diasumsikan eksternal** — tidak ikut di-compose. Bila kelak butuh stack lengkap, tinggal tambah service di `compose.yaml` tanpa ubah `Dockerfile`.

## Tujuan

- Menyediakan `Dockerfile` multi-stage berbasis `oven/bun:1-alpine` (deps → builder → runner).
- Menyediakan `compose.yaml` minimal (1 service: `web`) untuk run lokal/staging.
- Menyediakan `.dockerignore` agar build context ramping & tidak membocorkan file sensitif.
- Menyediakan `.env.example` template tanpa secret (sumber kebenaran: `src/lib/constants.ts`).

Keputusan desain (sudah dikonfirmasi):
- **Base image:** `oven/bun:1-alpine` end-to-end (deps, builder, runner).
- **Output mode:** `output: "standalone"` di `next.config.ts`.
- **Compose scope:** hanya frontend (single service).
- **Path artefak:** `Dockerfile`, `compose.yaml`, `.dockerignore`, `.env.example` di root project.

## Pra-syarat & Perubahan Kode

- Tambah `output: "standalone"` ke `next.config.ts` — wajib supaya stage `runner` cukup copy `.next/standalone`, `.next/static`, dan `public/` (tanpa `node_modules`).
- Tidak ada perubahan kode aplikasi lain. Middleware (`src/proxy.ts`), env vars, dan flow runtime tidak berubah.

## Implementation Steps

### Step 1 — Aktifkan standalone output di `next.config.ts`

Edit `next.config.ts`, tambahkan `output: "standalone"` di samping `reactCompiler: true`.

```ts
const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  // ...config existing
};
```

**Verifikasi lokal:** `bun run build` → cek `.next/standalone/server.js` ada.

### Step 2 — Buat `.dockerignore`

Mirror `.gitignore` + tambahan untuk artefak yang tidak perlu masuk build context:

```
# VCS & tooling
.git
.github

# Build artefacts
.next
out
node_modules
dist

# Env (secret)
.env
.env.*

# Dev / docs / planning (tidak perlu di image)
plan
apidocs
docs
graphify-out
.beads
.claude
.vscode
.idea

# OS
.DS_Store
Thumbs.db

# Testing
coverage
tests/__snapshots__

# Logs
*.log
```

### Step 3 — Buat `Dockerfile` multi-stage

```dockerfile
# syntax=docker/dockerfile:1.7

# ---------- Stage 1: deps ----------
FROM oven/bun:1-alpine AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --ignore-scripts

# ---------- Stage 2: builder ----------
FROM oven/bun:1-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# ---------- Stage 3: runner ----------
FROM oven/bun:1-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -S -g 1001 nodejs \
 && adduser -S -u 1001 -G nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["bun", "run", "server.js"]
```

Catatan:
- `--frozen-lockfile` memastikan install deterministik dari `bun.lock`.
- `--ignore-scripts` selaras dengan field `ignoreScripts` di `package.json` (`sharp`, `unrs-resolver` di-skip).
- `HOSTNAME=0.0.0.0` wajib supaya server standalone listen di semua interface container.
- Bila kelak Bun runtime bermasalah dengan Next.js standalone server, fallback: ganti **stage runner** ke `node:20-alpine` dan ubah `CMD` jadi `["node", "server.js"]`. Stage `deps` & `builder` tetap pakai Bun.

### Step 4 — Buat `compose.yaml`

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    image: mail-fe:local
    container_name: mail-fe
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - .env
    environment:
      NODE_ENV: production
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/login"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 20s
```

Catatan:
- Tidak ada `depends_on` — API eksternal.
- Healthcheck pakai path `/login` karena selalu reachable, tidak butuh auth, dan ada di `src/app/login/page.tsx`.
- `wget` tersedia di `oven/bun:1-alpine` (Alpine BusyBox); kalau hilang di versi mendatang, ganti ke `curl` atau install `wget` di runner stage.

### Step 5 — Buat `.env.example`

Template tanpa nilai. Sumber kebenaran daftar var: `src/lib/constants.ts` (semua server-only, tidak ada `NEXT_PUBLIC_*`).

```
# Backend API
API_BASE_URL=

# Appwrite (auth/session)
APPWRITE_HOSTNAME=
APPWRITE_ENDPOINT=
APPWRITE_PROJECT_ID=
APPWRITE_API_KEY=

# Mail config
DEFAULT_MAIL_DOMAIN=

# Session (base64url-encoded secret untuk JWT encryption di NextProxy)
SESSION_SECRET=
```

### Step 6 — Update `README.md` (opsional, satu paragraf)

Tambah seksi "Run with Docker":

```md
## Run with Docker

1. `cp .env.example .env` lalu isi nilai yang dibutuhkan.
2. `docker compose up -d --build`
3. Akses di http://localhost:3000
4. Stop: `docker compose down`
```

## Catatan Teknis

- **Bun vs Node runtime:** Next.js 16 standalone server kompatibel dengan Bun. Bila ada regresi, fallback ke `node:20-alpine` di stage `runner` saja (deps + builder tetap Bun untuk konsistensi `bun.lock`).
- **Middleware (`src/proxy.ts`):** bagian dari Next.js runtime — tidak butuh container terpisah, tidak butuh konfigurasi compose tambahan.
- **Tailwind v4:** dikompilasi saat `bun run build`, tidak ada artefak runtime tambahan.
- **`NODE_ENV=production` wajib** — `src/proxy.ts:99` mengaktifkan flag `secure` cookie hanya saat production.
- **Caching layer:** `package.json` + `bun.lock` di-copy duluan supaya layer dependency tidak invalidate saat source berubah.
- **Image size target:** < 250 MB. Bila lebih besar, audit isi `node_modules` di stage builder dan pastikan stage runner hanya berisi `.next/standalone` + `.next/static` + `public/`.
- **Secret handling:** `.env` jangan di-commit (sudah di-cover `.gitignore`); di prod sebaiknya pakai secret manager / env injection dari orchestrator, bukan file `.env`.

## Verifikasi

### A. Build & smoke test lokal

```bash
docker compose build
docker compose up -d
docker compose logs -f web    # tunggu pesan "Ready" / "Listening on 0.0.0.0:3000"
curl -I http://localhost:3000/login   # 200 atau 307 ke /login
```

### B. Health & ukuran image

```bash
docker images mail-fe:local           # target < 250 MB
docker inspect --format '{{.State.Health.Status}}' mail-fe   # healthy
```

### C. Env propagation

```bash
docker compose exec web printenv | grep -E '^(API_BASE_URL|APPWRITE_|SESSION_SECRET|DEFAULT_MAIL_DOMAIN)='
```

### D. Functional smoke

- Login flow di browser (`http://localhost:3000/login`) — pastikan tidak ada error 500.
- Buka satu halaman yang memanggil `/api/proxy/*` (mis. `/persuratan` atau `/master/tipe-surat`) → verifikasi proxy ke `API_BASE_URL` jalan dan Bearer ter-inject.
- Cek navigasi sidebar render normal.

### E. Teardown

```bash
docker compose down
```

## File yang Akan Dibuat / Diubah

| File | Aksi |
|---|---|
| `Dockerfile` | Buat baru |
| `compose.yaml` | Buat baru |
| `.dockerignore` | Buat baru |
| `.env.example` | Buat baru |
| `next.config.ts` | Edit (tambah `output: "standalone"`) |
| `README.md` | Edit (opsional, tambah seksi "Run with Docker") |
