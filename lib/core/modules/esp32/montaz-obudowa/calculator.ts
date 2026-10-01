import type { CalcResult, Warning } from "@/lib/core/calc-result"
import { MIN_IP_KOD_WILGOTNE } from "@/lib/core/modules/baterie/ochrona-wilgoc/constants"
import { ipPonizejWymaganego } from "@/lib/core/modules/baterie/ochrona-wilgoc/warnings"
import { IP_ZALECANE_WILGOC } from "@/lib/core/modules/kalkulator-mobilny/wilgoc-male-instalacje/constants"
import { wilgocZalecaneIp65 } from "@/lib/core/modules/kalkulator-mobilny/wilgoc-male-instalacje/warnings"
import { IP_SUCHA_ROZDZIELNIA, MIN_ODSTEP_OD_SZYN_CM } from "./constants"
import type { MontazObudowaInput } from "./input"
import { brakIzolacji, brakWentylacji, montazZalecanyDin, odstepOdSzynZaMaly } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "IP_{obudowy} \\ge IP_{min};\\quad d_{szyny} \\ge 2\\,\\mathrm{cm}"

export type MontazObudowaResult = {
  /** Stopień IP ze źródła dla miejsca: 20 (sucha rozdzielnia) albo 65 (wilgotne). */
  zalecaneIp: number | null
  /** Próg twardy: 55 w miejscu wilgotnym (M4/E10), 20 w suchym. */
  minimalneIp: number | null
}

/**
 * Ekran 3, Moduł 9. Źródło podaje IP20 w suchej rozdzielni i IP65 w wilgotnym garażu — bez 🔴. Kontrola IP w miejscu
 * wilgotnym to echo istniejących silników (Dyrektywa #8), bez nowych progów: poniżej IP55 — twardy stop M4/E10
 * (`ipPonizejWymaganego`), IP55–IP64 — ostrzeżenie „zalecane IP65” M12/E23 (`wilgocZalecaneIp65`). Odstęp 2 cm, wentylacja
 * i izolacja — 🟡 (źródło ich nie oznacza 🔴; poziom ✅🤖 do potwierdzenia przez właściciela).
 */
export function calculateMontazObudowa(input: MontazObudowaInput): CalcResult<MontazObudowaResult> {
  const { miejsce, ipKod, montaz, odstepOdSzynCm, wentylacja, izolacjaOdCzesciPodNapieciem } = input
  const wilgotne = miejsce === "wilgotne"
  const value: MontazObudowaResult = {
    zalecaneIp: miejsce === null ? null : wilgotne ? IP_ZALECANE_WILGOC : IP_SUCHA_ROZDZIELNIA,
    minimalneIp: miejsce === null ? null : wilgotne ? MIN_IP_KOD_WILGOTNE : IP_SUCHA_ROZDZIELNIA,
  }
  const base = {
    value,
    unit: "",
    formula: FORMULA,
    assumptions: [],
    calculatorVersion: CALCULATOR_VERSION,
  }

  if (odstepOdSzynCm !== null && (!Number.isFinite(odstepOdSzynCm) || odstepOdSzynCm < 0)) {
    return {
      ...base,
      status: "INVALID_INPUT",
      inputs: {},
      warnings: [
        {
          code: "ESP-ODSTEP-UJEMNY",
          level: "critical",
          i18nKey: "ESP-ODSTEP-UJEMNY",
          technicalMessage: `odstepOdSzynCm = ${odstepOdSzynCm} — oczekiwana liczba ≥ 0`,
          field: "odstepOdSzynCm",
        },
      ],
    }
  }

  const warnings: Warning[] = []
  if (wilgotne && ipKod !== null) {
    if (ipKod < MIN_IP_KOD_WILGOTNE) warnings.push(ipPonizejWymaganego(ipKod))
    else if (ipKod < IP_ZALECANE_WILGOC) warnings.push(wilgocZalecaneIp65(miejsce, ipKod))
  }
  if (odstepOdSzynCm !== null && odstepOdSzynCm < MIN_ODSTEP_OD_SZYN_CM) warnings.push(odstepOdSzynZaMaly(odstepOdSzynCm))
  if (wentylacja === false) warnings.push(brakWentylacji())
  if (izolacjaOdCzesciPodNapieciem === false) warnings.push(brakIzolacji())
  if (montaz === "inny") warnings.push(montazZalecanyDin())

  const kompletne =
    miejsce !== null &&
    ipKod !== null &&
    montaz !== null &&
    odstepOdSzynCm !== null &&
    wentylacja !== null &&
    izolacjaOdCzesciPodNapieciem !== null
  // Info never raises the status (Directive #6).
  const istotne = warnings.some((w) => w.level !== "info")
  return {
    ...base,
    status: !kompletne ? "INCOMPLETE" : istotne ? "VALID_WITH_WARNINGS" : "VALID",
    inputs: {
      ...(ipKod !== null && { ipKod }),
      ...(odstepOdSzynCm !== null && { odstepOdSzynCm }),
    },
    warnings,
  }
}
