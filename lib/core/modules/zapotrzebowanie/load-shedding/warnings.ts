import type { Warning } from "@/lib/core/calc-result"

export function socPozaZakresem(value: number): Warning {
  return {
    code: "SOC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "SOC-POZA-ZAKRESEM",
    technicalMessage: `socPct = ${value}, oczekiwano [0, 100]`,
    field: "socPct",
  }
}

export function odbiornikOdlaczony(priorytet: number): Warning {
  return {
    code: "ODBIORNIK-ODLACZONY",
    level: "warning",
    i18nKey: "ODBIORNIK-ODLACZONY",
    params: { priorytet },
    technicalMessage: `priorytet=${priorytet}, odlaczone=true`,
  }
}

export function odbiornikAktywny(priorytet: number): Warning {
  if (priorytet === 1) {
    return {
      code: "ODBIORNIK-AKTYWNY",
      level: "info",
      i18nKey: "ODBIORNIK-AKTYWNY-PRIORYTET-1",
      technicalMessage: `priorytet=${priorytet}, odlaczone=false`,
    }
  }
  return {
    code: "ODBIORNIK-AKTYWNY",
    level: "info",
    i18nKey: "ODBIORNIK-AKTYWNY",
    params: { priorytet },
    technicalMessage: `priorytet=${priorytet}, odlaczone=false`,
  }
}
