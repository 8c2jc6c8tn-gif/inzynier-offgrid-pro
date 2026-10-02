/**
 * Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — Część 2D, scalony silnik „wpływ czynnika X na dobór mocy/COP”
 * (dawne 5.69, 5.73–5.100; docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md „2D”; Biblia §6.27.43, §6.27.47–6.27.74).
 * Wzorzec D: jeden ekran z wyborem czynnika, każdy czynnik ma 1–8 własnych pól (Sekcja A źródła), własny wzór
 * (Sekcja B) i komunikat z liczbą (Sekcja C). Silnik nie zna żadnej wartości użytkownika — wszystkie pola wpisuje
 * user albo przepisuje z ekranów Części 1 (Dyrektywa #1).
 */

/** Czynniki z fizyką do policzenia. Pozostałe pozycje 2D — patrz `CZYNNIKI_NIEBUDOWANE` w constants.ts. */
export type Czynnik =
  | "okna" // 5.77
  | "dach" // 5.78
  | "podloga" // 5.79
  | "mostki" // 5.75
  | "szczelnosc" // 5.80
  | "wentylacja" // 5.76
  | "wysokosc" // 5.83
  | "rury" // 5.73
  | "zyski-sloneczne" // 5.81, 5.84, 5.86
  | "zyski-bytowe" // 5.82
  | "temp-zasilania" // 5.69
  | "temp-zrodla" // 5.93
  | "temp-powrotu" // 5.95
  | "defrost" // 5.96
  | "ograniczenie-mocy" // 5.97, 5.98
  | "przeplyw" // 5.94
  | "odwierty" // 5.90, 5.91
  | "bufor-starty" // 5.100

/**
 * Klucze pól. Ten sam klucz w kilku czynnikach znaczy to samo (np. `dTK` — różnica temperatur obliczeniowych z
 * Ekranu 1), więc wartość wpisana raz zostaje przy zmianie czynnika.
 */
export type KluczPola =
  | "dTK"
  | "zapotrzebowanieKw"
  | "mocPompyKw"
  | "powierzchniaM2"
  | "uPrzed"
  | "uPo"
  | "gruboscCm"
  | "lambda"
  | "dTGruntK"
  | "hMostkowPrzedWK"
  | "hMostkowPoWK"
  | "kubaturaM3"
  | "nPrzed"
  | "nPo"
  | "strumienM3H"
  | "etaPrzedPct"
  | "etaPoPct"
  | "wentylatoryKwhDoba"
  | "powierzchniaPodlogiM2"
  | "obwodM"
  | "uScian"
  | "hPrzedM"
  | "hPoM"
  | "dlugoscRurM"
  | "psiPrzed"
  | "psiPo"
  | "tWodyC"
  | "tOtoczeniaC"
  | "godzinyH"
  | "powierzchniaOkienM2"
  | "g"
  | "napromieniowanieKwhM2"
  | "zacienieniePrzedPct"
  | "zacieniePoPct"
  | "godzinySezonuH"
  | "zyskiKwhDoba"
  | "dniSezonu"
  | "tPrzedC"
  | "tPoC"
  | "copPrzed"
  | "copPo"
  | "cieploSezonKwh"
  | "defrostKwhDoba"
  | "dniSzronienia"
  | "zuzyciePompySezonKwh"
  | "ograniczeniePct"
  | "copOgraniczony"
  | "mocFalownikaKw"
  | "dTObieguK"
  | "liczbaA"
  | "glebokoscAM"
  | "liczbaB"
  | "glebokoscBM"
  | "cenaZlM"
  | "wNaM"
  | "obciazenieKw"
  | "wodaInstalacjiL"
  | "buforL"
  | "histerezaK"

export type WplywCzynnikaInput = {
  /** Wybrany czynnik; null = nie wybrano. */
  czynnik: Czynnik | null
  /** Wartości pól; brak klucza albo 0 = nie wpisano (dla pól temperatury: brak klucza = nie wpisano). */
  pola: Partial<Record<KluczPola, number>>
}
