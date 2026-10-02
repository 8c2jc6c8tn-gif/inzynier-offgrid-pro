import type { Assumption, CalcResult, Status, Warning } from "@/lib/core/calc-result"
import type { ZasilanieEsp32Input } from "./input"
import {
  bezpiecznikIFiltr,
  bezposrednioZMagistrali,
  napiecieWejsciaPrzekroczone,
  pradWyjsciowyPrzekroczony,
  sprawnoscPozaZakresem,
  wartoscUjemna,
} from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "I_{wy} = \\frac{P}{U_{wy}},\\quad I_{we} = \\frac{P}{\\eta \\cdot U_{mag}},\\quad U_{mag,max} \\le U_{we,max}"

export type ZasilanieEsp32Result = {
  /** Prąd po stronie ESP32 [A]. */
  pradWyjsciowyA: number | null
  /** Prąd pobierany z magistrali przy napięciu nominalnym [A]. */
  pradWejsciowyA: number | null
}

const PUSTY: ZasilanieEsp32Result = { pradWyjsciowyA: null, pradWejsciowyA: null }

/**
 * Ekran 2, Moduł 9 — "Zasilanie ESP32 z magistrali" (dawne 11.2). 🔴 ESP32 bezpośrednio na magistrali (źródło);
 * 🔴 najwyższe napięcie magistrali ponad maks. napięcie wejściowe przetwornicy z karty (Biblia: „przetwornica z
 * odpowiednim zakresem wejściowym” — przekroczenie niszczy przetwornicę, ✅🤖 poziom); 🟡 prąd ponad możliwości
 * przetwornicy. Prąd wejściowy z bilansu mocy — do doboru bezpiecznika (źródło: „zaleca bezpiecznik”, bez reguły).
 */
export function calculateZasilanieEsp32(input: ZasilanieEsp32Input): CalcResult<ZasilanieEsp32Result> {
  const inputs: Record<string, number> = {
    napiecieMagistraliV: input.napiecieMagistraliV ?? 0,
    napiecieMagistraliMaxV: input.napiecieMagistraliMaxV ?? 0,
    poborMocyW: input.poborMocyW ?? 0,
    napiecieWyjscioweV: input.napiecieWyjscioweV ?? 0,
    napiecieWejscioweMaxV: input.napiecieWejscioweMaxV ?? 0,
    pradWyjsciowyMaxA: input.pradWyjsciowyMaxA ?? 0,
    sprawnoscPct: input.sprawnoscPct ?? 0,
  }
  const wynik = (status: Status, value: ZasilanieEsp32Result, warnings: Warning[], assumptions: Assumption[] = []): CalcResult<ZasilanieEsp32Result> => ({
    value,
    unit: "A",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  const ETYKIETY = {
    napiecieMagistraliV: "POLE-NAPIECIE-MAGISTRALI",
    napiecieMagistraliMaxV: "POLE-MAKS-NAPIECIE-MAGISTRALI",
    poborMocyW: "POLE-POBOR-MOCY",
    napiecieWyjscioweV: "POLE-NAPIECIE-WYJSCIOWE",
    napiecieWejscioweMaxV: "POLE-MAKS-NAPIECIE-WEJSCIOWE-PRZETWORNICY",
    pradWyjsciowyMaxA: "POLE-MAKS-PRAD-PRZETWORNICY",
  } as const
  const errors: Warning[] = []
  for (const [pole, etykieta] of Object.entries(ETYKIETY) as [keyof typeof ETYKIETY, string][]) {
    const v = input[pole]
    if (v !== null && v < 0) errors.push(wartoscUjemna(pole, etykieta, v))
  }
  if (input.sprawnoscPct !== null && (input.sprawnoscPct <= 0 || input.sprawnoscPct > 100)) errors.push(sprawnoscPozaZakresem(input.sprawnoscPct))
  if (errors.length > 0) return wynik("INVALID_INPUT", PUSTY, errors)

  if (input.sposob === "bezposrednio") return wynik("VALID_WITH_WARNINGS", PUSTY, [bezposrednioZMagistrali()])
  const { napiecieMagistraliV: U, poborMocyW: P, napiecieWyjscioweV: Uwy, sprawnoscPct: eta } = input
  if (input.sposob === null || U === null || U <= 0 || P === null || P <= 0 || Uwy === null || Uwy <= 0 || eta === null) {
    return wynik("INCOMPLETE", PUSTY, [])
  }

  const value: ZasilanieEsp32Result = { pradWyjsciowyA: P / Uwy, pradWejsciowyA: P / ((eta / 100) * U) }
  const warnings: Warning[] = []
  const uMax = input.napiecieMagistraliMaxV ?? U
  if (input.napiecieWejscioweMaxV !== null && uMax > input.napiecieWejscioweMaxV) {
    warnings.push(napiecieWejsciaPrzekroczone(uMax, input.napiecieWejscioweMaxV))
  }
  if (input.pradWyjsciowyMaxA !== null && input.pradWyjsciowyMaxA > 0 && value.pradWyjsciowyA! > input.pradWyjsciowyMaxA) {
    warnings.push(pradWyjsciowyPrzekroczony(value.pradWyjsciowyA!, input.pradWyjsciowyMaxA))
  }
  warnings.push(bezpiecznikIFiltr(value.pradWejsciowyA!))

  return wynik(warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID", value, warnings, [
    { kod: "ESP-ZALOZENIE-NAPIECIE-MAX" },
  ])
}
