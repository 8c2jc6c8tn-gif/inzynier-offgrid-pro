import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { MIN_IP_KOD_WILGOTNE } from "@/lib/core/modules/baterie/ochrona-wilgoc/constants"
import { ipPonizejWymaganego } from "@/lib/core/modules/baterie/ochrona-wilgoc/warnings"
import {
  IP_ZALECANE_NAMIOT_JACHT,
  IP_ZALECANE_WILGOC,
  MIEJSCA_PODWYZSZONE_RYZYKO,
  MIN_IP_NAMIOT_JACHT,
  ZALECENIA_WILGOC,
  type ZalecenieWilgoc,
} from "./constants"
import type { WilgocMaleInstalacjeInput } from "./input"
import { namiotJachtPonizejIp65, namiotJachtZalecaneIp67, wilgocCichyZabojca, wilgocZalecaneIp65 } from "./warnings"

export const CALCULATOR_VERSION = "1.2.0"

const FORMULA =
  "IP_{obudowy} \\ge IP_{min};\\ IP_{min} = 55 \\ \\text{(M4/E10)},\\ IP_{min} = 65 \\ \\text{(namiot, jacht — D44)};\\ IP_{zal} = 65 \\ \\text{(wilgoć)},\\ 67 \\ \\text{(namiot, jacht)}"

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
 * D44 (decyzja właściciela): miejsce z wilgocią IP55–IP64 → ostrzeżenie (zalecane IP65); namiot/jacht zawsze
 * traktowane jako narażone na wilgoć → twardy stop poniżej IP65, ostrzeżenie poniżej IP67 (zalecane IP67–IP68).
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
    formula: FORMULA, formulaKey: "UI-FORMULA-KALKULATOR-MOBILNY-WILGOC-MALE-INSTALACJE",
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  if (input.miejsce === null || input.ipKod === 0) return wynik("INCOMPLETE", PUSTY_WYNIK)
  const podwyzszoneRyzyko = (MIEJSCA_PODWYZSZONE_RYZYKO as readonly string[]).includes(input.miejsce)
  // Tent/yacht are always treated as exposed to moisture (D44) — the moisture answer is not needed there.
  if (!podwyzszoneRyzyko && input.narazoneNaWilgoc === null) return wynik("INCOMPLETE", PUSTY_WYNIK)

  const minimalneIp = podwyzszoneRyzyko ? MIN_IP_NAMIOT_JACHT : MIN_IP_KOD_WILGOTNE
  const assumptions: Assumption[] = [
    podwyzszoneRyzyko
      ? { kod: "WMI-ZALOZENIE-PROG-NAMIOT-JACHT", params: { min: MIN_IP_NAMIOT_JACHT, zalecane: IP_ZALECANE_NAMIOT_JACHT } }
      : { kod: "WMI-ZALOZENIE-PROG-Z-M4-E10", params: { min: MIN_IP_KOD_WILGOTNE } },
  ]
  if (!podwyzszoneRyzyko && !input.narazoneNaWilgoc) {
    return wynik("VALID", { minimalneIp: null, ipWystarczajace: true, zalecenia: [] }, [], assumptions)
  }

  const ipWystarczajace = input.ipKod >= minimalneIp
  const warnings: Warning[] = []
  // One message per place about the IP rating: the hard stop, or — once the minimum is met — the recommendation.
  if (!ipWystarczajace) {
    warnings.push(podwyzszoneRyzyko ? namiotJachtPonizejIp65(input.miejsce, input.ipKod) : ipPonizejWymaganego(input.ipKod))
  } else if (podwyzszoneRyzyko && input.ipKod < IP_ZALECANE_NAMIOT_JACHT) {
    warnings.push(namiotJachtZalecaneIp67(input.miejsce, input.ipKod))
  } else if (!podwyzszoneRyzyko && input.ipKod < IP_ZALECANE_WILGOC) {
    warnings.push(wilgocZalecaneIp65(input.miejsce, input.ipKod))
  }
  warnings.push(wilgocCichyZabojca())

  return wynik(
    warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    { minimalneIp, ipWystarczajace, zalecenia: [...ZALECENIA_WILGOC] },
    warnings,
    assumptions,
  )
}
