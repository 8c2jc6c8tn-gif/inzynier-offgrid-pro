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

export function wymaganyTypB(zainstalowanyTyp: string): Warning {
  return {
    code: "WYMAGANY-TYP-B",
    level: "critical",
    message: `Falownik hybrydowy wymaga RCD typu B — zainstalowany typ ${zainstalowanyTyp} nie wykryje prądu uszkodzeniowego DC (realne ryzyko porażenia).`,
    technicalMessage: `falownikHybrydowy=true, zainstalowanyTyp=${zainstalowanyTyp}`,
  }
}

export function wymaganyTypAMinimum(): Warning {
  return {
    code: "WYMAGANY-TYP-A-MINIMUM",
    level: "critical",
    message: "Odbiorniki z silnikami wymagają RCD co najmniej typu A — zainstalowany typ AC nie wystarcza.",
    technicalMessage: "odbiornikiZSilnikami=true, zainstalowanyTyp=AC",
  }
}

export function progPowyzejOchronyOsob(progMa: number): Warning {
  return {
    code: "PROG-POWYZEJ-OCHRONY-OSOB",
    level: "critical",
    message: `Próg różnicowy ${progMa} mA jest za wysoki dla ochrony osób — wymagane 30 mA.`,
    technicalMessage: `celOchrony=osob, progMa=${progMa} > 30`,
  }
}

export function progPowyzejOchronyPozarowej(progMa: number): Warning {
  return {
    code: "PROG-POWYZEJ-OCHRONY-POZAROWEJ",
    level: "critical",
    message: `Próg różnicowy ${progMa} mA jest za wysoki dla ochrony przeciwpożarowej — wymagane 300 mA.`,
    technicalMessage: `celOchrony=pozarowa, progMa=${progMa} > 300`,
  }
}

export function dobranyPoprawnie(): Warning {
  return {
    code: "RCD-DOBRANY-POPRAWNIE",
    level: "info",
    message: "Typ RCD i próg różnicowy spełniają wszystkie sprawdzone wymagania.",
    technicalMessage: "wszystkie sprawdzenia OK",
  }
}
