import type { Warning } from "@/lib/core/calc-result"
import { MIN_ODLEGLOSC_OD_ZWODU_M } from "./constants"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    message: "Wartość nie może być ujemna.",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function brakTypu1PrzyOdgromowej(): Warning {
  return {
    code: "BRAK-TYPU-1-PRZY-ODGROMOWEJ",
    level: "critical",
    message: "Budynek ma instalację odgromową — na wejściu do budynku obowiązkowy jest SPD Typ 1 (prąd udarowy 10/350 µs), nie tylko Typ 2.",
    technicalMessage: "maInstalacjeOdgromowa=true, wymagany Typ 1",
  }
}

export function zaBliskoZwodu(odlegloscM: number): Warning {
  return {
    code: "ZA-BLISKO-ZWODU",
    level: "critical",
    message: `Panele ${odlegloscM} m od zwodu piorunochronu (poniżej ${MIN_ODLEGLOSC_OD_ZWODU_M} m) — ryzyko przeskoku iskry. Zwiększ odstęp do min. 1 m lub zastosuj separację izolacyjną.`,
    technicalMessage: `odlegloscOdZwoduM=${odlegloscM} < ${MIN_ODLEGLOSC_OD_ZWODU_M}`,
  }
}

export function ucPonizejMinimum(ucV: number, ucMinimalneV: number): Warning {
  return {
    code: "UC-PONIZEJ-MINIMUM",
    level: "critical",
    message: `Napięcie trwałej pracy SPD (${ucV} V) jest poniżej wymaganego minimum (${ucMinimalneV.toFixed(0)} V = Voc × 1,25) — SPD może ulec uszkodzeniu w normalnej pracy.`,
    technicalMessage: `ucSpdV=${ucV} < ucMinimalneV=${ucMinimalneV}`,
  }
}

export function spdUziemionyOsobno(): Warning {
  return {
    code: "SPD-UZIEMIONY-OSOBNO",
    level: "critical",
    message: "SPD musi być uziemiony przez wspólną Główną Szynę Wyrównawczą (GSW), nigdy osobno.",
    technicalMessage: "uziemienieViaGsw=false",
  }
}

export function spdDobranyPoprawnie(typWymagany: string): Warning {
  return {
    code: "SPD-DOBRANY-POPRAWNIE",
    level: "info",
    message: `SPD ${typWymagany}, Uc wystarczające, uziemienie przez GSW — wszystkie warunki spełnione.`,
    technicalMessage: `typWymagany=${typWymagany}`,
  }
}
