/**
 * Ekran 9, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "Straty przez wentylację grawitacyjną" (dawne 5.9,
 * docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md; Biblia §6.9). Wzorzec D.
 *
 * The number of air changes is entered by the user (airtightness test, Screen 12, or measurement) — the source
 * gives no formula linking chimneys, leaks and wind to the stack-effect air change.
 */
export type WentylacjaGrawitacyjnaInput = {
  /** Heated air volume of the building [m³]. 0 = not entered. */
  kubaturaM3: number
  /** Air changes per day [1/day] (the source's unit, „8 wymian powietrza na dobę”). 0 = not entered. */
  wymianyNaDobe: number
  /** Indoor temperature [°C]; null = not entered. */
  tWewC: number | null
  /** Mean outdoor temperature of the day [°C]; null = not entered. */
  tZewnC: number | null
  /** Other heat losses of the building at the same temperatures [W] (e.g. transmission from Screen 1) — optional, 0 = no share. */
  stratyPozostaleW: number
  /** Heat recovery efficiency for the comparison [%] (datasheet) — optional, 0 = no comparison. */
  sprawnoscOdzyskuPct: number
  /** Days to sum the loss over (e.g. a month) — optional, 0 = only per day. */
  dni: number
  /** New, airtight house without mechanical ventilation — source 🟡 (mould). */
  szczelnyDom: boolean
}
