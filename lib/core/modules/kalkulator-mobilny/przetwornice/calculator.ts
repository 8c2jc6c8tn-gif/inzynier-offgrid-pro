import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { USB_NAPIECIE_V } from "./constants"
import type { PrzetwornicaInput } from "./input"
import { validateInput } from "./validation"
import {
  bezPrzetwornicy,
  falownikZaSlaby,
  przetwornicaZaSlaba,
  rozwazSystemWyzszegoNapiecia,
  sprawdzKable,
  sprawdzSzczyt,
  szczytZaMaly,
} from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA_DC = "I_{wy} = \\dfrac{P}{U_{wy}}, \\quad I_{wej} = \\dfrac{P}{U_{wej} \\times \\eta}"
const FORMULA_FALOWNIK =
  "P_{min} = k_{zapas} \\times \\sum P_i, \\quad P_{szczyt} = \\sum P_i + \\max_i \\big(P_i (k_{r,i} - 1)\\big), \\quad I_{akum} = \\dfrac{P}{U \\times \\eta}"

export type PrzetwornicaResult = {
  /** Napięcie wyjściowe [V] (5 V w trybie USB). */
  napiecieWyjscioweV: number
  /** Prąd po stronie urządzenia [A] — minimalny prąd wyjściowy przetwornicy (tryby DC). */
  pradWyjsciowyA: number
  /** Prąd pobierany z akumulatora przy obciążeniu urządzeniami [A]. */
  pradZAkumulatoraA: number
  /** Tryb "falownik": suma mocy urządzeń pracujących naraz [W]. */
  sumaMocyW: number
  /** Tryb "falownik": minimalna moc ciągła falownika = suma × zapas [W]. */
  minimalnaMocFalownikaW: number
  /** Tryb "falownik": szczyt przy rozruchu najbardziej wymagającego urządzenia [W]. */
  szczytRozruchuW: number
  /** Tryb "falownik": prąd z akumulatora przy pełnej mocy posiadanego falownika [A]; 0 = nie podano. */
  pradPrzyPelnejMocyA: number
}

const PUSTY_WYNIK: PrzetwornicaResult = {
  napiecieWyjscioweV: 0,
  pradWyjsciowyA: 0,
  pradZAkumulatoraA: 0,
  sumaMocyW: 0,
  minimalnaMocFalownikaW: 0,
  szczytRozruchuW: 0,
  pradPrzyPelnejMocyA: 0,
}

/**
 * Ekran 8, Moduł 12 — "Przetwornice" (dawne 8.9 + 8.41 + 8.42, Biblia §12.9, §12.29, §12.30). Trzy tryby,
 * ta sama zasada: moc urządzenia plus zapas na rozruch.
 * - "usb" / "dcdc": I_wy = P / U_wy (minimalny prąd przetwornicy/ładowarki), I_wej = P / (U_wej × η) (§12.9).
 *   Przykład §12.9 "24V→12V przy 10A pobierze z akumulatora 11A" jest niespójny z jego własnym wzorem:
 *   10 A × 12 V = 120 W, z 24 V to ok. 5,6 A przy η 90% — 11 A wyszłoby tylko przy tym samym napięciu.
 * - "falownik": minimalna moc ciągła = suma mocy × zapas (Biblia §12.29 "1,5–2× większej" — zapas wpisuje
 *   user), szczyt = suma + największy dodatkowy pobór przy rozruchu jednego urządzenia (założenie: urządzenia
 *   nie startują jednocześnie). Prąd z akumulatora P / (U × η); przykład §12.29 "2000 W przy 12 V → 166 A"
 *   odtwarza się przy η = 100% (2000 / 12 = 166,7 A).
 */
export function calculatePrzetwornica(input: PrzetwornicaInput): CalcResult<PrzetwornicaResult> {
  const { errors } = validateInput(input)
  const formula = input.tryb === "falownik" ? FORMULA_FALOWNIK : FORMULA_DC
  const inputs = Object.fromEntries(Object.entries(input).filter(([, v]) => typeof v === "number")) as Record<string, number>
  const baza = { unit: input.tryb === "falownik" ? "W" : "A", formula, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY_WYNIK, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const eta = input.sprawnoscPct / 100
  const niepelne = { ...baza, value: PUSTY_WYNIK, status: "INCOMPLETE" as const, assumptions: [], warnings: [] }
  if (input.napiecieAkumulatoraV === 0 || eta === 0) return niepelne

  const warnings: Warning[] = []
  const assumptions: Assumption[] = []

  if (input.tryb !== "falownik") {
    const napiecieWyjscioweV = input.tryb === "usb" ? USB_NAPIECIE_V : input.napiecieUrzadzeniaV
    if (napiecieWyjscioweV === 0 || input.mocUrzadzeniaW === 0) return niepelne
    const pradWyjsciowyA = input.mocUrzadzeniaW / napiecieWyjscioweV
    const bezposrednio = input.tryb === "dcdc" && napiecieWyjscioweV === input.napiecieAkumulatoraV
    const pradZAkumulatoraA = bezposrednio ? pradWyjsciowyA : input.mocUrzadzeniaW / (input.napiecieAkumulatoraV * eta)
    if (bezposrednio) warnings.push(bezPrzetwornicy(napiecieWyjscioweV))
    else if (input.pradPrzetwornicyA > 0 && input.pradPrzetwornicyA < pradWyjsciowyA) {
      warnings.push(przetwornicaZaSlaba(input.pradPrzetwornicyA, pradWyjsciowyA))
    }
    if (input.tryb === "dcdc" && napiecieWyjscioweV > input.napiecieAkumulatoraV) warnings.push(rozwazSystemWyzszegoNapiecia())
    if (input.tryb === "usb") assumptions.push({ kod: "PRZ-ZALOZENIE-USB-5V" })
    return {
      ...baza,
      value: { ...PUSTY_WYNIK, napiecieWyjscioweV, pradWyjsciowyA, pradZAkumulatoraA },
      status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
      assumptions,
      warnings,
    }
  }

  const wpisane = input.urzadzenia.filter((u) => u.mocW > 0)
  if (wpisane.length === 0 || input.zapasMocy === 0) return niepelne
  const sumaMocyW = wpisane.reduce((s, u) => s + u.mocW, 0)
  const minimalnaMocFalownikaW = sumaMocyW * input.zapasMocy
  const dodatekRozruchu = Math.max(...wpisane.map((u) => u.mocW * (Math.max(u.krotnoscRozruchu, 1) - 1)))
  const szczytRozruchuW = sumaMocyW + dodatekRozruchu
  const pradZAkumulatoraA = sumaMocyW / (input.napiecieAkumulatoraV * eta)
  const pradPrzyPelnejMocyA = input.mocFalownikaW > 0 ? input.mocFalownikaW / (input.napiecieAkumulatoraV * eta) : 0

  if (input.mocFalownikaW > 0 && input.mocFalownikaW < minimalnaMocFalownikaW) {
    warnings.push(falownikZaSlaby(input.mocFalownikaW, minimalnaMocFalownikaW))
  }
  if (input.mocSzczytowaFalownikaW > 0) {
    if (input.mocSzczytowaFalownikaW < szczytRozruchuW) warnings.push(szczytZaMaly(input.mocSzczytowaFalownikaW, szczytRozruchuW))
  } else warnings.push(sprawdzSzczyt(szczytRozruchuW))
  warnings.push(sprawdzKable(Math.max(pradZAkumulatoraA, pradPrzyPelnejMocyA)))
  assumptions.push({ kod: "PRZ-ZALOZENIE-ROZRUCH-POJEDYNCZO" })
  if (wpisane.some((u) => u.krotnoscRozruchu === 0)) assumptions.push({ kod: "PRZ-ZALOZENIE-BRAK-KROTNOSCI" })

  return {
    ...baza,
    value: {
      ...PUSTY_WYNIK,
      napiecieWyjscioweV: 0,
      pradZAkumulatoraA,
      sumaMocyW,
      minimalnaMocFalownikaW,
      szczytRozruchuW,
      pradPrzyPelnejMocyA,
    },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
