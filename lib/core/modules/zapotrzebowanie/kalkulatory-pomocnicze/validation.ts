import type { Warning } from "@/lib/core/calc-result"
import type { KalkulatoryPomocniczeInput } from "./input"
import { EFFICIENCY_LOW_WARNING_THRESHOLD, EFFICIENCY_MAX, EFFICIENCY_MIN, POWER_W_SANITY_MAX } from "./constants"
import { efficiencyOutOfRange, efficiencyUnusuallyLow, notPositive, powerUnusuallyHigh } from "./warnings"

export type ValidationResult = {
  /** Błędy krytyczne — dane nie nadają się do obliczenia (status INVALID_INPUT). */
  errors: Warning[]
  /** Ostrzeżenia, które nie blokują obliczenia (status VALID_WITH_WARNINGS). */
  warnings: Warning[]
}

export function validateInput(input: KalkulatoryPomocniczeInput): ValidationResult {
  const errors: Warning[] = []
  const warnings: Warning[] = []

  if ("voltageV" in input && input.voltageV <= 0) {
    errors.push(notPositive("voltageV", "napięcie systemu", input.voltageV))
  }

  if ("powerW" in input) {
    if (input.powerW <= 0) {
      errors.push(notPositive("powerW", "moc urządzenia", input.powerW))
    } else if (input.powerW > POWER_W_SANITY_MAX) {
      warnings.push(powerUnusuallyHigh(input.powerW))
    }
  }

  if ("capacityAh" in input && input.capacityAh <= 0) {
    errors.push(notPositive("capacityAh", "pojemność", input.capacityAh))
  }

  if ("energyWh" in input && input.energyWh <= 0) {
    errors.push(notPositive("energyWh", "energia", input.energyWh))
  }

  if ("efficiency" in input && input.efficiency !== undefined) {
    const efficiency = input.efficiency
    if (efficiency <= EFFICIENCY_MIN || efficiency > EFFICIENCY_MAX) {
      errors.push(efficiencyOutOfRange(efficiency))
    } else if (efficiency < EFFICIENCY_LOW_WARNING_THRESHOLD) {
      warnings.push(efficiencyUnusuallyLow(efficiency))
    }
  }

  return { errors, warnings }
}
