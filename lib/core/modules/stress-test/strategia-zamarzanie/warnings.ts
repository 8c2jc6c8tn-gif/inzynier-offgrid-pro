import type { Warning } from "@/lib/core/calc-result"

export function procentPozaZakresem(pole: string, value: number): Warning {
  return {
    code: "ZAMARZANIE-PROCENT-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "ZAMARZANIE-PROCENT-POZA-ZAKRESEM",
    technicalMessage: `${pole} = ${value}, oczekiwano 0..100 (sprawność > 0)`,
    field: pole,
  }
}

export function pojemnoscUjemna(value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-UJEMNA",
    params: { label: "Pojemność baterii" },
    technicalMessage: `pojemnoscKwh = ${value}, oczekiwano >= 0`,
    field: "pojemnoscKwh",
  }
}

export function mocUjemna(indeks: number, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-UJEMNA",
    params: { label: "Moc odbiornika" },
    technicalMessage: `odbiorniki[${indeks}].mocW = ${value}, oczekiwano >= 0`,
    field: `odbiorniki.${indeks}`,
  }
}

export function socPonizejMinimum(): Warning {
  return {
    code: "ZAMARZANIE-SOC-PONIZEJ-MINIMUM",
    level: "critical",
    i18nKey: "ZAMARZANIE-SOC-PONIZEJ-MINIMUM",
    technicalMessage: "socPct <= socMinPct — bateria już na minimum, krytyczne odbiorniki bez zasilania",
    field: "socPct",
  }
}

export function komfortOdlaczony(nazwy: string): Warning {
  return {
    code: "ZAMARZANIE-KOMFORT-ODLACZONY",
    level: "info",
    i18nKey: "ZAMARZANIE-KOMFORT-ODLACZONY",
    params: { nazwy },
    technicalMessage: "priorytet 3 odłączony — brak nadwyżki PV zimą (M2/E12: SoC < 90% lub brak nadwyżki)",
  }
}

export function wazneOdlaczanePrzyProgu(nazwy: string, prog: number): Warning {
  return {
    code: "ZAMARZANIE-WAZNE-PRZY-PROGU",
    level: "info",
    i18nKey: "ZAMARZANIE-WAZNE-PRZY-PROGU",
    params: { nazwy, prog },
    technicalMessage: `priorytet 2 odłączany przy SoC < ${prog}% (M2/E12)`,
  }
}

export function brakKrytycznych(): Warning {
  return {
    code: "ZAMARZANIE-BRAK-KRYTYCZNYCH",
    level: "warning",
    i18nKey: "ZAMARZANIE-BRAK-KRYTYCZNYCH",
    technicalMessage: "brak odbiorników priorytetu 1 z mocą > 0 — nie ma czego chronić przed zamarzaniem",
    field: "odbiorniki",
  }
}
