/**
 * Module 4 "Magazyn energii / baterie" — "Czas balansowania". Inputs are the user's own measurements:
 * the app does not know the cell mismatch or the balancer current. Convention: 0 = not entered yet.
 */
export type CzasBalansowaniaInput = {
  /** Cell capacity, Ah (series pack: capacity of one cell). 0 = not entered. */
  pojemnoscAh: number
  /** Capacity difference between the fullest and the emptiest cell near the top, % of cell capacity. 0 = not entered. */
  rozjazdProc: number
  /** Balancer current from the BMS datasheet/settings, A. 0 = not entered. */
  pradBalanseraA: number
  /** Hours per day the cells stay above the balance start voltage. 0 = not entered (only run time is shown). */
  oknoGodzinDobe: number
}
