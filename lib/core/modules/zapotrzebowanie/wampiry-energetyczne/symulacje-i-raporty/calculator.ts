import type { CalcResult } from "@/lib/core/calc-result"
import type { AutonomiaStandbyInput, KosztRocznyStandbyInput, WplywNaDoborInput } from "./input"
import { validateAutonomia, validateKosztRoczny, validateWplywNaDobor } from "./validation"
import { DNI_W_ROKU, GODZIN_W_DOBIE } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/katalog-urzadzen/constants"
import { obliczPojemnoscUzytecznaKwh } from "@/lib/core/modules/baterie/dobor-pojemnosci/calculator"

export const CALCULATOR_VERSION = "1.0.0"

// --- 1.28 + 1.31 + 1.42: autonomia/drenaż baterii przy obciążeniu tylko standby ---

const FORMULA_AUTONOMIA = "t_{h} = \\dfrac{C_{uzyteczna}[kWh] \\times 1000 \\times DoD}{P_{standby}[W]}"

export type AutonomiaStandbyResult = {
  godzinyDoWyczerpania: number
  /** null gdy standbyZredukowanyW nie podano (brak drugiego scenariusza). */
  godzinyDoWyczerpaniaZredukowany: number | null
}

/**
 * Dawne 1.28 ("Symulacja drenażu baterii przez urządzenia standby") + 1.31 ("Analiza autonomii
 * systemu przy obciążeniu tylko standby") + 1.42 ("Scenariusz: ile wytrzyma bateria przy
 * obciążeniu tylko standby") — trzy stare funkcje pytające o to samo, scalone w jedną symulację.
 * Przykład źródła 1.31 ("45 W → 26 h, 15 W → 78 h") jest wewnętrznie zgodny z tym wzorem
 * niezależnie od konkretnej pojemności/DoD (stały pool energii, proporcja 45:15 = 78:26 = 3) —
 * zweryfikowane w testach na energii dostępnej 1170 Wh.
 */
export function calculateAutonomiaStandby(input: AutonomiaStandbyInput): CalcResult<AutonomiaStandbyResult> {
  const { errors } = validateAutonomia(input)
  const inputs = {
    standbyW: input.standbyW,
    standbyZredukowanyW: input.standbyZredukowanyW,
    pojemnoscUzytecznaKwh: input.pojemnoscUzytecznaKwh,
    dodPct: input.dodPct,
  }
  const pustyWynik: AutonomiaStandbyResult = { godzinyDoWyczerpania: 0, godzinyDoWyczerpaniaZredukowany: null }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "h",
      status: "INVALID_INPUT",
      formula: FORMULA_AUTONOMIA, formulaKey: "UI-FORMULA-ZAPOTRZEBOWANIE-WAMPIRY-ENERGETYCZNE-SYMULACJE-I-RAPORTY-AUTONOMIA",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.standbyW === 0 || input.pojemnoscUzytecznaKwh === 0 || input.dodPct === 0) {
    return {
      value: pustyWynik,
      unit: "h",
      status: "INCOMPLETE",
      formula: FORMULA_AUTONOMIA, formulaKey: "UI-FORMULA-ZAPOTRZEBOWANIE-WAMPIRY-ENERGETYCZNE-SYMULACJE-I-RAPORTY-AUTONOMIA",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const energiaDostepnaWh = input.pojemnoscUzytecznaKwh * 1000 * (input.dodPct / 100)
  const godzinyDoWyczerpania = energiaDostepnaWh / input.standbyW
  const godzinyDoWyczerpaniaZredukowany =
    input.standbyZredukowanyW > 0 ? energiaDostepnaWh / input.standbyZredukowanyW : null

  return {
    value: { godzinyDoWyczerpania, godzinyDoWyczerpaniaZredukowany },
    unit: "h",
    status: "VALID",
    formula: FORMULA_AUTONOMIA, formulaKey: "UI-FORMULA-ZAPOTRZEBOWANIE-WAMPIRY-ENERGETYCZNE-SYMULACJE-I-RAPORTY-AUTONOMIA",
    inputs,
    assumptions: [],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}

// --- 1.43: raport roczny koszt wampirów energetycznych ---

const FORMULA_KOSZT = "E_{rok}[kWh] = \\dfrac{P_{standby} \\times 8760}{1000}; \\quad Koszt = E_{rok} \\times cena"

export type KosztRocznyStandbyResult = {
  energiaRocznaKwh: number
  kosztRocznyZl: number
  /** null gdy zapotrzebowanieCalkowiteRocznaKwh nie podano. */
  udzialProcentowy: number | null
}

/**
 * Dawne 1.43 ("Raport »roczny koszt wampirów energetycznych«"). Przykład źródła (438 kWh/rok,
 * koszt 350 zł, 15% całkowitego zużycia) zweryfikowany niezależnie: 438 kWh odpowiada dokładnie
 * 50 W ciągłego poboru (50×8760/1000=438), 15% odpowiada całkowitemu zużyciu 2920 kWh/rok — obie
 * relacje zgodne z tym wzorem. Cena energii NIE ma wartości domyślnej (źródło podaje 350 zł/438 kWh
 * ≈ 0,80 zł/kWh tylko jako ilustrację, nie normę) — pole zawsze ręczne.
 */
export function calculateKosztRocznyStandby(input: KosztRocznyStandbyInput): CalcResult<KosztRocznyStandbyResult> {
  const { errors } = validateKosztRoczny(input)
  const inputs = {
    standbyW: input.standbyW,
    cenaEnergiiZlZaKwh: input.cenaEnergiiZlZaKwh,
    zapotrzebowanieCalkowiteRocznaKwh: input.zapotrzebowanieCalkowiteRocznaKwh,
  }
  const pustyWynik: KosztRocznyStandbyResult = { energiaRocznaKwh: 0, kosztRocznyZl: 0, udzialProcentowy: null }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "zł/rok",
      status: "INVALID_INPUT",
      formula: FORMULA_KOSZT, formulaKey: "UI-FORMULA-ZAPOTRZEBOWANIE-WAMPIRY-ENERGETYCZNE-SYMULACJE-I-RAPORTY-KOSZT",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.standbyW === 0 || input.cenaEnergiiZlZaKwh === 0) {
    return {
      value: pustyWynik,
      unit: "zł/rok",
      status: "INCOMPLETE",
      formula: FORMULA_KOSZT, formulaKey: "UI-FORMULA-ZAPOTRZEBOWANIE-WAMPIRY-ENERGETYCZNE-SYMULACJE-I-RAPORTY-KOSZT",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const energiaRocznaKwh = (input.standbyW * GODZIN_W_DOBIE * DNI_W_ROKU) / 1000
  const kosztRocznyZl = energiaRocznaKwh * input.cenaEnergiiZlZaKwh
  const udzialProcentowy =
    input.zapotrzebowanieCalkowiteRocznaKwh > 0
      ? (energiaRocznaKwh / input.zapotrzebowanieCalkowiteRocznaKwh) * 100
      : null

  return {
    value: { energiaRocznaKwh, kosztRocznyZl, udzialProcentowy },
    unit: "zł/rok",
    status: "VALID",
    formula: FORMULA_KOSZT, formulaKey: "UI-FORMULA-ZAPOTRZEBOWANIE-WAMPIRY-ENERGETYCZNE-SYMULACJE-I-RAPORTY-KOSZT",
    inputs,
    assumptions: [],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}

// --- 1.45: wpływ standby na zapotrzebowanie projektowe (korekta bilansu) ---

const FORMULA_WPLYW =
  "\\Delta C_{uzyteczna} = \\dfrac{(E_{standby} \\times eliminacja\\%) \\times d_{autonomii}}{\\eta_{falownika} \\times DoD}"

export type WplywNaDoborResult = {
  redukcjaDobowaKwh: number
  redukcjaPojemnosciKwh: number
}

/**
 * Dawne 1.45 ("Ocena wpływu standby na zapotrzebowanie projektowe – korekta bilansu"). O ile
 * mniejsza może być bateria po eliminacji części standby — echo wzoru `obliczPojemnoscUzytecznaKwh`
 * z `baterie/dobor-pojemnosci` (ten sam wzór co Ekran 1 Modułu 4), zastosowanego do samej redukcji
 * energii standby (wzór jest liniowy względem energii dobowej, więc różnica = wynik na samej
 * redukcji). Przykładu źródła ("eliminacja 80% → mniej o 30 Ah") NIE odtworzono dosłownie — źródło
 * nie podaje napięcia systemu/dni autonomii/sprawności/DoD potrzebnych do przeliczenia Ah, więc
 * przykład jest niedospecyfikowany (ta sama sytuacja jak rozbieżność w przykładzie Ekranu 1
 * Modułu 4, docs/memory.md) — wzór wdrożony poprawnie fizycznie, wynik w kWh (jednostka baterii
 * w tej apce), nie w Ah.
 */
export function calculateWplywNaDobor(input: WplywNaDoborInput): CalcResult<WplywNaDoborResult> {
  const { errors } = validateWplywNaDobor(input)
  const inputs = {
    standbyDobowaKwh: input.standbyDobowaKwh,
    eliminacjaPct: input.eliminacjaPct,
    dniAutonomii: input.dniAutonomii,
    sprawnoscFalownikaPct: input.sprawnoscFalownikaPct,
    dodPct: input.dodPct,
  }
  const pustyWynik: WplywNaDoborResult = { redukcjaDobowaKwh: 0, redukcjaPojemnosciKwh: 0 }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "kWh",
      status: "INVALID_INPUT",
      formula: FORMULA_WPLYW, formulaKey: "UI-FORMULA-ZAPOTRZEBOWANIE-WAMPIRY-ENERGETYCZNE-SYMULACJE-I-RAPORTY-WPLYW",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.standbyDobowaKwh === 0 ||
    input.eliminacjaPct === 0 ||
    input.dniAutonomii === 0 ||
    input.sprawnoscFalownikaPct === 0 ||
    input.dodPct === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "kWh",
      status: "INCOMPLETE",
      formula: FORMULA_WPLYW, formulaKey: "UI-FORMULA-ZAPOTRZEBOWANIE-WAMPIRY-ENERGETYCZNE-SYMULACJE-I-RAPORTY-WPLYW",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const redukcjaDobowaKwh = input.standbyDobowaKwh * (input.eliminacjaPct / 100)
  const redukcjaPojemnosciKwh = obliczPojemnoscUzytecznaKwh(
    redukcjaDobowaKwh,
    input.dniAutonomii,
    input.sprawnoscFalownikaPct,
    input.dodPct,
  )

  return {
    value: { redukcjaDobowaKwh, redukcjaPojemnosciKwh },
    unit: "kWh",
    status: "VALID",
    formula: FORMULA_WPLYW, formulaKey: "UI-FORMULA-ZAPOTRZEBOWANIE-WAMPIRY-ENERGETYCZNE-SYMULACJE-I-RAPORTY-WPLYW",
    inputs,
    assumptions: [],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
