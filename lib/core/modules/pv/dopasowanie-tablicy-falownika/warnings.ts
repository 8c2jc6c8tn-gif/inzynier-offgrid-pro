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

export function oknoMpptOdwrocone(mpptMinV: number, mpptMaxV: number): Warning {
  return {
    code: "OKNO-MPPT-ODWROCONE",
    level: "critical",
    message: "Dolna granica okna MPPT nie może być większa od górnej.",
    technicalMessage: `mpptMinV=${mpptMinV} > mpptMaxV=${mpptMaxV}`,
  }
}

export function napiecieZimoweZaWysokie(vStringColdV: number, vMaxFalownikaV: number): Warning {
  return {
    code: "NAPIECIE-ZIMOWE-ZA-WYSOKIE",
    level: "critical",
    message: `Napięcie stringu w najzimniejszych warunkach (${vStringColdV.toFixed(1)} V) przekracza maksymalne dopuszczalne napięcie DC falownika (${vMaxFalownikaV.toFixed(1)} V) — realne ryzyko trwałego uszkodzenia falownika w mroźny, słoneczny poranek. Zmniejsz liczbę paneli w stringu.`,
    technicalMessage: `vStringColdV=${vStringColdV} > vMaxFalownikaV=${vMaxFalownikaV}`,
  }
}

export function napiecieZimoweOk(vStringColdV: number, vMaxFalownikaV: number): Warning {
  return {
    code: "NAPIECIE-ZIMOWE-OK",
    level: "info",
    message: `Napięcie stringu w najzimniejszych warunkach (${vStringColdV.toFixed(1)} V) mieści się w limicie falownika (${vMaxFalownikaV.toFixed(1)} V).`,
    technicalMessage: `vStringColdV=${vStringColdV} <= vMaxFalownikaV=${vMaxFalownikaV}`,
  }
}

export function ponizejOknaMppt(vStringStcV: number, mpptMinV: number): Warning {
  return {
    code: "PONIZEJ-OKNA-MPPT",
    level: "critical",
    message: `Napięcie robocze stringu (${vStringStcV.toFixed(1)} V) jest poniżej dolnej granicy okna MPPT falownika (${mpptMinV.toFixed(1)} V) — falownik może nie odnaleźć punktu mocy maksymalnej albo w ogóle nie wystartować. Dodaj panele do stringu.`,
    technicalMessage: `vStringStcV=${vStringStcV} < mpptMinV=${mpptMinV}`,
  }
}

export function powyzejOknaMppt(vStringStcV: number, mpptMaxV: number): Warning {
  return {
    code: "POWYZEJ-OKNA-MPPT",
    level: "warning",
    message: `Napięcie robocze stringu (${vStringStcV.toFixed(1)} V) przekracza górną granicę okna MPPT falownika (${mpptMaxV.toFixed(1)} V) — falownik może obcinać dostępną moc. Usuń panel ze stringu albo rozdziel na dwa krótsze stringi.`,
    technicalMessage: `vStringStcV=${vStringStcV} > mpptMaxV=${mpptMaxV}`,
  }
}

export function wOknieMppt(vStringStcV: number, mpptMinV: number, mpptMaxV: number): Warning {
  return {
    code: "W-OKNIE-MPPT",
    level: "info",
    message: `Napięcie robocze stringu (${vStringStcV.toFixed(1)} V) mieści się w oknie MPPT falownika (${mpptMinV.toFixed(1)}-${mpptMaxV.toFixed(1)} V).`,
    technicalMessage: `mpptMinV=${mpptMinV} <= vStringStcV=${vStringStcV} <= mpptMaxV=${mpptMaxV}`,
  }
}

export function pradPrzekroczony(iStringA: number, iMaxMpptA: number): Warning {
  return {
    code: "PRAD-PRZEKROCZONY",
    level: "critical",
    message: `Prąd roboczy stringu (${iStringA.toFixed(1)} A) przekracza maksymalny prąd wejściowy MPPT falownika (${iMaxMpptA.toFixed(1)} A) — ryzyko uszkodzenia wejścia MPPT. Rozdziel panele na osobne MPPT albo wybierz panel o niższym Imp.`,
    technicalMessage: `iStringA=${iStringA} > iMaxMpptA=${iMaxMpptA}`,
  }
}

export function pradOk(iStringA: number, iMaxMpptA: number): Warning {
  return {
    code: "PRAD-OK",
    level: "info",
    message: `Prąd roboczy stringu (${iStringA.toFixed(1)} A) mieści się w limicie MPPT falownika (${iMaxMpptA.toFixed(1)} A).`,
    technicalMessage: `iStringA=${iStringA} <= iMaxMpptA=${iMaxMpptA}`,
  }
}

export function przewymiarowanieZaMale(dcAcRatio: number, minZalecany: number): Warning {
  return {
    code: "DC-AC-ZA-MALE",
    level: "warning",
    message: `Stosunek mocy PV do mocy AC falownika (${dcAcRatio.toFixed(2)}) jest poniżej zalecanego zakresu (${minZalecany.toFixed(1)}-1,3 dla off-gridu) — falownik nie wykorzysta swojego potencjału, zwłaszcza przy słabszym świetle.`,
    technicalMessage: `dcAcRatio=${dcAcRatio} < ${minZalecany}`,
  }
}

export function przewymiarowanieZaDuze(dcAcRatio: number, maxZalecany: number): Warning {
  return {
    code: "DC-AC-ZA-DUZE",
    level: "warning",
    message: `Stosunek mocy PV do mocy AC falownika (${dcAcRatio.toFixed(2)}) przekracza zalecany zakres (1,1-${maxZalecany.toFixed(1)} dla off-gridu) — ryzyko obcinania mocy w słoneczne dni, przegrzewania i skróconej żywotności falownika.`,
    technicalMessage: `dcAcRatio=${dcAcRatio} > ${maxZalecany}`,
  }
}

export function przewymiarowanieOk(dcAcRatio: number): Warning {
  return {
    code: "DC-AC-OK",
    level: "info",
    message: `Stosunek mocy PV do mocy AC falownika (${dcAcRatio.toFixed(2)}) mieści się w zalecanym zakresie 1,1-1,3 dla off-gridu.`,
    technicalMessage: `1.1 <= dcAcRatio=${dcAcRatio} <= 1.3`,
  }
}
