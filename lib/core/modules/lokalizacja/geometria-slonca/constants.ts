/**
 * Nazwane stałe geometrii słonecznej — zakaz "magicznych liczb" (docs/standards/03-jadro-obliczeniowe.md, 3.2).
 *
 * Współczynniki pozycji słońca pochodzą wprost z algorytmu NOAA Solar Calculator (NOAA Global
 * Monitoring Laboratory), który jest implementacją metody niskiej dokładności z J. Meeus,
 * "Astronomical Algorithms", 2nd ed., 1998, rozdz. 25 (położenie Słońca), 22 (nachylenie
 * ekliptyki) i 28 (równanie czasu). Deklarowana dokładność NOAA: ok. 0,0167° dla lat 1800–2100.
 */

/** Dzień juliański epoki J2000.0 (2000-01-01 12:00 TT). */
export const JD_J2000 = 2451545.0
/** Dzień juliański odpowiadający 1970-01-01 00:00 UTC (epoka czasu Unix). */
export const JD_EPOKA_UNIX = 2440587.5
export const MS_NA_DOBE = 86_400_000
export const DNI_W_STULECIU_JULIANSKIM = 36525

export const MINUT_NA_DOBE = 1440
/** Obrót Ziemi: 4 minuty czasu na 1° długości geograficznej. */
export const MINUT_NA_STOPIEN = 4

/** Meeus 25.2 — średnia długość geometryczna Słońca L0 [°]. */
export const L0_A = 280.46646
export const L0_B = 36000.76983
export const L0_C = 0.0003032

/** Meeus 25.3 — anomalia średnia Słońca M [°]. */
export const M_A = 357.52911
export const M_B = 35999.05029
export const M_C = 0.0001537

/** Meeus 25.4 — mimośród orbity Ziemi e. */
export const E_A = 0.016708634
export const E_B = 0.000042037
export const E_C = 0.0000001267

/** Meeus 25 — równanie środka C [°]. */
export const C1_A = 1.914602
export const C1_B = 0.004817
export const C1_C = 0.000014
export const C2_A = 0.019993
export const C2_B = 0.000101
export const C3 = 0.000289

/** Meeus 25 — długość pozorna (nutacja + aberracja) [°]. */
export const ABERRACJA = 0.00569
export const NUTACJA_AMPL = 0.00478
export const OMEGA_A = 125.04
export const OMEGA_B = 1934.136

/** Meeus 22.2 — średnie nachylenie ekliptyki [°, ′, ″]. */
export const EPS0_STOPNIE = 23
export const EPS0_MINUTY = 26
export const EPS0_SEKUNDY = 21.448
export const EPS0_B = 46.815
export const EPS0_C = 0.00059
export const EPS0_D = 0.001813
export const EPS_KOREKTA = 0.00256

/** Refrakcja atmosferyczna — przybliżenie z NOAA Solar Calculator [″ łuku]. */
export const REFR_PROG_BRAK_DEG = 85
export const REFR_PROG_WYSOKA_DEG = 5
export const REFR_PROG_HORYZONT_DEG = -0.575
export const REFR_WYSOKA = [58.1, 0.07, 0.000086] as const
export const REFR_HORYZONT = [1735, -518.2, 103.4, -12.79, 0.711] as const
export const REFR_PONIZEJ = 20.774
export const SEKUND_NA_STOPIEN = 3600

/**
 * Masa optyczna powietrza — F. Kasten, A. T. Young, "Revised optical air mass tables and
 * approximation formula", Applied Optics 28(22), 1989: AM = 1 / (cos z + a·(b − z)^(−c)), z w stopniach.
 */
export const KY_A = 0.50572
export const KY_B = 96.07995
export const KY_C = 1.6364

/**
 * Promieniowanie bezpośrednie przy bezchmurnym niebie — A. B. Meinel, M. P. Meinel, "Applied
 * Solar Energy", 1976: I_D = 1,353 · 0,7^(AM^0,678) [kW/m²]. Używane w tym projekcie wyłącznie
 * jako WAGA WZGLĘDNA (udział procentowy), nie jako prognoza uzysku.
 */
export const MEINEL_I0_KW_M2 = 1.353
export const MEINEL_PODSTAWA = 0.7
export const MEINEL_WYKLADNIK = 0.678
