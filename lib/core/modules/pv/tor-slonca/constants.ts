/**
 * Tor słońca z godzinową produkcją PV (Etap 1 oceny `docs/tor-slonca-ar-ocena.md`) — stałe organizacyjne, nie fizyka.
 * Fizyka to geometria słońca (`lokalizacja/geometria-slonca`) i nasłonecznienie płaszczyzny
 * (`lokalizacja/orientacja-powierzchni`); model mocy to ten sam uproszczony PR co w ekranie „Kąt i azymut”.
 */

/** Rok niebędący przestępnym, służy tylko do wyznaczenia pozycji słońca w dniach łuków (tor zmienia się między latami o ułamek stopnia). */
export const ROK_ODNIESIENIA = 2025

/** Łuki charakterystyczne: przesilenie letnie, równonoc jesienna (jak w aplikacjach AR), przesilenie zimowe. `miesiac` 1–12. */
export const DNI_LUKOW = [
  { id: "lato", miesiac: 6, dzien: 21 },
  { id: "rownonoc", miesiac: 9, dzien: 23 },
  { id: "zima", miesiac: 12, dzien: 21 },
] as const

/** Dzień reprezentujący wybrany miesiąc na wykresie toru (połowa miesiąca). */
export const DZIEN_WYBRANEGO_MIESIACA = 15

/** Krok próbkowania pozycji słońca [min]: wschód i zachód z dokładnością do tego kroku, linia łuku z tym samym krokiem. */
export const KROK_MIN = 1

/** Co ile minut punkt łuku trafia do wyniku (rysunek); wschód/zachód i maksimum liczone z kroku `KROK_MIN`. */
export const KROK_RYSUNKU_MIN = 5

/** Próbek słońca w obrębie godziny dla energii przy czystym niebie (średnia z podgodzin, nie jeden punkt). */
export const PODPROBEK_NA_GODZINE = 4

/** Granice walidacji formularza — wykrywają pomyłkę jednostek, nie są normą. */
export const MOC_KWP_MAKS = 1000
/** PR z definicji nie przekracza ~1 dla modułu jednostronnego; wartość wyżej to najpewniej błąd (np. wpisane procenty). */
export const PR_MAKS = 1

export const GODZIN_W_DOBIE = 24
export const MIESIECY = 12
export const MIN_W_GODZINIE = 60
