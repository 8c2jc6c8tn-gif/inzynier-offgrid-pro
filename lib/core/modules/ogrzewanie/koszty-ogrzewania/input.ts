/**
 * Moduł 6 "Ogrzewanie" — "Porównanie kosztów ogrzewania" (dawne 5.39, Biblia v2.0 §6.27.13
 * "Analiza kosztów ogrzewania różnymi źródłami"; `docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md`,
 * Część 2C — "zbiera wyniki z 2A"). Rozszerzenie o nagrzewnicę paliwową typu "webasto" i olej — D28
 * (`rejestr-decyzji.md`).
 *
 * Źródło nie podaje wartości opałowych, sprawności ani cen — wszystkie parametry to wpis użytkownika
 * (Dyrektywa #1). `null` = pole nie wypełnione.
 */

export type RodzajZrodla =
  | "drewno"
  | "wegiel"
  | "pellet"
  | "gaz"
  | "olej"
  | "inne-paliwo"
  | "nagrzewnica-paliwowa"
  | "kociol-elektryczny"
  | "grzejniki-ir"
  | "pompa-ciepla"

/**
 * Sposób liczenia kosztu 1 kWh ciepła: `paliwo` — c / (WO × η); `karta` — z karty katalogowej
 * urządzenia (moc grzewcza i zużycie paliwa na godzinę); `prad` — c / COP.
 */
export type SposobLiczenia = "paliwo" | "karta" | "prad"

export type ZrodloCiepla = {
  nazwa: string
  rodzaj: RodzajZrodla
  /** Jednostka paliwa do opisu wyniku (kg, l, m³, mp…) — tylko etykieta. */
  jednostka: string
  /** Cena: zł za jednostkę paliwa (paliwo, karta) albo zł za kWh prądu (prad). */
  cenaZl: number | null
  /** Wartość opałowa [kWh/jednostkę] — sposób `paliwo`. */
  wartoscOpalowaKwh: number | null
  /** Sprawność urządzenia [%] — sposób `paliwo`. */
  sprawnoscPct: number | null
  /** Moc grzewcza [kW] — wymagana dla `karta`; dla `paliwo` opcjonalna (godziny pracy → pobór prądu). */
  mocGrzewczaKw: number | null
  /** Zużycie paliwa przy mocy grzewczej [jednostka/h] — sposób `karta`. */
  zuzyciePaliwaNaH: number | null
  /** COP — sposób `prad`, tylko pompa ciepła (grzałka, kocioł, IR: COP = 1). */
  cop: number | null
  /** Pobór prądu urządzenia paliwowego w pracy [W] (wentylator, podajnik, pompa) — opcjonalny. */
  poborPraduW: number | null
  kosztInwestycjiZl: number | null
  kosztSerwisuRocznyZl: number | null
}

export type KosztyOgrzewaniaInput = {
  /** Ciepło potrzebne w sezonie grzewczym [kWh]. */
  zapotrzebowanieSezonKwh: number | null
  /** Okres analizy [lata] — źródło: "ranking opłacalności w skali 10 lat". */
  liczbaLat: number | null
  zrodla: ZrodloCiepla[]
}
