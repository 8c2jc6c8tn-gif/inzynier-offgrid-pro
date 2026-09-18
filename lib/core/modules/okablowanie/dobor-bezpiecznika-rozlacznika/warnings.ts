import type { Warning } from "@/lib/core/calc-result"

/**
 * Katalog ostrzeżeń tego kalkulatora (docs/standards/04-walidacja-i-twarde-stopy.md, 4.1).
 * Treść 🔴 1:1 ze źródła (docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md, Ekran 6).
 */

export function aicPonizejPraduZwarciowego(aicA: number, pradZwarciowyA: number): Warning {
  return {
    code: "AIC-PONIZEJ-PRADU-ZWARCIOWEGO",
    level: "critical",
    i18nKey: "AIC-BEZPIECZNIKA-PONIZEJ-PRADU-ZWARCIOWEGO",
    params: { aic: aicA, pradZwarciowy: pradZwarciowyA },
    technicalMessage: `aicBezpiecznikaA=${aicA} < pradZwarciowyA=${pradZwarciowyA}`,
    field: "aicBezpiecznikaA",
  }
}
