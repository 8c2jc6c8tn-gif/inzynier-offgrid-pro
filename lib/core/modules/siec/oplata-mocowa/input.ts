/**
 * M14 — F5 „Opłata mocowa — przesunięcie poboru” (Wzorzec D). `03_M14_Dom_i_Firma_Siec.md` §7;
 * opracowanie §8.4 ✅: 0,2194 zł/kWh netto for energy drawn on working days 7:00–22:00
 * (Informacja Prezesa URE nr 58/2025, pkt 5). Shows the share of those hours and the effect of
 * shifting X% of that energy outside them.
 */
export type OplataMocowaInput = {
  dataRozliczenia: string
  /** Total energy drawn [kWh/year]. 0 = not entered. */
  energiaRocznaKwh: number
  /** Energy drawn on working days 7:00–22:00 [kWh/year]; null = not entered (0 is legal). */
  energiaWGodzinachKwh: number | null
  /** Share of that energy moved outside the hours [%], 0–100. */
  przesuniecieProcent: number
  /** Rate from the invoice [zł/kWh]; undefined = ✅ data. */
  stawkaWlasnaZlKwh?: number
}
