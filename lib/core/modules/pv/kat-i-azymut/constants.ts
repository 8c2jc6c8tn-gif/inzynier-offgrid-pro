/** Siatka kątów pochylenia tabeli napromieniowania [°] — pełny zakres 0–90 (D26: stelaż regulowany aż do pionu). */
export const KAT_MIN_DEG = 0
export const KAT_MAX_DEG = 90
export const KAT_KROK_DEG = 1

/**
 * Natężenie odniesienia [kW/m²] — z definicji uzysku odniesienia (IEC 61724: Yr = H / G_STC):
 * napromieniowanie H [kWh/m²] podzielone przez 1 kW/m² daje "godziny pełnego słońca", a energia
 * E = P [kWp] × Yr × PR. Stała definicyjna, nie współczynnik projektowy.
 */
export const NATEZENIE_ODNIESIENIA_KW_M2 = 1

/** PR — dopuszczalny zakres wartości (0; 1] (definicja: stosunek energii rzeczywistej do teoretycznej). */
export const PR_MIN_WYLACZNIE = 0
export const PR_MAX = 1
