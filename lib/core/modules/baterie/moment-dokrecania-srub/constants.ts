/**
 * Ekran 11, Moduł 4 "Magazyn energii / baterie" — "Moment dokręcania śrub (Torque Control)"
 * (dawne 3.12 — docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md).
 * Wzorzec E — checklist weryfikacyjna: sekwencja "zrób i potwierdź", nie kalkulacja
 * (docs/standards/08-ui-ux.md, 8.2). Wartości momentów dokręcania — dane 1:1 ze źródła.
 */

export type ChecklistItem = {
  id: string
  element: string
  moment: string
  uwaga: string
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "terminal-m6",
    element: "Terminal ogniwa M6 (typowy LiFePO4)",
    moment: "4–4,5 N·m",
    uwaga: "Klucz dynamometryczny, nigdy udarowy.",
  },
  {
    id: "terminal-m8",
    element: "Terminal ogniwa M8",
    moment: "8 N·m",
    uwaga: "—",
  },
  {
    id: "kontrola-24h",
    element: "Kontrola ponowna po 24h",
    moment: "—",
    uwaga: "Sprawdź osiadanie połączenia.",
  },
]

/** Ostrzeżenia stałe, zawsze widoczne — nie są powiązane z konkretnym krokiem. */
export const OSTRZEZENIA_STALE = [
  "Nie stosuj podkładek sprężystych bezpośrednio na terminalu.",
  "Nie używaj pasty miedziowej na aluminium (cross-ref Moduł 5, Ekran 4 — korozja galwaniczna).",
]

/**
 * [13.09.2026] ✅ DODANO — na wyraźną prośbę właściciela projektu: "Moment dokręcania podamy do
 * wyboru dla kilku popularnych ogniw i ich pojemności." Rozwiązuje sprzeczność znalezioną
 * 13.09.2026 (`docs/rejestr-pokrycia.md`, ten wiersz) między oryginalną Biblią v2.0 (M6 ogólne =
 * 4–4,5 N·m) i `Uzupelnienie_Modul_11_Montaz_16S_Praktyczny.md` (M6 wg pojemności = 5–7 N·m) —
 * **nie przez wybór jednej wartości, tylko przez zachowanie obu, poprawnie zakresowanych**
 * (zasada "nie usuwaj — oznacz"): oryginalna wartość zostaje jako opcja "pojemność nieznana",
 * nowe wartości jako opcje per pojemność/model. Żaden inny producent/model niż te dwa źródła
 * podają nie jest tu wymyślony — stąd tylko 5 konkretnych pozycji + 2 uniwersalne fallbacki.
 */
export type SpecyfikacjaMomentu =
  | { rodzaj: "zakres"; minNm: number; maxNm: number }
  | { rodzaj: "maksimum"; maxNm: number }

export type TypOgniwa = {
  id: string
  etykieta: string
  gwint: "M6" | "M8"
  moment: SpecyfikacjaMomentu
  zrodlo: string
}

export const TYPY_OGNIW: TypOgniwa[] = [
  {
    id: "generic-m6",
    etykieta: "Ogniwo LiFePO4 ogólne, pojemność nieznana (M6)",
    gwint: "M6",
    moment: { rodzaj: "zakres", minNm: 4, maxNm: 4.5 },
    zrodlo: "Tresc_Modul_4_Baterie_Ekrany.md (oryginalna Biblia v2.0)",
  },
  {
    id: "50-150ah-m6",
    etykieta: "50–150 Ah, typowe mniejsze ogniwa pryzmatyczne (M6)",
    gwint: "M6",
    moment: { rodzaj: "zakres", minNm: 5, maxNm: 6 },
    zrodlo: "Uzupelnienie_Modul_11_Montaz_16S_Praktyczny.md",
  },
  {
    id: "280ah-m6",
    etykieta: "280 Ah, np. EVE LF280K (M6)",
    gwint: "M6",
    moment: { rodzaj: "zakres", minNm: 6, maxNm: 7 },
    zrodlo: "Uzupelnienie_Modul_11_Montaz_16S_Praktyczny.md (nie przekraczać 8 N·m)",
  },
  {
    id: "eve-mb31-m6",
    etykieta: "EVE MB31, 304/314 Ah, podwójny gwint (M6)",
    gwint: "M6",
    moment: { rodzaj: "maksimum", maxNm: 6 },
    zrodlo: "Uzupelnienie_Modul_11_Montaz_16S_Praktyczny.md",
  },
  {
    id: "wieksze-m8",
    etykieta: "Większe ogniwa (M8)",
    gwint: "M8",
    moment: { rodzaj: "zakres", minNm: 8, maxNm: 10 },
    zrodlo: "Uzupelnienie_Modul_11_Montaz_16S_Praktyczny.md (rozszerza oryginalne 8 N·m)",
  },
  {
    id: "inne-m6",
    etykieta: "Inne / nie na liście (gwint M6)",
    gwint: "M6",
    moment: { rodzaj: "maksimum", maxNm: 4 },
    zrodlo: "Bezpieczny punkt startowy — najniższa znana wartość dla M6 w tym projekcie",
  },
  {
    id: "inne-m8",
    etykieta: "Inne / nie na liście (gwint M8)",
    gwint: "M8",
    moment: { rodzaj: "maksimum", maxNm: 8 },
    zrodlo: "Bezpieczny punkt startowy — najniższa znana wartość dla M8 w tym projekcie",
  },
]

export function znajdzTypOgniwa(id: string): TypOgniwa | undefined {
  return TYPY_OGNIW.find((t) => t.id === id)
}

export function formatujMoment(spec: SpecyfikacjaMomentu): string {
  if (spec.rodzaj === "zakres") {
    return `${spec.minNm.toLocaleString("pl-PL")}–${spec.maxNm.toLocaleString("pl-PL")} N·m`
  }
  return `maks. ${spec.maxNm.toLocaleString("pl-PL")} N·m`
}

/** 1:1 z instrukcją właściciela projektu (2026-09-13): "jeśli nie ma twojego ogniwa, sprawdź w
 *  instrukcji producenta albo użyj bezpiecznego momentu" — pokazywane tylko dla `inne-m6`/`inne-m8`. */
export const OSTRZEZENIE_INNE_OGNIWO =
  "Twojego ogniwa nie ma na liście — sprawdź moment w instrukcji producenta. Jeśli jej nie masz, zacznij od bezpiecznej, niższej wartości i po 24h skontroluj, czy połączenie się nie poluzowało (nigdy nie zgaduj wyższej wartości)."
