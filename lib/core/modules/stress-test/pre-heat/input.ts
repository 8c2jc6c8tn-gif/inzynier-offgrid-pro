/**
 * Moduł 7 "Stress-test zimowy" — Ekran 18 "Pre-Heat Thermal Storage — magazynowanie ciepła przed frontem" (dawne 6.28;
 * docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md). Wzorzec D. Pojemność cieplna budynku (M6/E8) i straty ciepła
 * przy prognozowanym mrozie (M6/E1) wpisuje user; prognoza pogody (M1) — poza zakresem.
 */

/** Skąd energia na przegrzanie — sekcja B: „w dzień poprzedzający (gdy jest słońce)”. */
export type ZrodloEnergiiPreHeat = "pv-dzien" | "bateria-noc" | "agregat"

export type PreHeatInput = {
  /** Pojemność cieplna budynku [kWh/K] — z M6/E8. */
  pojemnoscCieplnaKwhK: number | null
  /** O ile podnieść temperaturę w domu [K] (przykład źródła: do 23°C). */
  podniesienieTempDomuK: number | null
  /** Straty ciepła budynku przy prognozowanym mrozie [kW] — z M6/E1. */
  stratyCieplaKw: number | null
  /** Pojemność bojlera C.W.U. [l]. null = bez bojlera. */
  pojemnoscBojleraL: number | null
  /** O ile podnieść temperaturę w bojlerze [K] (przykład źródła: do 70°C). */
  podniesienieTempBojleraK: number | null
  /** COP ogrzewania (pompa ciepła) — 1 dla grzałki elektrycznej. */
  cop: number | null
  zrodloEnergii: ZrodloEnergiiPreHeat | null
  /** Nadwyżka PV dostępna w dniu przed frontem [kWh]. null = nie podano. */
  nadwyzkaPvKwh: number | null
}
