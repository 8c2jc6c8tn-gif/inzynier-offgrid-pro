/**
 * M14 — field "Wzrost cen energii" of screens D7 (dom) and F8 (firma), `03_M14_Dom_i_Firma_Siec.md`
 * §4 (D40–D43). One engine for three switch positions (D42):
 * - "suwak" — constant real change g per year (slider −3 / 0 / +5 / +10 %, default 0);
 * - "ue" — dynamics of EU Reference Scenario 2020 for Poland (real, above inflation);
 * - "ue-inflacja" — the same dynamics plus inflation π (Fisher), i.e. nominal amounts to pay.
 * The app never forecasts prices itself and never uses the €/MWh level, only the index.
 */

export type ZrodloInflacji = "gus" | "nbp" | "wlasna"

export type TrybSciezki =
  | { rodzaj: "suwak"; gProcent: number }
  | { rodzaj: "ue" }
  | { rodzaj: "ue-inflacja"; zrodloInflacji: ZrodloInflacji; wlasnaInflacjaProcent: number | null }

export type SciezkaCenInput = {
  /** Base year of prices (year 0). Year t = 1 is `rokBazowy + 1`. */
  rokBazowy: number
  /** Horizon N [years], 10–25 (D40). */
  horyzontLat: number
  /** Annual cost of grid energy in base-year prices [zł/year]. 0 = not entered. */
  kosztRocznyZl: number
  tryb: TrybSciezki
}
