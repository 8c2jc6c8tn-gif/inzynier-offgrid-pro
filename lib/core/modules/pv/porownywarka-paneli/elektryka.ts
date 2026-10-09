/**
 * Porównywarka paneli PV (D81, Etap A3): elektryka panelu bez falownika — napięcie stringu zimą, limit napięcia układu z karty,
 * warianty połączenia N paneli w równe stringi i ochrona stringów. Wzory i progi nie są tu redefiniowane: napięcie zimowe z
 * `stress-test-mppt`, sumowanie szereg/równolegle z `konfigurator-stringow`, margines Isc i obowiązek zabezpieczenia stringów z
 * `ochrona-stringow` (HD 60364-7-712). Rekomendacji jednego wariantu NIE ma: bez falownika (okno MPPT, maks. Voc wejścia — Etap A4)
 * „najlepszy” szereg byłby po prostu najwyższym napięciem DC dopuszczonym przez panel (do 1500 V), co w instalacji off-grid jest złym doradztwem.
 */
import { calculateKonfiguratorStringow } from "@/lib/core/modules/pv/konfigurator-stringow/calculator"
import { calculateOchronaStringow, obliczIScMaxA } from "@/lib/core/modules/pv/ochrona-stringow/calculator"
import { obliczNapiecieStringuZimowego } from "@/lib/core/modules/pv/stress-test-mppt/calculator"
import type { DanePanelu } from "./input"

export type OchronaWariantu = {
  /** Obowiązek zabezpieczenia nadprądowego każdego stringu (§712.431.101); przy ≤ 2 stringach równoległych norma go wyklucza. */
  wymagana: boolean
  /** > 2 stringi i ochrona niewymagana wzorem → wymagana alternatywa kablowa (§712.433.101), nieobjęta tym ekranem. */
  alternatywaKablowa: boolean
  /** `false` = żaden bezpiecznik nie spełnia przedziału normy dla tego panelu i liczby stringów. */
  zakresPoprawny: boolean
  /** Przedział prądu znamionowego zabezpieczenia stringu [A] (1,1·Isc_max … I_MOD_MAX_OCPR). */
  inMinA: number
  inMaxA: number
}

export type WariantPolaczenia = {
  /** Liczba paneli w jednym stringu (szeregowo). */
  panelowWSzeregu: number
  /** Liczba stringów połączonych równolegle. */
  stringowRownolegle: number
  /** Napięcie stringu w STC w punkcie mocy [V]. */
  vmpStringuV: number
  /** Napięcie jałowe stringu w najniższej temperaturze [V]. */
  vocZimaStringuV: number
  /** Prąd w punkcie mocy macierzy [A]. */
  impMacierzyA: number
  /** Prąd zwarciowy macierzy w STC [A]. */
  iscMacierzyA: number
  /** `null`, gdy karta nie podaje prądu bezpiecznika szeregowego (przedziału nie da się wyznaczyć). */
  ochrona: OchronaWariantu | null
}

export type WynikElektryki = {
  tminC: number
  /** Voc jednego panelu w najniższej temperaturze [V]. */
  vocZimaPanelaV: number
  /** Maksymalne napięcie układu DC z karty [V]. */
  limitNapieciaV: number
  /** Największa liczba paneli w jednym stringu, przy której Voc zimą mieści się w limicie napięcia układu z karty. */
  maxPaneliWSzeregu: number
  /** Wszystkie równe połączenia N paneli mieszczące się w limicie napięcia, od najmniejszej liczby stringów równoległych. */
  warianty: WariantPolaczenia[]
  /** Prąd zwarciowy jednego stringu z marginesem normy (K1·Isc) [A]. */
  iscMaxStringuA: number
}

/** Ocena elektryki dla `liczbaPaneli` sztuk; `null`, gdy brak danych elektrycznych panelu, Tmin albo liczby sztuk. */
export function ocenElektryke(panel: DanePanelu, liczbaPaneli: number, tminC: number | null | undefined): WynikElektryki | null {
  const e = panel.elektryka
  if (!e || tminC === null || tminC === undefined || !Number.isInteger(liczbaPaneli) || liczbaPaneli < 1) return null
  const vocZimaPanelaV = obliczNapiecieStringuZimowego(e.vocV, e.betaVocPctNaC, tminC, 1)
  const maxPaneliWSzeregu = Math.floor(e.maxNapieciaSystemuV / vocZimaPanelaV)
  const warianty: WariantPolaczenia[] = []
  for (let s = 1; s <= Math.min(liczbaPaneli, maxPaneliWSzeregu); s++) {
    if (liczbaPaneli % s !== 0) continue
    const p = liczbaPaneli / s
    const suma = calculateKonfiguratorStringow({ mode: "mieszany", vmpV: e.vmpV, impA: e.impA, panelWGrupie: s, liczbaGrup: p })
    const ochronaWyn =
      e.maxBezpiecznikSzeregowyA === null
        ? null
        : calculateOchronaStringow({
            iscStcA: e.iscA,
            iModMaxOcprA: e.maxBezpiecznikSzeregowyA,
            liczbaStringowRownoleglych: p,
            maZabezpieczeniaPerString: false,
            wybranyBezpiecznikA: null,
          }).value
    warianty.push({
      panelowWSzeregu: s,
      stringowRownolegle: p,
      vmpStringuV: suma.value.voltageV,
      vocZimaStringuV: obliczNapiecieStringuZimowego(e.vocV, e.betaVocPctNaC, tminC, s),
      impMacierzyA: suma.value.currentA,
      iscMacierzyA: e.iscA * p,
      ochrona:
        ochronaWyn === null
          ? null
          : {
              wymagana: ochronaWyn.ochronaWymagana,
              alternatywaKablowa: ochronaWyn.alternatywaKablowaWymagana,
              zakresPoprawny: ochronaWyn.zakresPoprawny,
              inMinA: ochronaWyn.inMinA,
              inMaxA: ochronaWyn.inMaxA,
            },
    })
  }
  warianty.sort((a, b) => a.stringowRownolegle - b.stringowRownolegle)
  return { tminC, vocZimaPanelaV, limitNapieciaV: e.maxNapieciaSystemuV, maxPaneliWSzeregu, warianty, iscMaxStringuA: obliczIScMaxA(e.iscA) }
}
