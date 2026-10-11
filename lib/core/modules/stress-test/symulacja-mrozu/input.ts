/**
 * Moduł 7, Ekran 1 "Symulacja przy −20°C i −30°C" (dawne 6.1, `docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md`; Wzorzec D):
 * symulacja dzień po dniu jednego miesiąca przy stałej temperaturze zewnętrznej scenariusza — produkcja PV wskazanego miesiąca,
 * zapotrzebowanie grzewcze rosnące ze spadkiem temperatury, dodatkowe zużycie (grzałki BMS, defrost) i spadek pojemności
 * użytecznej baterii. Źródło podaje „−20% przy −20°C” tylko jako przykład, nie krzywą — spadek pojemności wpisuje użytkownik
 * (z karty ogniwa); silnik niczego nie zakłada.
 *
 * Silnik jest czysty: produkcja dobowa to dane wejściowe (strona liczy je z TMY lokalizacji), nie ma tu klimatu ani geometrii.
 */

/** Stable building heat-loss data of Module 6, Screen 1 — enough to recompute the heat demand at any outdoor temperature. */
export type BudynekMrozu = {
  /** Σ U·A of partitions against outdoor air plus the ventilation coefficient H_V [W/K]. */
  wspolczynnikStratZewnetrznychWK: number
  /** Heat flow through partitions to spaces of a fixed temperature (ground, attic) at the design indoor temperature [W]; negative = gain. */
  stalyStrumienStratW: number
  /** Indoor temperature θi [°C]. */
  temperaturaWewnetrznaC: number
}

/** What heats the building: electricity (the heating enters the electric demand as heat ÷ COP) or a fuel (no electricity). */
export type ZrodloCieplaMrozu = "prad" | "paliwo"

export type MagazynMrozu = {
  /** Usable capacity at ordinary temperature [kWh] (already within the allowed depth of discharge). 0 = no store. */
  pojemnoscUzytecznaKwh: number
  /** Round-trip efficiency applied on charging [%]. Required when capacity > 0 (`null` = not entered → INCOMPLETE). */
  sprawnoscPct: number | null
  /** State of charge on the first day [% of the usable capacity at the scenario temperature]; 0 = empty (safe side). */
  stanPoczatkowyPct: number
}

export type ScenariuszMrozu = {
  /** Constant outdoor temperature of the scenario for the whole month [°C]. */
  temperaturaC: number
  /** COP of the heat pump at this temperature; `null` = use the general `cop`. */
  cop: number | null
  /** Drop of the usable battery capacity at this temperature [%] (datasheet); `null` = no derating entered. */
  spadekPojemnosciPct: number | null
}

export type SymulacjaMrozuInput = {
  /** PV energy of every day of the simulated month at the reference conditions [kWh/day], 1..31 values. */
  produkcjaDobowaKwh: number[]
  /** Correction of the PV production for the cold month [%] (e.g. negative for snow/frost deposit from M7 Screens 7 and 14); 0 = none. */
  korektaProdukcjiPct: number
  /** Daily consumption of the household without heating [kWh/day]; `null` = not entered. */
  zuzycieBazoweDobaKwh: number | null
  /** BMS heaters, defrost and other extra consumption caused by the cold [kWh/day]; 0 = none. */
  dodatkoweZuzycieDobaKwh: number
  /** Building heat-loss data; `null` = heating is not simulated (stated in the result). */
  budynek: BudynekMrozu | null
  zrodloCiepla: ZrodloCieplaMrozu | null
  /** General COP (heater = 1) used by scenarios without their own; `null` = not entered. */
  cop: number | null
  /** Battery; `null` = no store (nothing carries over between days). */
  magazyn: MagazynMrozu | null
  /** Share of the daily demand used at night, without PV [%]; `null` = day and night of one day are netted. */
  udzialNocyPct: number | null
  scenariusze: ScenariuszMrozu[]
}
