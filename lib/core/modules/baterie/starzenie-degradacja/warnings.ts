import type { Warning } from "@/lib/core/calc-result"

export function pojemnoscNiedodatnia(value: number): Warning {
  return {
    code: "POJEMNOSC-NIEDODATNIA",
    level: "critical",
    message: "Pojemność użyteczna potrzebna dziś musi być większa od zera.",
    technicalMessage: `pojemnoscUzytecznaDzisKwh = ${value}, oczekiwano > 0`,
    field: "pojemnoscUzytecznaDzisKwh",
  }
}

export function degradacjaPozaZakresem(value: number): Warning {
  return {
    code: "DEGRADACJA-POZA-ZAKRESEM",
    level: "critical",
    message: "Roczny spadek pojemności musi być z przedziału 0–100% (>0).",
    technicalMessage: `degradacjaRocznaPct = ${value}, oczekiwano (0, 100]`,
    field: "degradacjaRocznaPct",
  }
}

export function calkowitaDegradacja(degradacjaRocznaPct: number, horyzontLata: number): Warning {
  return {
    code: "CALKOWITA-DEGRADACJA-W-HORYZONCIE",
    level: "critical",
    message: `Przy ${degradacjaRocznaPct}%/rok przez ${horyzontLata} lat prosty model liniowy degradacji sięga zera lub poniżej — wynik nie ma sensu fizycznego. Sprawdź wpisane wartości.`,
    technicalMessage: `degradacjaRocznaPct(${degradacjaRocznaPct}) × horyzontLata(${horyzontLata}) >= 100`,
    field: "degradacjaRocznaPct",
  }
}
