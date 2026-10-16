import type { StrefaKlimatyczna } from "../obciazenie-cieplne/constants"
import type { PaliwoInput } from "../obciazenie-cieplne/input"

/**
 * Heat balance of a small object — camper, garden plot house (altana/ROD) or garage (micro-installation mode, spec 37.7:
 * "own heat balance screen of the object"). A rectangular box described by length × width × height; the engine turns it into the
 * partitions of M6/E1 (`obciazenie-cieplne`) and reuses that calculator, so the physics is written once. `null` = not entered.
 */
export type MalyObiektCieplaInput = {
  dlugoscM: number | null
  szerokoscM: number | null
  wysokoscM: number | null
  /** U of the walls, roof and floor [W/(m²·K)] — from the design or the user's own estimate; the app has no default. */
  uScianWM2K: number | null
  uDachuWM2K: number | null
  uPodlogiWM2K: number | null
  /** `true` = the floor is exposed to outdoor air (camper, object on legs); `false` = ground or an unheated room below; `null` = not chosen. */
  podlogaNadPowietrzem: boolean | null
  /** Only when `podlogaNadPowietrzem === false`: temperature below the floor [°C], typed by the user, fixed all year. */
  temperaturaPodPodlogaC: number | null
  /** Windows and doors together [m²] and their U [W/(m²·K)]; 0 m² = no openings. `null` = not entered (the result then waits). */
  otworyM2: number | null
  uOtworowWM2K: number | null
  temperaturaWewnetrznaC: number | null
  strefaKlimatyczna: StrefaKlimatyczna | null
  /** Air changes per hour n [1/h] (leakiness + ventilation). */
  wymianyPowietrzaNaH: number | null
  /** Heat recovery of the ventilation [%]; `null` = none. */
  sprawnoscOdzyskuPct: number | null
  /** COP of an electric heat source (resistive heater = 1, heat pump from its card); `null` = not electric / not entered. */
  cop: number | null
  paliwo: PaliwoInput | null
  /** 12 monthly mean outdoor temperatures [°C], January first; `null` month = skipped. */
  srednieTemperaturyMiesieczneC: (number | null)[]
  /** 12 flags (from the object profile): months in which the object is used. Empty array = none chosen. */
  miesiaceUzytkowania: boolean[]
}
