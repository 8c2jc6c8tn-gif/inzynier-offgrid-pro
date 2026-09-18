import type { Warning } from "@/lib/core/calc-result"

export function zapotrzebowanieNiedodatnie(value: number): Warning {
  return {
    code: "ZAPOTRZEBOWANIE-NIEDODATNIE",
    level: "critical",
    i18nKey: "ZAPOTRZEBOWANIE-NIEDODATNIE",
    technicalMessage: `zapotrzebowanieDoboweKwh = ${value}, oczekiwano > 0`,
    field: "zapotrzebowanieDoboweKwh",
  }
}

export function dniAutonomiiNiedodatnie(value: number): Warning {
  return {
    code: "DNI-AUTONOMII-NIEDODATNIE",
    level: "critical",
    i18nKey: "DNI-AUTONOMII-NIEDODATNIE",
    technicalMessage: `dniAutonomii = ${value}, oczekiwano > 0`,
    field: "dniAutonomii",
  }
}

export function sprawnoscPozaZakresem(value: number): Warning {
  return {
    code: "SPRAWNOSC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "SPRAWNOSC-PROCENT-DODATNIA-POZA-ZAKRESEM",
    technicalMessage: `sprawnoscFalownikaPct = ${value}, oczekiwano (0, 100]`,
    field: "sprawnoscFalownikaPct",
  }
}

export function dodPozaZakresem(value: number): Warning {
  return {
    code: "DOD-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "DOD-DODATNI-POZA-ZAKRESEM",
    technicalMessage: `dodPct = ${value}, oczekiwano (0, 100]`,
    field: "dodPct",
  }
}
