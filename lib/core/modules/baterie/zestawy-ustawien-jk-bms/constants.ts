/**
 * JK BMS setting sets published by authors (video tutorials, manuals). Each set is DATA of its author
 * with the source named — not an app recommendation. Adding an author = adding an entry to `ZESTAWY`
 * (+ the label keys in `lib/i18n/ui/m04-zestawy-jk-bms.ts`); the engine and the screen need no change.
 *
 * Reference ranges come from `docs/zrodla/Uzupelnienie_Modul_11_Montaz_16S_Praktyczny.md`, Step 3.3.
 */

/** How a parameter is shown and derived: a cell voltage also gets a pack value, a continuous current gets a C-rate. */
export type TypParametru =
  | "liczbaOgniw"
  | "pojemnoscAh"
  | "napiecieOgniwaV"
  | "pradBalanseraA"
  | "pradCiagly"
  | "temperaturaC"

/** Ids of the JK app parameters (the app's own names are kept in `nazwaJk`). */
export type IdParametru =
  | "cellCount"
  | "batteryCapacity"
  | "startBalanceVolt"
  | "maxBalanced"
  | "cellOvp"
  | "cellRcv"
  | "soc100"
  | "cellOvpr"
  | "cellUvpr"
  | "soc0"
  | "cellUvp"
  | "powerOff"
  | "cellRfv"
  | "smartSleep"
  | "continuedCharge"
  | "continuedDischarge"
  | "chargeUtpr"
  | "chargeUtp"

export type ParametrZestawu = {
  id: IdParametru
  /** Name exactly as shown in the JK app. */
  nazwaJk: string
  typ: TypParametru
  wartosc: number
  /** The author's alternative value (e.g. "3.45 V or"), shown next to the main one, never used in checks. */
  alternatywa?: number
  /** True when the meaning of the parameter is not confirmed in the JK manual — the app compares nothing for it. */
  doPotwierdzenia?: boolean
}

export type ZestawUstawien = {
  id: string
  autor: string
  /** BMS family the set is for. */
  bms: string
  /** Where the values come from — shown 1:1 in the screen (author, medium, date). */
  zrodlo: string
  parametry: ParametrZestawu[]
}

export const ZESTAWY: ZestawUstawien[] = [
  {
    id: "pozytywnie-nauczeni-314ah-16s",
    autor: "Pozytywnie nauczeni",
    bms: "JK",
    zrodlo: "Film autora, tabela „LiFePO4 314Ah — PARAMETRY BMS” (zrzut ekranu z 17.10.2026; adresu filmu brak)",
    parametry: [
      { id: "cellCount", nazwaJk: "Cell Count", typ: "liczbaOgniw", wartosc: 16 },
      { id: "batteryCapacity", nazwaJk: "Battery Capacity", typ: "pojemnoscAh", wartosc: 314 },
      { id: "startBalanceVolt", nazwaJk: "Start balance volt", typ: "napiecieOgniwaV", wartosc: 3.4, alternatywa: 3.45 },
      { id: "maxBalanced", nazwaJk: "Max Balanced", typ: "pradBalanseraA", wartosc: 2 },
      { id: "cellOvp", nazwaJk: "Cell OVP", typ: "napiecieOgniwaV", wartosc: 3.6 },
      { id: "cellRcv", nazwaJk: "VOL. Cell RCV", typ: "napiecieOgniwaV", wartosc: 3.525, doPotwierdzenia: true },
      { id: "soc100", nazwaJk: "SOC-100%", typ: "napiecieOgniwaV", wartosc: 3.45, doPotwierdzenia: true },
      { id: "cellOvpr", nazwaJk: "Cell OVPR", typ: "napiecieOgniwaV", wartosc: 3.4 },
      { id: "cellUvpr", nazwaJk: "CELL UVPR", typ: "napiecieOgniwaV", wartosc: 2.8 },
      { id: "soc0", nazwaJk: "SOC-0%", typ: "napiecieOgniwaV", wartosc: 2.7, doPotwierdzenia: true },
      { id: "cellUvp", nazwaJk: "Cell UVP", typ: "napiecieOgniwaV", wartosc: 2.65 },
      { id: "powerOff", nazwaJk: "Power Off Vol.", typ: "napiecieOgniwaV", wartosc: 2.6 },
      { id: "cellRfv", nazwaJk: "Vol. Cell RFV", typ: "napiecieOgniwaV", wartosc: 3.35, doPotwierdzenia: true },
      { id: "smartSleep", nazwaJk: "Vol. Smart Sleep", typ: "napiecieOgniwaV", wartosc: 3.3, doPotwierdzenia: true },
      { id: "continuedCharge", nazwaJk: "Continued Charge", typ: "pradCiagly", wartosc: 100 },
      { id: "continuedDischarge", nazwaJk: "Continued Discharge", typ: "pradCiagly", wartosc: 100 },
      { id: "chargeUtpr", nazwaJk: "Charge UTPR", typ: "temperaturaC", wartosc: 5 },
      { id: "chargeUtp", nazwaJk: "Charge UTP", typ: "temperaturaC", wartosc: 5 },
    ],
  },
]

/** Reference values from the source (Step 3.3 and the control table). `od`/`do` inclusive, per cell. */
export const ODNIESIENIE = {
  /** Cell OVP, V/cell ("OVP: 3.60–3.65 V/cell"). */
  ovpV: { od: 3.6, do: 3.65 },
  /** Cell UVP, V/cell ("UVP: 2.50–2.80 V/cell"). */
  uvpV: { od: 2.5, do: 2.8 },
  /** Charge current as C-rate ("typically 0.2–0.5 C"). */
  pradLadowaniaC: { od: 0.2, do: 0.5 },
  /** Balance start, V/cell ("set the balance start threshold to 3.40 V"). */
  startBalansuV: 3.4,
} as const

/** Tolerance when comparing a voltage with a reference point, V (values are given to 1 mV). */
export const TOLERANCJA_NAPIECIA_V = 0.0005
