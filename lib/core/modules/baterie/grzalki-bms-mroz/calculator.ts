import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { GrzalkiBmsMrozInput } from "./input"
import { validateInput } from "./validation"
import { brakPotrzebyGrzania, grzanieWstrzymane, grzanieZBaterii, grzanieZPv } from "./warnings"
import { PROG_SOC_WSTRZYMANIA_PCT, PROG_TEMPERATURY_GRZANIA_C } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type ZrodloGrzania = "brak-potrzeby" | "pv" | "bateria" | "wstrzymane"

export type GrzalkiBmsMrozResult = {
  temperaturaMinC: number
  socPct: number
  zrodloGrzania: ZrodloGrzania
}

/**
 * Ekran 5, Moduł 4 "Magazyn energii / baterie" — "Grzałki BMS i ochrona przed mrozem" (scala
 * dawne 3.5, 3.14, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B, punkt 2). Drzewo
 * decyzyjne 1:1 ze źródła: poniżej progu temperatury grzanie jest potrzebne; jeśli jest
 * produkcja PV, grzanie idzie z paneli; jeśli nie, zależy od SoC względem progu. Dokładna
 * granica SoC = 30% NIE jest jednoznacznie rozstrzygnięta w źródle (">30%" i "<30%" to dwa
 * osobne warunki, nie pokrywają punktu równego progowi) — zwracany `OUT_OF_SCOPE`, nie
 * zgadywana strona.
 */
export function calculateGrzalkiBmsMroz(input: GrzalkiBmsMrozInput): CalcResult<GrzalkiBmsMrozResult> {
  const { errors } = validateInput(input)
  const pustyWynik: GrzalkiBmsMrozResult = { temperaturaMinC: 0, socPct: 0, zrodloGrzania: "brak-potrzeby" }
  const inputs = {
    temperaturaMinC: input.temperaturaMinC ?? 0,
    socPct: input.socPct,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "°C",
      status: "INVALID_INPUT",
      formula: "",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.temperaturaMinC === null || input.socPct === 0 || input.produkcjaPv === "") {
    return {
      value: pustyWynik,
      unit: "°C",
      status: "INCOMPLETE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const temperaturaMinC = input.temperaturaMinC
  const socPct = input.socPct

  if (temperaturaMinC >= PROG_TEMPERATURY_GRZANIA_C) {
    return {
      value: { temperaturaMinC, socPct, zrodloGrzania: "brak-potrzeby" },
      unit: "°C",
      status: "VALID",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [brakPotrzebyGrzania(temperaturaMinC)],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.produkcjaPv === "tak") {
    return {
      value: { temperaturaMinC, socPct, zrodloGrzania: "pv" },
      unit: "°C",
      status: "VALID",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [grzanieZPv()],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (socPct === PROG_SOC_WSTRZYMANIA_PCT) {
    return {
      value: pustyWynik,
      unit: "°C",
      status: "OUT_OF_SCOPE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const zrodloGrzania: ZrodloGrzania = socPct > PROG_SOC_WSTRZYMANIA_PCT ? "bateria" : "wstrzymane"
  const warnings: Warning[] =
    zrodloGrzania === "bateria" ? [grzanieZBaterii(socPct)] : [grzanieWstrzymane(socPct)]

  return {
    value: { temperaturaMinC, socPct, zrodloGrzania },
    unit: "°C",
    status: "VALID_WITH_WARNINGS",
    formula: "",
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
