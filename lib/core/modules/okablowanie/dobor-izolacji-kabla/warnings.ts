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

export function izolacjaPonizejTemperatury(izolacja: string, tempC: number, maxC: number): Warning {
  return {
    code: "IZOLACJA-PONIZEJ-TEMPERATURY",
    level: "critical",
    i18nKey: "IZOLACJA-PONIZEJ-TEMPERATURY",
    params: { izolacja, temp: tempC, max: maxC },
    technicalMessage: `izolacja=${izolacja}, maxC=${maxC}, temperaturaMaksymalnaC=${tempC}`,
  }
}

export function izolacjaWystarczajaca(izolacja: string, maxC: number): Warning {
  return {
    code: "IZOLACJA-WYSTARCZAJACA",
    level: "info",
    i18nKey: "IZOLACJA-WYSTARCZA-NA-TEMPERATURE",
    params: { izolacja, max: maxC },
    technicalMessage: `izolacja=${izolacja}`,
  }
}
