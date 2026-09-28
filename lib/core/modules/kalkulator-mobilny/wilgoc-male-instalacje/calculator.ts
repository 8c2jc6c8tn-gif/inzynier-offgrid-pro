import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { MIN_IP_KOD_WILGOTNE } from "@/lib/core/modules/baterie/ochrona-wilgoc/constants"
import { ipPonizejWymaganego } from "@/lib/core/modules/baterie/ochrona-wilgoc/warnings"
import { IP_ZALECANE_WILGOTNY_GARAZ, ZALECENIA_WILGOC, type ZalecenieWilgoc } from "./constants"
import type { WilgocMaleInstalacjeInput } from "./input"
import { garazZalecaneIp65, wilgocCichyZabojca } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "IP_{obudowy} \\ge IP_{min} = 55 \\ \\text{(miejsce narażone na wilgoć, M4/E10)}"

export type WilgocMaleInstalacjeResult = {
  /** Minimalny kod IP dla tego miejsca; `null` = miejsce nienarażone na wilgoć (próg nie dotyczy). */
  minimalneIp: number | null
  ipWystarczajace: boolean
  /** Lista zalecanych osłon (źródło); pusta dla miejsca nienarażonego na wilgoć. */
  zalecenia: ZalecenieWilgoc[]
}

const PUSTY_WYNIK: WilgocMaleInstalacjeResult = { minimalneIp: null, ipWystarczajace: false, zalecenia: [] }

/**
 * Ekran 23, Moduł 12 — "Zabezpieczenia przeciwwilgociowe dla małych instalacji" (dawne 8.46). Echo M4/E10
 * (D12): ten sam próg IP55 i ten sam twardy stop `IP-PONIZEJ-WYMAGANEGO` — bez nowych liczb. Lista osłon
 * 1:1 z Biblii §12.34. Punkt rosy (kondensacja) nie jest tu liczony — pełny kalkulator w M4/E10.
 */
export function calculateWilgocMaleInstalacje(input: WilgocMaleInstalacjeInput): CalcResult<WilgocMaleInstalacjeResult> {
  const inputs = {
    narazoneNaWilgoc: input.narazoneNaWilgoc === null ? -1 : input.narazoneNaWilgoc ? 1 : 0,
    ipKod: input.ipKod,
  }
  const wynik = (
    status: CalcResult<WilgocMaleInstalacjeResult>["status"],
    value: WilgocMaleInstalacjeResult,
    warnings: Warning[] = [],
    assumptions: Assumption[] = [],
  ): CalcResult<WilgocMaleInstalacjeResult> => ({
    value,
    unit: "IP",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  if (input.miejsce === null || input.narazoneNaWilgoc === null || input.ipKod === 0) return wynik("INCOMPLETE", PUSTY_WYNIK)

  const assumptions: Assumption[] = [{ kod: "WMI-ZALOZENIE-PROG-Z-M4-E10", params: { min: MIN_IP_KOD_WILGOTNE } }]
  if (!input.narazoneNaWilgoc) {
    return wynik("VALID", { minimalneIp: null, ipWystarczajace: true, zalecenia: [] }, [], assumptions)
  }

  const ipWystarczajace = input.ipKod >= MIN_IP_KOD_WILGOTNE
  const warnings: Warning[] = []
  if (!ipWystarczajace) warnings.push(ipPonizejWymaganego(input.ipKod))
  if (input.miejsce === "garaz" && input.ipKod < IP_ZALECANE_WILGOTNY_GARAZ) warnings.push(garazZalecaneIp65(input.ipKod))
  warnings.push(wilgocCichyZabojca())

  return wynik(
    ipWystarczajace ? "VALID" : "VALID_WITH_WARNINGS",
    { minimalneIp: MIN_IP_KOD_WILGOTNE, ipWystarczajace, zalecenia: [...ZALECENIA_WILGOC] },
    warnings,
    assumptions,
  )
}
