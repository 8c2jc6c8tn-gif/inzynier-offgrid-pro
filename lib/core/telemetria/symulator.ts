import { zbudujProbke, type ProbkaTelemetrii } from "./probka"

export type ScenariuszSymulatora = "normalna-praca" | "zima-brak-slonca" | "alarm-bms" | "zwarcie"

export interface OpcjeSymulatora {
  zrodloId: string
  scenariusz: ScenariuszSymulatora
  /** Start time, epoch ms. */
  start: number
  krokMs: number
  liczbaKrokow: number
}

/** Deterministic pseudo-noise in [-1, 1] (no Math.random: tests and demo must be reproducible). */
function szum(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

/**
 * Demo data generator. Output is the same ProbkaTelemetrii stream as any real source, so replacing
 * it with real data changes the source only. Values are illustrative, not measurements.
 */
export function generujDemo(o: OpcjeSymulatora): ProbkaTelemetrii[] {
  const wynik: ProbkaTelemetrii[] = []
  let soc = o.scenariusz === "zima-brak-slonca" ? 60 : 70
  for (let i = 0; i < o.liczbaKrokow; i++) {
    const czas = o.start + i * o.krokMs
    const godzina = ((czas / 3_600_000) % 24 + 24) % 24
    const slonce = Math.max(0, Math.sin(((godzina - 6) / 12) * Math.PI))
    const mnoznik = o.scenariusz === "zima-brak-slonca" ? 0.05 : 1
    const mocPv = Math.max(0, 3000 * slonce * mnoznik * (1 + 0.05 * szum(i)))
    const mocObciazenia = 400 + 300 * Math.max(0, Math.sin(((godzina - 17) / 6) * Math.PI)) + 20 * szum(i + 7)
    const bilans = mocPv - mocObciazenia
    soc = Math.min(100, Math.max(0, soc + (bilans * (o.krokMs / 3_600_000)) / 100))
    let prad = bilans / 52
    let temperatura = 22 + 3 * slonce + 0.2 * szum(i + 3)
    if (o.scenariusz === "alarm-bms" && i > o.liczbaKrokow / 2) temperatura += 25
    if (o.scenariusz === "zwarcie" && i === Math.floor(o.liczbaKrokow / 2)) prad = 900
    const dodaj = (kanal: string, wielkosc: ProbkaTelemetrii["wielkosc"], wartosc: number) =>
      wynik.push(zbudujProbke({ zrodloId: o.zrodloId, kanal, czas, wielkosc, wartosc }))
    dodaj("pv", "moc", mocPv)
    dodaj("obciazenie", "moc", mocObciazenia)
    dodaj("bms", "soc", soc)
    dodaj("bms", "napiecie", 48 + soc * 0.08)
    dodaj("bms", "prad", prad)
    dodaj("bms", "temperatura", temperatura)
  }
  return wynik
}
