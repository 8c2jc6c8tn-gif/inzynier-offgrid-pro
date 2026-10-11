import type { StrefaKlimatyczna } from "./constants"
import type { KierunekStrumienia, WarstwaPrzegrody } from "./u-z-warstw"

/**
 * Moduł 6, Ekran 1 "Charakterystyka termiczna budynku" (dawne 5.1, `docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md`):
 * "straty ciepła (W) liczone z różnicy temperatur wewnątrz/na zewnątrz i współczynników U, dla każdego
 * miesiąca osobno". Heat loss by transmission (Σ U·A·ΔT) and ventilation (n·V·ρ·cp·ΔT) — physics
 * written out by the source; PN-EN 12831-1 itself is not in the repo, so its thermal bridges, ground
 * correction factors, gains and reheat capacity are NOT modelled (explicit warning). `null` = not entered.
 */
export type Przegroda = {
  nazwa: string
  powierzchniaM2: number | null
  /** Thermal transmittance U [W/(m²·K)] — from the design, energy certificate or product sheet. When entered it wins over `warstwy`. */
  uWM2K: number | null
  /**
   * Optional: layers of the partition — used only when `uWM2K` is `null`; U = 1/(Rsi + Σ d/λ + Rse), homogeneous layers
   * (no thermal bridges). Needs `kierunekStrumienia` (picks Rsi). Absent/`null` = U is entered directly.
   */
  warstwy?: WarstwaPrzegrody[] | null
  /** Direction of the heat flow (wall = "poziomo", roof = "w-gore", floor = "w-dol"); only with `warstwy`. */
  kierunekStrumienia?: KierunekStrumienia | null
  /** `true` = outdoor air on the other side (design θe, monthly mean for months). */
  zewnetrzna: boolean
  /**
   * Only when `zewnetrzna === false` (ground, unheated attic, garage): temperature on the other side
   * [°C], entered by the user, fixed all year (explicit assumption); `null` = not entered yet.
   */
  temperaturaPoDrugiejStronieC: number | null
}

/**
 * Optional fuel heat source (wood, coal, gas, oil…): the user's own numbers from the fuel supplier / boiler card — the app
 * has no default calorific value or efficiency. The stock turns into usable heat as `zapas · wartoscOpalowaKwh · sprawnoscPct/100`.
 * `null` = not entered.
 */
export type PaliwoInput = {
  /** Unit of the fuel for the result text only (kg, l, m³, mp…). */
  jednostka: string
  /** Calorific value [kWh per unit] — from the supplier or fuel card. */
  wartoscOpalowaKwh: number | null
  /** Efficiency of the boiler/stove [%]. */
  sprawnoscPct: number | null
  /** Fuel in stock [units]. */
  zapas: number | null
}

export type ObciazenieCieplneInput = {
  przegrody: Przegroda[]
  temperaturaWewnetrznaC: number | null
  strefaKlimatyczna: StrefaKlimatyczna | null
  kubaturaM3: number | null
  /** Air changes per hour n [1/h] (infiltration + ventilation without recovery). */
  wymianyPowietrzaNaH: number | null
  /** Optional: COP of the heat source (electric heater = 1) — electric energy per day at θe. */
  cop: number | null
  /**
   * Optional: efficiency of the ventilation heat recovery [%] — H_V is multiplied by (1 − η/100), as in
   * `inzynier-szkieletowy-pro` (`Qve = V·0,34·n·(1 − ηrek)`); applied to the whole `wymianyPowietrzaNaH`, i.e. it assumes that
   * the entered air change rate goes through the recuperator. `null` = no recovery.
   */
  sprawnoscOdzyskuPct?: number | null
  /** Optional: fuel source with a stock — how long the stock lasts. */
  paliwo?: PaliwoInput | null
  /** Optional: 12 monthly mean outdoor temperatures [°C], January first; `null` = month skipped. */
  srednieTemperaturyMiesieczneC: (number | null)[]
}
