/**
 * Moduł 6, Ekran 7 "Mostki termiczne" (dawne 5.7, `docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md`). B: "dla
 * każdego mostka (narożniki, styk dachu ze ścianą, płyty balkonowe, ościeża) liczony współczynnik liniowy Ψ
 * i straty W/m". Heat flow through a linear thermal bridge: H = Ψ·l, Φ = H·(θi − θe) — PN-EN 12831, formula
 * (3.4) as quoted and verified in the Purmo guide (`docs/zrodla/materialy-Purmo-PN-EN-12831-ogrzewanie/`,
 * `02-wzory-zweryfikowane.md`). Ψ itself is NOT computed (EN ISO 10211 numerics) nor tabulated here
 * (EN ISO 14683 not in the repo) — it is entered from a thermal-bridge catalogue, the designer or the
 * product sheet, like U on Ekran 1. `null` = not entered.
 */
export type Mostek = {
  nazwa: string
  /** Length of the linear bridge [m]. */
  dlugoscM: number | null
  /** Linear thermal transmittance Ψ [W/(m·K)] — may be negative with external dimensions (e.g. corners). */
  psiWmK: number | null
  /** Optional Ψ after the planned fix (e.g. insulated window reveal) [W/(m·K)]. */
  psiPoPoprawieWmK: number | null
  /** Window lintel left without insulation — the source's 🟡 case. */
  nadprozeBezIzolacji: boolean
}

export type MostkiTermiczneInput = {
  mostki: Mostek[]
  /** θi from Ekran 1. */
  temperaturaWewnetrznaC: number | null
  /** θe of the climate zone from Ekran 1. */
  temperaturaZewnetrznaC: number | null
  /** Heat loss of Ekran 1 without bridges (Φ_T + Φ_V) [W]; `null` = Ekran 1 not complete — no share shown. */
  obciazenieBezMostkowW: number | null
}
