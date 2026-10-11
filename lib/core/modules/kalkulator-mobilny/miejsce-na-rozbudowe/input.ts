/**
 * Moduł 12, Ekran 31 „Planowanie rozbudowy małej instalacji” (dawne 8.58) — część „ograniczenia przestrzenne”: ile jeszcze paneli albo
 * akumulatorów fizycznie zmieści się w wolnym miejscu (kamper, altana, skrzynia, półka). Czysta geometria prostopadłościanów: silnik
 * nie zna wentylacji, dostępu serwisowego ani masy — odstępy to wyłącznie liczby wpisane przez użytkownika z karty urządzenia albo z
 * jego własnej decyzji; pole puste to `null` (brak danych), nie wartość „typowa”. Wszystkie wymiary w milimetrach.
 */
export type MiejsceNaRozbudoweInput = {
  /** Wolne miejsce [mm]: długość, szerokość (poziomo) i wysokość; wysokość potrzebna tylko do piętrowania i kontroli wysokości elementu. */
  miejsceDlugoscMm: number | null
  miejsceSzerokoscMm: number | null
  miejsceWysokoscMm: number | null
  /** Jeden element (panel albo akumulator) [mm]. */
  elementDlugoscMm: number | null
  elementSzerokoscMm: number | null
  elementWysokoscMm: number | null
  /** Odstęp między sąsiednimi elementami [mm] (wentylacja, dostęp, tolerancja montażu); `null` = nie wpisano, liczone jako 0. */
  odstepMiedzyMm: number | null
  /** Odstęp od ścian miejsca [mm]; `null` = nie wpisano, liczone jako 0. */
  marginesPrzyScianieMm: number | null
  /** Czy elementy wolno układać jedne na drugich (akumulatory tak, panele zwykle nie). */
  moznaPietrowac: boolean
  /** Ile elementów użytkownik chce dołożyć; `null` = pytanie tylko „ile się zmieści”. */
  planowanaLiczba: number | null
}
