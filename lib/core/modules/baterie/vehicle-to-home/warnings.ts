import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function sprawnoscPozaZakresem(value: number): Warning {
  return {
    code: "SPRAWNOSC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "SPRAWNOSC-EFEKTYWNA-POZA-ZAKRESEM",
    technicalMessage: `sprawnoscEfektywnaPct = ${value}, oczekiwano [0, 100]`,
    field: "sprawnoscEfektywnaPct",
  }
}

export function rezerwaWiekszaNizPojemnosc(rezerwa: number, pojemnosc: number): Warning {
  return {
    code: "REZERWA-WIEKSZA-NIZ-POJEMNOSC",
    level: "critical",
    i18nKey: "REZERWA-WIEKSZA-NIZ-POJEMNOSC",
    technicalMessage: `rezerwaNaDojazdKwh=${rezerwa} > pojemnoscBaterEvKwh=${pojemnosc}`,
    field: "rezerwaNaDojazdKwh",
  }
}

export function tylkoV2l(): Warning {
  return {
    code: "TYLKO-V2L",
    level: "warning",
    i18nKey: "TYLKO-V2L",
    technicalMessage: "wspieraV2h=false",
  }
}
