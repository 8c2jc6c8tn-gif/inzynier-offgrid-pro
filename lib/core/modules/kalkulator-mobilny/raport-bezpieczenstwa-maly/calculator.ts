import type { CalcResult, Warning } from "@/lib/core/calc-result"
import { PUNKTY_RAPORTU, type IdPunktuRaportu } from "./constants"
import type { OdpowiedzRaportu, RaportBezpieczenstwaInput } from "./input"
import { bezpiecznikWiekszyNizPrzewod, brakBezpiecznikaAkumulatora, doNaprawy, niesprawdzone } from "./warnings"

export const CALCULATOR_VERSION = "1.1.0"

const FORMULA = "bezpieczeństwo = \\dfrac{n_{OK}}{n_{punktów}} \\times 100\\%"

export type PunktWyniku = { id: IdPunktuRaportu; odpowiedz: OdpowiedzRaportu; href: string | null }

export type RaportBezpieczenstwaResult = {
  /** Udział punktów OK we wszystkich punktach [%] — niesprawdzone liczą się jak nie-OK. */
  procentBezpieczenstwa: number
  liczbaOk: number
  liczbaBledow: number
  liczbaNiesprawdzonych: number
  razem: number
  punkty: PunktWyniku[]
}

/**
 * Ekran 14, Moduł 12 — "Raport bezpieczeństwa małej instalacji" (dawne 8.22, Biblia §12.22). Uproszczony
 * odpowiednik raportu zgodności M5: lista kontrolna OK / Błąd dla pięciu obszarów Biblii, wynik jako udział
 * punktów OK („Instalacja jest w 80% bezpieczna” = 4 z 5 OK) i kroki naprawcze dla każdego błędu. Aplikacja
 * nie ma jeszcze danych z pomiarów małej instalacji, więc raport składa się z odpowiedzi usera (samoocena,
 * każdy punkt odsyła do kalkulatora, który element dobiera). Niesprawdzony punkt NIE liczy się jako OK.
 */
export function calculateRaportBezpieczenstwa(input: RaportBezpieczenstwaInput): CalcResult<RaportBezpieczenstwaResult> {
  const punkty: PunktWyniku[] = PUNKTY_RAPORTU.map((p) => ({ id: p.id, odpowiedz: input.odpowiedzi[p.id] ?? null, href: p.href }))
  const razem = punkty.length
  const liczbaOk = punkty.filter((p) => p.odpowiedz === "ok").length
  const liczbaBledow = punkty.filter((p) => p.odpowiedz === "blad").length
  const liczbaNiesprawdzonych = razem - liczbaOk - liczbaBledow
  const value = { procentBezpieczenstwa: (liczbaOk / razem) * 100, liczbaOk, liczbaBledow, liczbaNiesprawdzonych, razem, punkty }
  const baza = { unit: "%", formula: FORMULA, formulaKey: "UI-FORMULA-KALKULATOR-MOBILNY-RAPORT-BEZPIECZENSTWA-MALY", inputs: { razem, liczbaOk, liczbaBledow, liczbaNiesprawdzonych }, calculatorVersion: CALCULATOR_VERSION }

  if (liczbaOk + liczbaBledow === 0) return { ...baza, value, status: "INCOMPLETE", assumptions: [], warnings: [] }

  const warnings: Warning[] = punkty
    .filter((p) => p.odpowiedz === "blad")
    .map((p) =>
      p.id === "bezpiecznik-akumulatora"
        ? brakBezpiecznikaAkumulatora()
        : p.id === "bezpiecznik-a-przewod"
          ? bezpiecznikWiekszyNizPrzewod()
          : doNaprawy(p.id),
    )
  if (liczbaNiesprawdzonych > 0) warnings.push(niesprawdzone(liczbaNiesprawdzonych))

  return {
    ...baza,
    value,
    status: liczbaBledow > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions: [{ kod: "RB-ZALOZENIE-SAMOOCENA" }],
    warnings,
  }
}
