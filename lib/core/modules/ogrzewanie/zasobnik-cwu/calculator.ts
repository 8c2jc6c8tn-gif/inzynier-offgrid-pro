import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { bojlerZaMaly } from "@/lib/core/modules/zapotrzebowanie/bojler-cwu/warnings"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "../zapotrzebowanie-co-cwu/constants"
import type { ZasobnikCwuInput } from "./input"
import { validateInput } from "./validation"
import { cyrkulacjaUproszczenie, zasobnikNieogrzewany } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "Q_{woda} = n V \\Delta T c, \\quad Q_{post} = UA (\\theta_{cwu} - \\theta_{ot}) \\cdot 24, \\quad Q_{cyrk} = q L (\\theta_{cwu} - \\theta_{rur}) h, \\quad E_{pompa} = P h"

export type ZasobnikCwuResult = {
  /** Dobowe zużycie C.W.U. [l/doba]. */
  zapotrzebowanieL: number
  /** Ciepło na podgrzanie wody [kWh/doba]. */
  cieploWodyKwh: number
  /** Strata postojowa zasobnika [kWh/doba]. */
  strataPostojowaKwh: number
  /** Strata postojowa zasobnika porównawczego [kWh/doba]; null = bez porównania. */
  strataPorownawczaKwh: number | null
  /** Roczna oszczędność lepszego zasobnika [kWh/rok]; null = bez porównania. */
  oszczednoscRocznaKwh: number | null
  /** Ciepło tracone przez rury cyrkulacji w godzinach pracy [kWh/doba]. */
  cyrkulacjaCieploKwh: number
  /** Prąd pompy cyrkulacyjnej [kWh/doba]. */
  cyrkulacjaPradKwh: number
  /** To samo przy cyrkulacji ciągłej 24 h (ciepło + prąd) [kWh/doba] — odniesienie źródła. */
  cyrkulacjaCiaglaKwh: number
  /** Ciepło razem: woda + strata postojowa + cyrkulacja [kWh/doba]. */
  cieploRazemKwh: number
  /** Udział strat (postój + cyrkulacja) w cieple razem [%]. */
  udzialStratPct: number
}

const PUSTY: ZasobnikCwuResult = {
  zapotrzebowanieL: 0,
  cieploWodyKwh: 0,
  strataPostojowaKwh: 0,
  strataPorownawczaKwh: null,
  oszczednoscRocznaKwh: null,
  cyrkulacjaCieploKwh: 0,
  cyrkulacjaPradKwh: 0,
  cyrkulacjaCiaglaKwh: 0,
  cieploRazemKwh: 0,
  udzialStratPct: 0,
}

const DNI_W_ROKU = 365
const r2 = (x: number) => Math.round(x * 100) / 100

/**
 * Ekran 17, Moduł 6 — "System C.W.U. — zasobnik i cyrkulacja" (dawne 5.19 + 5.20 + 5.21, Biblia §6.19–§6.21).
 * Trzy aspekty jednego systemu, wszystkie z fizyki bez wymyślonych współczynników:
 *  1. zapotrzebowanie — n · V · ΔT · c (echo Ekranu 2, ta sama stała wody); 🟡 zasobnik mniejszy niż dobowe
 *     zużycie — echo M2/E2 (`bojlerZaMaly`), przykład źródła „200 l dla 4 osób” = 4 × 50 l;
 *  2. strata postojowa — UA · (θ_cwu − θ_otoczenia) · 24 h; UA [W/K] z karty zasobnika (tak podaje źródło:
 *     „izolacja 0,8 W/K”). Klasy ErP A/B/C i szczegółowy rozkład EN 12897 (przyłącza, dno, pokrywa) nie są
 *     liczone — progi klas (rozp. UE 812/2013) i norma nie są w repo; UA z karty już je obejmuje;
 *  3. cyrkulacja — ciepło rur q · L · ΔT przez godziny pracy + prąd pompy P · h; odniesienie: to samo przy 24 h.
 *     Wychładzanie rur po wyłączeniu pompy pominięte (ℹ️ ✅🤖).
 * 🟡 źródła „zasobnik w nieogrzewanym garażu” — flaga użytkownika; skutek liczy już niska θ_otoczenia
 * (źródło: „podwaja straty” — to przykład, nie stała).
 *
 * Niespójność przykładu źródła (Dyrektywa #5): „0,8 W/K → 1,2 kWh/dobę” wymaga ΔT = 62,5 K, a „0,5 W/K →
 * 0,7 kWh/dobę” — ΔT ≈ 58 K; przy jednej ΔT = 62,5 K lepszy zasobnik traci 0,75 kWh, a oszczędność to
 * 0,45 × 365 ≈ 164 kWh/rok, nie „180 kWh” (180 wychodzi z zaokrąglonych 1,2 − 0,7 = 0,5). Silnik liczy
 * jedną ΔT dla obu zasobników. Cyrkulacja „1,2 vs 0,3 kWh/dobę” — ilustracja, odtworzona w teście dla
 * dobranych danych (50 W przez 24 h vs 6 h).
 */
export function calculateZasobnikCwu(input: ZasobnikCwuInput): CalcResult<ZasobnikCwuResult> {
  const { errors } = validateInput(input)
  const inputs = {
    osoby: input.osoby,
    litrowNaOsobe: input.litrowNaOsobe,
    pojemnoscL: input.pojemnoscL,
    uaWK: input.uaWK,
    uaPorownawczyWK: input.uaPorownawczyWK,
    dlugoscCyrkulacjiM: input.dlugoscCyrkulacjiM,
    strataRuryWmK: input.strataRuryWmK,
    godzinCyrkulacji: input.godzinCyrkulacji,
    mocPompyW: input.mocPompyW,
  }
  const baza = { unit: "kWh/doba", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const zCyrkulacja = input.dlugoscCyrkulacjiM > 0
  if (
    input.osoby === 0 ||
    input.litrowNaOsobe === 0 ||
    input.tZimnaC === null ||
    input.tCwuC === null ||
    input.pojemnoscL === 0 ||
    input.uaWK === 0 ||
    input.tOtoczeniaC === null ||
    (zCyrkulacja && (input.strataRuryWmK === 0 || input.tOtoczeniaRurC === null))
  ) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const zapotrzebowanieL = input.osoby * input.litrowNaOsobe
  const cieploWodyKwh = zapotrzebowanieL * (input.tCwuC - input.tZimnaC) * WSPOLCZYNNIK_KWH_NA_L_K
  const dtZasobnika = Math.max(0, input.tCwuC - input.tOtoczeniaC)
  const strataPostojowaKwh = (input.uaWK * dtZasobnika * 24) / 1000
  const strataPorownawczaKwh = input.uaPorownawczyWK > 0 ? (input.uaPorownawczyWK * dtZasobnika * 24) / 1000 : null
  const oszczednoscRocznaKwh = strataPorownawczaKwh !== null ? (strataPostojowaKwh - strataPorownawczaKwh) * DNI_W_ROKU : null

  const dtRur = zCyrkulacja ? Math.max(0, input.tCwuC - (input.tOtoczeniaRurC as number)) : 0
  const mocRurW = zCyrkulacja ? input.strataRuryWmK * input.dlugoscCyrkulacjiM * dtRur : 0
  const mocPompyW = zCyrkulacja ? input.mocPompyW : 0
  const cyrkulacjaCieploKwh = (mocRurW * input.godzinCyrkulacji) / 1000
  const cyrkulacjaPradKwh = (mocPompyW * input.godzinCyrkulacji) / 1000
  const cyrkulacjaCiaglaKwh = ((mocRurW + mocPompyW) * 24) / 1000

  const cieploRazemKwh = cieploWodyKwh + strataPostojowaKwh + cyrkulacjaCieploKwh
  const udzialStratPct = ((strataPostojowaKwh + cyrkulacjaCieploKwh) / cieploRazemKwh) * 100

  const warnings: Warning[] = []
  if (input.pojemnoscL < zapotrzebowanieL) warnings.push(bojlerZaMaly(input.pojemnoscL, zapotrzebowanieL))
  if (input.nieogrzewane) warnings.push(zasobnikNieogrzewany(r2(strataPostojowaKwh)))
  if (zCyrkulacja) warnings.push(cyrkulacjaUproszczenie())

  const assumptions: Assumption[] = [{ kod: "ZAS-ZALOZENIE-UA-Z-KARTY" }]
  return {
    ...baza,
    value: {
      zapotrzebowanieL,
      cieploWodyKwh,
      strataPostojowaKwh,
      strataPorownawczaKwh,
      oszczednoscRocznaKwh,
      cyrkulacjaCieploKwh,
      cyrkulacjaPradKwh,
      cyrkulacjaCiaglaKwh,
      cieploRazemKwh,
      udzialStratPct,
    },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
