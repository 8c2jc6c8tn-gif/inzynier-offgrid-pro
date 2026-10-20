import type { Warning } from "@/lib/core/calc-result"
import { ZESTAWY, type ZestawUstawien } from "./constants"
import type { ZestawyUstawienJkBmsInput } from "./input"

export function znajdzZestaw(id: string): ZestawUstawien | undefined {
  return ZESTAWY.find((z) => z.id === id)
}

/** A non-empty id that is not in the catalogue (stale draft, edited storage) is an input error. */
export function walidujWejscie(input: ZestawyUstawienJkBmsInput): Warning[] {
  if (input.zestawId === "" || znajdzZestaw(input.zestawId)) return []
  return [
    {
      code: "ZJK-NIEZNANY-ZESTAW",
      level: "critical",
      i18nKey: "ZJK-NIEZNANY-ZESTAW",
      technicalMessage: `zestawId = "${input.zestawId}" is not in ZESTAWY`,
      field: "zestawId",
    },
  ]
}
