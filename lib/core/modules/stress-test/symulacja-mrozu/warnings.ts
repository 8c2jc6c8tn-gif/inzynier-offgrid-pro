import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "SYMMR-WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "SYMMR-WARTOSC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function wartoscNiedodatnia(field: string, value: number): Warning {
  return {
    code: "SYMMR-WARTOSC-NIEDODATNIA",
    level: "critical",
    i18nKey: "SYMMR-WARTOSC-NIEDODATNIA",
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function wartoscPozaZakresem(field: string, value: number, min: number, max: number): Warning {
  return {
    code: "SYMMR-WARTOSC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "SYMMR-WARTOSC-POZA-ZAKRESEM",
    params: { min, max },
    technicalMessage: `${field} = ${value}, oczekiwano [${min}, ${max}]`,
    field,
  }
}

export function liczbaDniPozaZakresem(n: number): Warning {
  return {
    code: "SYMMR-LICZBA-DNI-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "SYMMR-LICZBA-DNI-POZA-ZAKRESEM",
    params: { n },
    technicalMessage: `produkcjaDobowaKwh ma ${n} wartości, oczekiwano 1..31`,
    field: "produkcjaDobowaKwh",
  }
}

export function zaDuzoScenariuszy(n: number, maks: number): Warning {
  return {
    code: "SYMMR-ZA-DUZO-SCENARIUSZY",
    level: "critical",
    i18nKey: "SYMMR-ZA-DUZO-SCENARIUSZY",
    params: { n, maks },
    technicalMessage: `scenariusze: ${n}, maksimum ${maks}`,
    field: "scenariusze",
  }
}

/** Heating is not in the demand — the deficits are understated (no building data, or a fuel source). */
export function bezOgrzewania(przyczyna: "brak-budynku" | "paliwo"): Warning {
  return {
    code: "SYMMR-BEZ-OGRZEWANIA",
    level: przyczyna === "brak-budynku" ? "warning" : "info",
    i18nKey: przyczyna === "brak-budynku" ? "SYMMR-BEZ-OGRZEWANIA-BRAK-BUDYNKU" : "SYMMR-BEZ-OGRZEWANIA-PALIWO",
    technicalMessage:
      przyczyna === "brak-budynku"
        ? "Brak danych budynku (M6/E1): zapotrzebowanie bez ogrzewania, deficyty zaniżone"
        : "Źródło ciepła na paliwo: ogrzewanie nie obciąża prądu, liczone tylko ciepło",
  }
}
