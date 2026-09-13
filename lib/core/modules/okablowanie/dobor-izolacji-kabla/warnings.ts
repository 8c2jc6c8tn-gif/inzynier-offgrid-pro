import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    message: "Wartość nie może być ujemna.",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function izolacjaPonizejTemperatury(izolacja: string, tempC: number, maxC: number): Warning {
  return {
    code: "IZOLACJA-PONIZEJ-TEMPERATURY",
    level: "critical",
    message: `Izolacja ${izolacja} wytrzymuje do ${maxC}°C, a spodziewana temperatura to ${tempC}°C — pęknie i puści wilgoć. Użyj izolacji o wyższej odporności termicznej.`,
    technicalMessage: `izolacja=${izolacja}, maxC=${maxC}, temperaturaMaksymalnaC=${tempC}`,
  }
}

export function izolacjaWystarczajaca(izolacja: string, maxC: number): Warning {
  return {
    code: "IZOLACJA-WYSTARCZAJACA",
    level: "info",
    message: `Izolacja ${izolacja} (do ${maxC}°C) wytrzyma spodziewaną temperaturę w tym miejscu.`,
    technicalMessage: `izolacja=${izolacja}`,
  }
}
