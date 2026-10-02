import type { ProbkaTelemetrii } from "./probka"

export interface RaportJakosci {
  liczbaProbek: number
  duplikaty: number
  pozaZakresem: number
  brakWartosci: number
  /** Gaps longer than 2× the expected step, per series (source/channel/quantity). */
  luki: { seria: string; od: number; do: number }[]
  /** Series whose value never changed over at least `minProbekZamrozenia` samples. */
  zamrozone: string[]
}

export const minProbekZamrozenia = 10

export const kluczSerii = (p: ProbkaTelemetrii) => `${p.zrodloId}|${p.kanal}|${p.wielkosc}`

/**
 * Checks a batch of samples. The sampling step is an explicit input (a property of the data set),
 * never guessed from the data — see the Δt pitfall in ai/prognozy.
 */
export function ocenJakosc(probki: ProbkaTelemetrii[], krokMs: number): RaportJakosci {
  const serie = new Map<string, ProbkaTelemetrii[]>()
  for (const p of probki) {
    const k = kluczSerii(p)
    const l = serie.get(k)
    if (l) l.push(p)
    else serie.set(k, [p])
  }
  const raport: RaportJakosci = {
    liczbaProbek: probki.length,
    duplikaty: 0,
    pozaZakresem: 0,
    brakWartosci: 0,
    luki: [],
    zamrozone: [],
  }
  for (const p of probki) {
    if (p.jakosc === "poza-zakresem") raport.pozaZakresem++
    if (p.jakosc === "brak") raport.brakWartosci++
  }
  for (const [seria, lista] of serie) {
    const posortowane = [...lista].sort((a, b) => a.czas - b.czas)
    for (let i = 1; i < posortowane.length; i++) {
      const d = posortowane[i].czas - posortowane[i - 1].czas
      if (d === 0) raport.duplikaty++
      else if (d > 2 * krokMs) raport.luki.push({ seria, od: posortowane[i - 1].czas, do: posortowane[i].czas })
    }
    const wartosci = posortowane.filter((p) => p.wartosc !== null).map((p) => p.wartosc)
    if (wartosci.length >= minProbekZamrozenia && wartosci.every((w) => w === wartosci[0])) raport.zamrozone.push(seria)
  }
  return raport
}

/** Removes exact duplicates (same series and time), keeping the first occurrence. */
export function usunDuplikaty(probki: ProbkaTelemetrii[]): ProbkaTelemetrii[] {
  const widziane = new Set<string>()
  return probki.filter((p) => {
    const k = `${kluczSerii(p)}|${p.czas}`
    if (widziane.has(k)) return false
    widziane.add(k)
    return true
  })
}
