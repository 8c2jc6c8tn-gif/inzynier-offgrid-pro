/**
 * Drafts of the Module 2 screens → calculator inputs and daily energy [kWh/day] (decision D-3, owner 24.11.2026: the „Bilans
 * zapotrzebowania” screen sums what the other screens already compute). One place for the draft → input conversion, used by the
 * source screens themselves and by the balance, so the two can never compute the same screen differently. UI layer (drafts hold
 * text), pure functions.
 */
import { isComputed } from "@/lib/core/calc-result"
import { calculateBojlerCwu } from "@/lib/core/modules/zapotrzebowanie/bojler-cwu/calculator"
import type { BojlerCwuInput } from "@/lib/core/modules/zapotrzebowanie/bojler-cwu/input"
import { calculateKategorieSpecjalne } from "@/lib/core/modules/zapotrzebowanie/kategorie-specjalne/calculator"
import type { KategorieSpecjalneInput } from "@/lib/core/modules/zapotrzebowanie/kategorie-specjalne/input"
import { calculatePoborWlasnyFalownika } from "@/lib/core/modules/zapotrzebowanie/pobor-wlasny-falownika/calculator"
import type { PoborWlasnyFalownikaInput } from "@/lib/core/modules/zapotrzebowanie/pobor-wlasny-falownika/input"
import { calculateSezonowosc } from "@/lib/core/modules/zapotrzebowanie/sezonowosc/calculator"
import type { SezonowoscInput, TypSezonowosci } from "@/lib/core/modules/zapotrzebowanie/sezonowosc/input"
import { calculateUrzadzeniaZmienne } from "@/lib/core/modules/zapotrzebowanie/urzadzenia-zmienne/calculator"
import type { PozycjaUrzadzenia, UrzadzeniaZmienneInput } from "@/lib/core/modules/zapotrzebowanie/urzadzenia-zmienne/input"
import { calculateKatalogUrzadzen } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/katalog-urzadzen/calculator"
import type { KatalogUrzadzenInput } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/katalog-urzadzen/input"
import { calculatePomiarMocyJalowej } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/pomiar-mocy-jalowej/calculator"
import type { PomiarMocyJalowejInput } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/pomiar-mocy-jalowej/input"
import type { BuforRozbudowyInput } from "@/lib/core/modules/zapotrzebowanie/bufor-rozbudowe/input"
import { dobowaWhNaMiesiac, dobowaWhZOdbiornikow, KLUCZ_DRAFTU_ODBIORNIKOW, type DraftOdbiornikow } from "@/lib/obiekt/zuzycie-z-odbiornikow"

const liczba = (s: string | undefined) => (s === undefined || s === "" ? 0 : Number(s))
const GODZIN_NA_DOBE = 24

/** Draft keys of the source screens (`app/kalkulatory/<key>`). */
export const KLUCZE_ZRODEL = {
  odbiorniki: KLUCZ_DRAFTU_ODBIORNIKOW,
  bojler: "bojler-cwu",
  wampiry: "wampiry-energetyczne",
  falownik: "pobor-wlasny-falownika",
  zmienne: "urzadzenia-zmienne",
  specjalne: "kategorie-specjalne",
  sezonowe: "sezonowosc",
  bufor: "bufor-rozbudowe",
} as const

export type DraftBojlera = { wolumenCwuLDoba: string; deltaTK: string; mocGrzalkiKw: string; pojemnoscBojleraL: string }
export type DraftFalownika = { poborJalowyW: string }
export type DraftZmiennych = { urzadzenia: PozycjaUrzadzenia[]; plytaIndukcyjnaWybrana: boolean; plytaIndukcyjnaMocW: string; plytaIndukcyjnaCzasMin: string }
export type DraftSezonowosci = {
  zapotrzebowanieKwhDoba: string
  typ: TypSezonowosci
  miesiacOd: string
  miesiacDo: string
  aktualnyMiesiac: string
  czyWeekend: boolean
}
export type DraftWampirow = { katalog: KatalogUrzadzenInput; pomiar: PomiarMocyJalowejInput }
export type DraftBufora = { buforPct: BuforRozbudowyInput["buforPct"] }

export const wejscieBojlera = (d: DraftBojlera): BojlerCwuInput => ({
  wolumenCwuLDoba: liczba(d.wolumenCwuLDoba),
  deltaTK: liczba(d.deltaTK),
  mocGrzalkiKw: liczba(d.mocGrzalkiKw),
  pojemnoscBojleraL: liczba(d.pojemnoscBojleraL),
})
export const wejscieFalownika = (d: DraftFalownika): PoborWlasnyFalownikaInput => ({ poborJalowyW: liczba(d.poborJalowyW) })
export const wejscieZmiennych = (d: DraftZmiennych): UrzadzeniaZmienneInput => ({
  urzadzenia: d.urzadzenia,
  plytaIndukcyjnaWybrana: d.plytaIndukcyjnaWybrana,
  plytaIndukcyjnaMocW: liczba(d.plytaIndukcyjnaMocW),
  plytaIndukcyjnaCzasMin: liczba(d.plytaIndukcyjnaCzasMin),
})
/** `miesiac` (1–12) and `weekend` override the screen's own „which month is it now” choice — the balance asks every month. */
export const wejscieSezonowosci = (d: DraftSezonowosci, miesiac?: number, weekend?: boolean): SezonowoscInput => ({
  zapotrzebowanieKwhDoba: liczba(d.zapotrzebowanieKwhDoba),
  typ: d.typ,
  miesiacOd: liczba(d.miesiacOd),
  miesiacDo: liczba(d.miesiacDo),
  aktualnyMiesiac: miesiac ?? liczba(d.aktualnyMiesiac),
  czyWeekend: weekend ?? d.czyWeekend,
})

/** One source of the balance: typical day and each month [kWh/day]; `null` = the source screen is not filled in (or invalid). */
export type WkladZrodla = { kwhDobaTypowa: number; kwhDobaMiesiace: number[] } | null

const staly = (kwh: number): WkladZrodla => ({ kwhDobaTypowa: kwh, kwhDobaMiesiace: Array(12).fill(kwh) })

export function wkladOdbiornikow(d: DraftOdbiornikow | null): WkladZrodla {
  const typowa = dobowaWhZOdbiornikow(d)
  const miesiace = dobowaWhNaMiesiac(d)
  return typowa === null || miesiace === null ? null : { kwhDobaTypowa: typowa / 1000, kwhDobaMiesiace: miesiace.map((wh) => wh / 1000) }
}

export function wkladBojlera(d: DraftBojlera | null): WkladZrodla {
  if (!d) return null
  const r = calculateBojlerCwu(wejscieBojlera(d))
  return isComputed(r.status) ? staly(r.value.energiaDobowaKwh) : null
}

/** Standby of the catalogue and the measurement tabs together, all day long (P · 24 h). */
export function wkladWampirow(d: DraftWampirow | null): WkladZrodla {
  if (!d) return null
  const k = calculateKatalogUrzadzen(d.katalog)
  const p = calculatePomiarMocyJalowej(d.pomiar)
  const sumaW = (isComputed(k.status) ? k.value.sumaW : 0) + (isComputed(p.status) ? p.value.sumaW : 0)
  return sumaW > 0 ? staly((sumaW * GODZIN_NA_DOBE) / 1000) : null
}

export function wkladFalownika(d: DraftFalownika | null): WkladZrodla {
  if (!d) return null
  const r = calculatePoborWlasnyFalownika(wejscieFalownika(d))
  return isComputed(r.status) ? staly(r.value.strataDobowaKwh) : null
}

/** Selected appliances (with the energy-class factor of their screen) and the induction hob: minutes per day → Wh per day. */
export function wkladZmiennych(d: DraftZmiennych | null): WkladZrodla {
  if (!d) return null
  const r = calculateUrzadzeniaZmienne(wejscieZmiennych(d))
  if (!isComputed(r.status)) return null
  const kwh = (r.value.energiaWh + r.value.plytaIndukcyjnaEnergiaWh) / 1000
  return kwh > 0 ? staly(kwh) : null
}

export function wkladSpecjalnych(d: KategorieSpecjalneInput | null): WkladZrodla {
  if (!d) return null
  const r = calculateKategorieSpecjalne(d)
  return isComputed(r.status) && r.value.energiaWh > 0 ? staly(r.value.energiaWh / 1000) : null
}

/**
 * The device of the „Sezonowość” screen. Year-round: every day. Seasonal: only in its months, never in the typical day. Weekend:
 * not in the typical (working) day; in every month as the worst day — a weekend day (stated as an assumption on the screen).
 */
export function wkladSezonowy(d: DraftSezonowosci | null): WkladZrodla {
  if (!d || liczba(d.zapotrzebowanieKwhDoba) <= 0) return null
  const miesiace: number[] = []
  for (let m = 1; m <= 12; m++) {
    const r = calculateSezonowosc(wejscieSezonowosci(d, m, true))
    if (!isComputed(r.status)) return null
    miesiace.push(r.value.zapotrzebowanieWliczoneKwhDoba)
  }
  return { kwhDobaTypowa: d.typ === "caloroczny" ? liczba(d.zapotrzebowanieKwhDoba) : 0, kwhDobaMiesiace: miesiace }
}

export const buforZDraftu = (d: DraftBufora | null): number | null => (d ? d.buforPct : null)
