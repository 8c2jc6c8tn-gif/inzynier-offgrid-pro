import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { OchronaStringowInput } from "./input"
import { validateInput } from "./validation"
import {
  alternatywaKablowaNiesprawdzona,
  bezpiecznikDobrany,
  ochronaObowiazkowaBrak,
  wybranyBezpiecznikPozaZakresem,
  zakresBezpiecznikaNiepoprawny,
} from "./warnings"
import {
  K1_ISC_MAX,
  PROG_LICZBY_STRINGOW,
  WSPOLCZYNNIK_MARGINESU_DOLNEGO,
  WSPOLCZYNNIK_TESTU_OBOWIAZKOWOSCI,
} from "./constants"

// 🔎 TD13 (dlug-techniczny.md): reguła doboru diody blokującej (§712.512.101 normy
// HD 60364-7-712: napięcie wsteczne ≥2×U_OC_MAX, prąd ≥1,1×I_SC_MAX) świadomie NIE zbudowana —
// poza wąskim zakresem korekty 06-07.09.2026, mimo że tytuł źródłowy ekranu ją wymienia wprost.

export const CALCULATOR_VERSION = "2.0.0"

export type OchronaStringowResult = {
  /** Prąd maksymalny zwarciowy stringu (I_SC_MAX), Załącznik B.2. */
  iScMaxA: number
  /** Dolna granica prądu znamionowego zabezpieczenia, §712.431.102. */
  inMinA: number
  /** Górna granica — I_MOD_MAX_OCPR panelu z karty katalogowej. */
  inMaxA: number
  /** false = inMinA > inMaxA, żaden bezpiecznik nie spełnia wymagań normy dla tej konfiguracji. */
  zakresPoprawny: boolean
  /** Wynik testu obowiązkowości zabezpieczenia, §712.431.101. */
  ochronaWymagana: boolean
  /** Ns>2 i ochrona nie jest wymagana wzorem — wymagana alternatywa kablowa (§712.433.101),
   *  nieobjęta tym kalkulatorem. */
  alternatywaKablowaWymagana: boolean
  /** null = użytkownik nie podał wybranego bezpiecznika do sprawdzenia. */
  wybranyBezpiecznikOk: boolean | null
}

const FORMULA =
  "I_{SC\\,MAX} = K_1 \\times I_{SC\\,STC} \\;;\\; 1{,}1\\,I_{SC\\,MAX} \\le I_n \\le I_{MOD\\_MAX\\_OCPR} \\;;\\; " +
  "1{,}35\\,I_{MOD\\_MAX\\_OCPR} < (N_s-1) I_{SC\\,MAX} \\Rightarrow \\text{ochrona obowiązkowa}"

function pusty(): OchronaStringowResult {
  return {
    iScMaxA: 0,
    inMinA: 0,
    inMaxA: 0,
    zakresPoprawny: false,
    ochronaWymagana: false,
    alternatywaKablowaWymagana: false,
    wybranyBezpiecznikOk: null,
  }
}

/**
 * Prąd maksymalny zwarciowy stringu (I_SC_MAX) z katalogowego Isc — Załącznik B.2 normy
 * HD 60364-7-712. K1=1,25 to minimum normowe (patrz `constants.ts`).
 */
export function obliczIScMaxA(iscStcA: number): number {
  return K1_ISC_MAX * iscStcA
}

/**
 * Ekran 22, Moduł 3 "Instalacja PV" — "Ochrona stringów (bezpieczniki, diody blokujące)"
 * (dawne 2.38, docs/zrodla/Tresc_Modul_3_PV_Ekrany.md, Sekcja B).
 *
 * PRZEPISANE wg normy HD 60364-7-712:2016 (docs/zrodla/norma-HD-60364-7-712/UNE-HD-60364-7-712-2017-pelny-tekst.pdf),
 * §712.431-433 + Załącznik B.2 — na wyraźną prośbę autora, po znalezieniu sprzeczności między
 * poprzednim uproszczeniem produktowym i tekstem normy (patrz docs/memory.md, korekta).
 *
 * ZASTĄPIONE (v1.0.0): "bezpiecznik = 1,25×Isc, obowiązkowe zawsze przy ≥3 stringach". Ten wzór
 * mylił dwa różne kroki normy — K1=1,25 (Załącznik B.2) to margines Isc_STC→Isc_max, NIE wzór na
 * dobór bezpiecznika. Rzeczywisty dobór to przedział §712.431.102 (1,1×Isc_max ≤ In ≤
 * I_MOD_MAX_OCPR z karty katalogowej panelu), a obowiązkowość przy Ns>2 to warunek §712.431.101
 * (1,35×I_MOD_MAX_OCPR < (Ns-1)×Isc_max), nie sztywny próg "≥3".
 *
 * Poza zakresem: przypadek wielu stringów za jednym wspólnym bezpiecznikiem (Np>1, wzór z
 * §712.431.102 dla grupowania) — tu zakładamy jeden bezpiecznik na string (najczęstszy
 * przypadek). Alternatywa kablowa (§712.433.101, Iz kabla stringu ≥ (Ns-1)×Isc_max, gdy
 * zabezpieczenie nie jest wymagane) nie jest tu sprawdzana — zgłaszana jako ostrzeżenie do
 * weryfikacji w module doboru przekroju kabla.
 */
export function calculateOchronaStringow(input: OchronaStringowInput): CalcResult<OchronaStringowResult> {
  const { errors } = validateInput(input)
  const inputs = {
    iscStcA: input.iscStcA,
    iModMaxOcprA: input.iModMaxOcprA,
    liczbaStringowRownoleglych: input.liczbaStringowRownoleglych,
    wybranyBezpiecznikA: input.wybranyBezpiecznikA ?? 0,
  }

  if (errors.length > 0) {
    return {
      value: pusty(),
      unit: "A",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.iscStcA === 0 || input.iModMaxOcprA === 0 || input.liczbaStringowRownoleglych === 0

  if (niekompletne) {
    return {
      value: pusty(),
      unit: "A",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const ns = input.liczbaStringowRownoleglych
  const iScMaxA = obliczIScMaxA(input.iscStcA)
  const inMinA = WSPOLCZYNNIK_MARGINESU_DOLNEGO * iScMaxA
  const inMaxA = input.iModMaxOcprA
  const zakresPoprawny = inMinA <= inMaxA

  const ochronaWymagana =
    ns > PROG_LICZBY_STRINGOW &&
    WSPOLCZYNNIK_TESTU_OBOWIAZKOWOSCI * input.iModMaxOcprA < (ns - 1) * iScMaxA

  const alternatywaKablowaWymagana = ns > PROG_LICZBY_STRINGOW && !ochronaWymagana

  const wybranyBezpiecznikOk =
    input.wybranyBezpiecznikA !== null
      ? input.wybranyBezpiecznikA >= inMinA && input.wybranyBezpiecznikA <= inMaxA
      : null

  const warnings: Warning[] = []

  if (!zakresPoprawny) {
    warnings.push(zakresBezpiecznikaNiepoprawny(inMinA, inMaxA))
  } else if (ochronaWymagana && !input.maZabezpieczeniaPerString) {
    warnings.push(ochronaObowiazkowaBrak(ns, iScMaxA, input.iModMaxOcprA))
  } else if (wybranyBezpiecznikOk === false) {
    warnings.push(wybranyBezpiecznikPozaZakresem(input.wybranyBezpiecznikA as number, inMinA, inMaxA))
  } else {
    warnings.push(bezpiecznikDobrany(inMinA, inMaxA))
  }

  if (alternatywaKablowaWymagana) {
    warnings.push(alternatywaKablowaNiesprawdzona(ns, iScMaxA))
  }

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  const value: OchronaStringowResult = {
    iScMaxA,
    inMinA,
    inMaxA,
    zakresPoprawny,
    ochronaWymagana,
    alternatywaKablowaWymagana,
    wybranyBezpiecznikOk,
  }

  const assumptions = [
    "K1=1,25 (minimum normowe, Załącznik B.2) — w warunkach zwiększonego odbicia/naświetlenia " +
      "norma dopuszcza wyższe K1, ale nie podaje konkretnej wartości; nie zgadujemy.",
  ]

  return {
    value,
    unit: "A",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
