import type { CalcResult, Warning } from "@/lib/core/calc-result"
import { BATTERY_TECHNOLOGIES } from "../../baterie/porownanie-technologii/constants"
import type { AkumulatorKamperaInput } from "./input"
import { validateInput } from "./validation"
import { agmZaGlebokoRozladowany, przekroczonaMasa } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "E = E_{d} \\times d, \\quad n = \\lceil \\dfrac{E}{C \\times U \\times DoD} \\rceil, \\quad k_{kWh} = \\dfrac{cena}{C \\times U \\times DoD \\times cykle / 1000}"

/** M4/E30 reference depth of discharge for AGM [%] — the threshold for the deep-discharge warning. */
export const AGM_DOD_REFERENCYJNY_PCT = BATTERY_TECHNOLOGIES.find((t) => t.id === "agm")!.dod * 100

export type WariantAkumulatora = {
  /** Energia użyteczna jednej sztuki [Wh]. */
  uzytecznaSztukaWh: number
  /** Ile sztuk potrzeba na zapotrzebowanie × dni. */
  sztuk: number
  masaKg: number
  cenaZl: number
  /** Koszt 1 kWh w całym życiu akumulatora [zł/kWh]. */
  kosztKwhZyciaZl: number
}

export type AkumulatorKamperaResult = { agm: WariantAkumulatora; lfp: WariantAkumulatora; potrzebaWh: number }

const PUSTY_WARIANT: WariantAkumulatora = { uzytecznaSztukaWh: 0, sztuk: 0, masaKg: 0, cenaZl: 0, kosztKwhZyciaZl: 0 }
const PUSTY_WYNIK: AkumulatorKamperaResult = { agm: PUSTY_WARIANT, lfp: PUSTY_WARIANT, potrzebaWh: 0 }

function wariant(potrzebaWh: number, napiecieV: number, ah: number, cena: number, masa: number, dodPct: number, cykle: number): WariantAkumulatora {
  const uzytecznaSztukaWh = ah * napiecieV * (dodPct / 100)
  const sztuk = Math.ceil(potrzebaWh / uzytecznaSztukaWh)
  return {
    uzytecznaSztukaWh,
    sztuk,
    masaKg: sztuk * masa,
    cenaZl: sztuk * cena,
    kosztKwhZyciaZl: cena / ((uzytecznaSztukaWh * cykle) / 1000),
  }
}

/**
 * Ekran 17, Moduł 12 — "Dobór akumulatora do kampera (AGM vs LiFePO4)" (dawne 8.37, Biblia §12.25).
 * Dla wpisanych modeli AGM i LiFePO4: ile sztuk pokryje zapotrzebowanie przez zadaną liczbę dób, ile to
 * waży i kosztuje, oraz koszt 1 kWh w całym życiu (cena ÷ energia oddana przez wszystkie cykle).
 * Ostrzeżenie o głębokim rozładowaniu AGM — próg z M4/E30 (AGM przy 50% DoD).
 */
export function calculateAkumulatorKampera(input: AkumulatorKamperaInput): CalcResult<AkumulatorKamperaResult> {
  const { errors } = validateInput(input)
  const inputs = { ...input }
  const baza = { unit: "zł/kWh", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY_WYNIK, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const { zapasMasyKg, ...wymagane } = input
  if (Object.values(wymagane).some((v) => v === 0)) {
    return { ...baza, value: PUSTY_WYNIK, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const potrzebaWh = input.zapotrzebowanieWhDoba * input.dniBezLadowania
  const agm = wariant(potrzebaWh, input.napiecieV, input.agmAh, input.agmCenaZl, input.agmMasaKg, input.agmDodPct, input.agmCykle)
  const lfp = wariant(potrzebaWh, input.napiecieV, input.lfpAh, input.lfpCenaZl, input.lfpMasaKg, input.lfpDodPct, input.lfpCykle)

  const warnings: Warning[] = []
  if (input.agmDodPct > AGM_DOD_REFERENCYJNY_PCT) warnings.push(agmZaGlebokoRozladowany(input.agmDodPct, AGM_DOD_REFERENCYJNY_PCT))
  if (zapasMasyKg > 0 && agm.masaKg > zapasMasyKg) warnings.push(przekroczonaMasa("agm", agm.masaKg, zapasMasyKg))
  if (zapasMasyKg > 0 && lfp.masaKg > zapasMasyKg) warnings.push(przekroczonaMasa("lfp", lfp.masaKg, zapasMasyKg))

  return {
    ...baza,
    value: { agm, lfp, potrzebaWh },
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions: [{ kod: "AKK-ZALOZENIE-PELNE-CYKLE" }],
    warnings,
  }
}
