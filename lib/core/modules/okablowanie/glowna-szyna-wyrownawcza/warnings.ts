import type { Warning } from "@/lib/core/calc-result"

export function gswUzywanaJakoPrzylacze(): Warning {
  return {
    code: "GSW-UZYWANA-JAKO-PRZYLACZE",
    level: "critical",
    i18nKey: "GSW-UZYWANA-JAKO-PRZYLACZE",
    technicalMessage: "uzywanaJakoPrzylaczeOdbiornikow=true",
  }
}
