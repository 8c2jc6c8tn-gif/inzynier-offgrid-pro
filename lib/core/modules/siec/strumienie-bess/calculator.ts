import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { DANE_ROZLICZEN, type Rozliczenia, wartoscWDniu } from "@/lib/core/dane/rozliczenia-pl-2026"
import { brakDanych } from "../rachunek-za-prad/warnings"
import type { StrumienieBessInput } from "./input"
import { validateInput } from "./validation"
import { mocUmownaC1x, strumienStratny, uslugiSystemowe } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type IdStrumienia = "autokonsumpcja" | "arbitraz" | "mocowa" | "mocUmowna"

export type StrumienWynik = { id: IdStrumienia; korzyscRokZl: number }

export type StrumienieBessResult = {
  strumienie: StrumienWynik[]
  korzyscRokZl: number
  /** Storage wear: (self-consumption + arbitrage kWh) × cost of one cycled kWh [zł/year]. */
  kosztZuzyciaRokZl: number
  bilansRokZl: number
  /** Simple payback = price / annual benefit [years]; null without price or benefit. */
  prostyZwrotLat: number | null
  stawkaMocowaZlKwh: number
}

const FORMULA =
  "K = E_{auto} z_{auto} + E_{arb} z_{arb} + E_{7-22} c_{moc} + K_{moc}; \\ Z = (E_{auto} + E_{arb}) \\cdot k_{cyklu}; \\ B = K - Z"

export function calculateStrumienieBess(
  input: StrumienieBessInput,
  dane: Rozliczenia = DANE_ROZLICZEN,
): CalcResult<StrumienieBessResult | null> {
  const inputs = { autokonsumpcjaKwhRok: input.autokonsumpcjaKwhRok, arbitrazKwhRok: input.arbitrazKwhRok, mocowaKwhRok: input.mocowaKwhRok }
  const base = { unit: "zł/rok", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  const nie = (status: "INVALID_INPUT" | "INCOMPLETE", warnings: Warning[]) =>
    ({ ...base, value: null, status, assumptions: [], warnings }) satisfies CalcResult<null>

  const errors = validateInput(input)
  if (errors.length > 0) return nie("INVALID_INPUT", errors)

  const brak: Warning[] = []
  if (input.kosztCykluZlKwh === null) brak.push(brakDanych("kosztCyklu"))
  if (input.autokonsumpcjaKwhRok > 0 && input.autokonsumpcjaZyskZlKwh === null) brak.push(brakDanych("zyskAutokonsumpcji"))
  if (input.arbitrazKwhRok > 0 && input.arbitrazZyskZlKwh === null) brak.push(brakDanych("zyskArbitrazu"))
  const stawkaMocowa = wartoscWDniu(dane.krajowe.oplataMocowaPozostali.okresy, input.dataRozliczenia)
  if (input.mocowaKwhRok > 0 && stawkaMocowa === null) brak.push(brakDanych("mocowa"))
  if (input.autokonsumpcjaKwhRok + input.arbitrazKwhRok === 0 && !input.mocUmownaZlRok) brak.push(brakDanych("przeplyw"))
  if (brak.length > 0) return nie("INCOMPLETE", brak)

  const k = input.kosztCykluZlKwh as number
  const cMoc = stawkaMocowa ?? 0
  const warnings: Warning[] = []
  const strumienie: StrumienWynik[] = []
  if (input.autokonsumpcjaKwhRok > 0) {
    const z = input.autokonsumpcjaZyskZlKwh as number
    strumienie.push({ id: "autokonsumpcja", korzyscRokZl: input.autokonsumpcjaKwhRok * z })
    if (z < k) warnings.push(strumienStratny("autokonsumpcja", z, k))
  }
  if (input.arbitrazKwhRok > 0) {
    const z = input.arbitrazZyskZlKwh as number
    strumienie.push({ id: "arbitraz", korzyscRokZl: input.arbitrazKwhRok * z })
    if (z < k) warnings.push(strumienStratny("arbitraz", z, k))
  }
  if (input.mocowaKwhRok > 0) strumienie.push({ id: "mocowa", korzyscRokZl: input.mocowaKwhRok * cMoc })
  if (input.mocUmownaZlRok) {
    strumienie.push({ id: "mocUmowna", korzyscRokZl: input.mocUmownaZlRok })
    if (input.grupa === "C1x") warnings.push(mocUmownaC1x())
  }
  warnings.push(uslugiSystemowe())

  const korzyscRokZl = strumienie.reduce((s, x) => s + x.korzyscRokZl, 0)
  const kosztZuzyciaRokZl = (input.autokonsumpcjaKwhRok + input.arbitrazKwhRok) * k
  const assumptions: Assumption[] = [
    { kod: "SIEC-BESS-ZALOZENIE-MOCOWA-OSOBNO", params: { stawka: cMoc } },
    { kod: "SIEC-ZALOZENIE-NETTO" },
  ]
  return {
    ...base,
    value: {
      strumienie,
      korzyscRokZl,
      kosztZuzyciaRokZl,
      bilansRokZl: korzyscRokZl - kosztZuzyciaRokZl,
      prostyZwrotLat: input.cenaMagazynuZl !== null && input.cenaMagazynuZl > 0 && korzyscRokZl > 0 ? input.cenaMagazynuZl / korzyscRokZl : null,
      stawkaMocowaZlKwh: cMoc,
    },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
