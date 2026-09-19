import type { Warning } from "@/lib/core/calc-result"

export function objawyZasiarczeniaObecne(liczbaObjawow: number): Warning {
  return {
    code: "OBJAWY-ZASIARCZENIA-OBECNE",
    level: "warning",
    i18nKey: liczbaObjawow === 1 ? "OBJAWY-ZASIARCZENIA-JEDEN" : "OBJAWY-ZASIARCZENIA-WIELE",
    params: liczbaObjawow === 1 ? undefined : { liczba: liczbaObjawow },
    technicalMessage: `liczbaObjawow=${liczbaObjawow} >= 1`,
  }
}
