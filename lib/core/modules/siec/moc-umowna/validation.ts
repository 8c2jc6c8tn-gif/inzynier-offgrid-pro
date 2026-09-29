import type { Warning } from "@/lib/core/calc-result"
import type { MocUmownaInput } from "./input"
import { wartoscUjemna, grupaNiezgodnaZMoca } from "../rachunek-za-prad/warnings"
import { czyGrupaG, grupaDostepnaDlaMocy } from "../rachunek-za-prad/constants"
import { miesiacyNie12, tylkoGrupaC } from "./warnings"

export function validateInput(input: MocUmownaInput): Warning[] {
  const errors: Warning[] = []
  if (czyGrupaG(input.grupa)) errors.push(tylkoGrupaC(input.grupa))
  if (input.mocUmownaKw < 0) errors.push(wartoscUjemna("mocUmownaKw", input.mocUmownaKw))
  else if (!czyGrupaG(input.grupa) && input.mocUmownaKw > 0 && !grupaDostepnaDlaMocy(input.grupa, input.mocUmownaKw)) {
    errors.push(grupaNiezgodnaZMoca(input.grupa, input.mocUmownaKw))
  }
  if (input.stalaZlKwMiesWlasna !== undefined && input.stalaZlKwMiesWlasna < 0) {
    errors.push(wartoscUjemna("stalaZlKwMiesWlasna", input.stalaZlKwMiesWlasna))
  }
  if (input.miesiace.length !== 12) errors.push(miesiacyNie12(input.miesiace.length))
  input.miesiace.forEach((m, i) => {
    if (m.maksKw !== null && m.maksKw < 0) errors.push(wartoscUjemna(`miesiace[${i}].maksKw`, m.maksKw))
    if (m.dziesiecNajwiekszychKw?.some((v) => v < 0)) errors.push(wartoscUjemna(`miesiace[${i}].dziesiecNajwiekszychKw`, -1))
  })
  return errors
}
