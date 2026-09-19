import type { Warning } from "@/lib/core/calc-result"

export function wartoscNiedodatnia(pole: string, etykieta: string, value: number): Warning {
  return {
    code: "WARTOSC-NIEDODATNIA",
    level: "critical",
    i18nKey: "WARTOSC-NIEDODATNIA",
    params: { label: etykieta },
    technicalMessage: `${pole} = ${value}, oczekiwano > 0`,
    field: pole,
  }
}

export function sprawnoscPozaZakresem(value: number): Warning {
  return {
    code: "SPRAWNOSC-PROCENT-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "SPRAWNOSC-PROCENT-POZA-ZAKRESEM",
    technicalMessage: `sprawnoscPct = ${value}, oczekiwano (0, 100]`,
    field: "sprawnoscPct",
  }
}

export function niskieObciazenie(obciazeniePct: number): Warning {
  return {
    code: "NISKIE-OBCIAZENIE-FALOWNIKA",
    level: "warning",
    i18nKey: "NISKIE-OBCIAZENIE-FALOWNIKA",
    params: { obciazenie: obciazeniePct.toFixed(1) },
    technicalMessage: `obciazeniePct=${obciazeniePct} < PROG_NISKIEGO_OBCIAZENIA_PCT`,
  }
}

export function obciazenieOptymalne(obciazeniePct: number): Warning {
  return {
    code: "OBCIAZENIE-FALOWNIKA-OPTYMALNE",
    level: "info",
    i18nKey: "OBCIAZENIE-FALOWNIKA-OPTYMALNE",
    params: { obciazenie: obciazeniePct.toFixed(1) },
    technicalMessage: `obciazeniePct=${obciazeniePct} w zakresie optymalnym`,
  }
}
