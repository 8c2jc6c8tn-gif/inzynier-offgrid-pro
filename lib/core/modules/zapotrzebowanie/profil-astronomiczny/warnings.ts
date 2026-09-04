import type { Warning } from "@/lib/core/calc-result"

export function szerokoscPozaZakresem(value: number): Warning {
  return {
    code: "SZEROKOSC-POZA-ZAKRESEM",
    level: "critical",
    message: "Szerokość geograficzna musi być z przedziału -90–90°.",
    technicalMessage: `szerokoscGeograficzna = ${value}, oczekiwano [-90, 90]`,
    field: "szerokoscGeograficzna",
  }
}

export function dzienPozaZakresem(value: number): Warning {
  return {
    code: "DZIEN-ROKU-POZA-ZAKRESEM",
    level: "critical",
    message: "Dzień roku musi być z przedziału 1–365.",
    technicalMessage: `dzienRoku = ${value}, oczekiwano [1, 365]`,
    field: "dzienRoku",
  }
}

export function mocOdbiornikaUjemna(value: number): Warning {
  return {
    code: "MOC-ODBIORNIKA-UJEMNA",
    level: "critical",
    message: "Moc odbiornika nie może być ujemna.",
    technicalMessage: `mocOdbiornikaNocnegoW = ${value}, oczekiwano >= 0`,
    field: "mocOdbiornikaNocnegoW",
  }
}

export function nocPolarnaLubDzienPolarny(dlugoscDniaH: number): Warning {
  return {
    code: "NOC-DZIEN-POLARNY",
    level: "info",
    message:
      dlugoscDniaH === 0
        ? "Na tej szerokości geograficznej w tym dniu Słońce w ogóle nie wschodzi (noc polarna)."
        : "Na tej szerokości geograficznej w tym dniu Słońce nie zachodzi (dzień polarny).",
    technicalMessage: `dlugoscDniaH=${dlugoscDniaH}`,
  }
}

export function energiaNocna(mocW: number, dlugoscNocyH: number, energiaKwh: number): Warning {
  return {
    code: "ENERGIA-NOCNA",
    level: "info",
    message: `Odbiornik ${mocW} W pracujący przez całą noc (${dlugoscNocyH.toFixed(1)} h) zużywa ${energiaKwh.toFixed(2)} kWh tej doby.`,
    technicalMessage: `mocW=${mocW}, dlugoscNocyH=${dlugoscNocyH}, energiaKwh=${energiaKwh}`,
  }
}
