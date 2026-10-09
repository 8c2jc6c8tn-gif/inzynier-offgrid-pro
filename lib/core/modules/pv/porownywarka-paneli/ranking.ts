/**
 * Ranking katalogu (spec 12, krok „sito”): wszystkie panele z katalogu na jednym miejscu, jednym tanim i uczciwym
 * miernikiem — zimowa energia — bez gwiazdek (te są względne wobec wybranego zestawu) i bez ceny (katalog jej nie ma).
 * Reguła porównywalności: wpływ temperatury ogniwa liczymy, gdy dane pogodowe mają temperaturę i choć jeden panel ma γ i NOCT;
 * wtedy panele BEZ γ albo NOCT nie są punktowane (wiersz „brak danych”, wartości `null`, na końcu listy) — nie wyłączają
 * temperatury pozostałym (decyzja właściciela 09.10.2026). Słabe światło: tylko gdy wszystkie ocenione panele mają daną z karty.
 */
import { MIESIACE_ZIMOWE_POROWNYWARKI } from "./constants"
import type { DanePanelu, MiejsceInput, WymiaryMiejsca } from "./input"
import { pojemnoscMiejsca, pojemnoscPochylona, wspolczynnikOknaMiejsca } from "./pakowanie"
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
  /** Brakujące dane temperaturowe z karty (`gamma`, `noct`) — niepusta lista = panel wykluczony z oceny (wartości `null`). */
  brakuje: ("gamma" | "noct")[]
  /** Zimowa energia jednego panelu [kWh] i roczna; `null` = panel wykluczony (brak danych temperaturowych). */
  zimaNaPanelKwh: number | null
  rokNaPanelKwh: number | null
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
  const temperatura = profil.tempC !== null && a.panele.some(maParametryTemperaturowe)
  /** Panele, które w ogóle oceniamy: przy modelu z temperaturą tylko te z γ i NOCT. */
  const ocenione = temperatura ? a.panele.filter(maParametryTemperaturowe) : a.panele
  const zakresModelu: ZakresModelu = {
    temperatura,
    slabeSwiatlo: ocenione.length > 0 && ocenione.every((p) => p.sprawnoscWzglednaPrzy200WPct !== null),
  }
  const wymiary = a.wymiaryMiejsca
  const pochylone = wymiary !== null && wymiary.montaz === "pochylony-na-konstrukcji"
  const fOkna = pochylone ? wspolczynnikOknaMiejsca(wymiary, a.szerokoscGeograficzna, a.dlugoscGeograficzna, a.miejsce.azymutDeg) : null
  /** Liczba sztuk w miejscu: pakowanie równoległe albo rzędy w odstępie bez cienia; `null`, gdy się nie da policzyć. */
  const pojemnosc = (p: DanePanelu): number | null => {
    if (wymiary === null) return null
    if (!pochylone) return pojemnoscMiejsca(wymiary, p)?.liczba ?? null
    return fOkna === null ? null : (pojemnoscPochylona(wymiary, p, a.miejsce.nachylenieDeg, fOkna)?.liczba ?? null)
  }
  const wiersze = a.panele.map((p): WierszRankingu => {
    const brakuje: WierszRankingu["brakuje"] = []
    if (temperatura && !maParametryTemperaturowe(p)) {
      if (p.gammaPctNaC === null) brakuje.push("gamma")
      if (p.noctC === null) brakuje.push("noct")
      return { id: p.id, nazwa: p.nazwa, pmaxW: p.pmaxW, dlugoscMm: p.dlugoscMm, szerokoscMm: p.szerokoscMm, brakuje, zimaNaPanelKwh: null, rokNaPanelKwh: null, zimaNaM2Kwh: null, liczbaWMiejscu: null, zimaWMiejscuKwh: null, rokWMiejscuKwh: null }
    }
    const mies = miesiecznaEnergiaPanelu(p, profil, zakresModelu)
    const zima = suma(MIESIACE_ZIMOWE_POROWNYWARKI.map((m) => mies[m]!))
    const rok = suma(mies)
    const pole = p.dlugoscMm !== null && p.szerokoscMm !== null ? (p.dlugoscMm / 1000) * (p.szerokoscMm / 1000) : null
    const n = pojemnosc(p)
    return {
      id: p.id,
      nazwa: p.nazwa,
      pmaxW: p.pmaxW,
      dlugoscMm: p.dlugoscMm,
      szerokoscMm: p.szerokoscMm,
      brakuje,
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
