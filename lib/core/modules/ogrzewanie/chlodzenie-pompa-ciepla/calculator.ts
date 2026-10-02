import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { obliczPunktRosyC } from "../../baterie/ochrona-wilgoc/calculator"
import { copPonizejJednosci, godzinyPozaDoba, procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { ChlodzeniePompaCieplaInput } from "./input"

export const CALCULATOR_VERSION = "1.1.0"

const W_NA_KW = 1000

const FORMULA =
  "E = Q_{chł} / EER,\\quad E_{free} = P_{obieg} t / 1000,\\quad \\theta_{rosy} = \\frac{b\\,\\alpha}{a - \\alpha},\\; \\alpha = \\frac{a\\theta}{b + \\theta} + \\ln(RH),\\quad E_{grz} = Q / COP"

export type ChlodzeniePompaCieplaResult = {
  /** Heat pump electricity for cooling per day [kWh]. */
  pradPompyKwh: number
  /** Air conditioner electricity per day [kWh]; null = no EER. */
  pradKlimatyzatoraKwh: number | null
  /** Free cooling circulation pump electricity per day [kWh]; null = no free cooling. */
  pradFreeCoolingKwh: number | null
  /** Dew point of the room air [°C]; null = room temperature or humidity missing. */
  punktRosyC: number | null
  /** Heating comparison (5.51): heat pump and air conditioner electricity over the season [kWh]. */
  grzaniePompaKwh: number | null
  grzanieKlimatyzatorKwh: number | null
  /** How much less electricity the heat pump uses for heating [%]. */
  grzanieOszczednoscPct: number | null
}

const PUSTY: ChlodzeniePompaCieplaResult = {
  pradPompyKwh: 0,
  pradKlimatyzatoraKwh: null,
  pradFreeCoolingKwh: null,
  punktRosyC: null,
  grzaniePompaKwh: null,
  grzanieKlimatyzatorKwh: null,
  grzanieOszczednoscPct: null,
}

const r1 = (x: number) => Math.round(x * 10) / 10

/** 🔴 (owner decision D71, 02.10.2026; was 🟡) Cooling flow at or below the dew point — condensation on the floor or fan coil, building damage (source: „grozi zawilgoceniem posadzki”). */
function ponizejRosy(tZasilania: number, rosa: number): Warning {
  return {
    code: "CHL-PONIZEJ-ROSY",
    level: "critical",
    params: { zasilanie: r1(tZasilania), rosa: r1(rosa) },
    technicalMessage: `tZasilaniaC ${tZasilania} <= punkt rosy ${rosa}`,
    field: "tZasilaniaC",
  }
}

/**
 * Moduł 6, Część 2C — chłodzenie latem (dawne 5.29 + 5.47 + chłodzenie i grzanie z 5.51 + energia z 5.53). Electricity
 * E = Q/EER for the heat pump and for an air conditioner, the free cooling circulation pump P·t, and the dew point of
 * the room air (Magnus-Tetens, shared with M4 `ochrona-wilgoc`) against the cooling flow temperature.
 *
 * ✅🤖 Free cooling is assumed to remove the whole entered heat — the source gives no ground cooling capacity model;
 * only the electricity of the circulation pump is compared with the compressor.
 *
 * Source examples (Dyrektywa #5): 5.29 „4 kWh/dobę zamiast 8 kWh klimatyzatora” — EER twice the air conditioner's,
 * reproducible with any Q; 5.47 „0,2 kWh/dobę zamiast 2 kWh sprężarki” — e.g. 50 W × 4 h; 5.51 „COP 4,5 jest 40%
 * tańsza niż COP 3,0” — 1 − 3,0/4,5 = 33%, not 40%. 5.53 „temperatura spadnie o 2 °C”, „sypialnie przekroczą 26 °C”
 * need a dynamic thermal model the source does not give — not computed.
 */
export function calculateChlodzeniePompaCiepla(input: ChlodzeniePompaCieplaInput): CalcResult<ChlodzeniePompaCieplaResult> {
  const errors = [
    ...ujemneWartosci({
      chlodDobaKwh: input.chlodDobaKwh,
      eerPompy: input.eerPompy,
      eerKlimatyzatora: input.eerKlimatyzatora,
      mocObiegowejW: input.mocObiegowejW,
      cieploSezonKwh: input.cieploSezonKwh,
    }),
    ...godzinyPozaDoba("godzinyFreeCoolingH", input.godzinyFreeCoolingH),
    ...procentPozaZakresem("wilgotnoscPct", input.wilgotnoscPct),
    ...copPonizejJednosci("copPompy", input.copPompy),
    ...copPonizejJednosci("copKlimatyzatora", input.copKlimatyzatora),
  ]
  const inputs = {
    chlodDobaKwh: input.chlodDobaKwh,
    eerPompy: input.eerPompy,
    eerKlimatyzatora: input.eerKlimatyzatora,
    mocObiegowejW: input.mocObiegowejW,
    godzinyFreeCoolingH: input.godzinyFreeCoolingH,
    tZasilaniaC: input.tZasilaniaC ?? 0,
    tPomieszczeniaC: input.tPomieszczeniaC ?? 0,
    wilgotnoscPct: input.wilgotnoscPct,
    cieploSezonKwh: input.cieploSezonKwh,
    copPompy: input.copPompy,
    copKlimatyzatora: input.copKlimatyzatora,
  }
  const baza = { unit: "kWh/doba", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.chlodDobaKwh === 0 || input.eerPompy === 0) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const q = input.chlodDobaKwh
  const freeCooling = input.mocObiegowejW > 0 && input.godzinyFreeCoolingH > 0
  const punktRosyC =
    input.tPomieszczeniaC !== null && input.wilgotnoscPct > 0 ? obliczPunktRosyC(input.tPomieszczeniaC, input.wilgotnoscPct) : null
  const warnings: Warning[] = []
  if (punktRosyC !== null && input.tZasilaniaC !== null && input.tZasilaniaC <= punktRosyC) {
    warnings.push(ponizejRosy(input.tZasilaniaC, punktRosyC))
  }
  const grzanie = input.cieploSezonKwh > 0
  const grzaniePompaKwh = grzanie && input.copPompy > 0 ? input.cieploSezonKwh / input.copPompy : null
  const grzanieKlimatyzatorKwh = grzanie && input.copKlimatyzatora > 0 ? input.cieploSezonKwh / input.copKlimatyzatora : null
  const assumptions: Assumption[] = []
  if (freeCooling) assumptions.push({ kod: "CHL-ZAL-FREE-COOLING" })

  return {
    ...baza,
    value: {
      pradPompyKwh: q / input.eerPompy,
      pradKlimatyzatoraKwh: input.eerKlimatyzatora > 0 ? q / input.eerKlimatyzatora : null,
      pradFreeCoolingKwh: freeCooling ? (input.mocObiegowejW * input.godzinyFreeCoolingH) / W_NA_KW : null,
      punktRosyC,
      grzaniePompaKwh,
      grzanieKlimatyzatorKwh,
      grzanieOszczednoscPct:
        grzaniePompaKwh !== null && grzanieKlimatyzatorKwh !== null ? (1 - grzaniePompaKwh / grzanieKlimatyzatorKwh) * 100 : null,
    },
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
