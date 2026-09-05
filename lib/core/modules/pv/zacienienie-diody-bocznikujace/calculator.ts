import type { CalcResult } from "@/lib/core/calc-result"
import type { ZacienienieDiodyBocznikujaceInput } from "./input"
import { validateInput } from "./validation"
import {
  brakZacienienia,
  zacienienieJednejSekcji,
  zacienienieDwochSekcji,
  zacienieniePelnegoPanelu,
} from "./warnings"
import { LICZBA_SEKCJI_DIOD_BOCZNIKUJACYCH } from "./constants"

// 🔎 TD10 (dlug-techniczny.md): tylko strata mocy zacienionego panelu. Strata na poziomie CAŁEGO
// STRINGU (zależna od konfiguracji wg źródła) NIE liczona — źródło nie podaje wzoru.
export const CALCULATOR_VERSION = "1.0.0"

export type ZacienienieDiodyBocznikujaceResult = {
  strataPaneluPct: number
  mocPaneluRzeczywistaW: number
}

const FORMULA =
  "strata_{panelu} = \\frac{sekcje_{zacienione}}{3} \\times 100\\% \\;\\; ; \\;\\; P_{rzeczywista} = P_{nominalna} \\times \\left(1 - \\frac{sekcje_{zacienione}}{3}\\right)"

/**
 * Ekran 13, Moduł 3 "Instalacja PV" — "Symulacja zacienienia i wpływu na diody bocznikujące"
 * (scala dawne 2.23, 2.49, docs/zrodla/Tresc_Modul_3_PV_Ekrany.md, Sekcja A-D). Liczy TYLKO
 * stratę mocy zacienionego panelu (poziom panelu) — poprawność wzoru zweryfikowana niezależnie
 * w Pythonie przed implementacją (1/3→33,3%, 2/3→66,7%, zgodne z zaokrągleniami źródła 33%/66%).
 *
 * Strata na poziomie CAŁEGO STRINGU (np. "zacienienie 1 panelu w stringu 6 paneli → strata
 * stringu 55%+") jest tu świadomie NIE liczona liczbowo — źródło wprost opisuje ją jako zależną
 * od konfiguracji (liczba paneli, topologia MPPT, okablowanie), bez podanego wzoru. Wymyślanie
 * takiego wzoru byłoby naruszeniem Dyrektywy #1 (`02_Dyrektywy_AI_Projektu.md`) — string-level
 * strata zostaje jako opisowa uwaga (assumptions), nie liczba.
 */
export function calculateZacienienieDiodyBocznikujace(
  input: ZacienienieDiodyBocznikujaceInput,
): CalcResult<ZacienienieDiodyBocznikujaceResult> {
  const { errors } = validateInput(input)
  const pustyWynik: ZacienienieDiodyBocznikujaceResult = { strataPaneluPct: 0, mocPaneluRzeczywistaW: 0 }
  const inputs = {
    mocPaneluNominalnaW: input.mocPaneluNominalnaW,
    liczbaZacienionychSekcji: input.liczbaZacienionychSekcji,
    liczbaPaneliWStringu: input.liczbaPaneliWStringu,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "%",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne = input.mocPaneluNominalnaW === 0 || input.liczbaPaneliWStringu === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "%",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const strataUlamkowa = input.liczbaZacienionychSekcji / LICZBA_SEKCJI_DIOD_BOCZNIKUJACYCH
  const strataPaneluPct = strataUlamkowa * 100
  const mocPaneluRzeczywistaW = input.mocPaneluNominalnaW * (1 - strataUlamkowa)

  const warnings =
    input.liczbaZacienionychSekcji === 0
      ? [brakZacienienia()]
      : input.liczbaZacienionychSekcji === 1
        ? [zacienienieJednejSekcji(strataPaneluPct)]
        : input.liczbaZacienionychSekcji === 2
          ? [zacienienieDwochSekcji(strataPaneluPct)]
          : [zacienieniePelnegoPanelu(strataPaneluPct)]

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: { strataPaneluPct, mocPaneluRzeczywistaW },
    unit: "%",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [
      "Strata panelu liczona z konstrukcyjnego faktu: standardowy panel PV ma 3 sekcje ogniw, każda z osobną diodą bocznikującą — zacienienie sekcji obniża napięcie panelu o 1/3 przy zbliżonym prądzie.",
      `Strata CAŁEGO STRINGU (${input.liczbaPaneliWStringu} paneli szeregowo) NIE jest tu liczona liczbowo — źródło opisuje ją jako zależną od konfiguracji (topologia MPPT, okablowanie), bez podanego wzoru. Przykład źródła: zacienienie 1 panelu w stringu 6 paneli → strata stringu ok. 55%, ale to zależy od konfiguracji, nie jest to stała wartość do wyliczenia tutaj.`,
    ],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
