import type { Warning } from "@/lib/core/calc-result"
import { MIN_ODLEGLOSC_OD_ZWODU_M } from "./constants"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function brakTypu1PrzyOdgromowej(): Warning {
  return {
    code: "BRAK-TYPU-1-PRZY-ODGROMOWEJ",
    level: "critical",
    i18nKey: "BRAK-TYPU-1-PRZY-ODGROMOWEJ",
    technicalMessage: "maInstalacjeOdgromowa=true, wymagany Typ 1",
  }
}

export function zaBliskoZwodu(odlegloscM: number): Warning {
  return {
    code: "ZA-BLISKO-ZWODU",
    level: "critical",
    i18nKey: "ZA-BLISKO-ZWODU",
    params: { odleglosc: odlegloscM, min: MIN_ODLEGLOSC_OD_ZWODU_M },
    technicalMessage: `odlegloscOdZwoduM=${odlegloscM} < ${MIN_ODLEGLOSC_OD_ZWODU_M}`,
  }
}

export function ucPonizejMinimum(ucV: number, ucMinimalneV: number): Warning {
  return {
    code: "UC-PONIZEJ-MINIMUM",
    level: "critical",
    i18nKey: "UC-PONIZEJ-MINIMUM",
    params: { uc: ucV, ucMin: ucMinimalneV.toFixed(0) },
    technicalMessage: `ucSpdV=${ucV} < ucMinimalneV=${ucMinimalneV}`,
  }
}

export function spdUziemionyOsobno(): Warning {
  return {
    code: "SPD-UZIEMIONY-OSOBNO",
    level: "critical",
    i18nKey: "SPD-UZIEMIONY-OSOBNO",
    technicalMessage: "uziemienieViaGsw=false",
  }
}

export function spdDobranyPoprawnie(typWymagany: string): Warning {
  return {
    code: "SPD-DOBRANY-POPRAWNIE",
    level: "info",
    i18nKey: "SPD-DOBRANY-POPRAWNIE",
    params: { typ: typWymagany },
    technicalMessage: `typWymagany=${typWymagany}`,
  }
}
