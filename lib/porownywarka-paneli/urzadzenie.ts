/**
 * Podsumowanie zakładki „Falownik i osprzęt” (A4) jako dane: urządzenie z katalogu, ocena układów każdego panelu, układ do wyceny
 * osprzętu i łączny koszt. Korzystają z niego zakładka i wydruk oferty, żeby liczby w obu miejscach były te same. To warstwa UI
 * (czyta tekstowy stan formularza); obliczenia robią moduły `lib/core`.
 */
import type { BosId } from "@/lib/core/dane/cennik-bos"
import { znajdzUrzadzeniePv, type UrzadzeniePv } from "@/lib/core/dane/katalog-urzadzen-pv"
import { BOS_DOMYSLNIE_WYLACZONE, type WynikBos } from "@/lib/core/modules/pv/porownywarka-paneli/bos"
import type { WynikPanelu } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import {
  limityZUrzadzenia,
  type DopasowanieDoUrzadzenia,
  type LimityWejsciaPv,
  type OcenaWariantuUrzadzenia,
} from "@/lib/core/modules/pv/porownywarka-paneli/dopasowanie-urzadzenia"
import { kluczUkladu, wycenZestaw, type OsprzetScenariuszaInput, type UrzadzenieDoWyceny } from "@/lib/core/modules/pv/porownywarka-paneli/osprzet-zestawu"
import type { OchronaWariantu } from "@/lib/core/modules/pv/porownywarka-paneli/elektryka"
import type { DanePanelu } from "@/lib/core/modules/pv/porownywarka-paneli/input"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import type { FormularzStan } from "./stan"

export { kluczUkladu }

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

/**
 * Device and accessories for the "more panels" scenario, from the form: only while the switch "add the device and accessories to the price"
 * (Profitability tab) is on and a device is chosen; `null` otherwise. Prices stay in the display currency like the panel prices.
 */
export function osprzetScenariuszaZFormularza(stan: FormularzStan, kurs: number): OsprzetScenariuszaInput | null {
  if (stan.zwrotZOsprzetem !== true || !stan.urzadzenieId) return null
  return {
    urzadzenieId: stan.urzadzenieId,
    napiecieAkumulatoraV: liczba(stan.akumV ?? "") ?? null,
    cenaUrzadzeniaJednegoZl: liczba(stan.cenaUrzadzenia ?? "") ?? null,
    trasaM: liczba(stan.trasaM ?? "") ?? null,
    bosWylaczone: wylaczoneBos(stan),
    bosCeny: cenyOsprzetuZStanu(stan),
    kurs,
    ukladyPaneli: stan.bosUklad ?? {},
  }
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
  const doWyceny: UrzadzenieDoWyceny = {
    limity,
    mikro,
    cenaUrzadzeniaJednegoZl: liczba(stan.cenaUrzadzenia ?? "") ?? null,
    trasaM: liczba(stan.trasaM ?? "") ?? null,
    opcjeBos: { wylaczone: wylaczoneBos(stan), cenyNadpisane: cenyOsprzetuZStanu(stan), kurs: i.kurs },
  }

  const panele = i.panele.flatMap((wynik): PanelNaUrzadzeniu[] => {
    const dane = i.dane.find((x) => x.id === wynik.id)
    const w = dane && wynik.elektryka ? wycenZestaw(dane, wynik.elektryka, wynik.liczbaPaneli, doWyceny, stan.bosUklad?.[wynik.id]) : null
    if (!w) return []
    const { dopasowanie, wybrany, ochronaA3, bos, kosztUrzadzen } = w
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
