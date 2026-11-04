/**
 * Named constants — no magic numbers (docs/standards/03-jadro-obliczeniowe.md, 3.2).
 * Sky-detection thresholds are numerical choices (a heuristic), not physical coefficients.
 */

/** 35 mm-equivalent frame 36 × 24 mm: its diagonal defines the "35 mm-equivalent focal length" in EXIF. */
export const SZEROKOSC_KLATKI_35MM_MM = 36
export const WYSOKOSC_KLATKI_35MM_MM = 24
export const DIAGONALA_KLATKI_35MM_MM = Math.hypot(SZEROKOSC_KLATKI_35MM_MM, WYSOKOSC_KLATKI_35MM_MM)

/** Sanity ranges (physical possibility, not norms). */
export const FOV_MIN_DEG = 10
export const FOV_MAX_DEG = 150
export const OGNISKOWA_35MM_MIN_MM = 5
export const OGNISKOWA_35MM_MAX_MM = 1000
export const ROZMIAR_ZDJECIA_MIN_PX = 16
export const ROZMIAR_ZDJECIA_MAX_PX = 20_000
export const NACHYLENIE_KAMERY_MIN_DEG = -90
export const NACHYLENIE_KAMERY_MAX_DEG = 90

export const PELNY_KAT_DEG = 360
/** Horizon profile resolution [°] — the same as the obstacle profile of the shading screen. */
export const KROK_PROFILU_DEG = 1
export const WYSOKOSC_HORYZONTU_MAX_DEG = 90

/** Warnings: the pinhole model gets worse with distance from the optical axis and with tilt. */
export const ODCHYLENIE_OD_OSI_OSTRZEZENIE_DEG = 40
export const FOV_SZEROKOKATNY_OSTRZEZENIE_DEG = 100
export const NACHYLENIE_KAMERY_OSTRZEZENIE_DEG = 45
/** Below this share of the 360° circle the profile is only a fragment — information, not an error. */
export const MALE_POKRYCIE_PROC = 50

/** Largest gap between neighbouring profile bins that is filled by interpolation [bins]. */
export const MAKS_LUKA_INTERPOLACJI_BINOW = 2

/** Sky detection: bright, nearly colourless pixel (overcast / haze). */
export const NIEBO_MIN_JASNOSC_BIALE = 170
export const NIEBO_MAX_ROZNICA_KANALOW_BIALE = 35
/** Sky detection: blue clearly above red and not below green. */
export const NIEBO_PRZEWAGA_NIEBIESKIEGO = 12
/** Minimum run of non-sky pixels that counts as the skyline [share of height] (skips birds, wires). */
export const NIEBO_MIN_SERIA_UDZIAL_WYSOKOSCI = 0.01
export const NIEBO_MIN_SERIA_PX = 3
/** Number of skyline points kept along the photo width. */
export const NIEBO_PUNKTOW_NA_ZDJECIE = 400
/** Median smoothing window [share of the number of points]. */
export const NIEBO_OKNO_MEDIANY_UDZIAL = 0.02

export const MS_NA_MINUTE = 60_000
export const MINUT_NA_GODZINE = 60
