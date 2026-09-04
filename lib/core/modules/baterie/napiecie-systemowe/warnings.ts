import type { Warning } from "@/lib/core/calc-result"

export function mocUjemna(value: number): Warning {
  return {
    code: "MOC-UJEMNA",
    level: "critical",
    message: "Obciążenie szczytowe nie może być ujemne.",
    technicalMessage: `mocSzczytowaW = ${value}, oczekiwano >= 0`,
    field: "mocSzczytowaW",
  }
}

export function rekomendacjaNapiecia(napiecieV: number): Warning {
  return {
    code: "REKOMENDACJA-NAPIECIA",
    level: "info",
    message: `Wyższe napięcie systemowe = mniejszy prąd przy tej samej mocy = cieńsze, tańsze kable. Rekomendowane: ${napiecieV}V.`,
    technicalMessage: `napiecieRekomendowaneV=${napiecieV}`,
  }
}
