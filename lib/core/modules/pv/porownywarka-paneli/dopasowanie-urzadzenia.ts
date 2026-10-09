/**
 * Porównywarka paneli PV (D81, Etap A4): dopasowanie układów stringów z A3 do falownika, regulatora MPPT albo mikroinwertera z katalogu
 * urządzeń. Sprawdza cztery rzeczy na wejściu PV — napięcie jałowe stringu zimą, okno MPPT, prąd roboczy i prąd zwarciowy na wejście —
 * i liczy, ile takich urządzeń potrzeba. Limit, którego karta nie podaje, to „brak danych”, nigdy wartość zgadnięta.
 *
 * Świadome przybliżenia (jawne w nocie ekranu): Vmp bierze się z STC, bo karty paneli nie podają współczynnika temperaturowego Vmp
 * (w upale Vmp jest niższe, na mrozie wyższe); prądy porównuje się w STC, tak jak karty urządzeń. Napięcie zimowe (Voc) jest policzone
 * w A3 z najniższej temperatury wpisanej przez użytkownika.
 */
import type { UrzadzeniePv } from "@/lib/core/dane/katalog-urzadzen-pv"
import type { WynikElektryki } from "./elektryka"
import type { DanePanelu } from "./input"

/** Tolerancja zaokrągleń przy dzieleniu limitu przez prąd panelu (np. 27,2 / 13,6 = 2 dokładnie). */
const EPS = 1e-9

export type LimityWejsciaPv = {
  /** Maks. napięcie jałowe wejścia PV [V]; `null` = karta nie podaje. */
  vocMaxV: number | null
  /** `true` = brak Voc max na karcie, wzięto górną granicę okna MPPT: przekroczenie oznacza „do sprawdzenia”, nie „na pewno za dużo”. */
  vocLimitZastepczy: boolean
  mpptMinV: number | null
  mpptMaxV: number | null
  /** Maks. prąd roboczy i prąd zwarcia PV NA JEDNO WEJŚCIE [A]. */
  iMaxWejsciaA: number | null
  iscMaxWejsciaA: number | null
  /** Liczba niezależnych wejść MPPT; `null` = karta nie podaje (liczone jako jedno). */
  liczbaWejsc: number | null
  /** Moc, powyżej której nadmiar jest obcinany albo niezalecany — jedno urządzenie [W]. */
  mocLimitW: number | null
  mocLimitRodzaj: "wejscie-pv" | "nominalna-przy-akumulatorze" | "wyjscie-ac" | null
  /** Mikroinwerter: jedno wejście = jeden panel (nie łączy się paneli w szereg). */
  jedenPanelNaWejscie: boolean
  /** `false` = urządzenie nie ma wejścia PV (np. falownik wyspowy Phoenix: wejście DC to akumulator). */
  maWejsciePv: boolean
}

/** Limity wejścia PV z wpisu katalogu; `napiecieAkumulatoraV` wybiera wiersz tabeli mocy nominalnej regulatora. */
export function limityZUrzadzenia(u: UrzadzeniePv, napiecieAkumulatoraV: number | null): LimityWejsciaPv {
  const mikro = u.rodzaj === "mikroinwerter-sieciowy"
  // For a micro-inverter the card's "DC input range" is the input window of one panel; for the others it is the battery side, not PV.
  const mpptMinV = u.mpptMinV ?? (mikro ? u.napiecieWejsciaDcMinV : null)
  const mpptMaxV = u.mpptMaxV ?? (mikro ? u.napiecieWejsciaDcMaxV : null)
  const vocKarty = u.vocMaxV ?? (mikro ? u.napiecieWejsciaDcMaxV : null)
  const vocMaxV = vocKarty ?? mpptMaxV
  const nominalna = u.mocPvNominalna?.find((w) => w.napiecieAkumulatoraV === napiecieAkumulatoraV)
  const moc: Pick<LimityWejsciaPv, "mocLimitW" | "mocLimitRodzaj"> =
    u.mocPvMaxW !== null
      ? { mocLimitW: u.mocPvMaxW, mocLimitRodzaj: "wejscie-pv" }
      : nominalna
        ? { mocLimitW: nominalna.mocW, mocLimitRodzaj: "nominalna-przy-akumulatorze" }
        : mikro && u.mocAcZnamionowaW !== null
          ? { mocLimitW: u.mocAcZnamionowaW, mocLimitRodzaj: "wyjscie-ac" }
          : { mocLimitW: null, mocLimitRodzaj: null }
  return {
    vocMaxV,
    vocLimitZastepczy: vocKarty === null && vocMaxV !== null,
    mpptMinV,
    mpptMaxV,
    iMaxWejsciaA: u.iMaxMpptA,
    iscMaxWejsciaA: u.iscMaxA,
    liczbaWejsc: u.liczbaWejscMppt,
    ...moc,
    jedenPanelNaWejscie: mikro,
    maWejsciePv: u.rodzaj !== "falownik-wyspowy",
  }
}

export type StatusKontroli = "ok" | "przekroczone" | "brak-danych"

export type OcenaWariantuUrzadzenia = {
  panelowWSzeregu: number
  stringowRownolegle: number
  /** Mikroinwerter przyjmuje jeden panel na wejście, więc szereg z kilku paneli odpada niezależnie od napięcia. */
  ukladNiedozwolony: boolean
  napiecieJalowe: { status: StatusKontroli; wartoscV: number; limitV: number | null; zastepcze: boolean; wykorzystanieProc: number | null }
  oknoMppt: { status: "ok" | "ponizej" | "powyzej" | "brak-danych"; vmpV: number; minV: number | null; maxV: number | null }
  /** Wartość = prąd na JEDNO wejście przy tym układzie (z podziałem na `liczbaUrzadzen`). */
  pradRoboczy: { status: StatusKontroli; wartoscA: number; limitA: number | null }
  pradZwarcia: { status: StatusKontroli; wartoscA: number; limitA: number | null }
  /** Ile urządzeń potrzeba, by rozdzielić stringi w limitach prądu; `null` = układ nie mieści się w limitach (napięcie, okno, pojedynczy string za mocny). */
  liczbaUrzadzen: number | null
  /** Żadna z kontroli nie jest przekroczona (brak danych nie liczy się jako przekroczenie). */
  miesciSie: boolean
  /** Wszystkie cztery kontrole mają dane z karty. */
  daneKompletne: boolean
  mocPaneliW: number
  /** Moc, ponad którą nadmiar jest obcinany — dla `liczbaUrzadzen` urządzeń; `null` bez limitu mocy albo gdy układ się nie mieści. */
  mocLimitW: number | null
  nadmiarMocyW: number | null
}

export type DopasowanieDoUrzadzenia = {
  limity: LimityWejsciaPv
  warianty: OcenaWariantuUrzadzenia[]
  /**
   * Indeks w `warianty`: spośród układów, które się mieszczą i mają potwierdzone napięcie jałowe, ten z najmniejszą liczbą urządzeń,
   * potem z najmniejszą liczbą stringów równoległych (mniej kabli i zabezpieczeń). `null` = żaden się nie kwalifikuje.
   */
  proponowany: number | null
  /** Ile paneli tego typu przyjmie JEDNO urządzenie wg napięć i prądów; `null` = brak danych do policzenia. */
  maxPaneliNaUrzadzenie: number | null
  /** Liczba wynika z górnej granicy okna MPPT zamiast z Voc max (karta nie podaje Voc max). */
  maxPaneliSzacunek: boolean
}

const dzielZaokraglDol = (limit: number, wartosc: number) => Math.floor(limit / wartosc + EPS)

/** Oceny wszystkich układów z A3 (`elektryka.warianty`) względem limitów urządzenia. */
export function ocenDopasowanie(panel: DanePanelu, elektryka: WynikElektryki, liczbaPaneli: number, limity: LimityWejsciaPv): DopasowanieDoUrzadzenia | null {
  const e = panel.elektryka
  if (!e || !limity.maWejsciePv || !Number.isInteger(liczbaPaneli) || liczbaPaneli < 1) return null
  const wejscia = limity.liczbaWejsc ?? 1
  const kRobocze = limity.iMaxWejsciaA === null ? null : dzielZaokraglDol(limity.iMaxWejsciaA, e.impA)
  const kZwarcia = limity.iscMaxWejsciaA === null ? null : dzielZaokraglDol(limity.iscMaxWejsciaA, e.iscA)
  const kPrad = [kRobocze, kZwarcia].filter((k): k is number => k !== null)
  const kPradMin = kPrad.length === 0 ? null : Math.min(...kPrad)
  // Strings one input can carry: a micro-inverter input takes a single panel whatever the current allows.
  const kNaWejscie = limity.jedenPanelNaWejscie ? Math.min(1, kPradMin ?? 1) : kPradMin

  const warianty: OcenaWariantuUrzadzenia[] = elektryka.warianty.map((v) => {
    const s = v.panelowWSzeregu
    const p = v.stringowRownolegle
    const ukladNiedozwolony = limity.jedenPanelNaWejscie && s > 1

    const vocLimit = limity.vocMaxV
    const napiecieJalowe: OcenaWariantuUrzadzenia["napiecieJalowe"] = {
      status: vocLimit === null ? "brak-danych" : v.vocZimaStringuV <= vocLimit ? "ok" : limity.vocLimitZastepczy ? "brak-danych" : "przekroczone",
      wartoscV: v.vocZimaStringuV,
      limitV: vocLimit,
      zastepcze: limity.vocLimitZastepczy,
      wykorzystanieProc: vocLimit === null ? null : (v.vocZimaStringuV / vocLimit) * 100,
    }

    const { mpptMinV, mpptMaxV } = limity
    const oknoMppt: OcenaWariantuUrzadzenia["oknoMppt"] = {
      status: mpptMinV === null && mpptMaxV === null ? "brak-danych" : mpptMinV !== null && v.vmpStringuV < mpptMinV ? "ponizej" : mpptMaxV !== null && v.vmpStringuV > mpptMaxV ? "powyzej" : "ok",
      vmpV: v.vmpStringuV,
      minV: mpptMinV,
      maxV: mpptMaxV,
    }

    const napiecieWOkach = napiecieJalowe.status !== "przekroczone" && (oknoMppt.status === "ok" || oknoMppt.status === "brak-danych")
    const pojedynczyStringZaMocny = (kRobocze !== null && kRobocze < 1) || (kZwarcia !== null && kZwarcia < 1)
    const poza = !napiecieWOkach || ukladNiedozwolony || pojedynczyStringZaMocny
    // Strings are spread evenly over the inputs; when one device cannot take them all, more devices share the strings.
    const liczbaUrzadzen = poza ? null : kNaWejscie === null ? 1 : Math.ceil(p / (wejscia * kNaWejscie))
    const naWejscie = liczbaUrzadzen === null ? 1 : Math.ceil(Math.ceil(p / liczbaUrzadzen) / wejscia)

    const prad = (k: number | null, limitA: number | null, pradStringuA: number): { status: StatusKontroli; wartoscA: number; limitA: number | null } => ({
      status: k === null ? "brak-danych" : k < 1 ? "przekroczone" : "ok",
      wartoscA: naWejscie * pradStringuA,
      limitA,
    })
    const pradRoboczy = prad(kRobocze, limity.iMaxWejsciaA, e.impA)
    const pradZwarcia = prad(kZwarcia, limity.iscMaxWejsciaA, e.iscA)

    const mocPaneliW = liczbaPaneli * panel.pmaxW
    const mocLimitW = limity.mocLimitW === null || liczbaUrzadzen === null ? null : limity.mocLimitW * liczbaUrzadzen
    const kontrole = [napiecieJalowe.status, oknoMppt.status, pradRoboczy.status, pradZwarcia.status]
    return {
      panelowWSzeregu: s,
      stringowRownolegle: p,
      ukladNiedozwolony,
      napiecieJalowe,
      oknoMppt,
      pradRoboczy,
      pradZwarcia,
      liczbaUrzadzen,
      miesciSie: liczbaUrzadzen !== null,
      daneKompletne: kontrole.every((k) => k !== "brak-danych") && !ukladNiedozwolony,
      mocPaneliW,
      mocLimitW,
      nadmiarMocyW: mocLimitW === null ? null : Math.max(0, mocPaneliW - mocLimitW),
    }
  })

  let proponowany: number | null = null
  warianty.forEach((w, i) => {
    if (w.liczbaUrzadzen === null || w.napiecieJalowe.status !== "ok") return
    const best = proponowany === null ? null : warianty[proponowany]!
    if (best === null || w.liczbaUrzadzen < best.liczbaUrzadzen! || (w.liczbaUrzadzen === best.liczbaUrzadzen && w.stringowRownolegle < best.stringowRownolegle)) proponowany = i
  })

  // Capacity of one device for this panel: the longest allowed string times the strings its inputs carry.
  const sGorne = [
    limity.jedenPanelNaWejscie ? 1 : null,
    limity.vocMaxV === null ? null : dzielZaokraglDol(limity.vocMaxV, elektryka.vocZimaPanelaV),
    limity.mpptMaxV === null ? null : dzielZaokraglDol(limity.mpptMaxV, e.vmpV),
    elektryka.maxPaneliWSzeregu,
  ].filter((x): x is number => x !== null)
  const sDolne = limity.mpptMinV === null ? 1 : Math.ceil(limity.mpptMinV / e.vmpV - EPS)
  const sMax = Math.min(...sGorne)
  const znaneNapiecia = limity.vocMaxV !== null || limity.mpptMaxV !== null
  const maxPaneliNaUrzadzenie = !znaneNapiecia || kNaWejscie === null ? null : sMax < Math.max(1, sDolne) || kNaWejscie < 1 ? 0 : sMax * kNaWejscie * wejscia
  return { limity, warianty, proponowany, maxPaneliNaUrzadzenie, maxPaneliSzacunek: limity.vocLimitZastepczy }
}
