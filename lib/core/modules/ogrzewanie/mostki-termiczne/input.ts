import type { SystemWymiarow } from "./katalog-psi"

/**
 * Moduł 6, Ekran 7 "Mostki termiczne" (dawne 5.7, `docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md`). B: "dla
 * każdego mostka (narożniki, styk dachu ze ścianą, płyty balkonowe, ościeża) liczony współczynnik liniowy Ψ
 * i straty W/m". Heat flow through a linear thermal bridge: H = Ψ·l, Φ = H·(θi − θe) — PN-EN 12831, formula
 * (3.4) as quoted and verified in the Purmo guide (`docs/zrodla/materialy-Purmo-PN-EN-12831-ogrzewanie/`,
 * `02-wzory-zweryfikowane.md`) and PN-EN ISO 14683 eq. (3). Ψ is NOT computed (EN ISO 10211 numerics): either
 * entered by the user (catalogue, designer, product sheet) or taken as an indicative value of PN-EN ISO 14683
 * Tablica A.2 by detail code (`katalog-psi.ts`, since 27.09.2026). `null` = not entered.
 */
export type Mostek = {
  nazwa: string
  /** Length of the linear bridge [m]. */
  dlugoscM: number | null
  /** Linear thermal transmittance Ψ [W/(m·K)] — may be negative with external dimensions (e.g. corners). Ignored when `kodKatalogu` is set. */
  psiWmK: number | null
  /** Optional Ψ after the planned fix (e.g. insulated window reveal) [W/(m·K)]. Ignored when `kodKataloguPoPoprawie` is set. */
  psiPoPoprawieWmK: number | null
  /** Detail code of PN-EN ISO 14683 Tablica A.2 (e.g. "W8") — Ψ from the table for `systemWymiarow`. */
  kodKatalogu?: string | null
  /** Detail code after the planned fix (e.g. "W11"), same table. */
  kodKataloguPoPoprawie?: string | null
  /** Window lintel left without insulation — the source's 🟡 case. */
  nadprozeBezIzolacji: boolean
}

export type MostkiTermiczneInput = {
  mostki: Mostek[]
  /** θi from Ekran 1. */
  temperaturaWewnetrznaC: number | null
  /** θe of the climate zone from Ekran 1. */
  temperaturaZewnetrznaC: number | null
  /** Dimension system of Ekran 1 areas (PN-EN ISO 14683, 4.3) — required only for Ψ taken from Tablica A.2. */
  systemWymiarow?: SystemWymiarow | null
  /** Heat loss of Ekran 1 without bridges (Φ_T + Φ_V) [W]; `null` = Ekran 1 not complete — no share shown. */
  obciazenieBezMostkowW: number | null
}
