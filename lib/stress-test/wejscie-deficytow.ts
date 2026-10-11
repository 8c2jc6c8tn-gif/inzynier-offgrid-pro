/**
 * Form state of M7/E2 "Deficyty miesięczne i agregat" (strings) → calculator input. UI layer, shared by the screen and by the
 * crisis report (M7/E3), so both compute the same numbers from the same saved draft.
 */
import { calculateDeficytyMiesieczne } from "@/lib/core/modules/stress-test/deficyty-miesieczne/calculator"
import { parsujHistorie } from "@/lib/core/modules/stress-test/deficyty-miesieczne/parsuj-historie"
import type { DeficytyMiesieczneInput, RodzajDanychHistorii, RokHistorii, ZrodloHistorii } from "@/lib/core/modules/stress-test/deficyty-miesieczne/input"

export type PolaDeficytow = {
  deficyty: string[]
  moc: string
  zuzycie: string
  cena: string
  serwis: string
  zapas: string
  /** "" = month by month; "3" | "7" | "14" | "miesiac" | "wlasny". */
  horyzont: string
  horyzontDni: string
  histDane: string
  histZrodlo: ZrodloHistorii
  histRodzaj: RodzajDanychHistorii
  histKwp: string
  histPr: string
  histPopyt: string
  histPopytTryb: "jeden" | "miesiace"
  histPopytMiesiace: string[]
  histOkno: string
  histPercentyl: string
  histProg: string
  histNoc: string
  histMagPoj: string
  histMagSpr: string
  histMagStan: string
}

/** Defaults a draft saved before some fields existed is filled from. */
export const PUSTE_POLA_DEFICYTOW: PolaDeficytow = {
  deficyty: Array.from({ length: 12 }, () => ""),
  moc: "",
  zuzycie: "",
  cena: "",
  serwis: "",
  zapas: "",
  horyzont: "",
  horyzontDni: "",
  histDane: "",
  histZrodlo: "wpisane-reczne",
  histRodzaj: "produkcja-pv-kwh",
  histKwp: "",
  histPr: "",
  histPopyt: "",
  histPopytTryb: "jeden",
  histPopytMiesiace: Array.from({ length: 12 }, () => ""),
  histOkno: "",
  histPercentyl: "",
  histProg: "",
  histNoc: "",
  histMagPoj: "",
  histMagSpr: "",
  histMagStan: "",
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))

/** Engine input from the form (0 = not entered, as the engine reads it) and the parsed history years. */
export function wejscieDeficytow(stan: PolaDeficytow, lata: RokHistorii[]): DeficytyMiesieczneInput {
  const wejscie: DeficytyMiesieczneInput = {
    deficytyKwh: stan.deficyty.map(liczba),
    mocAgregatuKw: liczba(stan.moc),
    zuzyciePaliwaLH: liczba(stan.zuzycie),
    cenaPaliwaZlL: liczba(stan.cena),
    kosztSerwisuZlH: liczba(stan.serwis),
    zapasPaliwaL: liczba(stan.zapas),
  }
  if (stan.horyzont === "miesiac") wejscie.horyzont = { rodzaj: "miesiac" }
  else if (stan.horyzont === "wlasny") {
    if (stan.horyzontDni !== "") wejscie.horyzont = { rodzaj: "dni", dni: liczba(stan.horyzontDni) }
  } else if (stan.horyzont !== "") wejscie.horyzont = { rodzaj: "dni", dni: Number(stan.horyzont) }

  if (lata.length > 0) {
    wejscie.historia = {
      zrodlo: stan.histZrodlo,
      rodzaj: stan.histRodzaj,
      lata,
      ...(stan.histRodzaj === "naswietlenie-kwh-m2" ? { przeliczenie: { mocPvKwp: liczba(stan.histKwp), wspolczynnikPr: liczba(stan.histPr) } } : {}),
    }
    if (stan.histPopytTryb === "miesiace") {
      if (stan.histPopytMiesiace.every((x) => x !== "")) wejscie.zapotrzebowanieDobaKwh = stan.histPopytMiesiace.map(liczba)
    } else if (stan.histPopyt !== "") wejscie.zapotrzebowanieDobaKwh = Array.from({ length: 12 }, () => liczba(stan.histPopyt))
    wejscie.analizaHistorii = {
      oknoDni: liczba(stan.histOkno),
      percentylPct: liczba(stan.histPercentyl),
      progSlabegoDniaPct: liczba(stan.histProg),
      ...(stan.histNoc !== "" ? { udzialNocyPct: liczba(stan.histNoc) } : {}),
      ...(liczba(stan.histMagPoj) > 0
        ? { magazyn: { pojemnoscUzytecznaKwh: liczba(stan.histMagPoj), sprawnoscPct: liczba(stan.histMagSpr), stanPoczatkowyPct: liczba(stan.histMagStan) } }
        : {}),
    }
  }
  return wejscie
}

/** Result of Screen 2 recomputed from its saved draft; `null` = Screen 2 was never filled in. */
export function wynikDeficytowZeSzkicu(seed: Partial<PolaDeficytow> | null) {
  if (!seed) return null
  const stan: PolaDeficytow = { ...PUSTE_POLA_DEFICYTOW, ...seed }
  return calculateDeficytyMiesieczne(wejscieDeficytow(stan, parsujHistorie(stan.histDane).lata))
}
