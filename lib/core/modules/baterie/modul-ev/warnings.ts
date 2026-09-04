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

export function pokryteWCalosci(sezon: string): Warning {
  return {
    code: "POKRYTE-W-CALOSCI",
    level: "info",
    message: `${sezon}: nadwyżka PV w pełni pokrywa ładowanie EV.`,
    technicalMessage: `sezon=${sezon}, brakKwh=0`,
  }
}

export function brakujeEnergii(sezon: string, brakKwh: number): Warning {
  return {
    code: "BRAKUJE-ENERGII",
    level: "warning",
    message: `${sezon}: brakuje ${brakKwh.toFixed(1)} kWh/dobę — trzeba sięgnąć po baterię domową, agregat, sieć lub zwiększyć PV.`,
    technicalMessage: `sezon=${sezon}, brakKwh=${brakKwh}`,
  }
}
