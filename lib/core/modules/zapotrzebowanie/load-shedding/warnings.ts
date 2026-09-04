import type { Warning } from "@/lib/core/calc-result"

export function socPozaZakresem(value: number): Warning {
  return {
    code: "SOC-POZA-ZAKRESEM",
    level: "critical",
    message: "SoC musi być z przedziału 0–100%.",
    technicalMessage: `socPct = ${value}, oczekiwano [0, 100]`,
    field: "socPct",
  }
}

export function odbiornikOdlaczony(priorytet: number): Warning {
  return {
    code: "ODBIORNIK-ODLACZONY",
    level: "warning",
    message: `Odbiornik priorytetu ${priorytet} zostałby teraz odłączony przez system load sheddingu.`,
    technicalMessage: `priorytet=${priorytet}, odlaczone=true`,
  }
}

export function odbiornikAktywny(priorytet: number): Warning {
  return {
    code: "ODBIORNIK-AKTYWNY",
    level: "info",
    message:
      priorytet === 1
        ? "Priorytet 1 (krytyczny) — nigdy nie odłączany przez system load sheddingu."
        : `Odbiornik priorytetu ${priorytet} pozostaje aktywny przy tym SoC.`,
    technicalMessage: `priorytet=${priorytet}, odlaczone=false`,
  }
}
