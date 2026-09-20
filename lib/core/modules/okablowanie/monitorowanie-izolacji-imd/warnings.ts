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

export function ukladItBezImd(): Warning {
  return {
    code: "UKLAD-IT-BEZ-IMD",
    level: "critical",
    i18nKey: "UKLAD-IT-BEZ-IMD",
    technicalMessage: "ukladIt=true, maZainstalowanyImd=false",
  }
}

export function imdZainstalowanyPoprawnie(progKOm: number): Warning {
  return {
    code: "IMD-ZAINSTALOWANY-POPRAWNIE",
    level: "info",
    i18nKey: "IMD-ZAINSTALOWANY-POPRAWNIE",
    params: { prog: progKOm },
    technicalMessage: `maZainstalowanyImd=true, progAlarmuKOm=${progKOm}`,
  }
}

export function ukladNieItImdNiepotrzebny(): Warning {
  return {
    code: "UKLAD-NIE-IT-IMD-NIEPOTRZEBNY",
    level: "info",
    i18nKey: "UKLAD-NIE-IT-IMD-NIEPOTRZEBNY",
    technicalMessage: "ukladIt=false",
  }
}
