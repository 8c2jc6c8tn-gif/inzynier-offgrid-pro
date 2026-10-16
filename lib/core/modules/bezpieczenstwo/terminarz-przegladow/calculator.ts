import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { PozycjaPrzegladu, TerminarzPrzegladowInput } from "./input"
import { dataNiepoprawnaTp, interwalNiepoprawnyTp, pozycjaNiekompletnaTp, przegladWPrzyszlosciTp } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type StatusPrzegladu = "po-terminie" | "w-terminie" | "bez-terminu"

export type TerminPrzegladu = {
  id: string
  nazwa: string
  /** Następny termin `RRRR-MM-DD`; `null` przy niekompletnej pozycji. */
  nastepnyTermin: string | null
  /** Dni do terminu: dodatnie = przed terminem, 0 = dziś, ujemne = po terminie; `null` przy niekompletnej pozycji. */
  dniDoTerminu: number | null
  status: StatusPrzegladu
}

export type TerminarzPrzegladowResult = {
  /** Pozycje z terminem, od najpilniejszej (najmniej dni do terminu), potem pozycje bez terminu w kolejności wpisu. */
  terminy: TerminPrzegladu[]
  poTerminie: number
}

const FORMULA = "T_{nast} = T_{ost} + i \\cdot \\text{miesięcy},\\; \\Delta = T_{nast} - T_{dziś}"
const MS_DOBA = 86_400_000

const RRRR_MM_DD = /^(\d{4})-(\d{2})-(\d{2})$/

/** `RRRR-MM-DD` → UTC midnight in ms, or `null` for a malformed or non-existent date (e.g. 2026-02-30). */
export function dataUtc(tekst: string): number | null {
  const m = RRRR_MM_DD.exec(tekst)
  if (!m) return null
  const [r, mies, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const ms = Date.UTC(r, mies - 1, d)
  const sprawdz = new Date(ms)
  return sprawdz.getUTCFullYear() === r && sprawdz.getUTCMonth() === mies - 1 && sprawdz.getUTCDate() === d ? ms : null
}

const dwie = (n: number) => String(n).padStart(2, "0")
const doTekstu = (ms: number) => {
  const d = new Date(ms)
  return `${String(d.getUTCFullYear()).padStart(4, "0")}-${dwie(d.getUTCMonth() + 1)}-${dwie(d.getUTCDate())}`
}

/** Calendar addition of months; the day of month is clamped to the last day of the target month (31 Jan + 1 month = 28/29 Feb). */
export function dodajMiesiace(dataMs: number, miesiace: number): number {
  const d = new Date(dataMs)
  const lacznie = d.getUTCFullYear() * 12 + d.getUTCMonth() + miesiace
  const rok = Math.floor(lacznie / 12)
  const mies = lacznie - rok * 12
  const ostatniDzien = new Date(Date.UTC(rok, mies + 1, 0)).getUTCDate()
  return Date.UTC(rok, mies, Math.min(d.getUTCDate(), ostatniDzien))
}

/**
 * Terminarz przeglądów i serwisu (7.32): z daty ostatniego przeglądu i interwału wpisanych przez użytkownika liczy następny termin
 * i dni do niego. Brak zaleceń producentów w aplikacji — interwały podaje użytkownik z instrukcji swoich urządzeń; nie ma progu „wkrótce".
 */
export function calculateTerminarzPrzegladow(input: TerminarzPrzegladowInput): CalcResult<TerminarzPrzegladowResult | null> {
  const zalozenia: Assumption[] = [{ kod: "TPRZ-ZAL-INTERWALY-UZYTKOWNIKA" }, { kod: "TPRZ-ZAL-MIESIACE-KALENDARZOWE" }]
  const baza = { unit: "dni", formula: FORMULA, formulaKey: "UI-FORMULA-TERMINARZ-PRZEGLADOW", inputs: { liczbaPozycji: input.pozycje.length }, calculatorVersion: CALCULATOR_VERSION }
  const dzis = dataUtc(input.dzisiaj)
  const bledy: Warning[] = []
  if (dzis === null) bledy.push(dataNiepoprawnaTp("—", "dzisiaj"))
  for (const p of input.pozycje) {
    if (p.ostatniPrzegladData !== null && dataUtc(p.ostatniPrzegladData) === null) bledy.push(dataNiepoprawnaTp(p.nazwa, "ostatniPrzegladData"))
    if (p.interwalMiesiecy !== null && !(Number.isInteger(p.interwalMiesiecy) && p.interwalMiesiecy >= 1)) bledy.push(interwalNiepoprawnyTp(p.nazwa, p.interwalMiesiecy))
  }
  if (bledy.length > 0 || dzis === null) return { ...baza, value: null, status: "INVALID_INPUT", assumptions: zalozenia, warnings: bledy }
  if (input.pozycje.length === 0) return { ...baza, value: null, status: "INCOMPLETE", assumptions: zalozenia, warnings: [] }

  const ostrzezenia: Warning[] = []
  const policzone: TerminPrzegladu[] = []
  const bezTerminu: TerminPrzegladu[] = []
  for (const p of input.pozycje as PozycjaPrzegladu[]) {
    if (p.ostatniPrzegladData === null || p.interwalMiesiecy === null) {
      ostrzezenia.push(pozycjaNiekompletnaTp(p.nazwa))
      bezTerminu.push({ id: p.id, nazwa: p.nazwa, nastepnyTermin: null, dniDoTerminu: null, status: "bez-terminu" })
      continue
    }
    const ostatni = dataUtc(p.ostatniPrzegladData)!
    if (ostatni > dzis) ostrzezenia.push(przegladWPrzyszlosciTp(p.nazwa))
    const nastepny = dodajMiesiace(ostatni, p.interwalMiesiecy)
    const dni = Math.round((nastepny - dzis) / MS_DOBA)
    policzone.push({ id: p.id, nazwa: p.nazwa, nastepnyTermin: doTekstu(nastepny), dniDoTerminu: dni, status: dni < 0 ? "po-terminie" : "w-terminie" })
  }
  policzone.sort((a, b) => a.dniDoTerminu! - b.dniDoTerminu!)
  const terminy = [...policzone, ...bezTerminu]
  return {
    ...baza,
    value: { terminy, poTerminie: terminy.filter((t) => t.status === "po-terminie").length },
    status: ostrzezenia.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions: zalozenia,
    warnings: ostrzezenia,
  }
}
