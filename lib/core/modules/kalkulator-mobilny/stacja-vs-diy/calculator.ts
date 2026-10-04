import type { CalcResult } from "@/lib/core/calc-result"
import type { StacjaVsDiyInput } from "./input"
import { validateInput } from "./validation"
import { diyWymagaWiedzy } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "E_{st} = E_{nom} \\times u, \\quad E_{diy} = C_{Ah} \\times U \\times DoD, \\quad k = \\dfrac{cena}{E}, \\quad krotność = \\dfrac{k_{st}}{k_{diy}}"

export type StacjaVsDiyResult = {
  /** Energia do wykorzystania [Wh]. */
  energiaStacjiWh: number
  energiaDiyWh: number
  /** Cena za 1 Wh użyteczną [zł/Wh]. */
  zlZaWhStacja: number
  zlZaWhDiy: number
  /** Ile razy więcej energii daje DIY za te same pieniądze (< 1 = stacja korzystniejsza). */
  krotnoscDiy: number
  /** Masa na 1 kWh użyteczną [kg/kWh]; 0 = masy nie podano. */
  kgNaKwhStacja: number
  kgNaKwhDiy: number
}

const PUSTY_WYNIK: StacjaVsDiyResult = {
  energiaStacjiWh: 0,
  energiaDiyWh: 0,
  zlZaWhStacja: 0,
  zlZaWhDiy: 0,
  krotnoscDiy: 0,
  kgNaKwhStacja: 0,
  kgNaKwhDiy: 0,
}

/**
 * Ekran 34, Moduł 12 — "Solarny generator (stacja) vs zestaw DIY" (dawne 8.61, Biblia §12.49).
 * Cena i masa na jednostkę energii użytecznej obu opcji. Przykład Biblii: stacja 500 Wh za 1200 zł,
 * DIY 100 Ah 12 V za 700 zł — przy DoD 50% (ołów) DIY daje ok. 2× więcej energii za te same pieniądze,
 * co zgadza się z komunikatem źródła. Wygoda, gwarancja i rozbudowa — w Migawce, nie w liczbach.
 */
export function calculateStacjaVsDiy(input: StacjaVsDiyInput): CalcResult<StacjaVsDiyResult> {
  const { errors } = validateInput(input)
  const inputs = { ...input }
  const baza = { unit: "zł/Wh", formula: FORMULA, formulaKey: "UI-FORMULA-KALKULATOR-MOBILNY-STACJA-VS-DIY", inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY_WYNIK, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  if (
    input.cenaStacjiZl === 0 ||
    input.pojemnoscStacjiWh === 0 ||
    input.uzytecznaStacjiPct === 0 ||
    input.cenaDiyZl === 0 ||
    input.pojemnoscDiyAh === 0 ||
    input.napiecieDiyV === 0 ||
    input.dodDiyPct === 0
  ) {
    return { ...baza, value: PUSTY_WYNIK, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const energiaStacjiWh = input.pojemnoscStacjiWh * (input.uzytecznaStacjiPct / 100)
  const energiaDiyWh = input.pojemnoscDiyAh * input.napiecieDiyV * (input.dodDiyPct / 100)
  const zlZaWhStacja = input.cenaStacjiZl / energiaStacjiWh
  const zlZaWhDiy = input.cenaDiyZl / energiaDiyWh
  const kgNa = (kg: number, wh: number) => (kg > 0 ? kg / (wh / 1000) : 0)

  return {
    ...baza,
    value: {
      energiaStacjiWh,
      energiaDiyWh,
      zlZaWhStacja,
      zlZaWhDiy,
      krotnoscDiy: zlZaWhStacja / zlZaWhDiy,
      kgNaKwhStacja: kgNa(input.masaStacjiKg, energiaStacjiWh),
      kgNaKwhDiy: kgNa(input.masaDiyKg, energiaDiyWh),
    },
    status: "VALID",
    assumptions: [{ kod: "SD-ZALOZENIE-TYLKO-MAGAZYN" }],
    warnings: [diyWymagaWiedzy()],
  }
}
