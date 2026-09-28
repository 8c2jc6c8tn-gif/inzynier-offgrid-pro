import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(pole: string, etykieta: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-UJEMNA",
    params: { label: etykieta },
    technicalMessage: `${pole} = ${value}, oczekiwano >= 0`,
    field: pole,
  }
}

export function procentPozaZakresem(pole: string, value: number): Warning {
  return {
    code: "BLACKOUT-PROCENT-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "BLACKOUT-PROCENT-POZA-ZAKRESEM",
    technicalMessage: `${pole} = ${value}, oczekiwano 0..100 (sprawność > 0)`,
    field: pole,
  }
}

export function socMinNieMniejszyNizStart(start: number, min: number): Warning {
  return {
    code: "BLACKOUT-SOC-MIN-NIE-MNIEJSZY",
    level: "critical",
    i18nKey: "BLACKOUT-SOC-MIN-NIE-MNIEJSZY",
    technicalMessage: `socMinPct = ${min} >= socStartPct = ${start}`,
    field: "socMinPct",
  }
}

export function systemPadnie(dzien: number, dniScenariusza: number, dodatkowaPojemnosc: number, redukcja: number): Warning {
  return {
    code: "BLACKOUT-SYSTEM-PADNIE",
    level: "warning",
    i18nKey: "BLACKOUT-SYSTEM-PADNIE",
    params: { dzien, dni: dniScenariusza, pojemnosc: Math.ceil(dodatkowaPojemnosc), redukcja: Math.ceil(redukcja) },
    technicalMessage: `dniPrzetrwania < dniScenariusza=${dniScenariusza}; awaria w dniu ${dzien}`,
    field: "dniScenariusza",
  }
}

export function systemPrzetrwa(dniScenariusza: number): Warning {
  return {
    code: "BLACKOUT-SYSTEM-PRZETRWA",
    level: "info",
    i18nKey: "BLACKOUT-SYSTEM-PRZETRWA",
    params: { dni: dniScenariusza },
    technicalMessage: `dniPrzetrwania >= dniScenariusza=${dniScenariusza}`,
    field: "dniScenariusza",
  }
}
