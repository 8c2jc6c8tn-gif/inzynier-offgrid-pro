/**
 * Własne miesięczne sumy promieniowania w miejsce wartości PVGIS TMY (INFRA-2, źródło: „Użytkownik może nadpisać ręcznie”).
 * Użytkownik wpisuje sumę promieniowania całkowitego na płaszczyznę poziomą [kWh/m²] wybranych miesięcy (np. z własnych pomiarów
 * albo z innego źródła); godzinowe dane TMY tego miesiąca są skalowane jednym współczynnikiem, więc kształt doby i podział na
 * składową bezpośrednią i rozproszoną zostają, a suma miesiąca równa się wpisanej. Pusty miesiąc = bez zmian. Czyste funkcje.
 */
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"
import { TOLERANCJA_ZAPISU_DEG, type ZapisTmy } from "./dane-tmy"

export const KLUCZ_NADPISANIA_NASLONECZNIENIA = "offgrid.pvgis-tmy-nadpisanie.v1"

/** Zapis własnych sum miesięcznych razem ze współrzędnymi, dla których je wpisano. */
export type NadpisanieNasloneczenia = {
  szerokosc: number
  dlugosc: number
  /** Suma promieniowania całkowitego na płaszczyznę poziomą w miesiącu [kWh/m²], od stycznia; `null` = bez nadpisania. */
  ghiKwhM2: (number | null)[]
  /** Średnia temperatura powietrza w miesiącu [°C], od stycznia; `null` = bez nadpisania. Brak pola w zapisach sprzed tej zmiany. */
  tempSrednieC?: (number | null)[]
}

/** TMY z zastosowanym nadpisaniem plus wartości PVGIS do porównania z wpisanymi. */
export type ZapisTmyZNadpisaniem = ZapisTmy & {
  /** Sumy miesięczne PVGIS TMY przed nadpisaniem [kWh/m²], od stycznia. */
  bazoweGhiKwhM2: number[]
  /** Współczynnik skali zastosowany do danego miesiąca; `null` = miesiąc bez nadpisania. */
  wspolczynniki: (number | null)[]
  /** Średnie temperatury miesięczne z TMY przed nadpisaniem [°C]; `null` = miesiąc bez rekordów z temperaturą. */
  bazoweTempC: (number | null)[]
  /** Przesunięcie temperatury zastosowane do danego miesiąca [K] (wpisana średnia − średnia TMY); `null` = bez nadpisania. */
  przesunieciaTempK: (number | null)[]
}

const W_NA_KW = 1000

const miesiacUtc = (czasUtcMs: number) => new Date(czasUtcMs).getUTCMonth()

/** Sumy miesięczne GHI [kWh/m²] — rekordy godzinowe, więc moc [W/m²] × 1 h. Miesiące liczone wg czasu UTC. */
export function sumyMiesieczneGhiKwhM2(rekordy: readonly RekordGodzinowy[]): number[] {
  const sumy = Array<number>(12).fill(0)
  for (const r of rekordy) sumy[miesiacUtc(r.czasUtcMs)]! += r.ghi / W_NA_KW
  return sumy
}

/** Średnie temperatury miesięczne [°C] z rekordów godzinowych (czas UTC); `null` = miesiąc bez rekordu z temperaturą. */
export function sredniaTempMiesieczneC(rekordy: readonly RekordGodzinowy[]): (number | null)[] {
  const suma = Array<number>(12).fill(0)
  const liczba = Array<number>(12).fill(0)
  for (const r of rekordy) {
    if (typeof r.tempC !== "number") continue
    const m = miesiacUtc(r.czasUtcMs)
    suma[m]! += r.tempC
    liczba[m]! += 1
  }
  return suma.map((x, m) => (liczba[m]! > 0 ? x / liczba[m]! : null))
}

/** Granica rozsądku wpisywanej średniej miesięcznej [°C] — nie wartość normowa, tylko odrzucenie pomyłek (np. 200 zamiast 20). */
export const TEMP_MIESIECZNA_MIN_C = -60
export const TEMP_MIESIECZNA_MAX_C = 60
export const czyPoprawnaTemperatura = (v: number | null | undefined): v is number =>
  typeof v === "number" && Number.isFinite(v) && v >= TEMP_MIESIECZNA_MIN_C && v <= TEMP_MIESIECZNA_MAX_C

/** Wpisana wartość jest używana tylko, gdy jest skończona i dodatnia (zero oznaczałoby miesiąc bez słońca — to nie jest „puste”). */
export const czyPoprawneNadpisanie = (v: number | null | undefined): v is number => typeof v === "number" && Number.isFinite(v) && v > 0

/** Czy zapis dotyczy tej lokalizacji (ta sama tolerancja co zapis TMY). */
export function nadpisaniePasuje(n: NadpisanieNasloneczenia | null, szerokosc: number, dlugosc: number): n is NadpisanieNasloneczenia {
  return n !== null && Math.abs(n.szerokosc - szerokosc) <= TOLERANCJA_ZAPISU_DEG && Math.abs(n.dlugosc - dlugosc) <= TOLERANCJA_ZAPISU_DEG && Array.isArray(n.ghiKwhM2) && n.ghiKwhM2.length === 12
}

/**
 * Zapis TMY z nadpisanymi miesiącami: rekordy miesiąca ze wpisaną sumą mają GHI, DNI i DHI pomnożone przez wspólny współczynnik
 * (wpisana ÷ suma PVGIS); w miesiącu ze wpisaną średnią temperaturą wszystkie temperatury godzinowe są przesunięte o tę samą różnicę
 * (wpisana − średnia TMY), więc przebieg dobowy zostaje, a średnia miesiąca równa się wpisanej. Bez poprawnych wpisów zwraca te same rekordy.
 */
export function zastosujNadpisanie(zapis: ZapisTmy, nadpisanie: NadpisanieNasloneczenia | null): ZapisTmyZNadpisaniem {
  const bazowe = sumyMiesieczneGhiKwhM2(zapis.dane.rekordy)
  const pasuje = nadpisanie !== null && nadpisaniePasuje(nadpisanie, zapis.szerokosc, zapis.dlugosc)
  const wspolczynniki = bazowe.map((suma, m) => {
    const wpis = pasuje ? nadpisanie.ghiKwhM2[m] : null
    return czyPoprawneNadpisanie(wpis) && suma > 0 ? wpis / suma : null
  })
  const bazoweTempC = sredniaTempMiesieczneC(zapis.dane.rekordy)
  const przesunieciaTempK = bazoweTempC.map((srednia, m) => {
    const wpis = pasuje ? nadpisanie.tempSrednieC?.[m] : null
    return czyPoprawnaTemperatura(wpis) && srednia !== null ? wpis - srednia : null
  })
  const bezZmian = wspolczynniki.every((k) => k === null) && przesunieciaTempK.every((d) => d === null)
  if (bezZmian) return { ...zapis, bazoweGhiKwhM2: bazowe, wspolczynniki, bazoweTempC, przesunieciaTempK }
  const rekordy = zapis.dane.rekordy.map((r) => {
    const m = miesiacUtc(r.czasUtcMs)
    const k = wspolczynniki[m]
    const dT = przesunieciaTempK[m]
    if ((k === null || k === undefined) && (dT === null || dT === undefined)) return r
    const wynik = k === null || k === undefined ? { ...r } : { ...r, ghi: r.ghi * k, dni: r.dni * k, dhi: r.dhi * k }
    if (dT !== null && dT !== undefined && typeof r.tempC === "number") wynik.tempC = r.tempC + dT
    return wynik
  })
  return { ...zapis, dane: { ...zapis.dane, rekordy }, bazoweGhiKwhM2: bazowe, wspolczynniki, bazoweTempC, przesunieciaTempK }
}
