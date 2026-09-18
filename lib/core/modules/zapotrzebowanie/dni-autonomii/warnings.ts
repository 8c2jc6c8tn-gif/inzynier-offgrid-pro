import type { Warning } from "@/lib/core/calc-result"

export function zapotrzebowanieUjemne(value: number): Warning {
  return {
    code: "ZAPOTRZEBOWANIE-UJEMNE",
    level: "critical",
    i18nKey: "ZAPOTRZEBOWANIE-UJEMNE",
    technicalMessage: `zapotrzebowanieDoboweKwh = ${value}, oczekiwano >= 0`,
    field: "zapotrzebowanieDoboweKwh",
  }
}

export function sprawnoscPozaZakresem(value: number): Warning {
  return {
    code: "SPRAWNOSC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "SPRAWNOSC-PROCENT-POZA-ZAKRESEM",
    technicalMessage: `sprawnoscFalownikaPct = ${value}, oczekiwano [0, 100]`,
    field: "sprawnoscFalownikaPct",
  }
}

export function dodPozaZakresem(value: number): Warning {
  return {
    code: "DOD-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "DOD-POZA-ZAKRESEM",
    technicalMessage: `dodPct = ${value}, oczekiwano [0, 100]`,
    field: "dodPct",
  }
}

export function wplywNaMagazyn(dniAutonomii: number, pojemnoscKwh: number): Warning {
  return {
    code: "WPLYW-NA-MAGAZYN",
    level: "info",
    i18nKey: "WPLYW-NA-MAGAZYN",
    params: { dni: dniAutonomii, pojemnosc: pojemnoscKwh.toFixed(1) },
    technicalMessage: `dniAutonomii=${dniAutonomii}, pojemnoscUzytecznaSzacowanaKwh=${pojemnoscKwh}`,
  }
}
