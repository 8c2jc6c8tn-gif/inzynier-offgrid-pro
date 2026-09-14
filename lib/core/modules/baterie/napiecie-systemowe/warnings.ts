import type { Warning } from "@/lib/core/calc-result"

export function mocUjemna(value: number): Warning {
  return {
    code: "MOC-UJEMNA",
    level: "critical",
    message: "Obciążenie szczytowe nie może być ujemne.",
    technicalMessage: `mocSzczytowaW = ${value}, oczekiwano >= 0`,
    field: "mocSzczytowaW",
  }
}

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    message: "Wartość nie może być ujemna.",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function rekomendacjaNapiecia(napiecieV: number): Warning {
  return {
    code: "REKOMENDACJA-NAPIECIA",
    level: "info",
    message: `Wyższe napięcie systemowe = mniejszy prąd przy tej samej mocy = cieńsze, tańsze kable. Rekomendowane: ${napiecieV}V.`,
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
  const propozycja =
    sugerowaneWylaczenie.length > 0
      ? ` Nie uruchamiaj razem: ${sugerowaneWylaczenie.join(" + ")}.`
      : ""
  return {
    code: "KONFLIKT-JEDNOCZESNOSCI",
    level: wagaOstrzezenia,
    message: `Zaznaczone odbiorniki w połączeniu pobierają ${sumaWorstCaseW.toFixed(0)} W — to przekracza planowaną moc ciągłą falownika (${limitW.toFixed(0)} W).${propozycja}`,
    technicalMessage: `sumaWorstCaseW=${sumaWorstCaseW} > mocCiaglaFalownikaPlanowanaW=${limitW}`,
  }
}

/** Etap C.1 — tabela decyzyjna: ogrzewanie elektryczne wymaga 48V. */
export function ogrzewanieWymaga48V(napiecieRekomendowaneV: number, ogrzewanieMocW: number): Warning {
  return {
    code: "OGRZEWANIE-WYMAGA-48V",
    level: "warning",
    message: `Zaznaczone ogrzewanie elektryczne (${ogrzewanieMocW.toFixed(0)} W) zwykle wymaga systemu 48V — obecna rekomendacja to ${napiecieRekomendowaneV}V, sprawdź czy to na pewno wystarczy przy długotrwałej pracy grzania.`,
    technicalMessage: `ogrzewanieMocW=${ogrzewanieMocW}, napiecieRekomendowaneV=${napiecieRekomendowaneV} < 48`,
  }
}

/** Etap C.3 — 100A przy 12V to prąd rzędu spawarki, realne ryzyko łuku/przegrzania złączek. */
export function pradWysokiPrzy12V(pradPrzy12VA: number): Warning {
  return {
    code: "PRAD-WYSOKI-PRZY-12V",
    level: "critical",
    message: `Przy 12V ten system pociągnąłby ${pradPrzy12VA.toFixed(0)} A — to prąd rzędu spawarki. Każde poluzowane złącze przy takim prądzie to potencjalny hotspot i ryzyko pożaru. Systemy 12V o prądach powyżej 100A są niezalecane.`,
    technicalMessage: `pradPrzy12VA=${pradPrzy12VA} > 100`,
  }
}

/** Etap H — ostrzeżenie edukacyjne, wyświetlane gdy użytkownik zaznaczy plan konwersji 24V→48V. */
export function pulapkaKonwersji24Do48(): Warning {
  return {
    code: "PULAPKA-KONWERSJI-24-DO-48",
    level: "warning",
    message:
      "Nie łącz dwóch gotowych pakietów 24V szeregowo, żeby uzyskać 48V — BMS-y nie komunikują się ze sobą, ogniwa się rozjadą. Zbuduj pakiet 48V od podstaw (16 ogniw, jeden BMS 16S) — poniżej szacowany koszt przejścia.",
    technicalMessage: "planowanaKonwersja24Do48=true",
  }
}
