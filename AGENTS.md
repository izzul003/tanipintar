# AGENTS.md: TaniPintar

Instructions for AI coding agents (Claude Code, Cursor, Copilot, Codex, etc.) working on this repo.

## What this project is

TaniPintar is a planting companion web app for home gardeners and beginner farmers in Indonesia. It covers picking seeds, step-by-step planting tutorials, an automatic care schedule (watering/fertilizing/checking), "Tanya penyuluh" (ask an agricultural extension officer), guides, and a farming blog.

- Product spec: `docs/PRD-TaniPintar.md` (read it first, in Indonesian).
- UI copy language: **Bahasa Indonesia**. Keep all user-facing text in Indonesian.

## Repo layout

```
prototype/              Static clickable prototype: deployable as-is
  index.html            Beranda (home)
  TanamanDetail.html    Plant detail (Cabai rawit merah)
  JadwalRawat.html      Weekly care schedule (interactive)
  TanyaPenyuluh.html    Chat with extension officer
  KatalogBibit.html     Seed catalog (interactive filters)
  BibitDetail.html      Planting tutorial, Tomat cherry (interactive stepper)
  PanduanDetail.html    Guide article: best time to water
  Blog.html             Blog list (interactive category filter)
  BlogDetail.html       Blog article
  assets/dc-lite.js     Tiny runtime that renders each page's template
  images/               Photos + sumber.csv (sources & licenses)
design-source/          Original design files (.dc.html) + canvas.json
docs/                   PRD (md + docx)
```

## How the prototype works

Each page has three parts:

1. `<template id="dc-tpl">`: HTML markup with `{{path}}` holes, `<sc-for list="{{items}}" as="item">` loops, `<sc-if value="{{cond}}">` conditionals, and `onClick="{{handler}}"` events.
2. `<script type="text/x-dc" id="dc-script">`: `class Component extends DCLogic { renderVals() { … } }`. State lives in `this.state`; call `this.setState()` to re-render.
3. `assets/dc-lite.js` renders the template into `#app`.

Rules for holes: `{{ }}` is a **dotted lookup only** (`{{t.plant}}`), never an expression. Compute values in `renderVals()`.

No build step. Run locally with any static server:

```bash
cd prototype && npx serve .        # or: python3 -m http.server 8000
```

## Design system (must follow)

Fonts: **Poppins** (headings, class `.serif`) + **Inter** (body), via Google Fonts.

| Token | Hex | Use |
|---|---|---|
| primary | `#2E7D32` | Main buttons, links, active nav |
| primary-dark | `#1B5E20` | Hero background, hover |
| primary-soft | `#E8F5E9` | Soft highlights, selected nav |
| secondary | `#66BB6A` | Secondary progress bars |
| accent | `#FFA000` (hover `#F57C00`) | Important CTAs; text on it is `#132A17`, not white (contrast) |
| accent-soft | `#FFF8E1` | Tips / reminder boxes |
| text | `#132A17` / `#3E5643` / `#6E8573` | Headings / body / caption |
| bg / surface | `#F4F7F5` / `#FFFFFF` | Page / cards |
| border / hover | `#DCE5DE` / `#EDF3EF` | Dividers / hover surfaces |
| water | `#0284C7`, bg `#E0F2FE`, text `#0369A1` | **Only** water icons, "Siram" tasks, rain status |
| fertilizer | `#D97706`, bg `#FEF3C7`, text `#92400E` | "Pupuk" tasks |
| danger | `#DC2626`, bg `#FEE2E2`, text `#B91C1C` | Pests, warnings |

Conventions:

- Task type colors are semantic: Siram = blue, Pupuk = amber, Periksa = green (`.tag-siram`, `.tag-pupuk`, `.tag-periksa`).
- Do not use light blue decoratively; it is reserved for water/rain.
- Accessibility: text contrast ≥ 4.5:1, touch targets ≥ 44px, real `<button>`/`<a>`/`<label>`.
- Icons are inline stroke SVGs (24×24 viewBox, stroke-width ~1.8). No emoji.
- Layout: max-width 1240px container (`.wrap`), cards with 20px radius, responsive (stack on phones).
- Date/time format: "23 November 2026", "06.30".

## Recommended next steps (production)

1. Port to a component framework (suggested: **Next.js + React + Tailwind**). Map tokens above into `tailwind.config` theme colors. Each prototype page becomes a route: `/`, `/tanaman/[id]`, `/jadwal`, `/penyuluh`, `/katalog`, `/katalog/[slug]`, `/panduan/[slug]`, `/blog`, `/blog/[slug]`.
2. Extract shared components: `Header`, `Footer`, `TaskItem`, `PlantCard`, `SeedCard`, `ArticleCard`, `Tag`, `TipsBox`, `ChatBubble`.
3. Move hard-coded data (tasks, seeds, articles, tutorial steps) into JSON/CMS following the data model in the PRD.
4. Backend per PRD: auth, plants, schedule generation from care templates, weather API, notifications, chat (LLM + human escalation).

## Caveats

- All data in the prototype is sample content. Care values (doses, harvest days, pH) are general guidance and must be reviewed by an extension officer before launch.
- `images/sumber.csv`: 18 photos are marked "Perlu verifikasi lisensi". Replace them or clear their licenses before going public. Vecteezy photos need attribution.
- Google Fonts load from the network; offline they fall back to system fonts.
