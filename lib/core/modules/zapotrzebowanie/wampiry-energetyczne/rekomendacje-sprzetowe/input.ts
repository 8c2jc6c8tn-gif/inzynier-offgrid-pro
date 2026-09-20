/**
 * Moduł zbiorczy "Wampiry energetyczne", podzakładka 4: Rekomendacje sprzętowe. Domyka dawne
 * 1.32+1.39+1.44 (porównanie metod odłączania) + 1.33+1.46 (dobór metody per urządzenie +
 * wydzielenie obwodu).
 */

export type MetodaOdlaczaniaId = "wylacznik-reczny" | "listwa-z-wylacznikiem" | "gniazdo-wifi" | "przekaznik-zigbee"

export type MetodaPorownaniaItem = {
  id: MetodaOdlaczaniaId
  /** Koszt zakupu/montażu [zł] — bez wartości domyślnej, źródło daje tylko przykład ilustracyjny. */
  kosztZakupuZl: number
  /** Szacowana roczna oszczędność [zł] wynikająca z eliminacji standby tą metodą. */
  rocznaOszczednoscZl: number
}

export type PorownanieMetodInput = {
  metody: MetodaPorownaniaItem[]
}

export type KategoriaUrzadzeniaId = "tv-konsola" | "router" | "ladowarki" | "agd-inne"

export type DoborMetodyInput = {
  kategoria: KategoriaUrzadzeniaId
}
