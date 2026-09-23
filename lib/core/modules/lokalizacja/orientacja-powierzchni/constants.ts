/**
 * Nazwane stałe — zakaz "magicznych liczb" (docs/standards/03-jadro-obliczeniowe.md, 3.2).
 */

/**
 * Domyślne albedo gruntu 0,2 — wartość typowa przyjmowana dla gruntu bez śniegu w J. A. Duffie,
 * W. A. Beckman, "Solar Engineering of Thermal Processes" (rozdz. 2.15–2.16). Użytkownik może ją
 * zmienić (np. śnieg ma albedo znacznie wyższe) — zawsze raportowana jako założenie.
 */
export const ALBEDO_DOMYSLNE = 0.2
export const ALBEDO_MIN = 0
export const ALBEDO_MAX = 1

/** Rok danych godzinowych: nieprzestępny (8760 h) albo przestępny (8784 h). */
export const GODZIN_W_ROKU = 8760
export const GODZIN_W_ROKU_PRZESTEPNYM = 8784
/** Krok rekordu [h] — dane godzinowe; energia = moc × 1 h. */
export const KROK_GODZIN = 1
export const W_NA_KW = 1000

/** Przeszukiwanie optimum: siatka zgrubna, potem dokładna wokół najlepszego punktu [°]. */
export const KROK_ZGRUBNY_DEG = 5
export const KROK_DOKLADNY_DEG = 1
export const NACHYLENIE_MIN_DEG = 0
export const NACHYLENIE_MAX_DEG = 90
export const AZYMUT_MIN_DEG = 0
export const AZYMUT_MAX_DEG = 360

export const SZEROKOSC_MIN = -90
export const SZEROKOSC_MAX = 90
export const DLUGOSC_MIN = -180
export const DLUGOSC_MAX = 180
