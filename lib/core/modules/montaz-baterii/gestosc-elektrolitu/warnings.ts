import type { Warning } from "@/lib/core/calc-result"
import { GESTOSC_POLOWA_G_CM3, GESTOSC_PELNY_G_CM3 } from "./constants"

export function stanPelny(gestoscGCm3: number): Warning {
  return {
    code: "STAN-PELNY",
    level: "info",
    i18nKey: "STAN-PELNY",
    params: { gestosc: gestoscGCm3.toFixed(2), pelny: GESTOSC_PELNY_G_CM3 },
    technicalMessage: `gestoscGCm3=${gestoscGCm3} >= ${GESTOSC_PELNY_G_CM3}`,
    field: "gestoscGCm3",
  }
}

export function stanCzesciowoNaladowany(gestoscGCm3: number): Warning {
  return {
    code: "STAN-CZESCIOWO-NALADOWANY",
    level: "warning",
    i18nKey: "STAN-CZESCIOWO-NALADOWANY",
    params: { gestosc: gestoscGCm3.toFixed(2), polowa: GESTOSC_POLOWA_G_CM3 },
    technicalMessage: `${GESTOSC_POLOWA_G_CM3} <= gestoscGCm3=${gestoscGCm3} < ${GESTOSC_PELNY_G_CM3}`,
    field: "gestoscGCm3",
  }
}

export function stanRozladowany(gestoscGCm3: number): Warning {
  return {
    code: "STAN-ROZLADOWANY",
    level: "warning",
    i18nKey: "STAN-ROZLADOWANY",
    params: { gestosc: gestoscGCm3.toFixed(2) },
    technicalMessage: `gestoscGCm3=${gestoscGCm3} < ${GESTOSC_POLOWA_G_CM3}`,
    field: "gestoscGCm3",
  }
}

export function gestoscNiedodatnia(value: number): Warning {
  return {
    code: "GESTOSC-NIEDODATNIA",
    level: "critical",
    i18nKey: "GESTOSC-NIEDODATNIA",
    technicalMessage: `gestoscGCm3 = ${value}, oczekiwano > 0`,
    field: "gestoscGCm3",
  }
}
