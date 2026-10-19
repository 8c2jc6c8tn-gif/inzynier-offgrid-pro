/**
 * Fence with PV panels (ogrodzenie PV) — constants. Geometry of the catalogue sections is exact; the steel properties
 * and the section-class limits are NOT in the repo sources (EN 1993-1-1 is not among `docs/zrodla/`) — they are listed
 * as assumptions "do potwierdzenia" in the result and in docs/lista-do-zrobienia.md.
 */
export type GatunekStali = "S235" | "S355"

/** Yield strength fy [MPa] (EN 1993-1-1 Table 3.1, thickness ≤ 40 mm) — from memory, to be confirmed. */
export const GRANICA_PLASTYCZNOSCI_MPA: Record<GatunekStali, number> = { S235: 235, S355: 355 }

/** γM0 for cross-section resistance (EN 1993-1-1 6.1) — recommended value, national annex not checked. */
export const GAMMA_M0 = 1.0

/** Modulus of elasticity of structural steel [MPa] (EN 1993-1-1 3.2.6). */
export const MODUL_YOUNGA_STALI_MPA = 210_000

/** Class-3 limits c/t for cold-formed RHS: internal part in compression 42ε, in bending 124ε (EN 1993-1-1 Table 5.2). */
export const LIMIT_KLASY_3_SCISKANA = 42
export const LIMIT_KLASY_3_ZGINANA = 124

/** Minimum clearance between the ground and the lowest panel edge [mm] (owner's rule: at least 25–30 cm — against dirt splashing). */
export const MIN_PRZESWIT_MM = 250

/** Horizontal rails per panel row (a panel is carried by two rails). */
export const SZYNY_NA_RZAD = 2

/** Cast-in-place pier diameters tried, ascending [mm] (nominal auger sizes). */
export const SREDNICE_FUNDAMENTU_MM: readonly number[] = [200, 250, 300, 400, 500, 600]

/** Embedment is rounded up to this step [mm]. */
export const KROK_GLEBOKOSCI_MM = 50

/** cp,net of a free-standing wall, EN 1991-1-4 Table 7.9, φ = 1, ℓ/h ≥ 10, zone A — used when the panels are too close to the ground for the signboard rule (7.4.3 (3)). */
export const CP_NET_SCIANA_POLE_A = 3.4


/** Density of water [kg/m³] — buoyancy of soil below the water table. */
export const GESTOSC_WODY_KG_M3 = 1000

export type ProfilRurki = {
  /** Outer dimension along the wind [mm] (strong axis for bending). */
  glebokoscMm: number
  /** Outer dimension along the fence [mm]. */
  szerokoscMm: number
  grubosciMm: number
}

/** Catalogue of rectangular hollow sections (depth × width × wall thickness); the calculator sorts it by cross-section area. */
export const KATALOG_RUREK: readonly ProfilRurki[] = [
  [30, 30, 2], [40, 20, 2], [40, 40, 2], [40, 40, 3], [60, 20, 2], [50, 50, 3], [60, 40, 2], [60, 40, 3], [60, 60, 3], [80, 40, 3],
  [80, 40, 4], [60, 60, 4], [80, 60, 3], [100, 50, 3], [100, 50, 4], [80, 80, 4], [100, 60, 4], [120, 60, 4], [100, 100, 4],
  [120, 80, 4], [100, 100, 5], [140, 80, 4], [160, 80, 5], [120, 120, 5], [150, 100, 5], [150, 150, 5], [150, 150, 6],
  [200, 100, 5], [200, 100, 6], [200, 200, 6],
].map(([glebokoscMm, szerokoscMm, grubosciMm]) => ({ glebokoscMm, szerokoscMm, grubosciMm }))
