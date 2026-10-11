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
}

/** TMY z zastosowanym nadpisaniem plus wartości PVGIS do porównania z wpisanymi. */
export type ZapisTmyZNadpisaniem = ZapisTmy & {
  /** Sumy miesięczne PVGIS TMY przed nadpisaniem [kWh/m²], od stycznia. */
  bazoweGhiKwhM2: number[]
  /** Współczynnik skali zastosowany do danego miesiąca; `null` = miesiąc bez nadpisania. */
  wspolczynniki: (number | null)[]
}

const W_NA_KW = 1000

const miesiacUtc = (czasUtcMs: number) => new Date(czasUtcMs).getUTCMonth()

/** Sumy miesięczne GHI [kWh/m²] — rekordy godzinowe, więc moc [W/m²] × 1 h. Miesiące liczone wg czasu UTC. */
export function sumyMiesieczneGhiKwhM2(rekordy: readonly RekordGodzinowy[]): number[] {
  const sumy = Array<number>(12).fill(0)
  for (const r of rekordy) sumy[miesiacUtc(r.czasUtcMs)]! += r.ghi / W_NA_KW
  return sumy
}

/** Wpisana wartość jest używana tylko, gdy jest skończona i dodatnia (zero oznaczałoby miesiąc bez słońca — to nie jest „puste”). */
export const czyPoprawneNadpisanie = (v: number | null | undefined): v is number => typeof v === "number" && Number.isFinite(v) && v > 0

/** Czy zapis dotyczy tej lokalizacji (ta sama tolerancja co zapis TMY). */
export function nadpisaniePasuje(n: NadpisanieNasloneczenia | null, szerokosc: number, dlugosc: number): n is NadpisanieNasloneczenia {
  return n !== null && Math.abs(n.szerokosc - szerokosc) <= TOLERANCJA_ZAPISU_DEG && Math.abs(n.dlugosc - dlugosc) <= TOLERANCJA_ZAPISU_DEG && Array.isArray(n.ghiKwhM2) && n.ghiKwhM2.length === 12
}

/**
 * Zapis TMY z nadpisanymi miesiącami: rekordy miesiąca ze wpisaną sumą mają GHI, DNI i DHI pomnożone przez wspólny współczynnik
 * (wpisana ÷ suma PVGIS); temperatury bez zmian. Bez poprawnych wpisów zwraca te same rekordy.
 */
export function zastosujNadpisanie(zapis: ZapisTmy, nadpisanie: NadpisanieNasloneczenia | null): ZapisTmyZNadpisaniem {
  const bazowe = sumyMiesieczneGhiKwhM2(zapis.dane.rekordy)
  const wspolczynniki = bazowe.map((suma, m) => {
    const wpis = nadpisanie && nadpisaniePasuje(nadpisanie, zapis.szerokosc, zapis.dlugosc) ? nadpisanie.ghiKwhM2[m] : null
    return czyPoprawneNadpisanie(wpis) && suma > 0 ? wpis / suma : null
  })
  if (wspolczynniki.every((k) => k === null)) return { ...zapis, bazoweGhiKwhM2: bazowe, wspolczynniki }
  const rekordy = zapis.dane.rekordy.map((r) => {
    const k = wspolczynniki[miesiacUtc(r.czasUtcMs)]
    return k === null || k === undefined ? r : { ...r, ghi: r.ghi * k, dni: r.dni * k, dhi: r.dhi * k }
  })
  return { ...zapis, dane: { ...zapis.dane, rekordy }, bazoweGhiKwhM2: bazowe, wspolczynniki }
}
