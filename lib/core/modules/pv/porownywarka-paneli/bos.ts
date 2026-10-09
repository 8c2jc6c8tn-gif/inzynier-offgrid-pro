/**
 * Porównywarka paneli PV (D81, Etap A4): koszt osprzętu (BOS) dla wybranego układu stringów. ILOŚCI liczy ten moduł z liczby stringów,
 * paneli, wejść MPPT i długości trasy kabla; CENY JEDNOSTKOWE pochodzą z orientacyjnego cennika (`lib/core/dane/cennik-bos`) jako zakres
 * min–max, zawsze nadpisywalne przez użytkownika. Ilości to propozycja do dostosowania (każdą pozycję można wyłączyć), nie projekt instalacji:
 * dobór aparatury (prąd wkładek, przekroje, typ konstrukcji) należy do projektanta i kart urządzeń.
 */
import { CENNIK_BOS, VAT_OSPRZETU, type BosId, type PozycjaCennikaBos } from "@/lib/core/dane/cennik-bos"

/** Pozycje wyłączone domyślnie: obudowa z aparaturą zastępuje osobny rozłącznik, ogranicznik i bezpiecznik, więc dwóch naraz się nie liczy. */
export const BOS_DOMYSLNIE_WYLACZONE: readonly BosId[] = ["rozdzielnia-dc"]

export type WejscieBos = {
  /** Liczba stringów równoległych (wszystkie urządzenia razem) i liczba paneli. */
  stringow: number
  paneli: number
  /** Wejścia MPPT w użyciu (po jednym rozłączniku i ograniczniku na wejście). */
  wejscUzytych: number
  /** Z A3: obowiązek zabezpieczenia nadprądowego każdego stringu. */
  ochronaStringowWymagana: boolean
  /** Długość trasy kabla DC od paneli do urządzenia, w jedną stronę [m]; `null` = nie wpisano. */
  dlugoscTrasyM: number | null
}

/** Ilość każdej pozycji; `null` = brak danych wejściowych (kabel bez długości trasy). */
export function iloscBos(w: WejscieBos): Record<BosId, number | null> {
  return {
    // Plus and minus run separately for every string.
    "kabel-pv": w.dlugoscTrasyM === null ? null : 2 * w.dlugoscTrasyM * w.stringow,
    // One connector pair per pole of each string, where the panel leads join the trunk cable.
    mc4: 2 * w.stringow,
    "bezpiecznik-dc": w.ochronaStringowWymagana ? w.stringow : 0,
    "rozlacznik-dc": w.wejscUzytych,
    "spd-dc": w.wejscUzytych,
    "rozdzielnia-dc": w.stringow,
    konstrukcja: w.paneli,
  }
}

export type LiniaBos = {
  id: BosId
  jednostka: PozycjaCennikaBos["jednostka"]
  pewnosc: PozycjaCennikaBos["pewnosc"]
  ilosc: number | null
  /** Cena jednostkowa brutto w walucie wyświetlania; przy nadpisaniu min = max. */
  cenaMin: number
  cenaMax: number
  nadpisanaCena: boolean
  wliczona: boolean
  /** Suma pozycji; `null`, gdy pozycja jest wyłączona albo brak ilości. */
  sumaMin: number | null
  sumaMax: number | null
}

export type OpcjeBos = {
  /** Pozycje wyłączone przez użytkownika; domyślnie `BOS_DOMYSLNIE_WYLACZONE`. */
  wylaczone: readonly BosId[]
  /** Ceny jednostkowe brutto wpisane przez użytkownika (waluta wyświetlania) — zastępują zakres z cennika. */
  cenyNadpisane: Partial<Record<BosId, number>>
  /** Jednostek waluty wyświetlania na 1 zł (cennik jest w zł). */
  kurs: number
}

export type WynikBos = {
  linie: LiniaBos[]
  sumaMin: number
  sumaMax: number
  /** Wliczona pozycja bez ilości — suma jej nie zawiera. */
  brakIlosci: BosId[]
}

export function obliczBos(w: WejscieBos, opcje: OpcjeBos): WynikBos {
  const ilosci = iloscBos(w)
  const linie = CENNIK_BOS.map((poz): LiniaBos => {
    const nadpisana = opcje.cenyNadpisane[poz.id]
    const cenaMin = nadpisana ?? poz.nettoMinZl * (1 + VAT_OSPRZETU) * opcje.kurs
    const cenaMax = nadpisana ?? poz.nettoMaxZl * (1 + VAT_OSPRZETU) * opcje.kurs
    const ilosc = ilosci[poz.id]
    const wliczona = !opcje.wylaczone.includes(poz.id)
    const licz = wliczona && ilosc !== null
    return {
      id: poz.id,
      jednostka: poz.jednostka,
      pewnosc: poz.pewnosc,
      ilosc,
      cenaMin,
      cenaMax,
      nadpisanaCena: nadpisana !== undefined,
      wliczona,
      sumaMin: licz ? ilosc * cenaMin : null,
      sumaMax: licz ? ilosc * cenaMax : null,
    }
  })
  return {
    linie,
    sumaMin: linie.reduce((a, l) => a + (l.sumaMin ?? 0), 0),
    sumaMax: linie.reduce((a, l) => a + (l.sumaMax ?? 0), 0),
    brakIlosci: linie.filter((l) => l.wliczona && l.ilosc === null).map((l) => l.id),
  }
}
