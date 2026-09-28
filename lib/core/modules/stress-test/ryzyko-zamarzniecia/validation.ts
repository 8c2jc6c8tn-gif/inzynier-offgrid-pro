import type { Warning } from "@/lib/core/calc-result"
import type { RyzykoZamarznieciaInput } from "./input"
import { wartoscUjemna } from "./warnings"

export function validateInput(input: RyzykoZamarznieciaInput): { errors: Warning[] } {
  const errors: Warning[] = []
  if (input.glebokoscPrzemarzaniaCm !== null && input.glebokoscPrzemarzaniaCm < 0) {
    errors.push(wartoscUjemna("glebokoscPrzemarzaniaCm", "Głębokość przemarzania", input.glebokoscPrzemarzaniaCm))
  }
  input.instalacje.forEach((e, i) => {
    if (e.glebokoscCm !== null && e.glebokoscCm < 0) {
      errors.push(wartoscUjemna(`instalacje.${i}.glebokoscCm`, "Głębokość ułożenia", e.glebokoscCm))
    }
  })
  return { errors }
}
