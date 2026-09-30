import type { Warning } from "@/lib/core/calc-result"

/** Biblia §12.4: warn when a device draws more current than the battery can deliver. */
export function pradUrzadzeniaPonadMaks(nazwa: string, pradA: number, maksPradA: number, indeks: number): Warning {
  return {
    code: "MA-PRAD-URZADZENIA-PONAD-MAKS",
    level: "warning",
    i18nKey: "MA-PRAD-URZADZENIA-PONAD-MAKS",
    params: { nazwa, prad: Math.round(pradA), maks: maksPradA },
    technicalMessage: `urzadzenia[${indeks}] I = ${pradA.toFixed(1)} A > maksPradA = ${maksPradA}`,
    field: `urzadzenia.${indeks}.mocW`,
  }
}

/** All devices at once draw more than the battery's maximum continuous current. */
export function pradRazemPonadMaks(pradA: number, maksPradA: number): Warning {
  return {
    code: "MA-PRAD-RAZEM-PONAD-MAKS",
    level: "warning",
    i18nKey: "MA-PRAD-RAZEM-PONAD-MAKS",
    params: { prad: Math.round(pradA), maks: maksPradA },
    technicalMessage: `suma I = ${pradA.toFixed(1)} A > maksPradA = ${maksPradA}`,
    field: "maksPradA",
  }
}
