/**
 * Podsumowanie zakładki „Falownik i osprzęt” (A4) jako dane: urządzenie z katalogu, ocena układów każdego panelu, układ do wyceny
 * osprzętu i łączny koszt. Korzystają z niego zakładka i wydruk oferty, żeby liczby w obu miejscach były te same. To warstwa UI
 * (czyta tekstowy stan formularza); obliczenia robią moduły `lib/core`.
 */
import type { BosId } from "@/lib/core/dane/cennik-bos"
import { znajdzUrzadzeniePv, type UrzadzeniePv } from "@/lib/core/dane/katalog-urzadzen-pv"
import { BOS_DOMYSLNIE_WYLACZONE, obliczBos, type WynikBos } from "@/lib/core/modules/pv/porownywarka-paneli/bos"
import type { WynikPanelu } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import {
  limityZUrzadzenia,
  ocenDopasowanie,
  type DopasowanieDoUrzadzenia,
  type LimityWejsciaPv,
  type OcenaWariantuUrzadzenia,
} from "@/lib/core/modules/pv/porownywarka-paneli/dopasowanie-urzadzenia"
import type { OchronaWariantu } from "@/lib/core/modules/pv/porownywarka-paneli/elektryka"
import type { DanePanelu } from "@/lib/core/modules/pv/porownywarka-paneli/input"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import type { FormularzStan } from "./stan"

/** Klucz układu w stanie formularza i w liście wyboru: „<w szeregu>x<równolegle>”. */
export const kluczUkladu = (w: Pick<OcenaWariantuUrzadzenia, "panelowWSzeregu" | "stringowRownolegle">) => `${w.panelowWSzeregu}x${w.stringowRownolegle}`

export type PanelNaUrzadzeniu = {
  wynik: WynikPanelu
  dopasowanie: DopasowanieDoUrzadzenia
  /** Układ do wyceny osprzętu: wybrany przez użytkownika spośród mieszczących się w limitach, a domyślnie proponowany; `null` = żaden się nie kwalifikuje. */
  wybrany: OcenaWariantuUrzadzenia | null
  /** Ochrona stringów wybranego układu z A3; `null` = karta panelu nie podaje prądu bezpiecznika szeregowego (albo brak układu). */
  ochronaA3: OchronaWariantu | null
  /** `null` = mikroinwerter (osprzętu DC nie wyceniamy) albo brak układu. */
  bos: WynikBos | null
  /** Cena urządzeń razem (cena jednego × liczba urządzeń); 0 bez wpisanej ceny. */
  kosztUrzadzen: number
  /** Panele + urządzenia + osprzęt jako zakres; `null` bez ceny paneli albo bez wyceny osprzętu. */
  razemMin: number | null
  razemMax: number | null
}

export type PodsumowanieUrzadzenia = {
  urzadzenie: UrzadzeniePv
  limity: LimityWejsciaPv
  mikro: boolean
  panele: PanelNaUrzadzeniu[]
}

export const wylaczoneBos = (stan: Pick<FormularzStan, "bosWylaczone">): readonly BosId[] => stan.bosWylaczone ?? BOS_DOMYSLNIE_WYLACZONE

/** Własne ceny osprzętu z formularza; puste albo ujemne pola są pomijane (wtedy działa zakres z cennika). */
export function cenyOsprzetuZStanu(stan: Pick<FormularzStan, "bosCeny">): Partial<Record<BosId, number>> {
  const wynik: Partial<Record<BosId, number>> = {}
  for (const [id, tekst] of Object.entries(stan.bosCeny ?? {})) {
    const x = liczba(tekst)
    if (x !== undefined && x >= 0) wynik[id as BosId] = x
  }
  return wynik
}

export function podsumujUrzadzenie(i: {
  stan: FormularzStan
  panele: WynikPanelu[]
  /** Dane paneli przekazane do silnika (moc i elektryka każdego panelu). */
  dane: DanePanelu[]
  /** Jednostek waluty wyświetlania na 1 zł (cennik osprzętu jest w zł). */
  kurs: number
}): PodsumowanieUrzadzenia | null {
  const { stan } = i
  const urzadzenie = stan.urzadzenieId ? znajdzUrzadzeniePv(stan.urzadzenieId) : undefined
  if (!urzadzenie) return null
  const limity = limityZUrzadzenia(urzadzenie, liczba(stan.akumV ?? "") ?? null)
  const mikro = urzadzenie.rodzaj === "mikroinwerter-sieciowy"
  const cenaUrzadzenia = liczba(stan.cenaUrzadzenia ?? "") ?? null
  const trasaM = liczba(stan.trasaM ?? "") ?? null
  const opcje = { wylaczone: wylaczoneBos(stan), cenyNadpisane: cenyOsprzetuZStanu(stan), kurs: i.kurs }

  const panele = i.panele.flatMap((wynik): PanelNaUrzadzeniu[] => {
    const dane = i.dane.find((x) => x.id === wynik.id)
    const dopasowanie = dane && wynik.elektryka ? ocenDopasowanie(dane, wynik.elektryka, wynik.liczbaPaneli, limity) : null
    if (!dopasowanie || !wynik.elektryka) return []
    const proponowany = dopasowanie.proponowany === null ? null : dopasowanie.warianty[dopasowanie.proponowany]!
    const wybrany = dopasowanie.warianty.find((w) => w.liczbaUrzadzen !== null && kluczUkladu(w) === stan.bosUklad?.[wynik.id]) ?? proponowany
    const indeks = wybrany === null ? -1 : dopasowanie.warianty.indexOf(wybrany)
    const ochronaA3 = indeks < 0 ? null : (wynik.elektryka.warianty[indeks]?.ochrona ?? null)
    const bos =
      wybrany === null || mikro
        ? null
        : obliczBos(
            {
              stringow: wybrany.stringowRownolegle,
              paneli: wynik.liczbaPaneli,
              wejscUzytych: Math.min(wybrany.stringowRownolegle, wybrany.liczbaUrzadzen! * (limity.liczbaWejsc ?? 1)),
              ochronaStringowWymagana: ochronaA3?.wymagana ?? false,
              dlugoscTrasyM: trasaM,
            },
            opcje,
          )
    const kosztUrzadzen = wybrany === null || cenaUrzadzenia === null ? 0 : cenaUrzadzenia * wybrany.liczbaUrzadzen!
    const maRazem = wynik.cenaRazemZl !== null && bos !== null
    return [
      {
        wynik,
        dopasowanie,
        wybrany,
        ochronaA3,
        bos,
        kosztUrzadzen,
        razemMin: maRazem ? wynik.cenaRazemZl! + kosztUrzadzen + bos!.sumaMin : null,
        razemMax: maRazem ? wynik.cenaRazemZl! + kosztUrzadzen + bos!.sumaMax : null,
      },
    ]
  })
  return { urzadzenie, limity, mikro, panele }
}
