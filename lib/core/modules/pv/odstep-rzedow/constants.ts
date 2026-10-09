/**
 * Odstęp rzędów paneli PV (D81, Moduł 3) — stałe organizacyjne, nie fizyka. Fizyka to geometria słońca
 * (`lokalizacja/geometria-slonca`) i nasłonecznienie płaszczyzny (`lokalizacja/orientacja-powierzchni`).
 */

/** „Zima” wg U1 właściciela: XI, XII, I, II (0 = styczeń) — ta sama definicja co w Porównywarce paneli. */
export const MIESIACE_ZIMOWE_ODRZ: readonly number[] = [10, 11, 0, 1]

/** Dzień projektowy: przesilenie zimowe, 21 grudnia (najniższe słońce w roku). Rok służy tylko do wyznaczenia pozycji słońca. */
export const DZIEN_PROJEKTOWY = { rok: 2026, miesiac: 11, dzien: 21 } as const

/**
 * Domyślne okno „bez cienia” w czasie słonecznym [godz.]. Praktyka projektowa, NIE norma — okno wybiera użytkownik; na
 * szerokości Polski szersze okno daje bardzo duże odstępy (słońce o 9:00 w grudniu stoi ok. 5° nad horyzontem), dlatego
 * ekran pokazuje obok tabelę strat. Do zmiany jedną linią po decyzji właściciela (karta „regułę odstępu” z 09.10.2026).
 */
export const OKNO_PROJEKTOWE_DOMYSLNE = { odH: 9, doH: 15 } as const

/** Krok próbkowania okna projektowego [min]. */
export const KROK_OKNA_MIN = 10

/** Kąty w tabeli porównawczej [°] (kąt użytkownika jest dołączany, jeśli go tu nie ma). */
export const KATY_TABELI_DEG: readonly number[] = [10, 15, 20, 25, 30, 35, 40, 45, 50, 60]

/** Ile punktów ma krzywa „strata w zależności od odstępu” (od 1/N do pełnego odstępu wymaganego). */
export const PUNKTY_KRZYWEJ = 6

/** Dokładność poszukiwania odstępu dla zadanej straty [m] i maksymalna liczba kroków bisekcji. */
export const TOLERANCJA_ODSTEPU_M = 0.005
export const MAKS_KROKOW_BISEKCJI = 40

/** Maksymalna długość stołu wzdłuż spadu uznawana za sensowną [m] (ochrona przed pomyłką w jednostkach). */
export const DLUGOSC_MAKS_M = 20
