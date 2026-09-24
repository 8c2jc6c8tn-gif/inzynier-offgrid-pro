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
/** Zakres kąta wzniesienia horyzontu przeszkód [°]. */
export const HORYZONT_MIN_DEG = 0
export const HORYZONT_MAX_DEG = 90

export const SZEROKOSC_MIN = -90
export const SZEROKOSC_MAX = 90
export const DLUGOSC_MIN = -180
export const DLUGOSC_MAX = 180

/**
 * Model Muneera (1990) w postaci stosowanej przez PVGIS — A. M. Gracia Amillo, T. Huld,
 * "Performance comparison of different models for the estimation of global irradiance on
 * inclined surfaces", JRC, EUR 26075 EN, 2013, równ. 28–31.
 */
/** Współczynnik N dla powierzchni zacienionej lub nieba zachmurzonego (równ. 28). */
export const MUNEER_N_ZACIENIONA = 0.25227
/** N = a + b·Kb + c·Kb² dla powierzchni nasłonecznionej (równ. 29–30). */
export const MUNEER_N_A = 0.00263
export const MUNEER_N_B = -0.712
export const MUNEER_N_C = -0.6883
/** Korekta niskiego słońca (równ. 30): stosowana, gdy wysokość słońca < 0,1 rad; mianownik 0,1 − 0,008·h. */
export const MUNEER_PROG_NISKIE_SLONCE_RAD = 0.1
export const MUNEER_NISKIE_SLONCE_B = 0.008

/** Zmodyfikowany wskaźnik przejrzystości Pereza (równ. 31): kt' = kt / (0,1 + 1,031·exp(−1,4 / (0,9 + 9,4/AM))). */
export const PEREZ_KT_A = 0.1
export const PEREZ_KT_B = 1.031
export const PEREZ_KT_C = 1.4
export const PEREZ_KT_D = 0.9
export const PEREZ_KT_E = 9.4
/** Niebo zachmurzone, gdy kt' < 0,3 (klasyfikacja Ineichena 2011, przyjęta w EUR 26075). */
export const PROG_ZACHMURZENIA_KT = 0.3

/** Stała słoneczna [W/m²] — wartość przyjęta w EUR 26075 (s. z równ. 15). */
export const STALA_SLONECZNA_W_M2 = 1367
/** Poprawka mimośrodu orbity — Duffie–Beckman, równ. 1.4.1a: Gon = Gsc·(1 + 0,033·cos(360·n/365)). */
export const MIMOSROD_AMPL = 0.033
export const DNI_ROKU = 365
