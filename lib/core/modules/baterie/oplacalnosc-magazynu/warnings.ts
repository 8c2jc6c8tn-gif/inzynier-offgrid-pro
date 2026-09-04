import type { Warning } from "@/lib/core/calc-result"

export function notPositive(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    message: `Wartość pola "${label}" musi być większa od zera.`,
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function sprawnoscPozaZakresem(value: number): Warning {
  return {
    code: "SPRAWNOSC-POZA-ZAKRESEM",
    level: "critical",
    message: "Sprawność musi być z przedziału 0–100%.",
    technicalMessage: `sprawnoscPct = ${value}, oczekiwano (0, 100]`,
    field: "sprawnoscPct",
  }
}

export function tanszeNizAlternatywa(kosztZaKwh: number, alternatywaZaKwh: number): Warning {
  return {
    code: "TANSZE-NIZ-ALTERNATYWA",
    level: "info",
    message: `Koszt energii z magazynu (${kosztZaKwh.toFixed(2)} zł/kWh) jest niższy niż koszt alternatywy (${alternatywaZaKwh.toFixed(2)} zł/kWh) — magazyn się opłaca.`,
    technicalMessage: `kosztZaKwh = ${kosztZaKwh} < kosztAlternatywyZlZaKwh = ${alternatywaZaKwh}`,
  }
}

export function drozszeNizAlternatywa(kosztZaKwh: number, alternatywaZaKwh: number): Warning {
  return {
    code: "DROZSZE-NIZ-ALTERNATYWA",
    level: "warning",
    message: `Koszt energii z magazynu (${kosztZaKwh.toFixed(2)} zł/kWh) jest wyższy niż koszt alternatywy (${alternatywaZaKwh.toFixed(2)} zł/kWh) — przy tych parametrach magazyn się nie zwraca.`,
    technicalMessage: `kosztZaKwh = ${kosztZaKwh} >= kosztAlternatywyZlZaKwh = ${alternatywaZaKwh}`,
  }
}
