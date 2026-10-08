/**
 * Ile sztuk panelu mieści się w miejscu o danych wymiarach (spec 6.3). Silnik pakowania jest ISTNIEJĄCY
 * (`typ-montazu/wiata.ts`, `ulozPanele`) — tu tylko marginesy i konwersja jednostek.
 */
import { ulozPanele, type Ulozenie } from "@/lib/core/modules/pv/typ-montazu/wiata"
import type { DanePanelu, WymiaryMiejsca } from "./input"

export type Pojemnosc = { liczba: number; ulozenie: Ulozenie }

/** Wymiary użytkowe po odjęciu marginesu z obu stron [m]; `null`, gdy margines zjada całą powierzchnię. */
export function wymiaryUzytkowe(w: WymiaryMiejsca): { dlugoscM: number; szerokoscM: number } | null {
  const dlugoscM = w.dlugoscM - 2 * w.marginesM
  const szerokoscM = w.szerokoscM - 2 * w.marginesM
  return dlugoscM > 0 && szerokoscM > 0 ? { dlugoscM, szerokoscM } : null
}

/**
 * Liczba paneli w miejscu; `null`, gdy karta nie podaje wymiarów panelu (nie zgadujemy). Margines większy niż połowa
 * powierzchni daje 0 sztuk, a nie błąd — użytkownik widzi, że nic się nie mieści.
 */
export function pojemnoscMiejsca(w: WymiaryMiejsca, p: DanePanelu): Pojemnosc | null {
  if (p.dlugoscMm === null || p.szerokoscMm === null) return null
  const uzyt = wymiaryUzytkowe(w)
  if (uzyt === null) return { liczba: 0, ulozenie: { liczbaPaneli: 0, bloki: [], podzial: "brak" } }
  const ulozenie = ulozPanele(uzyt.dlugoscM, uzyt.szerokoscM, p.dlugoscMm / 1000, p.szerokoscMm / 1000)
  return { liczba: ulozenie.liczbaPaneli, ulozenie }
}
