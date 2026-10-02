/** Server-rendered metadata (`generateMetadata` in `app/layout.tsx`, `app/manifest.ts`) per market language. */
export const pl = {
  "UI-META-NAZWA": "Inżynier Offgrid Pro",
  "UI-META-NAZWA-KROTKA": "Offgrid Pro",
  "UI-META-OPIS": "Kalkulator/doradca inżynierski dla systemów off-grid PV (panele, magazyn energii, ogrzewanie, bezpieczeństwo).",
} as const

export const en: Record<keyof typeof pl, string> = {
  "UI-META-NAZWA": "Offgrid Engineer Pro",
  "UI-META-NAZWA-KROTKA": "Offgrid Pro",
  "UI-META-OPIS": "Engineering calculator and advisor for off-grid PV systems (panels, energy storage, heating, safety).",
}

export const ru: Record<keyof typeof pl, string> = {
  "UI-META-NAZWA": "Инженер Offgrid Pro",
  "UI-META-NAZWA-KROTKA": "Offgrid Pro",
  "UI-META-OPIS": "Инженерный калькулятор и консультант для автономных фотоэлектрических систем (панели, накопители энергии, отопление, безопасность).",
}
