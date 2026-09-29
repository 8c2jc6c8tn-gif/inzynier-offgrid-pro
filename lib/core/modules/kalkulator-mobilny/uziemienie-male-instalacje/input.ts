/**
 * Ekran 38, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Uziemienie małej instalacji" (dawne 8.65,
 * `docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md`; pełna treść: Biblia §12.53). `Tresc`: "uproszczona wersja
 * Modułu 5, Ekran 9/11 (uziemienie) dla instalacji tymczasowych/mobilnych, gdzie pełne uziemienie budynkowe nie ma
 * zastosowania (kamper, jacht)". Runda M12 „uproszczone wersje” (hybryda): wrapper — poziom twardego stopu dla
 * nieuziemionej obudowy falownika z M5/E11; projekt uziomu prętowego (M5/E9) zostaje w M5 (odsyłacz w UI).
 */

/** Rodzaj instalacji (Biblia §12.53, "Skąd czerpie dane": 12V/24V DC, 230V AC z falownika). */
export type RodzajMalejInstalacji = "dc" | "ac230"

/**
 * Miejsca ze źródła: garaż, kamper, jacht ("Skąd czerpie dane") oraz "na zewnątrz" ("Jak działa logika"); namiot — D55
 * (właściciel 29.09.2026: w namiocie nie ma podwozia, więc strategia ochrony jest inna).
 */
export type MiejsceUziemienia = "garaz" | "kamper" | "jacht" | "zewnatrz" | "namiot"

/** Odpowiedź na pytanie kontrolne; "nie-wiem" = strona bezpieczna (traktowane jak "nie", wzorzec M3/E21). */
export type OdpowiedzKontrolna = "tak" | "nie" | "nie-wiem"

export type UziemienieMaleInstalacjeInput = {
  /** `null` = jeszcze nie wybrano. */
  rodzaj: RodzajMalejInstalacji | null
  /** `null` = jeszcze nie wybrano. */
  miejsce: MiejsceUziemienia | null
  /** Tylko dla 230 V AC: czy obudowa falownika jest uziemiona. `null` = brak odpowiedzi. */
  obudowaFalownikaUziemiona: OdpowiedzKontrolna | null
  /** Tylko dla 230 V AC: czy gniazda 230 V mają styk ochronny (bolec/PE) podłączony. `null` = brak odpowiedzi. */
  gniazdaZeStykiemOchronnym: OdpowiedzKontrolna | null
  /**
   * Tylko dla 230 V AC: czy falownik ma połączenie N–PE (fabryczne, przekaźnikiem przełącznika sieci albo wykonane wg
   * instrukcji producenta) — punkt, do którego wraca prąd zwarcia (D54). `null` = brak odpowiedzi.
   */
  polaczenieNPE: OdpowiedzKontrolna | null
  /** Tylko dla 230 V AC: czy za połączeniem N–PE jest wyłącznik różnicowoprądowy (RCD) 30 mA (D54). `null` = brak odpowiedzi. */
  rcd30mA: OdpowiedzKontrolna | null
  /**
   * Tylko dla 230 V AC w kamperze albo na jachcie: czy instalacja bywa zasilana z zewnątrz (słupek na kempingu, keja) —
   * wtedy przewód ochronny przychodzi z sieci (D55). `null` = brak odpowiedzi.
   */
  zasilanieZewnetrzne: "tak" | "nie" | null
  /**
   * Tylko gdy jest zasilanie z zewnątrz i połączenie N–PE w falowniku: czy to połączenie jest rozłączane przy zasilaniu
   * z zewnątrz (np. przekaźnik przełącznika sieci) — inaczej powstaje podwójne połączenie N–PE (D55). `null` = brak odpowiedzi.
   */
  npeRozlaczanePrzyZasilaniuZewnetrznym: OdpowiedzKontrolna | null
}
