import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "PRZES-WARTOSC-UJEMNA",
    level: "critical",
    params: { pole: field },
    technicalMessage: `${field} = ${value}, expected >= 0`,
    field,
  }
}

export function godzinaPozaDoba(field: string, value: number, max: number): Warning {
  return {
    code: "PRZES-GODZINA-POZA-DOBA",
    level: "critical",
    params: { pole: field, max },
    technicalMessage: `${field} = ${value}, expected 0..${max}`,
    field,
  }
}

export function pozaSiatka(field: string, value: number, krok: number): Warning {
  return {
    code: "PRZES-POZA-SIATKA",
    level: "critical",
    params: { pole: field, krokMin: krok * 60 },
    technicalMessage: `${field} = ${value} is not a multiple of ${krok} h`,
    field,
  }
}

export function terminPrzedStartem(nazwa: string, od: string, doH: string): Warning {
  return {
    code: "PRZES-TERMIN-PRZED-STARTEM",
    level: "critical",
    params: { nazwa, od, do: doH },
    technicalMessage: `task ${nazwa}: deadline ${doH} <= earliest start ${od}`,
  }
}

export function zadaniePozaOknem(nazwa: string, czas: number, od: string, doH: string): Warning {
  return {
    code: "PRZES-ZADANIE-POZA-OKNEM",
    level: "warning",
    params: { nazwa, czas, od, do: doH },
    technicalMessage: `task ${nazwa}: ${czas} h does not fit between ${od} and ${doH}`,
  }
}

export function zadanieBezNadwyzki(nazwa: string, start: string): Warning {
  return {
    code: "PRZES-ZADANIE-BEZ-NADWYZKI",
    level: "info",
    params: { nazwa, start },
    technicalMessage: `task ${nazwa}: no forecast surplus in its window, earliest start ${start}`,
  }
}
