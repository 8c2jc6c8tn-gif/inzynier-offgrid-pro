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

export function geometriaNiefizyczna(): Warning {
  return {
    code: "GEOMETRIA-PRETA-NIEFIZYCZNA",
    level: "critical",
    i18nKey: "GEOMETRIA-PRETA-NIEFIZYCZNA",
    technicalMessage: "4×długość/średnica <= e — wzór Dwighta nie ma sensu fizycznego dla tej geometrii (zbyt krótki/gruby pręt)",
  }
}

export function zaDuzoPretow(liczbaPretow: number, max: number): Warning {
  return {
    code: "ZA-DUZO-PRETOW-DO-PROSTEGO-LICZENIA",
    level: "warning",
    i18nKey: "ZA-DUZO-PRETOW-DO-PROSTEGO-LICZENIA",
    params: { liczba: liczbaPretow, max },
    technicalMessage: `liczbaPretow=${liczbaPretow} > ${max} — wymaga realnego projektu geodezyjnego, nie tylko liczenia`,
  }
}

export function uziomZaprojektowany(liczbaPretow: number, rezystancjaOm: number): Warning {
  return {
    code: "UZIOM-ZAPROJEKTOWANY",
    level: "info",
    i18nKey: "UZIOM-ZAPROJEKTOWANY",
    params: { liczba: liczbaPretow, rezystancja: rezystancjaOm.toFixed(1) },
    technicalMessage: `liczbaPretow=${liczbaPretow}, rezystancjaOm=${rezystancjaOm}`,
  }
}
