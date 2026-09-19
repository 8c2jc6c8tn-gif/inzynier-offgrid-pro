import type { Warning } from "@/lib/core/calc-result"

export function mocUjemna(value: number): Warning {
  return {
    code: "MOC-UJEMNA",
    level: "critical",
    i18nKey: "MOC-UJEMNA",
    technicalMessage: `mocSzczytowaW = ${value}, oczekiwano >= 0`,
    field: "mocSzczytowaW",
  }
}

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function rekomendacjaNapiecia(napiecieV: number): Warning {
  return {
    code: "REKOMENDACJA-NAPIECIA",
    level: "info",
    i18nKey: "REKOMENDACJA-NAPIECIA",
    params: { napiecie: napiecieV },
    technicalMessage: `napiecieRekomendowaneV=${napiecieV}`,
  }
}

/** Etap B.2 — konflikt jednoczesności, waga zależna od udziału odbiorników długotrwałych. */
export function konfliktJednoczesnosci(
  sumaWorstCaseW: number,
  limitW: number,
  wagaOstrzezenia: "warning" | "critical",
  sugerowaneWylaczenie: string[],
): Warning {
  const maPropozycje = sugerowaneWylaczenie.length > 0
  return {
    code: "KONFLIKT-JEDNOCZESNOSCI",
    level: wagaOstrzezenia,
    i18nKey: maPropozycje ? "KONFLIKT-JEDNOCZESNOSCI-Z-PROPOZYCJA" : "KONFLIKT-JEDNOCZESNOSCI",
    params: maPropozycje
      ? { suma: sumaWorstCaseW.toFixed(0), limit: limitW.toFixed(0), urzadzenia: sugerowaneWylaczenie.join(" + ") }
      : { suma: sumaWorstCaseW.toFixed(0), limit: limitW.toFixed(0) },
    technicalMessage: `sumaWorstCaseW=${sumaWorstCaseW} > mocCiaglaFalownikaPlanowanaW=${limitW}`,
  }
}

/** Etap C.1 — tabela decyzyjna: ogrzewanie elektryczne wymaga 48V. */
export function ogrzewanieWymaga48V(napiecieRekomendowaneV: number, ogrzewanieMocW: number): Warning {
  return {
    code: "OGRZEWANIE-WYMAGA-48V",
    level: "warning",
    i18nKey: "OGRZEWANIE-WYMAGA-48V",
    params: { napiecie: napiecieRekomendowaneV, moc: ogrzewanieMocW.toFixed(0) },
    technicalMessage: `ogrzewanieMocW=${ogrzewanieMocW}, napiecieRekomendowaneV=${napiecieRekomendowaneV} < 48`,
  }
}

/** Etap C.3 — 100A przy 12V to prąd rzędu spawarki, realne ryzyko łuku/przegrzania złączek. */
export function pradWysokiPrzy12V(pradPrzy12VA: number): Warning {
  return {
    code: "PRAD-WYSOKI-PRZY-12V",
    level: "critical",
    i18nKey: "PRAD-WYSOKI-PRZY-12V",
    params: { prad: pradPrzy12VA.toFixed(0) },
    technicalMessage: `pradPrzy12VA=${pradPrzy12VA} > 100`,
  }
}

/** Etap H — ostrzeżenie edukacyjne, wyświetlane gdy użytkownik zaznaczy plan konwersji 24V→48V. */
export function pulapkaKonwersji24Do48(): Warning {
  return {
    code: "PULAPKA-KONWERSJI-24-DO-48",
    level: "warning",
    i18nKey: "PULAPKA-KONWERSJI-24-DO-48",
    technicalMessage: "planowanaKonwersja24Do48=true",
  }
}
