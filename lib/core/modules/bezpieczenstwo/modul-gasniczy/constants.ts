import type { SrodekGasniczy } from "./input"

/**
 * Minimalna liczba niezależnych czujników potwierdzenia alarmu. Źródło: Tresc_Modul_8, Ekran 4, B.1 —
 * „dopiero po potwierdzeniu alarmu (np. dwa niezależne czujniki, żeby uniknąć fałszywego zadziałania)”.
 * Potwierdzenie wymaga co najmniej drugiego, niezależnego czujnika — 2 to przykład źródła, a zarazem minimum.
 */
export const MIN_CZUJNIKOW_POTWIERDZENIA = 2

/** Nie gaszą wewnętrznej reakcji ogniwa LiFePO4 — wymienione wprost (Tresc_Modul_8, Ekran 4, przypomnienie z M4). */
export const SRODKI_NIESKUTECZNE_LIFEPO4: readonly SrodekGasniczy[] = ["proszek", "co2"]

/** Wymagane dla LiFePO4: „agregat wodny/mgłowy lub specjalny środek do magazynów energii”. */
export const SRODKI_WYMAGANE_LIFEPO4: readonly SrodekGasniczy[] = ["mgla-wodna", "specjalny-magazyn-energii"]
