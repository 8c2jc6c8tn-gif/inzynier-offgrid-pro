import type { Warning } from "@/lib/core/calc-result"

export function objawyZasiarczeniaObecne(liczbaObjawow: number): Warning {
  return {
    code: "OBJAWY-ZASIARCZENIA-OBECNE",
    level: "warning",
    message: `Zaobserwowano ${liczbaObjawow} ${liczbaObjawow === 1 ? "objaw" : "objawy"} zasiarczenia — patrz Ekran B11 "Ratowanie zasiarczonego akumulatora".`,
    technicalMessage: `liczbaObjawow=${liczbaObjawow} >= 1`,
  }
}
