import {
  GAMMA_M0,
  GRANICA_PLASTYCZNOSCI_MPA,
  KATALOG_RUREK,
  LIMIT_KLASY_3_SCISKANA,
  LIMIT_KLASY_3_ZGINANA,
  MODUL_YOUNGA_STALI_MPA,
  type GatunekStali,
  type ProfilRurki,
} from "./constants"

export type WlasnosciProfilu = {
  profil: ProfilRurki
  /** Cross-section area [mm²]. */
  poleMm2: number
  /** Second moment of area about the axis along the fence (bending by the wind) [mm⁴]. */
  momentBezwladnosciMm4: number
  /** Elastic section modulus [mm³]. */
  wskaznikWelMm3: number
  /** Section is at most class 3 (elastic design applicable). */
  klasaNieWiekszaNiz3: boolean
}

/** Corner radii are ignored — the section is slightly under-estimated (safe side). */
export function wlasnosciProfilu(profil: ProfilRurki, gatunek: GatunekStali): WlasnosciProfilu {
  const { glebokoscMm: h, szerokoscMm: b, grubosciMm: t } = profil
  const poleMm2 = b * h - (b - 2 * t) * (h - 2 * t)
  const momentBezwladnosciMm4 = (b * h ** 3 - (b - 2 * t) * (h - 2 * t) ** 3) / 12
  const wskaznikWelMm3 = (2 * momentBezwladnosciMm4) / h
  const epsilon = Math.sqrt(235 / GRANICA_PLASTYCZNOSCI_MPA[gatunek])
  const stojnik = (h - 3 * t) / t // web in bending (c = h − 3t)
  const pas = (b - 3 * t) / t // flange in compression (c = b − 3t)
  const klasaNieWiekszaNiz3 = stojnik <= LIMIT_KLASY_3_ZGINANA * epsilon && pas <= LIMIT_KLASY_3_SCISKANA * epsilon
  return { profil, poleMm2, momentBezwladnosciMm4, wskaznikWelMm3, klasaNieWiekszaNiz3 }
}

/** Catalogue sorted by area (lightest first). */
export function katalogWgMasy(gatunek: GatunekStali): readonly WlasnosciProfilu[] {
  return KATALOG_RUREK.map((p) => wlasnosciProfilu(p, gatunek)).sort((a, b) => a.poleMm2 - b.poleMm2)
}

/** Bending resistance M_Rd = W_el·fy/γM0 [N·mm]. */
export function nosnoscZginaniaNmm(w: WlasnosciProfilu, gatunek: GatunekStali): number {
  return (w.wskaznikWelMm3 * GRANICA_PLASTYCZNOSCI_MPA[gatunek]) / GAMMA_M0
}

export function wykorzystanie(momentNmm: number, nosnoscNmm: number): number {
  return momentNmm / nosnoscNmm
}

/** Cantilever of length H with a point load F at height a: tip deflection at the load δ = F·a³/(3EI). Returned for the load point [mm]. */
export function ugiecieKonsoliMm(silaN: number, wysokoscPunktuMm: number, w: WlasnosciProfilu): number {
  return (silaN * wysokoscPunktuMm ** 3) / (3 * MODUL_YOUNGA_STALI_MPA * w.momentBezwladnosciMm4)
}

/** Simply supported beam under a uniform load w [N/mm] over span ℓ [mm]: δ = 5wℓ⁴/(384EI). */
export function ugiecieBelkiMm(obciazenieNMm: number, rozpietoscMm: number, w: WlasnosciProfilu): number {
  return (5 * obciazenieNMm * rozpietoscMm ** 4) / (384 * MODUL_YOUNGA_STALI_MPA * w.momentBezwladnosciMm4)
}
