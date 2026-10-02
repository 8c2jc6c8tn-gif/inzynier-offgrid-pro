import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { PRIORYTET_ZRODLA } from "./constants"
import type { PriorytetUps, UpsKrytycznyInput, UrzadzenieKrytyczne } from "./input"
import { validateInput } from "./validation"
import { akumulatorSlaby, brakPriorytetu, czasPodtrzymaniaInfo, progOdRazu } from "./warnings"
import { EFFICIENCY_DEFAULT } from "@/lib/core/modules/zapotrzebowanie/kalkulatory-pomocnicze/constants"

// 1.0.0: hardware sizing only (11.54). 1.1.0 (02.10.2026): + shedding plan by priority (12.54, TD6 closed) and the
// 🔴 „akumulator UPS słaby” of Sekcja C.
export const CALCULATOR_VERSION = "1.1.0"

/** One stage of the shedding plan: the loads still powered after the lower priority levels were cut. */
export type EtapOdciecia = {
  /** 0 = all selected loads; k = after cutting k lowest priority levels. */
  etap: number
  /** Priority level cut at the start of this stage (null for stage 0). */
  odcietyPriorytet: PriorytetUps | null
  /** Ids of the loads still powered. */
  aktywne: string[]
  mocW: number
  /** Run time if this set ran from a full UPS [h] — E / P. */
  czasOdPelnegoH: number
  /** Duration of this stage in the plan with the user's threshold [h]; null = threshold not entered. */
  czasEtapuH: number | null
}

export type UpsKrytycznyResult = {
  laczonyPoborW: number
  czasPodtrzymaniaH: number
  /** null = some selected load has no priority (the plan needs every load ranked). */
  planOdciecia: EtapOdciecia[] | null
  /** Run time of the priority 1 loads with staged shedding [h]; null = no threshold or no plan. */
  czasPriorytetu1H: number | null
}

const FORMULA =
  "P_{bazowe} = \\sum_{i \\in zaznaczone} P_i \\;\\; ; \\;\\; t = (C_{Ah} \\times V \\times \\eta) / P_{bazowe} \\;\\; ; \\;\\; " +
  "t_k = E_k / P_k - t_{prog} \\; (E_{k+1} = t_{prog} \\cdot P_k), \\; t_{ost} = E / P_{ost}"

function priorytetEfektywny(u: UrzadzenieKrytyczne): PriorytetUps | null {
  if (u.priorytet !== undefined) return u.priorytet
  return PRIORYTET_ZRODLA[u.id] ?? null
}

/**
 * Stages from all loads down to priority 1 only. With the threshold X [h]: stage k runs until the energy left equals
 * X × P_k (the „UPS rozładuje się za X minut” moment of the source), then the lowest remaining level is cut; the last
 * stage runs the remaining energy out.
 */
function planOdciecia(zaznaczone: UrzadzenieKrytyczne[], energiaWh: number, progH: number | null): EtapOdciecia[] {
  const poziomy = [...new Set(zaznaczone.map((u) => priorytetEfektywny(u)!))].sort((a, b) => b - a)
  const etapy: EtapOdciecia[] = []
  let pozostaloWh = energiaWh
  for (let k = 0; k < poziomy.length; k++) {
    const odciete = new Set(poziomy.slice(0, k))
    const aktywne = zaznaczone.filter((u) => !odciete.has(priorytetEfektywny(u)!))
    const mocW = aktywne.reduce((s, u) => s + u.powerW, 0)
    const ostatni = k === poziomy.length - 1
    let czasEtapuH: number | null = null
    if (progH !== null && mocW > 0) {
      if (ostatni) czasEtapuH = pozostaloWh / mocW
      else {
        czasEtapuH = Math.max(0, pozostaloWh / mocW - progH)
        pozostaloWh = Math.min(pozostaloWh, progH * mocW)
      }
    }
    etapy.push({
      etap: k,
      odcietyPriorytet: k === 0 ? null : poziomy[k - 1]!,
      aktywne: aktywne.map((u) => u.id),
      mocW,
      czasOdPelnegoH: mocW > 0 ? energiaWh / mocW : 0,
      czasEtapuH,
    })
  }
  return etapy
}

/**
 * Ekran 6, Moduł 8 "Bezpieczeństwo i sytuacje awaryjne" — "UPS krytyczny — sprzęt i zarządzanie
 * AI" (scala dawne 11.54, 12.54, docs/zrodla/Tresc_Modul_8_Bezpieczenstwo_Ekrany.md). Wzorzec
 * echo trybu "runtime" z `kalkulatory-pomocnicze` (M2/E16): `t=(C_Ah×V×η)/P`, tu zastosowany do
 * sumy poboru mocy urządzeń krytycznych zamiast pojedynczego odbiornika. Sprawność domyślna
 * (0,92) importowana z `kalkulatory-pomocnicze/constants.ts`, ta sama założona wartość robocza,
 * nie zduplikowana liczba.
 *
 * 12.54 (Sekcja B punkt 2): the same energy, staged — lower priorities are cut first so the fire panel and the
 * controller run longest. Order 1:1 from the source (`PRIORYTET_ZRODLA`); the trigger („zbliżające się
 * rozładowanie”) has no number in the source, so the threshold is the user's (✅🤖 form of the rule:
 * `docs/lista-do-zrobienia.md` ⚠️ 02.10.2026).
 */
export function calculateUpsKrytyczny(input: UpsKrytycznyInput): CalcResult<UpsKrytycznyResult> {
  const { errors, warnings: walidacyjneOstrzezenia } = validateInput(input)
  const zaznaczone = input.urzadzenia.filter((u) => u.selected)
  const pustyWynik: UpsKrytycznyResult = { laczonyPoborW: 0, czasPodtrzymaniaH: 0, planOdciecia: null, czasPriorytetu1H: null }
  const prog = input.progOdcieciaMin ?? 0
  const inputs = {
    ...Object.fromEntries(zaznaczone.map((u) => [u.id, u.powerW])),
    pojemnoscAh: input.pojemnoscAh,
    napiecieV: input.napiecieV,
    progOdcieciaMin: prog,
  }
  // The weak-battery 🔴 does not depend on the numbers — shown even before the form is complete.
  const stopy: Warning[] = input.akumulatorSlaby ? [akumulatorSlaby()] : []

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "h",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const laczonyPoborW = zaznaczone.reduce((sum, u) => sum + u.powerW, 0)
  const niekompletne =
    zaznaczone.length === 0 || laczonyPoborW === 0 || input.pojemnoscAh === 0 || input.napiecieV === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "h",
      status: stopy.length > 0 ? "VALID_WITH_WARNINGS" : "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [...stopy, ...walidacyjneOstrzezenia],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const efficiency = input.efficiency ?? EFFICIENCY_DEFAULT
  const energiaWh = input.pojemnoscAh * input.napiecieV * efficiency
  const czasPodtrzymaniaH = energiaWh / laczonyPoborW

  const assumptions: Assumption[] =
    input.efficiency === undefined ? [{ kod: "SPRAWNOSC-DOMYSLNA", params: { efficiency } }] : []
  assumptions.push({ kod: "UPS-ZAL-KOLEJNOSC" })

  const warnings: Warning[] = [...stopy, ...walidacyjneOstrzezenia, czasPodtrzymaniaInfo(czasPodtrzymaniaH)]

  const bezPriorytetu = zaznaczone.filter((u) => priorytetEfektywny(u) === null)
  let plan: EtapOdciecia[] | null = null
  let czasPriorytetu1H: number | null = null
  if (bezPriorytetu.length > 0) warnings.push(brakPriorytetu(bezPriorytetu.map((u) => u.label)))
  else {
    const progH = prog > 0 ? prog / 60 : null
    plan = planOdciecia(zaznaczone, energiaWh, progH)
    if (progH !== null) {
      czasPriorytetu1H = plan.reduce((s, e) => s + (e.czasEtapuH ?? 0), 0)
      assumptions.push({ kod: "UPS-ZAL-PROG", params: { prog } })
      if (progH >= czasPodtrzymaniaH && plan.length > 1) warnings.push(progOdRazu(prog))
    }
    if (zaznaczone.some((u) => u.id === "silowniki" && priorytetEfektywny(u) !== 1) && plan.length > 1)
      assumptions.push({ kod: "UPS-ZAL-FAIL-SAFE" })
  }

  return {
    value: { laczonyPoborW, czasPodtrzymaniaH, planOdciecia: plan, czasPriorytetu1H },
    unit: "h",
    status: stopy.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs: { ...inputs, efficiency },
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
