/**
 * Direction of the heat flow through a partition — picks the surface resistances (PN-EN ISO 6946:2017, Table 7:
 * "w górę" = roof/ceiling, "poziomo" = wall, "w dół" = floor).
 */
export type KierunekStrumienia = "w-gore" | "poziomo" | "w-dol"
export const KIERUNKI_STRUMIENIA: readonly KierunekStrumienia[] = ["w-gore", "poziomo", "w-dol"]

/**
 * Conventional surface resistances Rsi/Rse [m²·K/W], PN-EN ISO 6946:2017 Table 7 — the values were read from the
 * standard's scan (page 21) in the sibling project inzynier-szkieletowy-pro (`docs/zrodla/norma-PN-EN-ISO-6946-2017/`)
 * and are used there in the same way (`OPORY_PRZEJMOWANIA`). Rse is 0.04 for every direction.
 */
export const OPORY_POWIERZCHNIOWE_M2KW: Record<KierunekStrumienia, { rsi: number; rse: number }> = {
  "w-gore": { rsi: 0.1, rse: 0.04 },
  poziomo: { rsi: 0.13, rse: 0.04 },
  "w-dol": { rsi: 0.17, rse: 0.04 },
}

/**
 * One homogeneous layer of a partition (outside → inside, the order does not matter for U). Either thickness and
 * conductivity λ (R = d/λ), or a ready thermal resistance `oporM2KW` (e.g. an air gap from a manufacturer's card);
 * `null` = not entered. Conductivity values are the user's own (product card) — the app does not guess them.
 */
export type WarstwaPrzegrody = {
  nazwa: string
  gruboscMm: number | null
  lambdaWmK: number | null
  oporM2KW: number | null
}

export type UZWarstw = {
  /** Σ R of the layers only [m²·K/W]. */
  oporWarstwM2KW: number
  /** Rsi + Σ R + Rse [m²·K/W]. */
  oporCalkowityM2KW: number
  uWM2K: number
}

/** Resistance of one layer, or `null` when it is not fully specified (thickness+λ, or R) or not positive. */
export function oporWarstwy(w: WarstwaPrzegrody): number | null {
  if (w.oporM2KW !== null) return w.oporM2KW > 0 ? w.oporM2KW : null
  if (w.gruboscMm !== null && w.lambdaWmK !== null && w.gruboscMm > 0 && w.lambdaWmK > 0) return w.gruboscMm / 1000 / w.lambdaWmK
  return null
}

/**
 * U = 1 / (Rsi + Σ d_j/λ_j + Rse) of a partition built of homogeneous layers (PN-EN ISO 6946, simple model of
 * Chapter 6 — the same as in inzynier-szkieletowy-pro, `obliczUDokladne`). Thermal bridges of studs/joists/fasteners
 * (ISO 6946 §6.7.2, Annex F) are NOT included — the framed-wall U from this function is therefore optimistic.
 * Returns `null` for an empty list or when any layer is not fully specified (a missing layer would silently lower R).
 */
export function uZWarstw(warstwy: readonly WarstwaPrzegrody[], kierunek: KierunekStrumienia): UZWarstw | null {
  if (warstwy.length === 0) return null
  let suma = 0
  for (const w of warstwy) {
    const r = oporWarstwy(w)
    if (r === null) return null
    suma += r
  }
  const { rsi, rse } = OPORY_POWIERZCHNIOWE_M2KW[kierunek]
  const calkowity = rsi + suma + rse
  return { oporWarstwM2KW: suma, oporCalkowityM2KW: calkowity, uWM2K: 1 / calkowity }
}
