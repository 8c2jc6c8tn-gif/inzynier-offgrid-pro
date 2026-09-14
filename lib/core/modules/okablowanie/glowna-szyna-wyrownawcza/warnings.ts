import type { Warning } from "@/lib/core/calc-result"

export function gswUzywanaJakoPrzylacze(): Warning {
  return {
    code: "GSW-UZYWANA-JAKO-PRZYLACZE",
    level: "critical",
    message: "GSW to tylko wyrównanie potencjałów, nie szyna prądowa — nie podłączaj do niej odbiorników.",
    technicalMessage: "uzywanaJakoPrzylaczeOdbiornikow=true",
  }
}
