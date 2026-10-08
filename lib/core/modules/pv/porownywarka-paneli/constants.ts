/**
 * Porównywarka paneli PV (D81, specyfikacja `docs/porownywarka-paneli-pv-specyfikacja.md`, Etap A1).
 * Stałe organizacyjne modułu — nie fizyka. Fizyka (G_poa, Muneer) jest w `lokalizacja/orientacja-powierzchni`.
 */

/** „Zima” wg U1 właściciela: XI, XII, I, II (indeksy miesięcy, 0 = styczeń). To NIE jest stała M14 (`MIESIACE_ZIMOWE = [11, 0]`). */
export const MIESIACE_ZIMOWE_POROWNYWARKI: readonly number[] = [10, 11, 0, 1]

/** Maksymalna liczba paneli porównywanych naraz (U20). */
export const MAKS_PANELI_W_ZESTAWIE = 4

/** Horyzont liczenia kosztu zimowej kWh [lata] — „zł/kWh zimowej w 25 latach” ze specyfikacji, sekcja 6.4. */
export const HORYZONT_LAT = 25

/** Nasłonecznienie, od którego (w górę) sprawność względna = 1: punkt odniesienia STC [W/m²]. */
export const G_STC_W_M2 = 1000
/** Punkt karty „sprawność względna przy 200 W/m²” [W/m²]. */
export const G_SLABE_SWIATLO_W_M2 = 200
/** Temperatura ogniwa w STC [°C]. */
export const T_STC_C = 25
/** Warunki definicji NOCT: nasłonecznienie [W/m²] i temperatura otoczenia [°C]. */
export const NOCT_G_W_M2 = 800
export const NOCT_T_OTOCZENIA_C = 20

export type KryteriumId =
  | "uzyskZimowy"
  | "uzyskRoczny"
  | "kosztZimowejKwh"
  | "cenaZaWp"
  | "degradacjaGwarancja"
  | "slabeSwiatlo"
  | "temperatura"
  | "zacienienieSnieg"
  | "odpornosc"
  | "tolerancjaMocy"
  | "wiarygodnosc"

export type DefinicjaKryterium = {
  id: KryteriumId
  /** Waga startowa [%] — „wstępne, do dopracowania” (jak M7/E12); przeliczana do 100% z policzonych kryteriów. */
  waga: number
  /** `wyzej`/`nizej` = lepsza większa/mniejsza wartość; `null` = kryterium opisowe, w A1 bez punktów. */
  kierunek: "wyzej" | "nizej" | null
  /** Domyślnie zaznaczone (kryteria spoza wag startowych właściciela są domyślnie odznaczone). */
  domyslnie: boolean
}

/**
 * Wagi startowe z 08.10.2026 (spec 6.4): uzysk zimowy 30, koszt zimowej kWh 20, degradacja i gwarancja 15,
 * słabe światło + temperatura 10 (po 5), zacienienie i śnieg 10, odporność 10, tolerancja mocy i wiarygodność 5 (po 2,5).
 * „Uzysk roczny” i „cena za Wp” nie mają wag w specyfikacji — 5% każde, domyślnie odznaczone (propozycja do potwierdzenia).
 */
export const KRYTERIA: readonly DefinicjaKryterium[] = [
  { id: "uzyskZimowy", waga: 30, kierunek: "wyzej", domyslnie: true },
  { id: "uzyskRoczny", waga: 5, kierunek: "wyzej", domyslnie: false },
  { id: "kosztZimowejKwh", waga: 20, kierunek: "nizej", domyslnie: true },
  { id: "cenaZaWp", waga: 5, kierunek: "nizej", domyslnie: false },
  { id: "degradacjaGwarancja", waga: 15, kierunek: "wyzej", domyslnie: true },
  { id: "slabeSwiatlo", waga: 5, kierunek: "wyzej", domyslnie: true },
  { id: "temperatura", waga: 5, kierunek: "nizej", domyslnie: true },
  { id: "zacienienieSnieg", waga: 10, kierunek: null, domyslnie: true },
  { id: "odpornosc", waga: 10, kierunek: null, domyslnie: true },
  { id: "tolerancjaMocy", waga: 2.5, kierunek: null, domyslnie: true },
  { id: "wiarygodnosc", waga: 2.5, kierunek: null, domyslnie: true },
]
