/**
 * Kryteria i gwiazdki (spec 6.4, U3). Reguła porównywalności: kryterium wchodzi do gwiazdek tylko, gdy WSZYSTKIE panele
 * mają dane do jego policzenia; inaczej jest pominięte z jawną listą braków, a jego waga nie bierze udziału w sumie.
 * Skala punktów jest WZGLĘDNA w obrębie porównywanego zestawu: najlepszy panel na danym kryterium = 10 (decyzja A
 * właściciela do potwierdzenia, założenie `PORP-ZAL-SKALA-WZGLEDNA`).
 */
import { KRYTERIA, type DefinicjaKryterium, type KryteriumId } from "./constants"
import type { KryteriaWybor } from "./input"

export type StatusKryterium = "policzone" | "pominiete-brak-danych" | "odznaczone" | "opisowe"

export type KryteriumWynik = {
  id: KryteriumId
  /** Waga startowa [%]. */
  waga: number
  status: StatusKryterium
  /** Nazwy paneli, którym brakuje danych (tylko `pominiete-brak-danych`). */
  brakuje: string[]
  /** Wartość kryterium per panel (kolejność wejścia); `null` = brak danych. */
  wartosci: (number | null)[]
  /** Punkty 0–10 per panel; `null`, gdy kryterium nie jest policzone. */
  punkty: (number | null)[]
  /** Waga po przeliczeniu do 100% z policzonych kryteriów [%]; `null`, gdy kryterium nie jest policzone. */
  wagaEfektywna: number | null
}

export function domyslnyWyborKryteriow(): KryteriaWybor {
  return Object.fromEntries(KRYTERIA.map((k) => [k.id, k.domyslnie])) as KryteriaWybor
}

/** Punkty 0–10 względem najlepszego w zestawie. */
export function punktyWzgledne(wartosci: number[], kierunek: "wyzej" | "nizej"): number[] {
  const min = Math.min(...wartosci)
  const max = Math.max(...wartosci)
  if (kierunek === "wyzej") return wartosci.map((v) => (max > 0 ? (10 * v) / max : 0))
  if (min > 0) return wartosci.map((v) => (10 * min) / v)
  // Najlepsza wartość <= 0 (np. γ = 0): proporcja min/v byłaby 0/0 albo zerowa dla wszystkich — skala liniowa min–max.
  return wartosci.map((v) => (max === min ? 10 : (10 * (max - v)) / (max - min)))
}

/** Ocena kryteriów i gwiazdki (0–10) per panel. `wartosci[id]` = wartości per panel w kolejności wejścia. */
export function ocenKryteria(
  nazwy: string[],
  wartosci: Partial<Record<KryteriumId, (number | null)[]>>,
  wybor: KryteriaWybor,
): { kryteria: KryteriumWynik[]; gwiazdki: (number | null)[] } {
  const wstepne = KRYTERIA.map((def: DefinicjaKryterium): KryteriumWynik => {
    const wart = wartosci[def.id] ?? nazwy.map(() => null)
    const baza = { id: def.id, waga: def.waga, wartosci: wart, punkty: nazwy.map(() => null), wagaEfektywna: null }
    if (def.kierunek === null) return { ...baza, status: "opisowe", brakuje: [] }
    if (!wybor[def.id]) return { ...baza, status: "odznaczone", brakuje: [] }
    const brakuje = nazwy.filter((_, i) => wart[i] === null || wart[i] === undefined)
    if (brakuje.length > 0) return { ...baza, status: "pominiete-brak-danych", brakuje }
    return { ...baza, status: "policzone", brakuje: [], punkty: punktyWzgledne(wart as number[], def.kierunek) }
  })
  const sumaWag = wstepne.reduce((a, k) => a + (k.status === "policzone" ? k.waga : 0), 0)
  const kryteria = wstepne.map((k) => (k.status === "policzone" ? { ...k, wagaEfektywna: (100 * k.waga) / sumaWag } : k))
  if (nazwy.length < 2 || sumaWag === 0) return { kryteria, gwiazdki: nazwy.map(() => null) }
  const gwiazdki = nazwy.map((_, i) =>
    kryteria.reduce((a, k) => (k.status === "policzone" ? a + (k.wagaEfektywna! * k.punkty[i]!) / 100 : a), 0),
  )
  return { kryteria, gwiazdki }
}
