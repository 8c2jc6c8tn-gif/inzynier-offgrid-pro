import type { Warning } from "@/lib/core/calc-result"

/** Source 🔴 (dawne 5.42): a horizontal collector laid no deeper than the frost depth freezes and loses output. */
export function plycejNizPrzemarzanie(glebokoscM: number, przemarzanieM: number): Warning {
  return {
    code: "KOL-PLYCEJ-NIZ-PRZEMARZANIE",
    level: "critical",
    i18nKey: "KOL-PLYCEJ-NIZ-PRZEMARZANIE",
    params: { glebokosc: glebokoscM, przemarzanie: przemarzanieM },
    technicalMessage: `kolektor poziomy na ${glebokoscM} m <= głębokość przemarzania ${przemarzanieM} m`,
    field: "glebokoscUlozeniaM",
  }
}

/** Frost depth not entered — the 🔴 check above was not performed. */
export function brakPrzemarzania(): Warning {
  return {
    code: "KOL-BRAK-PRZEMARZANIA",
    level: "info",
    i18nKey: "KOL-BRAK-PRZEMARZANIA",
    technicalMessage: "glebokoscPrzemarzaniaM nie wpisana — kontrola 🔴 zbyt płytkiego kolektora nie wykonana",
    field: "glebokoscPrzemarzaniaM",
  }
}

/** ✅🤖 🟡: depth outside the source's 1.2–1.8 m (shallower — freezing risk; deeper — cost, source warning). */
export function glebokoscNietypowa(glebokoscM: number, min: number, max: number): Warning {
  return {
    code: "KOL-GLEBOKOSC-NIETYPOWA",
    level: "warning",
    i18nKey: "KOL-GLEBOKOSC-NIETYPOWA",
    params: { glebokosc: glebokoscM, min, max },
    technicalMessage: `glebokoscUlozeniaM = ${glebokoscM} poza zakresem źródła [${min}; ${max}] m`,
    field: "glebokoscUlozeniaM",
  }
}

/** ✅🤖 🟡: borehole depth outside the source's 50–100 m. */
export function odwiertNietypowy(glebokoscM: number, min: number, max: number): Warning {
  return {
    code: "KOL-ODWIERT-NIETYPOWY",
    level: "warning",
    i18nKey: "KOL-ODWIERT-NIETYPOWY",
    params: { glebokosc: glebokoscM, min, max },
    technicalMessage: `glebokoscOdwiertuM = ${glebokoscM} poza zakresem źródła [${min}; ${max}] m`,
    field: "glebokoscOdwiertuM",
  }
}

/** The entered sizing index lies outside the source's range — the result is the user's index, not the source's. */
export function wskaznikSpozaZrodla(pole: "m2Na10Kw" | "wNaMetr", wartosc: number, min: number, max: number): Warning {
  return {
    code: "KOL-WSKAZNIK-SPOZA-ZRODLA",
    level: "info",
    i18nKey: "KOL-WSKAZNIK-SPOZA-ZRODLA",
    params: { wartosc, min, max },
    technicalMessage: `${pole} = ${wartosc} poza zakresem źródła [${min}; ${max}]`,
    field: pole,
  }
}

/** Spiral/basket collectors: the source gives no sizing index — no numbers. */
export function spiralnyBezWskaznika(): Warning {
  return {
    code: "KOL-SPIRALNY-BEZ-WSKAZNIKA",
    level: "info",
    i18nKey: "KOL-SPIRALNY-BEZ-WSKAZNIKA",
    technicalMessage: "kolektor spiralny/koszowy: źródło nie podaje wskaźnika wymiarowania — wynik liczbowy nie liczony",
    field: "typ",
  }
}
