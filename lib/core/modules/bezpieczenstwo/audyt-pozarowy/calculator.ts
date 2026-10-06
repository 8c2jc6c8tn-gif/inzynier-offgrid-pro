import type { CalcResult } from "@/lib/core/calc-result"
import { nazwaElementu } from "@/lib/core/nazwa-elementu"
import { kategoriaKey } from "./constants"
import type { AuditCheckItem } from "./input"

// 2.0.0: category is an id (label as a key), list entered by the user — demo data removed.
export const CALCULATOR_VERSION = "2.0.0"

export type AuditPozarowyResult = {
  procentGotowosci: number
  liczbaOk: number
  liczbaOstrzezen: number
  liczbaKrytycznych: number
  razem: number
}

/**
 * Ekran 11, Moduł 8 — "Autonomiczny audyt bezpieczeństwa pożarowego" (dawne 12.57,
 * docs/zrodla/Tresc_Modul_8_Bezpieczenstwo_Ekrany.md). AI regularnie sprawdza, czy
 * w razie pożaru wszystko zadziała tak, jak powinno — żeby nie odkryć zepsutego
 * czujnika dopiero w trakcie prawdziwego pożaru.
 */
export function calculateAuditPozarowy(items: AuditCheckItem[]): CalcResult<AuditPozarowyResult> {
  const razem = items.length

  if (razem === 0) {
    return {
      value: { procentGotowosci: 0, liczbaOk: 0, liczbaOstrzezen: 0, liczbaKrytycznych: 0, razem: 0 },
      unit: "%",
      status: "INCOMPLETE",
      formula: "gotowość = OK / razem", formulaKey: "UI-FORMULA-BEZPIECZENSTWO-AUDYT-POZAROWY",
      inputs: { razem: 0 },
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const liczbaOk = items.filter((i) => i.status === "ok").length
  const liczbaOstrzezen = items.filter((i) => i.status === "warning").length
  const liczbaKrytycznych = items.filter((i) => i.status === "critical").length
  const procentGotowosci = Math.round((liczbaOk / razem) * 1000) / 10

  return {
    value: { procentGotowosci, liczbaOk, liczbaOstrzezen, liczbaKrytycznych, razem },
    unit: "%",
    status: liczbaOstrzezen + liczbaKrytycznych > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: "gotowość = OK / razem", formulaKey: "UI-FORMULA-BEZPIECZENSTWO-AUDYT-POZAROWY",
    inputs: { razem, liczbaOk, liczbaOstrzezen, liczbaKrytycznych },
    assumptions: [
      { kod: "AUDYT-ZALOZENIE-WPIS-RECZNY" },
    ],
    warnings: items
      .map((i, idx) => ({ i, nr: idx + 1 }))
      .filter(({ i }) => i.status !== "ok")
      .map(({ i, nr }) => ({
        code: `AUDYT-${i.id.toUpperCase()}`,
        level: i.status === "critical" ? ("critical" as const) : ("warning" as const),
        i18nKey: i.opis.trim() === "" ? "AUDYT-POZYCJA-BEZ-OPISU" : "AUDYT-POZYCJA",
        // Element name and description are installation data (user or live feed), not engine text.
        params: {
          kategoriaKey: kategoriaKey(i.kategoria),
          ...nazwaElementu("element", i.element, "NAZWA-ELEMENT-NR", nr),
          opis: i.opis.trim(),
        },
        technicalMessage: `id=${i.id}, status=${i.status}`,
        field: i.id,
      })),
    calculatorVersion: CALCULATOR_VERSION,
  }
}
