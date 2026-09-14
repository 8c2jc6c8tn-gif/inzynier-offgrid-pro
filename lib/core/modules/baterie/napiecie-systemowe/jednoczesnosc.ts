import { PROG_DLUGOTRWALE_MIN } from "./constants"

export type OdbiornikDoAnalizy = {
  id: string
  label: string
  mocW: number
  czasPracyMin: number
  bazowy: boolean
}

export type JednoczesnoscWynik = {
  sumaBazowaW: number
  sumaPrzelaczalneWorstCaseW: number
  sumaWorstCaseW: number
  /** Czy podano planowaną moc ciągłą falownika — bez niej sprawdzenie konfliktu jest pomijane. */
  limitPodano: boolean
  konflikt: boolean
  nadwyzkaW: number
  /** Zachłannie dobrany (od największej mocy) zestaw odbiorników, których jednoczesne wyłączenie
   *  sprowadza sumę poniżej limitu — Etap B.2. */
  sugerowaneWylaczenie: { id: string; label: string; mocW: number }[]
  wagaOstrzezenia: "warning" | "critical" | null
}

/**
 * Etap B.2 (analiza jednoczesności) + B.3 (długotrwałe obciążenie) — algorytm zaprojektowany
 * i zaakceptowany 13.09.2026 (docs/memory.md, "Poprawki do modułu 'Dobór napięcia' — runda 2"),
 * materiał źródłowy dawał tylko przykłady, nie regułę. Świadomie POZA zakresem: prąd rozruchowy
 * silników/pomp (źródło nie podaje wartości).
 */
export function analizaJednoczesnosci(
  odbiorniki: OdbiornikDoAnalizy[],
  mocCiaglaFalownikaPlanowanaW: number,
): JednoczesnoscWynik {
  const bazowe = odbiorniki.filter((o) => o.bazowy)
  const przelaczalne = odbiorniki.filter((o) => !o.bazowy)

  const sumaBazowaW = bazowe.reduce((s, o) => s + o.mocW, 0)
  const sumaPrzelaczalneWorstCaseW = przelaczalne.reduce((s, o) => s + o.mocW, 0)
  const sumaWorstCaseW = sumaBazowaW + sumaPrzelaczalneWorstCaseW

  const limitPodano = mocCiaglaFalownikaPlanowanaW > 0
  const konflikt = limitPodano && sumaWorstCaseW > mocCiaglaFalownikaPlanowanaW

  if (!konflikt) {
    return {
      sumaBazowaW,
      sumaPrzelaczalneWorstCaseW,
      sumaWorstCaseW,
      limitPodano,
      konflikt: false,
      nadwyzkaW: 0,
      sugerowaneWylaczenie: [],
      wagaOstrzezenia: null,
    }
  }

  const nadwyzkaW = sumaWorstCaseW - mocCiaglaFalownikaPlanowanaW

  // Zachłanny dobór: sortuj przełączalne malejąco wg mocy, usuwaj po kolei aż suma zejdzie
  // poniżej limitu — najmniejszy praktyczny zestaw do "nie uruchamiaj razem".
  const posortowane = [...przelaczalne].sort((a, b) => b.mocW - a.mocW)
  const sugerowaneWylaczenie: { id: string; label: string; mocW: number }[] = []
  let biezacaSuma = sumaWorstCaseW
  for (const o of posortowane) {
    if (biezacaSuma <= mocCiaglaFalownikaPlanowanaW) break
    sugerowaneWylaczenie.push({ id: o.id, label: o.label, mocW: o.mocW })
    biezacaSuma -= o.mocW
  }

  // Waga: critical gdy w konflikcie biorą udział co najmniej dwa odbiorniki długotrwałe
  // (≥30 min — realne ryzyko przegrzania długotrwałego), inaczej warning.
  const liczbaDlugotrwalychWKonflikcie = przelaczalne.filter((o) => o.czasPracyMin >= PROG_DLUGOTRWALE_MIN).length
  const wagaOstrzezenia: "warning" | "critical" = liczbaDlugotrwalychWKonflikcie >= 2 ? "critical" : "warning"

  return {
    sumaBazowaW,
    sumaPrzelaczalneWorstCaseW,
    sumaWorstCaseW,
    limitPodano,
    konflikt: true,
    nadwyzkaW,
    sugerowaneWylaczenie,
    wagaOstrzezenia,
  }
}
