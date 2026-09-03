import type { Warning } from "@/lib/core/calc-result"
import { GESTOSC_POLOWA_G_CM3, GESTOSC_PELNY_G_CM3 } from "./constants"

export function stanPelny(gestoscGCm3: number): Warning {
  return {
    code: "STAN-PELNY",
    level: "info",
    message: `Gęstość elektrolitu ${gestoscGCm3.toFixed(2)} g/cm³ — akumulator pełny (≥${GESTOSC_PELNY_G_CM3} g/cm³).`,
    technicalMessage: `gestoscGCm3=${gestoscGCm3} >= ${GESTOSC_PELNY_G_CM3}`,
    field: "gestoscGCm3",
  }
}

export function stanCzesciowoNaladowany(gestoscGCm3: number): Warning {
  return {
    code: "STAN-CZESCIOWO-NALADOWANY",
    level: "warning",
    message: `Gęstość elektrolitu ${gestoscGCm3.toFixed(2)} g/cm³ — akumulator naładowany częściowo (ok. połowy, referencja ${GESTOSC_POLOWA_G_CM3} g/cm³). Zalecane doładowanie.`,
    technicalMessage: `${GESTOSC_POLOWA_G_CM3} <= gestoscGCm3=${gestoscGCm3} < ${GESTOSC_PELNY_G_CM3}`,
    field: "gestoscGCm3",
  }
}

export function stanRozladowany(gestoscGCm3: number): Warning {
  return {
    code: "STAN-ROZLADOWANY",
    level: "warning",
    message: `Gęstość elektrolitu ${gestoscGCm3.toFixed(2)} g/cm³ — akumulator rozładowany. Wymagane doładowanie przed dalszym użytkowaniem.`,
    technicalMessage: `gestoscGCm3=${gestoscGCm3} < ${GESTOSC_POLOWA_G_CM3}`,
    field: "gestoscGCm3",
  }
}

export function gestoscNiedodatnia(value: number): Warning {
  return {
    code: "GESTOSC-NIEDODATNIA",
    level: "critical",
    message: "Gęstość elektrolitu musi być większa od zera.",
    technicalMessage: `gestoscGCm3 = ${value}, oczekiwano > 0`,
    field: "gestoscGCm3",
  }
}
