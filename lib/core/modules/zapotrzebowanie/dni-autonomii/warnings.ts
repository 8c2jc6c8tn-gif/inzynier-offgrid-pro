import type { Warning } from "@/lib/core/calc-result"

export function zapotrzebowanieUjemne(value: number): Warning {
  return {
    code: "ZAPOTRZEBOWANIE-UJEMNE",
    level: "critical",
    message: "Zapotrzebowanie dobowe nie może być ujemne.",
    technicalMessage: `zapotrzebowanieDoboweKwh = ${value}, oczekiwano >= 0`,
    field: "zapotrzebowanieDoboweKwh",
  }
}

export function sprawnoscPozaZakresem(value: number): Warning {
  return {
    code: "SPRAWNOSC-POZA-ZAKRESEM",
    level: "critical",
    message: "Sprawność falownika musi być z przedziału 0–100%.",
    technicalMessage: `sprawnoscFalownikaPct = ${value}, oczekiwano [0, 100]`,
    field: "sprawnoscFalownikaPct",
  }
}

export function dodPozaZakresem(value: number): Warning {
  return {
    code: "DOD-POZA-ZAKRESEM",
    level: "critical",
    message: "DoD (głębokość rozładowania) musi być z przedziału 0–100%.",
    technicalMessage: `dodPct = ${value}, oczekiwano [0, 100]`,
    field: "dodPct",
  }
}

export function wplywNaMagazyn(dniAutonomii: number, pojemnoscKwh: number): Warning {
  return {
    code: "WPLYW-NA-MAGAZYN",
    level: "info",
    message: `Przy ${dniAutonomii} dniach autonomii i wpisanych parametrach magazyn potrzebuje ok. ${pojemnoscKwh.toFixed(1)} kWh pojemności użytecznej (szacunek — pełne wyliczenie: Moduł 4, Ekran 1).`,
    technicalMessage: `dniAutonomii=${dniAutonomii}, pojemnoscUzytecznaSzacowanaKwh=${pojemnoscKwh}`,
  }
}
