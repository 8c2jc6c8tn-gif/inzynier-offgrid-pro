import type { GrupaGruntuNiespoistego, WilgotnoscGruntu } from "../eurokod-7/grunty-pn-b-03020"
import type { KategoriaTerenu, StrefaWiatrowa } from "../eurokod-1/wiatr"
import type { GatunekStali } from "./constants"

/** How the embedment is computed — both are shown, the owner picks the governing one (D101 pattern). */
export type MetodaOporuGruntu = "zachowawcza" | "broms"

/**
 * Fence made of PV panels. Convention of the repo: 0 / `null` = not entered, no hidden defaults. The user chooses the soil from
 * the PN-B-03020 table; φ′ and the density come from there. Posts, rails and the pier are selected by the calculator.
 */
export type OgrodzeniePvInput = {
  /** Panel length along the fence [mm] — post spacing is derived from it. 0 = not entered. */
  dlugoscPanelaMm: number
  /** Panel dimension across the fence (vertical) [mm]. 0 = not entered. */
  wysokoscPanelaMm: number
  /** Panel thickness [mm] — only for the flush-face check; `null` = check skipped. */
  grubDoscPanelaMm: number | null
  /** Vertical gap between panel rows [mm]; `null` = 0 (assumption shown). */
  szczelinaPionowaMm: number | null
  /** Horizontal gap between a panel and a post [mm]; `null` = 0 (assumption shown). */
  szczelinaPoziomaMm: number | null
  /** Clearance between the ground and the lowest panel edge [mm]. 0 = not entered. */
  przeswitMm: number
  /** Number of panel rows; `null` = as many as fit under the height limit. */
  liczbaRzedow: number | null
  /** Highest allowed fence height without a permit [mm]; `null` = no limit entered. */
  maxWysokoscMm: number | null
  /** Fence length [m] — only for the count of posts and panels; `null` = not entered. */
  dlugoscOgrodzeniaM: number | null
  strefaWiatrowa: StrefaWiatrowa | null
  wysokoscNpmM: number | null
  kategoriaTerenu: KategoriaTerenu | null
  grupaGruntu: GrupaGruntuNiespoistego | null
  /** Density index I_D of the soil, 0.2–1.0 (PN-B-03020 chart range). 0 = not entered. */
  stopienZageszczeniaId: number
  wilgotnoscGruntu: WilgotnoscGruntu | null
  /** Soil below the water table — density reduced by buoyancy. */
  gruntPodWoda: boolean
  /** Frost depth [m] of the site — the pier base must reach it. 0 = not entered. */
  glebokoscPrzemarzaniaM: number
  gatunekStali: GatunekStali | null
  metodaOporuGruntu: MetodaOporuGruntu | null
  /** Allowed rail deflection [mm] (serviceability); `null` = only shown. */
  ugiecieDopuszczalneMm: number | null
}
