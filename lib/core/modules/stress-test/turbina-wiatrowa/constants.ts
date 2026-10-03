/** Integration step of the Rayleigh integral [m/s] (the spec: 0.1 m/s up to the cut-out speed). */
export const KROK_CALKOWANIA_MS = 0.1

/**
 * Technical limit of the model, not an engineering norm: the cut-out speed above this value is refused so that a
 * typing error (e.g. 2500) cannot make the integration loop huge. Real cut-out speeds are far below.
 */
export const PREDKOSC_WYLACZENIA_MAKS_MS = 100

export const GODZIN_W_DOBIE = 24
