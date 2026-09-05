import type { Warning } from "@/lib/core/calc-result"

/**
 * Katalog ostrzeżeń tego kalkulatora (docs/standards/04-walidacja-i-twarde-stopy.md, 4.1).
 * Treść 🔴 1:1 ze źródła (docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md, Ekran 6).
 */

export function aicPonizejPraduZwarciowego(aicA: number, pradZwarciowyA: number): Warning {
  return {
    code: "AIC-PONIZEJ-PRADU-ZWARCIOWEGO",
    level: "critical",
    message: `Zdolność łączeniowa bezpiecznika (${aicA} A) jest niższa niż prąd zwarciowy w tym punkcie (${pradZwarciowyA} A) — zbyt niska zdolność łączeniowa, ryzyko łuku elektrycznego zamiast bezpiecznego przepalenia.`,
    technicalMessage: `aicBezpiecznikaA=${aicA} < pradZwarciowyA=${pradZwarciowyA}`,
    field: "aicBezpiecznikaA",
  }
}
