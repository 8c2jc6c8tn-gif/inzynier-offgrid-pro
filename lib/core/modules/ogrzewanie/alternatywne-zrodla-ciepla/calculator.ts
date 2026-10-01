import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "../zapotrzebowanie-co-cwu/constants"
import type { AlternatywneZrodlaCieplaInput } from "./input"
import { validateInput } from "./validation"
import { irNieZastapiOgrzewania, kociolOsobnyEkran, kominekPrzegrzanieBezPradu, matyStropNieizolowany, pcmDrozszyOdWody } from "./warnings"

export const CALCULATOR_VERSION = "1.1.0"

const FORMULA =
  "P_{woda} = P \\cdot u, \\quad E_{IR} = P \\cdot t, \\quad P_{maty} = q \\cdot A, \\quad Q_{PCM} = V \\rho L, \\quad V_{wody} = \\dfrac{Q_{PCM}}{c_w \\Delta T}"

const KJ_NA_KWH = 3600

export type AlternatywneZrodlaCieplaResult = {
  /** Kominek: moc oddawana do wody [kW]. */
  kominekDoWodyKw: number | null
  /** Kominek: moc oddawana do pomieszczenia [kW]. */
  kominekDoPowietrzaKw: number | null
  /** Maty: moc grzewcza [kW]. */
  matyMocKw: number | null
  /** Kominek (część wodna) albo maty: pokrycie zapotrzebowania [%]; null = zapotrzebowanie nie wpisane. */
  pokrycieZapotrzebowaniaPct: number | null
  /** Kominek: pokrycie zapotrzebowania całą mocą (woda + pomieszczenie) [%]. */
  kominekPokrycieRazemPct: number | null
  /** IR: energia na dobę [kWh]. */
  irEnergiaKwhDoba: number | null
  /** PCM: ciepło utajone przy pełnym stopieniu [kWh]. */
  pcmEnergiaKwh: number | null
  /** PCM: objętość bufora wodnego o tej samej energii przy wpisanym ΔT [l]. */
  rownowaznikWodyL: number | null
}

const PUSTY: AlternatywneZrodlaCieplaResult = {
  kominekDoWodyKw: null,
  kominekDoPowietrzaKw: null,
  matyMocKw: null,
  pokrycieZapotrzebowaniaPct: null,
  kominekPokrycieRazemPct: null,
  irEnergiaKwhDoba: null,
  pcmEnergiaKwh: null,
  rownowaznikWodyL: null,
}

/**
 * Moduł 6, Część 2A — "Alternatywne i uzupełniające źródła ciepła" (dawne 5.32–5.36, Biblia §6.27.6–10).
 * Wzorzec B: jedna karta na źródło, każda liczy tylko to, co wynika wprost z danych źródła:
 * - kominek z płaszczem: P_woda = P × udział, reszta do pomieszczenia, pokrycie zapotrzebowania (Ekran 2);
 * - kocioł elektryczny: osobny ekran (5.33, `kociol-elektryczny`) — tu odsyłacz;
 * - IR: E = P × h (przykład „600 W → 0,6 kWh na godzinę”);
 * - maty kapilarne: P = q × A, pokrycie zapotrzebowania (COP przy zasilaniu 30 °C — Ekran 5, nie tu);
 * - PCM: Q = V × ρ × L (tylko ciepło utajone) i objętość wody o tej samej energii przy ΔT bufora.
 * Ostrzeżenia czterech kart 1:1 ze źródła; przegrzanie kominka bez prądu ✅🤖 jako 🟡 (źródło: „ostrzeżenie”).
 *
 * Przykłady źródła: „kominek 10 kW, płaszcz 70% → 7 kW do wody” — odtworzony; „pokryje 60% zapotrzebowania”
 * nie podaje zapotrzebowania (7 kW / 60% ≈ 11,7 kW, a z całą mocą 10 kW / 60% ≈ 16,7 kW) — silnik pokazuje oba.
 * „100 l PCM × 200 kJ/kg ≈ 300 l bufora wodnego” zgadza się przy gęstości 1 kg/l i ΔT ≈ 16 K — źródło nie
 * podaje ani gęstości, ani ΔT (Dyrektywa #5). „Stabilizuje temperaturę o 3 °C” i „COP 4,8” nie są liczone
 * (brak modelu w źródle).
 */
export function calculateAlternatywneZrodlaCiepla(input: AlternatywneZrodlaCieplaInput): CalcResult<AlternatywneZrodlaCieplaResult> {
  const { errors } = validateInput(input)
  const inputs = {
    zapotrzebowanieKw: input.zapotrzebowanieKw,
    kominekMocKw: input.kominekMocKw,
    kominekDoWodyPct: input.kominekDoWodyPct,
    irMocW: input.irMocW,
    irGodzinNaDobe: input.irGodzinNaDobe,
    matyMocWm2: input.matyMocWm2,
    matyPowierzchniaM2: input.matyPowierzchniaM2,
    pcmObjetoscL: input.pcmObjetoscL,
    pcmGestoscKgL: input.pcmGestoscKgL,
    pcmCieploTopnieniaKjKg: input.pcmCieploTopnieniaKjKg,
    buforDeltaTK: input.buforDeltaTK,
  }
  const baza = { unit: input.zrodlo === "pcm" || input.zrodlo === "ir" ? "kWh" : "kW", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  const niekompletny: CalcResult<AlternatywneZrodlaCieplaResult> = { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.zrodlo === "kociol-elektryczny") return { ...baza, value: PUSTY, status: "OUT_OF_SCOPE", assumptions: [], warnings: [kociolOsobnyEkran()] }

  const value: AlternatywneZrodlaCieplaResult = { ...PUSTY }
  const warnings: Warning[] = []
  const assumptions: Assumption[] = []
  const Z = input.zapotrzebowanieKw
  const pokrycie = (kw: number) => (Z > 0 ? (kw / Z) * 100 : null)

  switch (input.zrodlo) {
    case "kominek": {
      if (input.kominekMocKw === 0 || input.kominekDoWodyPct === 0) return niekompletny
      value.kominekDoWodyKw = (input.kominekMocKw * input.kominekDoWodyPct) / 100
      value.kominekDoPowietrzaKw = input.kominekMocKw - value.kominekDoWodyKw
      value.pokrycieZapotrzebowaniaPct = pokrycie(value.kominekDoWodyKw)
      value.kominekPokrycieRazemPct = pokrycie(input.kominekMocKw)
      if (!input.kominekZabezpieczenieBezPradu) warnings.push(kominekPrzegrzanieBezPradu())
      assumptions.push({ kod: "ALT-ZALOZENIE-KOMINEK" })
      break
    }
    case "ir": {
      if (input.irMocW === 0 || input.irGodzinNaDobe === 0) return niekompletny
      value.irEnergiaKwhDoba = (input.irMocW * input.irGodzinNaDobe) / 1000
      if (input.irJakoPodstawowe) warnings.push(irNieZastapiOgrzewania())
      break
    }
    case "maty": {
      if (input.matyMocWm2 === 0 || input.matyPowierzchniaM2 === 0) return niekompletny
      value.matyMocKw = (input.matyMocWm2 * input.matyPowierzchniaM2) / 1000
      value.pokrycieZapotrzebowaniaPct = pokrycie(value.matyMocKw)
      if (input.matyStropNieizolowany) warnings.push(matyStropNieizolowany())
      break
    }
    case "pcm": {
      if (input.pcmObjetoscL === 0 || input.pcmGestoscKgL === 0 || input.pcmCieploTopnieniaKjKg === 0) return niekompletny
      value.pcmEnergiaKwh = (input.pcmObjetoscL * input.pcmGestoscKgL * input.pcmCieploTopnieniaKjKg) / KJ_NA_KWH
      if (input.buforDeltaTK > 0) value.rownowaznikWodyL = value.pcmEnergiaKwh / (WSPOLCZYNNIK_KWH_NA_L_K * input.buforDeltaTK)
      warnings.push(pcmDrozszyOdWody())
      assumptions.push({ kod: "ALT-ZALOZENIE-PCM" })
      break
    }
    default:
      return niekompletny
  }

  return {
    ...baza,
    value,
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
