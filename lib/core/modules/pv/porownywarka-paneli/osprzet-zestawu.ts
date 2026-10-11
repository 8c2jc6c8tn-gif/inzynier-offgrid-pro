/**
 * Porównywarka paneli PV: wycena urządzenia (falownik, regulator, mikroinwerter) i osprzętu dla zestawu o danej liczbie paneli.
 * Jedno miejsce dla ekranu „Falownik i osprzęt” (spec 27), okresu zwrotu z osprzętem (spec 30) i scenariusza „więcej paneli” z osprzętem
 * (spec 41): liczba paneli zmienia układ stringów, liczbę urządzeń i ilości osprzętu, więc wycena zawsze idzie przez te same funkcje.
 */
import type { BosId } from "@/lib/core/dane/cennik-bos"
import { znajdzUrzadzeniePv } from "@/lib/core/dane/katalog-urzadzen-pv"
import { obliczBos, type OpcjeBos, type WynikBos } from "./bos"
import {
  limityZUrzadzenia,
  ocenDopasowanie,
  type DopasowanieDoUrzadzenia,
  type LimityWejsciaPv,
  type OcenaWariantuUrzadzenia,
} from "./dopasowanie-urzadzenia"
import { ocenElektryke, type OchronaWariantu, type WynikElektryki } from "./elektryka"
import type { DanePanelu } from "./input"

/** Klucz układu: „<w szeregu>x<równolegle>”. */
export const kluczUkladu = (w: Pick<OcenaWariantuUrzadzenia, "panelowWSzeregu" | "stringowRownolegle">) => `${w.panelowWSzeregu}x${w.stringowRownolegle}`

export type UrzadzenieDoWyceny = {
  limity: LimityWejsciaPv
  /** Mikroinwerter: osprzętu DC nie wyceniamy. */
  mikro: boolean
  /** Cena jednego urządzenia; `null` = nie wpisano. */
  cenaUrzadzeniaJednegoZl: number | null
  /** Długość trasy kabla DC w jedną stronę [m]; `null` = nie wpisano. */
  trasaM: number | null
  opcjeBos: OpcjeBos
}

export type WycenaZestawu = {
  dopasowanie: DopasowanieDoUrzadzenia
  /** Wybrany układ: ten z `kluczWybranego`, jeśli mieści się w limitach, inaczej proponowany; `null` = żaden się nie kwalifikuje. */
  wybrany: OcenaWariantuUrzadzenia | null
  ochronaA3: OchronaWariantu | null
  /** `null` = mikroinwerter albo brak układu. */
  bos: WynikBos | null
  kosztUrzadzen: number
}

/** Wycena dla `liczbaPaneli` sztuk, na podstawie już policzonej elektryki (A3) tej liczby paneli; `null`, gdy urządzenie nie ma wejścia PV. */
export function wycenZestaw(panel: DanePanelu, elektryka: WynikElektryki, liczbaPaneli: number, u: UrzadzenieDoWyceny, kluczWybranego?: string): WycenaZestawu | null {
  const dopasowanie = ocenDopasowanie(panel, elektryka, liczbaPaneli, u.limity)
  if (!dopasowanie) return null
  const proponowany = dopasowanie.proponowany === null ? null : dopasowanie.warianty[dopasowanie.proponowany]!
  const wybrany = dopasowanie.warianty.find((w) => w.liczbaUrzadzen !== null && kluczUkladu(w) === kluczWybranego) ?? proponowany
  const indeks = wybrany === null ? -1 : dopasowanie.warianty.indexOf(wybrany)
  const ochronaA3 = indeks < 0 ? null : (elektryka.warianty[indeks]?.ochrona ?? null)
  const bos =
    wybrany === null || u.mikro
      ? null
      : obliczBos(
          {
            stringow: wybrany.stringowRownolegle,
            paneli: liczbaPaneli,
            wejscUzytych: Math.min(wybrany.stringowRownolegle, wybrany.liczbaUrzadzen! * (u.limity.liczbaWejsc ?? 1)),
            ochronaStringowWymagana: ochronaA3?.wymagana ?? false,
            dlugoscTrasyM: u.trasaM,
          },
          u.opcjeBos,
        )
  const kosztUrzadzen = wybrany === null || u.cenaUrzadzeniaJednegoZl === null ? 0 : u.cenaUrzadzeniaJednegoZl * wybrany.liczbaUrzadzen!
  return { dopasowanie, wybrany, ochronaA3, bos, kosztUrzadzen }
}

/**
 * Urządzenie i osprzęt do scenariusza „więcej paneli” (spec 41) jako zwykłe dane wejścia silnika (bez funkcji i bez znajomości formularza).
 * Ceny w walucie wyświetlania, tak jak ceny paneli; `kurs` = jednostek waluty na 1 zł (cennik osprzętu jest w zł).
 */
export type OsprzetScenariuszaInput = {
  urzadzenieId: string
  napiecieAkumulatoraV: number | null
  cenaUrzadzeniaJednegoZl: number | null
  trasaM: number | null
  bosWylaczone: readonly BosId[]
  bosCeny: Partial<Record<BosId, number>>
  kurs: number
  /** Układ wybrany przez użytkownika dla panelu (id panelu → klucz „<w szeregu>x<równolegle>”); używany tylko tam, gdzie mieści się w limitach. */
  ukladyPaneli?: Record<string, string>
}

export function urzadzenieZWejsciaScenariusza(o: OsprzetScenariuszaInput): UrzadzenieDoWyceny | null {
  const urzadzenie = znajdzUrzadzeniePv(o.urzadzenieId)
  if (!urzadzenie) return null
  return {
    limity: limityZUrzadzenia(urzadzenie, o.napiecieAkumulatoraV),
    mikro: urzadzenie.rodzaj === "mikroinwerter-sieciowy",
    cenaUrzadzeniaJednegoZl: o.cenaUrzadzeniaJednegoZl,
    trasaM: o.trasaM,
    opcjeBos: { wylaczone: o.bosWylaczone, cenyNadpisane: o.bosCeny, kurs: o.kurs },
  }
}

export type KosztZestawu = { minZl: number; maxZl: number; niepelny: boolean }

/**
 * Cena zestawu `liczbaPaneli` sztuk razem z urządzeniami i osprzętem (zakres min–max); `null`, gdy nie da się wycenić: brak danych
 * elektrycznych panelu albo Tmin, urządzenie bez wejścia PV albo żaden układ nie mieści się w limitach urządzenia dla tej liczby paneli.
 */
export function kosztZestawuZOsprzetem(panel: DanePanelu, cenaPaneliZl: number, liczbaPaneli: number, tminC: number | null | undefined, u: UrzadzenieDoWyceny, kluczWybranego?: string): KosztZestawu | null {
  const elektryka = ocenElektryke(panel, liczbaPaneli, tminC)
  if (!elektryka) return null
  const w = wycenZestaw(panel, elektryka, liczbaPaneli, u, kluczWybranego)
  if (!w || w.wybrany === null) return null
  return {
    minZl: cenaPaneliZl + w.kosztUrzadzen + (w.bos?.sumaMin ?? 0),
    maxZl: cenaPaneliZl + w.kosztUrzadzen + (w.bos?.sumaMax ?? 0),
    niepelny: (w.bos?.brakIlosci.length ?? 0) > 0,
  }
}
