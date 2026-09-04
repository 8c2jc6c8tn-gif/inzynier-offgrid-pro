import type { Warning } from "@/lib/core/calc-result"
import type { TopologiaBmsInput } from "./input"
import { notPositive } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: TopologiaBmsInput): ValidationResult {
  const errors: Warning[] = []
  if (input.bmsCommonPortA < 0) {
    errors.push(notPositive("bmsCommonPortA", "prąd znamionowy Common Port", input.bmsCommonPortA))
  }
  if (input.falownikPradRozruchuA < 0) {
    errors.push(notPositive("falownikPradRozruchuA", "szczytowy prąd rozruchu falownika", input.falownikPradRozruchuA))
  }
  return { errors }
}
