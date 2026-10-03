import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { DystrybucjaCieplaInput } from "./input"
import { validateInput } from "./validation"
import { copNieWyzszy, grzejnikiWysokotemperaturoweZPompa, podlogowkaBezwladnosc, porownanieTylkoDlaPompy } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "E = \\dfrac{Q}{COP}, \\quad oszczędność = 1 - \\dfrac{COP_{odn}}{COP_{sys}}, \\quad zwrot = \\dfrac{dopłata}{(E_{odn} - E_{sys}) \\times cena}"

export type DopasowanieDoZrodla = "dobre" | "zle" | "inne-zrodlo"

export type DystrybucjaCieplaResult = {
  dopasowanie: DopasowanieDoZrodla
  /** Oszczędność prądu pompy względem grzejników standardowych [%]; null = brak obu COP. */
  oszczednoscPct: number | null
  /** Prąd pompy w roku przy wybranym systemie [kWh]; 0 = nie liczone. */
  energiaSystemuKwh: number
  /** Prąd pompy w roku przy grzejnikach standardowych [kWh]; 0 = nie liczone. */
  energiaOdniesieniaKwh: number
  /** Oszczędność [kWh/rok]; 0 = nie liczone. */
  oszczednoscKwh: number
  /** Oszczędność [zł/rok]; null = brak ceny. */
  oszczednoscZlRok: number | null
  /** Prosty zwrot dopłaty [lata]; null = brak dopłaty, ceny albo oszczędności. */
  zwrotLat: number | null
}

const PUSTY: DystrybucjaCieplaResult = {
  dopasowanie: "inne-zrodlo",
  oszczednoscPct: null,
  energiaSystemuKwh: 0,
  energiaOdniesieniaKwh: 0,
  oszczednoscKwh: 0,
  oszczednoscZlRok: null,
  zwrotLat: null,
}

/**
 * Ekran 13, Moduł 6 — "Dystrybucja ciepła — wybór systemu" (dawne 5.13 + 5.17 + 5.18). Co liczy: tylko to,
 * co źródło daje jako fizykę — prąd pompy ciepła E = Q / COP dla dwóch temperatur zasilania (COP z karty
 * pompy, wpisuje użytkownik) i wynikającą oszczędność; zwrot dopłaty = dopłata ÷ oszczędność w zł.
 * 🔴 ze źródła: zwykłe (wysokotemperaturowe, 75/65/20) grzejniki przy pompie ciepła.
 *
 * Czego NIE liczy (Dyrektywa #1): wielkości grzejnika przy niższej temperaturze zasilania ani rozstawu/
 * długości pętli podłogówki. Przeliczenie mocy grzejnika z 75/65/20 na 45/35/20 wymaga wykładnika
 * charakterystyki grzejnika i definicji ΔT z PN-EN 442 (brak w repo); projekt pętli wymaga PN-EN 1264
 * (brak w repo). Rozstaw 15/10 cm ze źródła to przykład, nie reguła. 🟡 „podłogówka w domu o niskiej
 * bezwładności przegrzewa” — bez progu liczbowego w źródle, więc nie wyzwalane (to samo co Ekran 8).
 *
 * Przykład źródła: „COP 4,5 przy 35 °C zamiast 3,2 przy 55 °C — oszczędzasz 28%” → 1 − 3,2/4,5 = 28,9%
 * (źródło obcina do 28%). Przykład „grzejnik 2,5 kW przy 75 °C vs 4 kW przy 45 °C, +200 zł, −15%, +12% COP”
 * nie ma danych do odtworzenia (brak COP i zapotrzebowania) — ilustracja.
 */
export function calculateDystrybucjaCiepla(input: DystrybucjaCieplaInput): CalcResult<DystrybucjaCieplaResult> {
  const { errors } = validateInput(input)
  const inputs = {
    cieploRocznieKwh: input.cieploRocznieKwh,
    copSystemu: input.copSystemu,
    copOdniesienia: input.copOdniesienia,
    doplataZl: input.doplataZl,
    cenaPraduZlKwh: input.cenaPraduZlKwh,
  }
  const baza = { unit: "%", formula: FORMULA, formulaKey: "UI-FORMULA-OGRZEWANIE-DYSTRYBUCJA-CIEPLA", inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.zrodloCiepla === null || input.system === null) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const warnings: Warning[] = []
  const pompa = input.zrodloCiepla === "pompa-ciepla"
  const standardowe = input.system === "grzejniki-standardowe"
  if (pompa && standardowe) warnings.push(grzejnikiWysokotemperaturoweZPompa())
  if (input.system === "podlogowe") warnings.push(podlogowkaBezwladnosc())
  if (!pompa) warnings.push(porownanieTylkoDlaPompy())

  const dopasowanie: DopasowanieDoZrodla = !pompa ? "inne-zrodlo" : standardowe ? "zle" : "dobre"
  const value: DystrybucjaCieplaResult = { ...PUSTY, dopasowanie }
  const assumptions: Assumption[] = []

  const sCopy = pompa && !standardowe && input.copSystemu > 0 && input.copOdniesienia > 0
  if (sCopy) {
    if (input.copSystemu <= input.copOdniesienia) warnings.push(copNieWyzszy(input.copSystemu, input.copOdniesienia))
    value.oszczednoscPct = (1 - input.copOdniesienia / input.copSystemu) * 100
    assumptions.push({ kod: "DYS-ZALOZENIE-COP-Z-KARTY" })
    if (input.cieploRocznieKwh > 0) {
      value.energiaSystemuKwh = input.cieploRocznieKwh / input.copSystemu
      value.energiaOdniesieniaKwh = input.cieploRocznieKwh / input.copOdniesienia
      value.oszczednoscKwh = value.energiaOdniesieniaKwh - value.energiaSystemuKwh
      if (input.cenaPraduZlKwh > 0) {
        value.oszczednoscZlRok = value.oszczednoscKwh * input.cenaPraduZlKwh
        if (input.doplataZl > 0 && value.oszczednoscZlRok > 0) value.zwrotLat = input.doplataZl / value.oszczednoscZlRok
      }
    }
  }

  return {
    ...baza,
    value,
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
