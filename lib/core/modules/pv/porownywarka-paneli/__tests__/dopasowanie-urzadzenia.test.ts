import { describe, expect, it } from "vitest"
import { KATALOG_PANELI_PV, znajdzPanelKatalogu } from "@/lib/core/dane/katalog-paneli-pv"
import { znajdzUrzadzeniePv } from "@/lib/core/dane/katalog-urzadzen-pv"
import { limityZUrzadzenia, ocenDopasowanie } from "../dopasowanie-urzadzenia"
import { ocenElektryke } from "../elektryka"
import type { DanePanelu } from "../input"

/**
 * Panel: JA Solar JAM60D41-500/LB (Voc 43,85 V, Vmp 36,91 V, Isc 14,42 A, Imp 13,55 A, β −0,25 %/°C), Tmin = −20 °C,
 * więc Voc jednego panelu zimą = 43,85·(1 + 0,0025·45) = 48,7831 V. Układy z A3 są sortowane od najmniejszej liczby stringów równoległych.
 */
const ja500 = (): DanePanelu => ({ ...znajdzPanelKatalogu("ja-solar-jam60d41-lb-500")!, cenaBruttoZl: null })
const ocen = (idUrzadzenia: string, n: number, akumV: number | null = null) => {
  const panel = ja500()
  const urzadzenie = znajdzUrzadzeniePv(idUrzadzenia)!
  return ocenDopasowanie(panel, ocenElektryke(panel, n, -20)!, n, limityZUrzadzenia(urzadzenie, akumV))
}
const uklad = (d: NonNullable<ReturnType<typeof ocen>>) => d.warianty.map((w) => [w.panelowWSzeregu, w.stringowRownolegle, w.liczbaUrzadzen])

describe("limityZUrzadzenia", () => {
  it("regulator Victron 150/35: Voc max z karty, brak okna, moc nominalna z wiersza napięcia akumulatora", () => {
    const l = limityZUrzadzenia(znajdzUrzadzeniePv("victron-smartsolar-150-35")!, 24)
    expect(l).toMatchObject({ vocMaxV: 150, vocLimitZastepczy: false, mpptMinV: null, mpptMaxV: null, iscMaxWejsciaA: 40, liczbaWejsc: 1, mocLimitW: 1000, mocLimitRodzaj: "nominalna-przy-akumulatorze" })
    expect(limityZUrzadzenia(znajdzUrzadzeniePv("victron-smartsolar-150-35")!, null).mocLimitW).toBeNull()
  })

  it("falownik VEVOR bez Voc max: limit zastępczy = górna granica okna MPPT, moc z karty", () => {
    const l = limityZUrzadzenia(znajdzUrzadzeniePv("vevor-hybryda-em3500-24l")!, null)
    expect(l).toMatchObject({ vocMaxV: 500, vocLimitZastepczy: true, mpptMinV: 60, mpptMaxV: 500, mocLimitW: 4000, mocLimitRodzaj: "wejscie-pv" })
  })

  it("mikroinwerter: zakres wejścia DC karty jako okno, jeden panel na wejście, moc po stronie AC; Phoenix nie ma wejścia PV", () => {
    const l = limityZUrzadzenia(znajdzUrzadzeniePv("vevor-mikro-gt-600")!, null)
    expect(l).toMatchObject({ vocMaxV: 50, mpptMinV: 18, mpptMaxV: 50, jedenPanelNaWejscie: true, mocLimitW: 600, mocLimitRodzaj: "wyjscie-ac", liczbaWejsc: 2 })
    expect(limityZUrzadzenia(znajdzUrzadzeniePv("victron-phoenix-24-500")!, null).maWejsciePv).toBe(false)
  })
})

describe("ocenDopasowanie (A4)", () => {
  it("Victron 150/35 przy 24 V, 12 paneli: tylko układ 3 w szeregu mieści się w Voc, prąd zwarcia dzieli stringi na 2 regulatory", () => {
    const d = ocen("victron-smartsolar-150-35", 12, 24)!
    // Voc: 12 → 585,4 V, 6 → 292,7 V, 4 → 195,1 V (za dużo); 3 → 146,35 V ≤ 150 V
    // Isc 14,42 A, limit 40 A na wejście → 2 stringi na wejście (⌊40/14,42⌋ = 2); 4 stringi → 2 regulatory, 6 → 3, 12 → 6
    expect(uklad(d)).toEqual([[12, 1, null], [6, 2, null], [4, 3, null], [3, 4, 2], [2, 6, 3], [1, 12, 6]])
    const w = d.warianty[3]!
    expect(w.napiecieJalowe).toMatchObject({ status: "ok", limitV: 150, zastepcze: false })
    expect(w.napiecieJalowe.wartoscV).toBeCloseTo(3 * 48.7831, 3)
    expect(w.napiecieJalowe.wykorzystanieProc).toBeCloseTo((3 * 48.7831) / 1.5, 3)
    expect(w.pradZwarcia).toMatchObject({ status: "ok", limitA: 40 })
    expect(w.pradZwarcia.wartoscA).toBeCloseTo(2 * 14.42, 6)
    expect(w.pradRoboczy.status).toBe("brak-danych")
    expect(w.oknoMppt.status).toBe("brak-danych")
    expect(w.daneKompletne).toBe(false)
    expect(d.warianty[0]!.napiecieJalowe.status).toBe("przekroczone")
    expect(d.proponowany).toBe(3)
    // 12 · 500 W = 6000 W przy 2 · 1000 W nominalnej mocy PV przy 24 V
    expect(w.mocPaneliW).toBe(6000)
    expect(w.mocLimitW).toBe(2000)
    expect(w.nadmiarMocyW).toBe(4000)
    // jeden regulator: 3 w szeregu × 2 stringi
    expect(d.maxPaneliNaUrzadzenie).toBe(6)
  })

  it("mikroinwerter GT-600: panel 500 W (Imp 13,55 A) przekracza prąd wejścia 12 A, więc żaden układ się nie mieści", () => {
    const d = ocen("vevor-mikro-gt-600", 4)!
    expect(uklad(d)).toEqual([[4, 1, null], [2, 2, null], [1, 4, null]])
    const jeden = d.warianty[2]!
    expect(jeden.pradRoboczy).toMatchObject({ status: "przekroczone", limitA: 12 })
    expect(jeden.pradRoboczy.wartoscA).toBeCloseTo(13.55, 6)
    expect(jeden.napiecieJalowe.status).toBe("ok")
    expect(d.warianty[1]!.ukladNiedozwolony).toBe(true)
    expect(d.warianty[1]!.napiecieJalowe.status).toBe("przekroczone")
    expect(d.proponowany).toBeNull()
    expect(d.maxPaneliNaUrzadzenie).toBe(0)
  })

  it("mikroinwerter GT-800: 4 panele na 2 wejścia po jednym panelu, czyli 2 urządzenia; moc AC 2 · 800 W < 2000 W paneli", () => {
    const d = ocen("vevor-mikro-gt-800", 4)!
    expect(uklad(d)).toEqual([[4, 1, null], [2, 2, null], [1, 4, 2]])
    expect(d.proponowany).toBe(2)
    const w = d.warianty[2]!
    expect(w.pradRoboczy).toMatchObject({ status: "ok", limitA: 14 })
    expect(w.pradZwarcia.status).toBe("brak-danych")
    expect(w.mocLimitW).toBe(1600)
    expect(w.nadmiarMocyW).toBe(400)
    expect(d.maxPaneliNaUrzadzenie).toBe(2)
  })

  it("falownik VEVOR bez Voc max: przekroczenie górnej granicy okna to „brak danych”, nie „za dużo”, i taki układ nie jest proponowany", () => {
    const d = ocen("vevor-hybryda-em3500-24l", 12)!
    const dwanascie = d.warianty[0]!
    expect(dwanascie.napiecieJalowe).toMatchObject({ status: "brak-danych", zastepcze: true, limitV: 500 })
    expect(dwanascie.liczbaUrzadzen).toBe(1)
    expect(d.proponowany).toBe(1)
    expect(d.warianty[1]).toMatchObject({ panelowWSzeregu: 6, stringowRownolegle: 2 })
    expect(d.warianty[1]!.oknoMppt).toMatchObject({ status: "ok", minV: 60, maxV: 500 })
    expect(d.warianty[1]!.nadmiarMocyW).toBe(2000)
    // karta nie podaje prądu wejścia PV → liczby paneli na urządzenie nie da się policzyć
    expect(d.maxPaneliNaUrzadzenie).toBeNull()
  })

  it("napięcie stringu poniżej dolnej granicy okna MPPT: pojedynczy panel (Vmp 36,91 V) przy oknie od 60 V", () => {
    const d = ocen("vevor-hybryda-em3500-24l", 1)!
    expect(d.warianty).toHaveLength(1)
    expect(d.warianty[0]!.oknoMppt.status).toBe("ponizej")
    expect(d.warianty[0]!.miesciSie).toBe(false)
    expect(d.proponowany).toBeNull()
  })

  it("urządzenie bez wejścia PV albo brak danych elektrycznych panelu → null", () => {
    expect(ocen("victron-phoenix-24-500", 4)).toBeNull()
    const panel = { ...ja500(), elektryka: null }
    expect(ocenDopasowanie(panel, ocenElektryke(ja500(), 4, -20)!, 4, limityZUrzadzenia(znajdzUrzadzeniePv("vevor-mikro-gt-800")!, null))).toBeNull()
  })

  it("katalog: każdy panel ma wariant liczony bez błędu dla każdego urządzenia z wejściem PV (smoke)", () => {
    const urzadzenie = znajdzUrzadzeniePv("victron-smartsolar-250-70")!
    for (const p of KATALOG_PANELI_PV) {
      const panel: DanePanelu = { ...p, cenaBruttoZl: null }
      const d = ocenDopasowanie(panel, ocenElektryke(panel, 6, -25)!, 6, limityZUrzadzenia(urzadzenie, 48))
      expect(d, p.id).not.toBeNull()
      for (const w of d!.warianty) expect(w.miesciSie, p.id).toBe(w.liczbaUrzadzen !== null)
    }
  })
})
