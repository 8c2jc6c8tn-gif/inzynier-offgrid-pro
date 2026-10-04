import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { PROG_KRYTYCZNY_WZROSTU_PCT } from "@/lib/core/modules/baterie/soh-per-ogniwo/constants"
import { CZAS_SPOCZYNKU_H, NAPIECIE_OGNIWA_OLOW_V, PROG_WYRZUCENIA_OLOW_12V } from "./constants"
import type { TestAkumulatoraInput } from "./input"
import { validateInput } from "./validation"
import { brakRezystancjiKarty, lifepo4PlaskaKrzywa, ponizejProguWyrzucenia, rezystancjaWzrosla } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "I = \\dfrac{P}{U_{obc}}, \\quad R_w = \\dfrac{U_{spocz} - U_{obc}}{I}, \\quad wzrost = \\dfrac{R_w - R_{karta}}{R_{karta}} \\times 100\\%"

export type StanAkumulatora = "dobry" | "do-wymiany" | "uszkodzony" | "niejasny"

export type TestAkumulatoraResult = {
  stan: StanAkumulatora
  /** Prąd obciążenia testowego [A]; 0 = bez testu. */
  pradA: number
  /** Spadek napięcia pod obciążeniem [V]; 0 = bez testu. */
  spadekV: number
  /** Zmierzona rezystancja wewnętrzna (z kablami i zaciskami) [mΩ]; 0 = bez testu. */
  rezystancjaMOhm: number
  /** Wzrost rezystancji względem karty [%]; null = brak odniesienia. */
  wzrostPct: number | null
  /** Próg wyrzucenia dla tego napięcia znamionowego [V]; 0 = nie dotyczy (LiFePO4). */
  progWyrzuceniaV: number
}

const PUSTY_WYNIK: TestAkumulatoraResult = {
  stan: "niejasny",
  pradA: 0,
  spadekV: 0,
  rezystancjaMOhm: 0,
  wzrostPct: null,
  progWyrzuceniaV: 0,
}

const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100

/**
 * Ekran 33, Moduł 12 — "Test: czy mój akumulator jest jeszcze dobry?" (dawne 8.60, Biblia §12.48). Uproszczona
 * wersja M4/E14 (SoH): napięcie spoczynkowe + opcjonalny test znanym obciążeniem. Źródło każe „porównać z
 * tabelą dla danego typu”, ale tabeli nie podaje — ekran nie zgaduje progów SoC (Dyrektywa #1). Zamiast tego
 * liczy fizykę: z testu obciążeniowego rezystancję wewnętrzną R = ΔU / I i porównuje ją z kartą katalogową
 * progiem wzrostu 50% z M4 (`soh-per-ogniwo`, ta sama wielkość fizyczna). Jedyny próg napięciowy ze źródła:
 * 10,5 V w spoczynku dla 12 V ołowiowego (przeliczany przez liczbę ogniw 2 V).
 * Niespójność przykładu Biblii: „12,6 V → pod obciążeniem 12,0 V (żarówka 50 W) — lekka utrata pojemności”
 * daje R = 0,6 V / 4,17 A ≈ 144 mΩ, czyli kilkadziesiąt razy więcej niż ma sprawny akumulator 12 V
 * kilkudziesięciu Ah — taki spadek oznacza raczej akumulator do wymiany (albo zły styk), nie „lekką utratę”.
 */
export function calculateTestAkumulatora(input: TestAkumulatoraInput): CalcResult<TestAkumulatoraResult> {
  const { errors } = validateInput(input)
  const inputs = {
    napiecieZnamionoweV: input.napiecieZnamionoweV,
    napiecieSpoczynkoweV: input.napiecieSpoczynkoweV,
    mocObciazeniaW: input.mocObciazeniaW,
    napiecieObciazenieV: input.napiecieObciazenieV,
    rezystancjaKartaMOhm: input.rezystancjaKartaMOhm,
  }
  const baza = { unit: "mΩ", formula: FORMULA, formulaKey: "UI-FORMULA-KALKULATOR-MOBILNY-TEST-AKUMULATORA", inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY_WYNIK, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const zTestem = input.mocObciazeniaW > 0 || input.napiecieObciazenieV > 0
  if (
    input.chemia === null ||
    input.napiecieZnamionoweV === 0 ||
    input.napiecieSpoczynkoweV === 0 ||
    (zTestem && (input.mocObciazeniaW === 0 || input.napiecieObciazenieV === 0))
  ) {
    return { ...baza, value: PUSTY_WYNIK, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const warnings: Warning[] = []
  const olow = input.chemia === "olow"
  const progWyrzuceniaV = olow ? PROG_WYRZUCENIA_OLOW_12V * (input.napiecieZnamionoweV / NAPIECIE_OGNIWA_OLOW_V / 6) : 0
  const uszkodzony = olow && input.napiecieSpoczynkoweV <= progWyrzuceniaV
  if (uszkodzony) warnings.push(ponizejProguWyrzucenia(input.napiecieSpoczynkoweV, r2(progWyrzuceniaV)))
  if (!olow) warnings.push(lifepo4PlaskaKrzywa())

  const pradA = zTestem ? input.mocObciazeniaW / input.napiecieObciazenieV : 0
  const spadekV = zTestem ? input.napiecieSpoczynkoweV - input.napiecieObciazenieV : 0
  const rezystancjaMOhm = zTestem ? (spadekV / pradA) * 1000 : 0
  const wzrostPct =
    zTestem && input.rezystancjaKartaMOhm > 0 ? ((rezystancjaMOhm - input.rezystancjaKartaMOhm) / input.rezystancjaKartaMOhm) * 100 : null
  const doWymiany = wzrostPct !== null && wzrostPct >= PROG_KRYTYCZNY_WZROSTU_PCT
  if (doWymiany) warnings.push(rezystancjaWzrosla(r1(rezystancjaMOhm), input.rezystancjaKartaMOhm, Math.round(wzrostPct), PROG_KRYTYCZNY_WZROSTU_PCT))

  const stan: StanAkumulatora = uszkodzony ? "uszkodzony" : doWymiany ? "do-wymiany" : wzrostPct !== null ? "dobry" : "niejasny"
  if (stan === "niejasny") warnings.push(brakRezystancjiKarty())

  const assumptions: Assumption[] = [{ kod: "TA-ZALOZENIE-SPOCZYNEK", params: { h: CZAS_SPOCZYNKU_H } }]
  if (zTestem) assumptions.push({ kod: "TA-ZALOZENIE-POMIAR-NA-ZACISKACH" })

  return {
    ...baza,
    value: { stan, pradA, spadekV, rezystancjaMOhm, wzrostPct, progWyrzuceniaV },
    status: warnings.some((w) => w.level === "warning") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
