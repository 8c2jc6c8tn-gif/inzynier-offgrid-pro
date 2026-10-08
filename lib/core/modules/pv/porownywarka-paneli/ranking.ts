/**
 * Ranking katalogu (spec 12, krok „sito”): wszystkie panele z katalogu na jednym miejscu, jednym tanim i uczciwym
 * miernikiem — zimowa energia — bez gwiazdek (te są względne wobec wybranego zestawu) i bez ceny (katalog jej nie ma).
 * Reguła porównywalności ta sama co w porównaniu: zjawisko (temperatura, słabe światło) jest liczone tylko wtedy, gdy
 * WSZYSTKIE panele w rankingu mają jego dane.
 */
import { MIESIACE_ZIMOWE_POROWNYWARKI } from "./constants"
import type { DanePanelu, MiejsceInput, WymiaryMiejsca } from "./input"
import { pojemnoscMiejsca } from "./pakowanie"
import { maParametryTemperaturowe, miesiecznaEnergiaPanelu, profilNaslonecznienia, type ZakresModelu } from "./uzysk"
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"

export type FiltrRankingu = {
  pmaxMinW?: number
  pmaxMaxW?: number
  /** Najdłuższy dopuszczalny bok panelu [mm] (U5: „maksymalny wymiar panelu” to filtr, nie pakowanie). Panel bez wymiarów odpada. */
  maxBokMm?: number
}

export type SortowanieRankingu = "zimaNaPanel" | "zimaNaM2" | "zimaWMiejscu"

export type WierszRankingu = {
  id: string
  nazwa: string
  pmaxW: number
  dlugoscMm: number | null
  szerokoscMm: number | null
  /** Zimowa energia jednego panelu [kWh] i roczna. */
  zimaNaPanelKwh: number
  rokNaPanelKwh: number
  /** Zima na 1 m² powierzchni panelu [kWh/m²]; `null` bez wymiarów. */
  zimaNaM2Kwh: number | null
  /** Ile sztuk mieści się w podanych wymiarach miejsca i zimowa/roczna energia tylu sztuk; `null` bez wymiarów miejsca lub panelu. */
  liczbaWMiejscu: number | null
  zimaWMiejscuKwh: number | null
  rokWMiejscuKwh: number | null
}

export type WynikRankingu = { zakresModelu: ZakresModelu; wiersze: WierszRankingu[] }

const suma = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

export function przefiltrujKatalog(katalog: readonly DanePanelu[], f: FiltrRankingu): DanePanelu[] {
  return katalog.filter((p) => {
    if (f.pmaxMinW !== undefined && p.pmaxW < f.pmaxMinW) return false
    if (f.pmaxMaxW !== undefined && p.pmaxW > f.pmaxMaxW) return false
    if (f.maxBokMm !== undefined) {
      if (p.dlugoscMm === null || p.szerokoscMm === null) return false
      if (Math.max(p.dlugoscMm, p.szerokoscMm) > f.maxBokMm) return false
    }
    return true
  })
}

/** Wartość miernika do sortowania malejąco; `null` (brak danych) ląduje na końcu. */
export function wartoscSortowania(w: WierszRankingu, klucz: SortowanieRankingu): number | null {
  return klucz === "zimaNaPanel" ? w.zimaNaPanelKwh : klucz === "zimaNaM2" ? w.zimaNaM2Kwh : w.zimaWMiejscuKwh
}

export function posortujRanking(wiersze: readonly WierszRankingu[], klucz: SortowanieRankingu): WierszRankingu[] {
  return [...wiersze].sort((a, b) => {
    const x = wartoscSortowania(a, klucz)
    const y = wartoscSortowania(b, klucz)
    return x === null ? (y === null ? 0 : 1) : y === null ? -1 : y - x
  })
}

export function rankingKatalogu(a: {
  szerokoscGeograficzna: number
  dlugoscGeograficzna: number
  daneGodzinowe: RekordGodzinowy[]
  miejsce: MiejsceInput
  wymiaryMiejsca: WymiaryMiejsca | null
  panele: readonly DanePanelu[]
}): WynikRankingu {
  const profil = profilNaslonecznienia(a.szerokoscGeograficzna, a.dlugoscGeograficzna, a.daneGodzinowe, a.miejsce)
  const zakresModelu: ZakresModelu = {
    temperatura: profil.tempC !== null && a.panele.every(maParametryTemperaturowe),
    slabeSwiatlo: a.panele.every((p) => p.sprawnoscWzglednaPrzy200WPct !== null),
  }
  const rownolegle = a.wymiaryMiejsca !== null && a.wymiaryMiejsca.montaz === "rownolegly" ? a.wymiaryMiejsca : null
  const wiersze = a.panele.map((p): WierszRankingu => {
    const mies = miesiecznaEnergiaPanelu(p, profil, zakresModelu)
    const zima = suma(MIESIACE_ZIMOWE_POROWNYWARKI.map((m) => mies[m]!))
    const rok = suma(mies)
    const pole = p.dlugoscMm !== null && p.szerokoscMm !== null ? (p.dlugoscMm / 1000) * (p.szerokoscMm / 1000) : null
    const n = rownolegle ? (pojemnoscMiejsca(rownolegle, p)?.liczba ?? null) : null
    return {
      id: p.id,
      nazwa: p.nazwa,
      pmaxW: p.pmaxW,
      dlugoscMm: p.dlugoscMm,
      szerokoscMm: p.szerokoscMm,
      zimaNaPanelKwh: zima,
      rokNaPanelKwh: rok,
      zimaNaM2Kwh: pole === null ? null : zima / pole,
      liczbaWMiejscu: n,
      zimaWMiejscuKwh: n === null ? null : zima * n,
      rokWMiejscuKwh: n === null ? null : rok * n,
    }
  })
  return { zakresModelu, wiersze }
}
