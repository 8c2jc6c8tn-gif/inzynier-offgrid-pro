import type { Warning } from "@/lib/core/calc-result"

export function zapotrzebowanieNiedodatnie(value: number): Warning {
  return {
    code: "ZAPOTRZEBOWANIE-NIEDODATNIE",
    level: "critical",
    message: "Zapotrzebowanie dobowe musi być większe od zera.",
    technicalMessage: `zapotrzebowanieDoboweKwh = ${value}, oczekiwano > 0`,
    field: "zapotrzebowanieDoboweKwh",
  }
}

export function dniAutonomiiNiedodatnie(value: number): Warning {
  return {
    code: "DNI-AUTONOMII-NIEDODATNIE",
    level: "critical",
    message: "Dni autonomii muszą być większe od zera.",
    technicalMessage: `dniAutonomii = ${value}, oczekiwano > 0`,
    field: "dniAutonomii",
  }
}

export function sprawnoscPozaZakresem(value: number): Warning {
  return {
    code: "SPRAWNOSC-POZA-ZAKRESEM",
    level: "critical",
    message: "Sprawność falownika musi być z przedziału 0–100% (>0).",
    technicalMessage: `sprawnoscFalownikaPct = ${value}, oczekiwano (0, 100]`,
    field: "sprawnoscFalownikaPct",
  }
}

export function dodPozaZakresem(value: number): Warning {
  return {
    code: "DOD-POZA-ZAKRESEM",
    level: "critical",
    message: "DoD (głębokość rozładowania) musi być z przedziału 0–100% (>0).",
    technicalMessage: `dodPct = ${value}, oczekiwano (0, 100]`,
    field: "dodPct",
  }
}
