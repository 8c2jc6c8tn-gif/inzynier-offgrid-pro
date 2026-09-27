import type { Warning } from "@/lib/core/calc-result"

export function przekrojPonizejMinimum(przekrojMm2: number, wymaganyMm2: number, bezpiecznikA: number, izA: number): Warning {
  return {
    code: "MK-BEZPIECZNIK-NIE-CHRONI-KABLA",
    level: "critical",
    i18nKey: "MK-BEZPIECZNIK-NIE-CHRONI-KABLA",
    params: { przekroj: przekrojMm2, wymagany: wymaganyMm2, bezpiecznik: bezpiecznikA.toFixed(1), iz: izA.toFixed(1) },
    technicalMessage: `In=${bezpiecznikA} > Iz=${izA} dla ${przekrojMm2} mm² (433.2: IB ≤ In ≤ Iz)`,
  }
}

export function brakPrzekrojuDlaKoordynacji(bezpiecznikA: number): Warning {
  return {
    code: "MK-BRAK-PRZEKROJU-DLA-BEZPIECZNIKA",
    level: "critical",
    i18nKey: "MK-BRAK-PRZEKROJU-DLA-BEZPIECZNIKA",
    params: { bezpiecznik: bezpiecznikA.toFixed(1) },
    technicalMessage: `żaden przekrój z tablicy nie ma Iz ≥ In=${bezpiecznikA}`,
  }
}

export function koordynacjaPodniosla(przekrojSpadekMm2: number, przekrojMm2: number): Warning {
  return {
    code: "MK-KOORDYNACJA-PODNIOSLA-PRZEKROJ",
    level: "info",
    i18nKey: "MK-KOORDYNACJA-PODNIOSLA-PRZEKROJ",
    params: { zSpadku: przekrojSpadekMm2, przekroj: przekrojMm2 },
    technicalMessage: `przekrój z obciążalności/spadku ${przekrojSpadekMm2} mm² podniesiony do ${przekrojMm2} mm² (Iz ≥ In)`,
  }
}

export function pojazdWibracje(): Warning {
  return {
    code: "MK-POJAZD-WIBRACJE",
    level: "info",
    i18nKey: "MK-POJAZD-WIBRACJE",
    technicalMessage: "Tresc E15: bezpiecznik z certyfikatem do zastosowań mobilnych; Biblia §12.13: peszle, izolacja odporna na drgania",
  }
}
