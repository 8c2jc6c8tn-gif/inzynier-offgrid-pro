import type { Warning } from "@/lib/core/calc-result"
import type { TopologiaBmsInput } from "./input"
import { notPositive } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: TopologiaBmsInput): ValidationResult {
  const errors: Warning[] = []
  if (input.bmsCommonPortA < 0) {
    errors.push(notPositive("bmsCommonPortA", "POLE-PRAD-ZNAMIONOWY-COMMON-PORT-L", input.bmsCommonPortA))
  }
  if (input.falownikPradRozruchuA < 0) {
    errors.push(notPositive("falownikPradRozruchuA", "POLE-SZCZYTOWY-PRAD-ROZRUCHU-FALOWNIKA-L", input.falownikPradRozruchuA))
  }
  return { errors }
}
