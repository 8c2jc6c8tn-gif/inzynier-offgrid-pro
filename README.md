# Inżynier Offgrid Pro

Kalkulator/doradca inżynierski dla systemów off-grid PV (panele, magazyn energii, ogrzewanie,
bezpieczeństwo). Web/PWA offline-first (Next.js 16 / React 19 / TypeScript), z architekturą
przygotowaną na przeniesienie na mobile. Część rodziny aplikacji "Inżynier Pro".

## Dokumentacja — od czego zacząć

- [`CLAUDE.md`](./CLAUDE.md) — punkt wejścia (dla AI i dla człowieka): kolejność czytania, zasady pracy z tym repo.
- [`docs/memory.md`](./docs/memory.md) — żywy log decyzji, pułapek i aktualnego stanu tego projektu.
- [`docs/standards/00-INDEKS.md`](./docs/standards/00-INDEKS.md) — pełny standard architektoniczny wspólny dla całej rodziny aplikacji (17 rozdziałów).
- [`docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_5.md`](./docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_5.md) — metodologia procesowa (GOD BOOK); relacja ze standardem opisana w jego Części Y.
- [`docs/lista-do-zrobienia.md`](./docs/lista-do-zrobienia.md) — bieżące zadania między sesjami.
- [`ZASADY_APLIKACJI.md`](./ZASADY_APLIKACJI.md) / [`USTALENIA.md`](./USTALENIA.md) — zasady i decyzje specyficzne dla Offgrid Pro (konstytucja tego projektu, nadrzędna wobec kodu).
- [`docs/rejestr-pokrycia.md`](./docs/rejestr-pokrycia.md) — status implementacji per ekran/moduł.
- [`docs/brief-dla-v0.md`](./docs/brief-dla-v0.md) — brief techniczny i projektowy dla v0.
- [`docs/zrodla/`](./docs/zrodla/) — materiały źródłowe Offgrid (Biblia architektury, treść modułów, Zasady UX Doradcy).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_Os8Br3QK8Z2ysdakZuH2otJK80LW)

## Getting Started

```bash
pnpm install
pnpm dev
```

Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

Inne komendy: `pnpm build` / `pnpm start` / `pnpm test` (Vitest) / `pnpm lint` (ESLint).
Jeden lockfile w repo: `pnpm-lock.yaml` — nie dodawać `package-lock.json` ani `yarn.lock` obok niego.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.
