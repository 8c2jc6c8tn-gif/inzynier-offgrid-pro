import type { Warning } from "@/lib/core/calc-result"
import { MAX_DOMOWNIKOW, MIN_DOMOWNIKOW } from "./constants"

export function liczbaDomownikowPozaZakresem(value: number): Warning {
  return {
    code: "LICZBA-DOMOWNIKOW-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "LICZBA-DOMOWNIKOW-POZA-ZAKRESEM",
    params: { min: MIN_DOMOWNIKOW, max: MAX_DOMOWNIKOW },
    technicalMessage: `liczbaDomownikow = ${value}, oczekiwano ${MIN_DOMOWNIKOW}-${MAX_DOMOWNIKOW}`,
    field: "liczbaDomownikow",
  }
}
