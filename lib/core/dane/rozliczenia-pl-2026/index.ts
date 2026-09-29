/**
 * M14 rates file `rozliczenia-pl-2026` (D36) — the only entry point to the JSON. The core reads
 * the data through this module; UI never imports the JSON directly (`kontrakty-rdzenia.md` §9).
 *
 * The JSON is validated with Zod when the module loads, so a malformed edit of the data (or a
 * 🔎 value slipped in with a different `pewnosc`) fails at startup and in tests, not silently in
 * a bill.
 */
import surowe from "./rozliczenia-pl-2026.json"
import {
  RozliczeniaSchema,
  type Grupa,
  type OsdId,
  type ProgMocowej,
  type Rozliczenia,
  type StawkaLiczbowa,
  type StawkiGrupy,
} from "./schema"

export * from "./schema"

export const DANE_ROZLICZEN: Rozliczenia = RozliczeniaSchema.parse(surowe)

type Okres<T> = { odDnia: string; doDnia: string | null; wartosc: T }

const MS_DOBA = 86_400_000

function dzien(iso: string): number {
  return Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)))
}

/** Value valid on the given day, or null when no period covers it. */
export function wartoscWDniu<T>(okresy: Okres<T>[], dataIso: string): T | null {
  const d = dzien(dataIso)
  const okres = okresy.find((o) => dzien(o.odDnia) <= d && (o.doDnia === null || d <= dzien(o.doDnia)))
  return okres ? okres.wartosc : null
}

/** Number of days of [od, do] (inclusive, epoch ms) covered by the period. */
function dniPokrycia<T>(o: Okres<T>, od: number, doD: number): number {
  const start = Math.max(dzien(o.odDnia), od)
  const koniec = Math.min(o.doDnia === null ? doD : dzien(o.doDnia), doD)
  return koniec < start ? 0 : Math.round((koniec - start) / MS_DOBA) + 1
}

/** Value of the period that is valid for the most days of the year (D36 fallback without monthly data). */
export function wartoscNajdluzej<T>(okresy: Okres<T>[], rok: number): T | null {
  const od = Date.UTC(rok, 0, 1)
  const doD = Date.UTC(rok, 11, 31)
  let najlepszy: Okres<T> | null = null
  let najwiecej = 0
  for (const o of okresy) {
    const dni = dniPokrycia(o, od, doD)
    if (dni > najwiecej) {
      najwiecej = dni
      najlepszy = o
    }
  }
  return najlepszy ? najlepszy.wartosc : null
}

/** Day-weighted value within one month; null when any day of the month is not covered. */
function wartoscMiesiaca(okresy: Okres<number>[], rok: number, miesiac: number): number | null {
  const od = Date.UTC(rok, miesiac, 1)
  const doD = Date.UTC(rok, miesiac + 1, 0)
  const dniMiesiaca = Math.round((doD - od) / MS_DOBA) + 1
  let suma = 0
  let dni = 0
  for (const o of okresy) {
    const n = dniPokrycia(o, od, doD)
    suma += n * o.wartosc
    dni += n
  }
  return dni === dniMiesiaca ? suma / dni : null
}

export type StawkaRoczna = {
  wartosc: number
  /** "srednia-wazona" — weighted by monthly consumption; "najdluzej" — longest-valid period. */
  metoda: "srednia-wazona" | "najdluzej"
  /** Whether the rate changes within the year (only then the method matters). */
  zmiennaWRoku: boolean
}

/**
 * Annual rate (`03_M14` „Logika” pkt 1): consumption-weighted average of the months when 12
 * monthly values are given, otherwise the rate valid for the longest part of the year.
 */
export function stawkaRoczna(
  stawka: StawkaLiczbowa,
  rok: number,
  zuzycieMiesieczneKwh: number[] | null,
): StawkaRoczna | null {
  const okresy = stawka.okresy
  const od = Date.UTC(rok, 0, 1)
  const doD = Date.UTC(rok, 11, 31)
  const wRoku = okresy.filter((o) => dniPokrycia(o, od, doD) > 0)
  const zmiennaWRoku = new Set(wRoku.map((o) => o.wartosc)).size > 1

  if (zuzycieMiesieczneKwh !== null && zuzycieMiesieczneKwh.length === 12) {
    let suma = 0
    let energia = 0
    for (let m = 0; m < 12; m++) {
      const e = zuzycieMiesieczneKwh[m]
      if (e <= 0) continue
      const v = wartoscMiesiaca(okresy, rok, m)
      if (v === null) return null
      suma += v * e
      energia += e
    }
    if (energia > 0) return { wartosc: suma / energia, metoda: "srednia-wazona", zmiennaWRoku }
  }
  const v = wartoscNajdluzej(okresy, rok)
  return v === null ? null : { wartosc: v, metoda: "najdluzej", zmiennaWRoku }
}

/** Flat capacity fee for households [zł/month] for the annual consumption (thresholds 1:1 as URE). */
export function oplataMocowaRyczaltZlMies(roczneZuzycieKwh: number, progi: ProgMocowej[]): number | null {
  const prog = progi.find((p) => {
    const powyzej = p.powyzejKwh === null || roczneZuzycieKwh > p.powyzejKwh
    const ponizej =
      p.doKwh === null || (p.doWlacznie ? roczneZuzycieKwh <= p.doKwh : roczneZuzycieKwh < p.doKwh)
    return powyzej && ponizej
  })
  return prog ? prog.zlMies : null
}

/** OSD tariff rates of a group valid on the given day; null = no ✅ data (invoice mode only). */
export function stawkiOsd(osdId: OsdId, grupa: Grupa, dataIso: string, dane: Rozliczenia = DANE_ROZLICZEN): StawkiGrupy | null {
  const osd = dane.osd.find((o) => o.id === osdId)
  if (!osd) return null
  const d = dzien(dataIso)
  const okres = osd.okresy.find((o) => dzien(o.odDnia) <= d && d <= dzien(o.doDnia))
  return okres?.grupy[grupa] ?? null
}

/** OSD tariff rates of a group from the period valid for the longest part of the year. */
export function stawkiOsdWRoku(osdId: OsdId, grupa: Grupa, rok: number, dane: Rozliczenia = DANE_ROZLICZEN): StawkiGrupy | null {
  const osd = dane.osd.find((o) => o.id === osdId)
  if (!osd) return null
  const okresy = osd.okresy.map((o) => ({ odDnia: o.odDnia, doDnia: o.doDnia, wartosc: o.grupy }))
  return wartoscNajdluzej(okresy, rok)?.[grupa] ?? null
}

/** True when the given day is after the file's `waznoscDo` (warning "stawki mogą być nieaktualne"). */
export function czyPoWaznosci(dataIso: string, dane: Rozliczenia = DANE_ROZLICZEN): boolean {
  return dzien(dataIso) > dzien(dane.waznoscDo)
}
