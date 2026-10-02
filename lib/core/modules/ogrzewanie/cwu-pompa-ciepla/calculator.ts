import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "../zapotrzebowanie-co-cwu/constants"
import { pvStala } from "../grzalka-cwu/warnings"
import type { CwuPompaCieplaInput } from "./input"
import { validateInput } from "./validation"
import { pompaZBaterii, przegrzewGrzalka } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "Q_{pc} = V c \\,(\\min(T_{doc}, T_{max,pc}) - T_{start}), \\quad Q_{grz} = V c \\,\\max(0, T_{doc} - T_{max,pc}), \\quad " +
  "E = \\dfrac{Q_{pc}}{COP_{CWU}} + Q_{grz}, \\quad t_{pc} = \\dfrac{Q_{pc}}{P_{th}}, \\quad E_{PV} = \\min\\!\\left(\\dfrac{Q_{pc}}{COP_{CWU}}, P_{PV} t_{pc}\\right)"

export type CwuPompaCieplaResult = {
  /** Ciepło od pompy (do jej temperatury maksymalnej) [kWh]. */
  cieploPompaKwh: number
  /** Ciepło od grzałki (ponad temperaturę pompy) [kWh]. */
  cieploGrzalkaKwh: number
  /** Prąd pompy = Q_pc / COP [kWh]. */
  energiaPompaKwh: number
  /** Prąd całego podgrzewu: pompa + grzałka [kWh]. */
  energiaRazemKwh: number
  /** Prąd, gdyby całość grzała grzałka (1 kWh prądu = 1 kWh ciepła) [kWh]. */
  energiaSamaGrzalkaKwh: number
  /** Oszczędność względem samej grzałki [kWh]. */
  oszczednoscKwh: number
  /** Czas grzania pompą [h]. */
  czasPompaH: number
  /** Czas dogrzewu grzałką [h]; null = brak dogrzewu albo mocy grzałki. */
  czasGrzalkaH: number | null
  /** Pobór elektryczny pompy w trybie C.W.U. = P_th / COP [kW]. */
  mocElektrycznaPompyKw: number
  /** Prąd pompy pokryty nadwyżką PV [kWh]; null = PV nie wpisane. */
  energiaZPvKwh: number | null
  /** Prąd pompy z baterii [kWh]; null = PV nie wpisane. */
  energiaZBateriiKwh: number | null
}

const PUSTY: CwuPompaCieplaResult = {
  cieploPompaKwh: 0,
  cieploGrzalkaKwh: 0,
  energiaPompaKwh: 0,
  energiaRazemKwh: 0,
  energiaSamaGrzalkaKwh: 0,
  oszczednoscKwh: 0,
  czasPompaH: 0,
  czasGrzalkaH: null,
  mocElektrycznaPompyKw: 0,
  energiaZPvKwh: null,
  energiaZBateriiKwh: null,
}

const r2 = (x: number) => Math.round(x * 100) / 100

/**
 * Moduł 6, Część 2B — dokładka do Ekranu 18: pompa ciepła w grzaniu C.W.U. (dawne 5.30) i zyski z grzania wody
 * nadwyżką PV — pompa vs grzałka (dawne 5.58). Fizyka ta sama co Ekran 18 (Q = V·ΔT·c, stała wody z
 * `bojler-cwu`): pompa grzeje do swojej temperatury maksymalnej (karta; źródło „55–60 °C”), resztę grzałka
 * (źródło: „wyższa temperatura wymaga grzałki wspomagającej”). Prąd pompy = Q/COP_CWU (COP z karty dla trybu
 * C.W.U. — źródło: „zwykle niższy niż przy ogrzewaniu”, liczby nie podaje), grzałka 1:1 (źródło: „COP 1”).
 * Udział PV — ten sam model co Ekran 18 (nadwyżka stała przez czas grzania, ✅🤖): pompa pobiera P_th/COP;
 * czego nadwyżka nie pokryje, bierze bateria (🟡 źródła 5.58). Priorytet C.W.U./C.O. (źródło: „w zależności
 * od ustawień”) nie jest liczony — źródło nie daje modelu; opisany w założeniu.
 *
 * Przykłady źródła (Dyrektywa #5): 5.30 „200 l do 55 °C w 2 h, 1,8 kWh przy COP 3,2” → Q = 1,8 × 3,2 = 5,76 kWh,
 * czyli ΔT ≈ 24,8 K — start ok. 30 °C (dogrzanie częściowo zużytego zasobnika), nie z zimnej wody (od 10 °C
 * byłoby 10,5 kWh ciepła i 3,3 kWh prądu); 2 h → moc grzewcza ok. 2,9 kW. 5.58 „1,5 h, 1,8 kWh, grzałka
 * 5,5 kWh” → COP 3,06 (w widełkach źródła 3–4), ΔT ≈ 23,6 K, moc grzewcza ok. 3,7 kW. Oba przykłady spójne
 * z fizyką przy tym (niepodanym) starcie; różnią się COP i mocą pompy, nie wzorem.
 */
export function calculateCwuPompaCiepla(input: CwuPompaCieplaInput): CalcResult<CwuPompaCieplaResult> {
  const { errors } = validateInput(input)
  const inputs = {
    pojemnoscL: input.pojemnoscL,
    tMaxPompyC: input.tMaxPompyC ?? 0,
    copCwu: input.copCwu,
    mocCieplnaPompyKw: input.mocCieplnaPompyKw,
    mocGrzalkiKw: input.mocGrzalkiKw,
    mocPvKw: input.mocPvKw,
  }
  const baza = { unit: "kWh", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (
    input.pojemnoscL === 0 ||
    input.tStartC === null ||
    input.tKoniecC === null ||
    input.tMaxPompyC === null ||
    input.copCwu === 0 ||
    input.mocCieplnaPompyKw === 0
  ) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const kwhNaK = input.pojemnoscL * WSPOLCZYNNIK_KWH_NA_L_K
  const tGranica = Math.min(input.tKoniecC, input.tMaxPompyC)
  const cieploPompaKwh = Math.max(0, tGranica - input.tStartC) * kwhNaK
  const cieploGrzalkaKwh = (input.tKoniecC - Math.max(input.tStartC, tGranica)) * kwhNaK
  const energiaPompaKwh = cieploPompaKwh / input.copCwu
  const energiaRazemKwh = energiaPompaKwh + cieploGrzalkaKwh
  const energiaSamaGrzalkaKwh = cieploPompaKwh + cieploGrzalkaKwh
  const czasPompaH = cieploPompaKwh / input.mocCieplnaPompyKw
  const czasGrzalkaH = cieploGrzalkaKwh > 0 && input.mocGrzalkiKw > 0 ? cieploGrzalkaKwh / input.mocGrzalkiKw : null
  const mocElektrycznaPompyKw = input.mocCieplnaPompyKw / input.copCwu

  const warnings: Warning[] = []
  if (cieploGrzalkaKwh > 0) warnings.push(przegrzewGrzalka(input.tMaxPompyC, r2(cieploGrzalkaKwh)))
  let energiaZPvKwh: number | null = null
  let energiaZBateriiKwh: number | null = null
  if (input.mocPvKw > 0) {
    energiaZPvKwh = Math.min(energiaPompaKwh, input.mocPvKw * czasPompaH)
    energiaZBateriiKwh = energiaPompaKwh - energiaZPvKwh
    if (energiaZBateriiKwh > 0) warnings.push(pompaZBaterii(r2(energiaZBateriiKwh)))
    warnings.push(pvStala())
  }

  const assumptions: Assumption[] = [{ kod: "CWP-ZAL-COP-SREDNI" }, { kod: "CWP-ZAL-BEZ-PRIORYTETU" }]
  return {
    ...baza,
    value: {
      cieploPompaKwh,
      cieploGrzalkaKwh,
      energiaPompaKwh,
      energiaRazemKwh,
      energiaSamaGrzalkaKwh,
      oszczednoscKwh: energiaSamaGrzalkaKwh - energiaRazemKwh,
      czasPompaH,
      czasGrzalkaH,
      mocElektrycznaPompyKw,
      energiaZPvKwh,
      energiaZBateriiKwh,
    },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
