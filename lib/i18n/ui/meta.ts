/** Server-rendered metadata (`generateMetadata` in `app/layout.tsx`, `app/manifest.ts`) per market language. */
// English: ./meta.en.ts, Russian: ./meta.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
export const pl = {
  "UI-META-NAZWA": "Inżynier Offgrid Pro",
  "UI-META-NAZWA-KROTKA": "Offgrid Pro",
  "UI-META-OPIS": "Kalkulator/doradca inżynierski dla systemów off-grid PV (panele, magazyn energii, ogrzewanie, bezpieczeństwo).",
} as const
