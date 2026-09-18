import type { Warning } from "@/lib/core/calc-result"

export function pojemnoscNiedodatnia(value: number): Warning {
  return {
    code: "POJEMNOSC-NIEDODATNIA",
    level: "critical",
    i18nKey: "POJEMNOSC-DZIS-NIEDODATNIA",
    technicalMessage: `pojemnoscUzytecznaDzisKwh = ${value}, oczekiwano > 0`,
    field: "pojemnoscUzytecznaDzisKwh",
  }
}

export function degradacjaPozaZakresem(value: number): Warning {
  return {
    code: "DEGRADACJA-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "DEGRADACJA-POZA-ZAKRESEM",
    technicalMessage: `degradacjaRocznaPct = ${value}, oczekiwano (0, 100]`,
    field: "degradacjaRocznaPct",
  }
}

export function calkowitaDegradacja(degradacjaRocznaPct: number, horyzontLata: number): Warning {
  return {
    code: "CALKOWITA-DEGRADACJA-W-HORYZONCIE",
    level: "critical",
    i18nKey: "CALKOWITA-DEGRADACJA-W-HORYZONCIE",
    params: { rate: degradacjaRocznaPct, lata: horyzontLata },
    technicalMessage: `degradacjaRocznaPct(${degradacjaRocznaPct}) × horyzontLata(${horyzontLata}) >= 100`,
    field: "degradacjaRocznaPct",
  }
}
