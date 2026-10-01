import type { Warning } from "@/lib/core/calc-result"
import { ujemneWartosci } from "../wspolne/walidacja"
import type { TestAkumulatoraInput } from "./input"

export function validateInput(input: TestAkumulatoraInput): { errors: Warning[] } {
  const errors = ujemneWartosci({
    napiecieZnamionoweV: input.napiecieZnamionoweV,
    napiecieSpoczynkoweV: input.napiecieSpoczynkoweV,
    mocObciazeniaW: input.mocObciazeniaW,
    napiecieObciazenieV: input.napiecieObciazenieV,
    rezystancjaKartaMOhm: input.rezystancjaKartaMOhm,
  })
  if (
    errors.length === 0 &&
    input.napiecieObciazenieV > 0 &&
    input.napiecieSpoczynkoweV > 0 &&
    input.napiecieObciazenieV >= input.napiecieSpoczynkoweV
  ) {
    errors.push({
      code: "TA-OBCIAZENIE-NIE-NIZSZE",
      level: "critical",
      i18nKey: "TA-OBCIAZENIE-NIE-NIZSZE",
      technicalMessage: `napiecieObciazenieV = ${input.napiecieObciazenieV} >= napiecieSpoczynkoweV = ${input.napiecieSpoczynkoweV} — pod obciążeniem napięcie musi spaść`,
      field: "napiecieObciazenieV",
    })
  }
  return { errors }
}
