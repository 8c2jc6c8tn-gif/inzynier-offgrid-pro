/**
 * Ekran 2, Moduł 8 "Bezpieczeństwo i sytuacje awaryjne" — "Bezpieczeństwo pożarowe przy
 * dogrzewaniu paliwem stałym" (dawne 6.25, docs/zrodla/Tresc_Modul_8_Bezpieczenstwo_Ekrany.md,
 * Wzorzec D).
 */

export type PaliwoStale = "drewno" | "pellet" | "wegiel"

export type DogrzewaniePaliwemStalymInput = {
  /** Typ paliwa. null = jeszcze nie wybrano. */
  typPaliwa: PaliwoStale | null
  /** Odległość od materiałów palnych [cm]. 0 = jeszcze nie wpisano. */
  odlegloscOdMaterialowPalnychCm: number
  /** Czy jest osobny nawiew powietrza do spalania. Domyślnie false — dane bezpieczeństwa nigdy jako ukryty domyślny "tak". */
  maNawiewPowietrzaDoSpalania: boolean
  /** Czy jest czujnik czadu (CO) w pomieszczeniu. Domyślnie false — dane bezpieczeństwa nigdy jako ukryty domyślny "tak". */
  maCzujnikCo: boolean
}
