/**
 * M14 — D10/F10 „Koszt powrotu do sieci” (ryzyko R1), `03_M14_Dom_i_Firma_Siec.md` §5,
 * opracowanie §5.3:  K_powrót ≈ stawka opłaty przyłączeniowej OSD [zł/kW] × moc przyłączeniowa
 * (grupy przyłączeniowe IV–VI, odległość standardowa). The rate is a user entry from the DSO tariff —
 * the data file has no connection rates yet (DANE-1, „Otwarte — wymaga danych zewnętrznych”).
 * 🔎 TD23 (`dlug-techniczny.md`): beyond the standard distance only „individual quote”, no amount.
 */
export type KosztPowrotuInput = {
  /** Connection fee rate from the DSO tariff [zł/kW netto]. null = not entered. */
  stawkaZlKw: number | null
  /** Connection capacity [kW]. 0 = not entered. */
  mocPrzylaczeniowaKw: number
  /** Distance within the standard length of the DSO tariff. null = not known. */
  odlegloscStandardowa: boolean | null
}
