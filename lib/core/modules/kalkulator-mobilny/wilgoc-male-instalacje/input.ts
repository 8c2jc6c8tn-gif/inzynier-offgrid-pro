/**
 * Ekran 23, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Zabezpieczenia przeciwwilgociowe dla małych
 * instalacji" (dawne 8.46, `docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md`; pełna treść: Biblia §12.34).
 * `Tresc`: "uproszczona wersja Modułu 4, Ekran 10 (kondensacja) — dla warunków garaż/piwnica/namiot/jacht,
 * z doborem stopnia IP wg środowiska". Runda M12 „uproszczone wersje” (hybryda): wrapper — próg IP i
 * ostrzeżenie z silnika M4/E10, punkt rosy zostaje w M4/E10 (odsyłacz w UI).
 */

/** Miejsca wymienione w źródle (Biblia §12.34, "Skąd czerpie dane"). */
export type MiejsceMalejInstalacji = "garaz" | "piwnica" | "namiot" | "jacht"

export type WilgocMaleInstalacjeInput = {
  /** Gdzie stoi instalacja. `null` = jeszcze nie wybrano. */
  miejsce: MiejsceMalejInstalacji | null
  /** Czy miejsce jest narażone na wilgoć (źródło: "System sprawdza, czy mała instalacja jest narażona na wilgoć"). `null` = brak odpowiedzi. */
  narazoneNaWilgoc: boolean | null
  /** Kod IP obudowy (np. 55 dla IP55) — opcje jak M4/E10. 0 = jeszcze nie wybrano. */
  ipKod: number
}
