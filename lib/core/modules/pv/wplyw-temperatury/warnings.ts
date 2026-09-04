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

export function utrataMocy(temperaturaPanelaC: number, strataPct: number) {
  return {
    code: "UTRATA-MOCY",
    level: "info" as const,
    message: `Panel przy ${temperaturaPanelaC.toFixed(0)}°C traci ok. ${strataPct.toFixed(1)}% mocy względem wartości katalogowej (mierzonej w 25°C).`,
    technicalMessage: `temperaturaPanelaC=${temperaturaPanelaC}, strataPct=${strataPct}`,
  } satisfies Warning
}
