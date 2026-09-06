/**
 * Ekran 1, Moduł 5 "Okablowanie i zabezpieczenia" — "Dobór przekroju kabla" (dawne 4.1, 4.18,
 * 4.27, 4.30, `docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md`). Tabele normatywne z
 * `docs/zrodla/norma-PN-HD-60364-5-52/zalacznik-B-tablice-obciazalnosci.md`, w pełni
 * zweryfikowane wizualnie (05.09.2026).
 *
 * Zakres świadomie ograniczony (nie luka — udokumentowana decyzja implementacyjna):
 * - Izolacja żył przyjęta jako PVC (70°C) — Sekcja A źródła nie pyta o typ izolacji. PVC ma niższą
 *   obciążalność niż XLPE/EPR, więc jest bezpiecznym (zachowawczym) domyślnym wyborem, nie zgadywaniem.
 * - Liczba żył obciążonych w obwodzie = 2 (obwód DC lub jednofazowy AC) — źródło nie rozróżnia
 *   DC/AC dalej niż napięciem, więc użyto Tablic dla "dwie żyły obciążone" (B.52.2).
 * - "Sposób ułożenia" (4 opcje z Sekcji A) zmapowany na kolumny metod referencyjnych Tablicy B.52.1:
 *   swobodnie → Metoda C (na ścianie/wolno), w peszlu → Metoda B2 (rura instalacyjna na ścianie,
 *   przewód wielożyłowy — bardziej zachowawcza niż B1), w ziemi → Metoda D (kabel w osłonie w gruncie).
 *   "w wiązce" → baza Metoda C + korekta wiązki (k2) z Tablicy B.52.17 pozycja 2.
 * - Korekta "k3" opisana w źródle jako osobny mnożnik NIE istnieje w tej postaci w samej normie —
 *   norma różnicuje sposób ułożenia przez wybór innej kolumny tabeli (metoda referencyjna), nie
 *   przez wspólny współczynnik. Ten kalkulator stosuje wersję zgodną z normą (wybór kolumny), nie
 *   wymyślony mnożnik k3 — rozbieżność względem uproszczonego opisu źródłowego (napisanego przed
 *   pozyskaniem normy) udokumentowana tu i w `docs/memory.md`, nie ukryta.
 */

export type Material = "Cu" | "Al"
export type SposobUlozenia = "swobodnie" | "w_peszlu" | "w_ziemi" | "w_wiazce"

/** ρ (rezystywność) [Ω·mm²/m] — stałe fizyczne, dane wprost w źródle (Sekcja B, punkt 7). */
export const REZYSTYWNOSC_MIEDZI_OHM_MM2_NA_M = 0.0175
export const REZYSTYWNOSC_ALUMINIUM_OHM_MM2_NA_M = 0.0282

/** Standardowe przekroje kabli, po których iteruje silnik (Sekcja B, punkt 9 — 1:1 ze źródła).
 *  Aluminium nie ma normatywnej wartości dla 1,5 mm² (Tablica B.52.2 zaczyna Al od 2,5 mm²). */
export const PRZEKROJE_MM2: Record<Material, readonly number[]> = {
  Cu: [1.5, 2.5, 4, 6, 10, 16, 25, 35],
  Al: [2.5, 4, 6, 10, 16, 25, 35],
}

/** Obciążalność bazowa [A] — Tablica B.52.2 (izolacja PVC, dwie żyły obciążone, 70°C/30°C powietrze,
 *  20°C grunt). Kolumny użyte: C (metoda referencyjna C — swobodnie/na ścianie), B2 (metoda B2 —
 *  przewód wielożyłowy w rurze instalacyjnej na ścianie, "w peszlu"), D (metoda D — kabel w osłonie
 *  w gruncie, "w ziemi"). */
export const OBCIAZALNOSC_BAZOWA_A: Record<Material, Record<number, { C: number; B2: number; D: number }>> = {
  Cu: {
    1.5: { C: 19.5, B2: 16.5, D: 22 },
    2.5: { C: 27, B2: 23, D: 29 },
    4: { C: 36, B2: 30, D: 37 },
    6: { C: 46, B2: 38, D: 46 },
    10: { C: 63, B2: 52, D: 60 },
    16: { C: 85, B2: 69, D: 78 },
    25: { C: 112, B2: 90, D: 99 },
    35: { C: 138, B2: 111, D: 119 },
  },
  Al: {
    2.5: { C: 21, B2: 17.5, D: 22 },
    4: { C: 28, B2: 24, D: 29 },
    6: { C: 36, B2: 30, D: 36 },
    10: { C: 49, B2: 41, D: 47 },
    16: { C: 66, B2: 54, D: 61 },
    25: { C: 83, B2: 71, D: 77 },
    35: { C: 103, B2: 86, D: 93 },
  },
}

/** Współczynnik poprawkowy temperatury — Tablica B.52.14 (powietrze, kolumna PVC/70°C) i
 *  B.52.15 (grunt, kolumna PVC/70°C). Punkty co 5°C — wartości pomiędzy liniowo interpolowane
 *  (metoda odczytu z "wygładzonej krzywej", nie wymyślony współczynnik). Poza zakresem (PVC nie ma
 *  zdefiniowanej wartości powyżej 60°C) → brak wyniku, nie ekstrapolacja. */
export const WSPOLCZYNNIK_TEMP_POWIETRZE_PVC: readonly [number, number][] = [
  [10, 1.22],
  [15, 1.17],
  [20, 1.12],
  [25, 1.06],
  [30, 1.0],
  [35, 0.94],
  [40, 0.87],
  [45, 0.79],
  [50, 0.71],
  [55, 0.61],
  [60, 0.5],
]

export const WSPOLCZYNNIK_TEMP_GRUNT_PVC: readonly [number, number][] = [
  [10, 1.1],
  [15, 1.05],
  [20, 1.0],
  [25, 0.95],
  [30, 0.89],
  [35, 0.84],
  [40, 0.77],
  [45, 0.71],
  [50, 0.63],
  [55, 0.55],
  [60, 0.45],
]

/** Współczynnik zmniejszający dla wiązki — Tablica B.52.17, pozycja 2 ("w pojedynczej warstwie na
 *  ścianie" — metoda C, "swobodnie"/"w wiązce") i pozycja 1 ("wiązka w powietrzu, obudowana" —
 *  metody A-F, użyta tu dla "w peszlu"). Klucz = liczba obwodów/kabli w wiązce. */
export const WSPOLCZYNNIK_WIAZKA_METODA_C: readonly [number, number][] = [
  [1, 1.0],
  [2, 0.85],
  [3, 0.79],
  [4, 0.75],
  [5, 0.73],
  [6, 0.72],
  [7, 0.72],
  [8, 0.71],
  [9, 0.7],
]

export const WSPOLCZYNNIK_WIAZKA_METODA_B: readonly [number, number][] = [
  [1, 1.0],
  [2, 0.8],
  [3, 0.7],
  [4, 0.65],
  [5, 0.6],
  [6, 0.57],
  [7, 0.54],
  [8, 0.52],
  [9, 0.5],
  [12, 0.45],
  [16, 0.41],
  [20, 0.38],
]

/** Tablica B.52.18 — kable w gruncie metodą D, kolumna "zero" (kable stykające się) — zachowawczy
 *  wybór, bo źródło nie pyta o prześwit między kablami. */
export const WSPOLCZYNNIK_WIAZKA_GRUNT: readonly [number, number][] = [
  [2, 0.75],
  [3, 0.65],
  [4, 0.6],
  [5, 0.55],
  [6, 0.5],
  [7, 0.45],
  [8, 0.43],
  [9, 0.41],
  [12, 0.36],
  [16, 0.32],
  [20, 0.29],
]

/** Domyślny dopuszczalny spadek napięcia (Sekcja A) — 2% AC / 3% DC. */
export const DOMYSLNY_SPADEK_AC_PCT = 2
export const DOMYSLNY_SPADEK_DC_PCT = 3

/** Werdykt: margines ≥15% na obu kryteriach → 🟢, 0-15% → 🟡 (Sekcja B, "Werdykt"). */
export const PROG_MARGINESU_ZALECANE_PCT = 15
