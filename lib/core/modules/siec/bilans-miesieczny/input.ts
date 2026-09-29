/**
 * M14 — monthly energy balance of the transition part (D4 „Ile PV i magazynu”, D5 „Zima bez sieci”,
 * input of the TCO engine D7/F8). `03_M14_Dom_i_Firma_Siec.md` §4 and opracowanie §4.2:
 *   E_sieć,m = max(0, E_zuż,m − E_PV,m·η − ΔE_mag,m)
 * Monthly PV production comes from M3 (PVGIS TMY of the location × kWp × PR — echo of
 * `obliczProdukcjeKwh`), never from a fixed „winter = x% of summer”. η is the direct
 * self-consumption share: typical OSD profiles (D38, W4) are not available yet, so only the
 * „znam swoją autokonsumpcję” option exists — a user entry, no default.
 */

/** "siec": shortfall is drawn from the grid, surplus exported. "wyspa": shortfall must be covered by a generator, surplus is lost. */
export type TrybBilansu = "siec" | "wyspa"

export type BilansMiesiecznyInput = {
  tryb: TrybBilansu
  /** 12 monthly consumption values [kWh], January first. */
  zuzycieMiesieczneKwh: number[]
  /** 12 monthly specific yields [kWh/kWp] from M3 (PVGIS TMY × PR). */
  uzyskMiesiecznyKwhNaKwp: number[]
  /** PV peak power [kWp]; 0 = no PV. */
  mocPvKwp: number
  /** Direct self-consumption share of PV production (0–1]; null = not entered. */
  autokonsumpcjaBezposrednia: number | null
  /** Usable storage capacity [kWh]; 0 = no storage. */
  pojemnoscMagazynuKwh: number
  /** Round-trip efficiency of storage (0–1] (M4); null = not entered (needed only with storage). */
  sprawnoscMagazynu: number | null
}
