/** Ciepło właściwe wody — uniwersalna stała fizyczna, nie dana specyficzna dla źródła. */
export const CIEPLO_WLASCIWE_WODY_J_KG_K = 4186
export const J_NA_KWH = 3_600_000
/** kWh potrzebne, żeby podgrzać 1 litr wody o 1 K (1 l wody ≈ 1 kg). */
export const WSPOLCZYNNIK_KWH_NA_L_K = CIEPLO_WLASCIWE_WODY_J_KG_K / J_NA_KWH
