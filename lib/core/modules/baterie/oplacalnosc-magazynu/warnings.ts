import type { Warning } from "@/lib/core/calc-result"

export function notPositive(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    i18nKey: "WARTOSC-NIEDODATNIA",
    params: { label },
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function sprawnoscPozaZakresem(value: number): Warning {
  return {
    code: "SPRAWNOSC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "SPRAWNOSC-OGOLNA-POZA-ZAKRESEM",
    technicalMessage: `sprawnoscPct = ${value}, oczekiwano (0, 100]`,
    field: "sprawnoscPct",
  }
}

export function tanszeNizAlternatywa(kosztZaKwh: number, alternatywaZaKwh: number): Warning {
  return {
    code: "TANSZE-NIZ-ALTERNATYWA",
    level: "info",
    i18nKey: "TANSZE-NIZ-ALTERNATYWA",
    params: { koszt: kosztZaKwh.toFixed(2), alt: alternatywaZaKwh.toFixed(2) },
    technicalMessage: `kosztZaKwh = ${kosztZaKwh} < kosztAlternatywyZlZaKwh = ${alternatywaZaKwh}`,
  }
}

export function drozszeNizAlternatywa(kosztZaKwh: number, alternatywaZaKwh: number): Warning {
  return {
    code: "DROZSZE-NIZ-ALTERNATYWA",
    level: "warning",
    i18nKey: "DROZSZE-NIZ-ALTERNATYWA",
    params: { koszt: kosztZaKwh.toFixed(2), alt: alternatywaZaKwh.toFixed(2) },
    technicalMessage: `kosztZaKwh = ${kosztZaKwh} >= kosztAlternatywyZlZaKwh = ${alternatywaZaKwh}`,
  }
}
