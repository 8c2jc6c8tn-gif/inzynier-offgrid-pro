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

export function wymaganyTypB(zainstalowanyTyp: string): Warning {
  return {
    code: "WYMAGANY-TYP-B",
    level: "critical",
    i18nKey: "WYMAGANY-TYP-B",
    params: { typ: zainstalowanyTyp },
    technicalMessage: `falownikHybrydowy=true, zainstalowanyTyp=${zainstalowanyTyp}`,
  }
}

export function wymaganyTypAMinimum(): Warning {
  return {
    code: "WYMAGANY-TYP-A-MINIMUM",
    level: "critical",
    i18nKey: "WYMAGANY-TYP-A-MINIMUM",
    technicalMessage: "odbiornikiZSilnikami=true, zainstalowanyTyp=AC",
  }
}

export function progPowyzejOchronyOsob(progMa: number): Warning {
  return {
    code: "PROG-POWYZEJ-OCHRONY-OSOB",
    level: "critical",
    i18nKey: "PROG-POWYZEJ-OCHRONY-OSOB",
    params: { prog: progMa },
    technicalMessage: `celOchrony=osob, progMa=${progMa} > 30`,
  }
}

export function progPowyzejOchronyPozarowej(progMa: number): Warning {
  return {
    code: "PROG-POWYZEJ-OCHRONY-POZAROWEJ",
    level: "critical",
    i18nKey: "PROG-POWYZEJ-OCHRONY-POZAROWEJ",
    params: { prog: progMa },
    technicalMessage: `celOchrony=pozarowa, progMa=${progMa} > 300`,
  }
}

export function dobranyPoprawnie(): Warning {
  return {
    code: "RCD-DOBRANY-POPRAWNIE",
    level: "info",
    i18nKey: "RCD-DOBRANY-POPRAWNIE",
    technicalMessage: "wszystkie sprawdzenia OK",
  }
}
