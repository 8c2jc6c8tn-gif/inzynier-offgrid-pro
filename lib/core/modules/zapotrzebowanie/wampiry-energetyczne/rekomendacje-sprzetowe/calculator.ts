import type { CalcResult } from "@/lib/core/calc-result"
import type { DoborMetodyInput, MetodaOdlaczaniaId, PorownanieMetodInput } from "./input"
import { validatePorownanieMetod } from "./validation"
import { oszczednoscNiepozytywna } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

// --- 1.32 + 1.39 + 1.44: porównanie metod odłączania (koszt vs zysk) ---

const FORMULA_ZWROT = "Okres_{zwrotu}[mies.] = \\dfrac{Koszt_{zakupu}}{Oszczednosc_{roczna}} \\times 12"

export type WynikMetody = {
  id: MetodaOdlaczaniaId
  kosztZakupuZl: number
  rocznaOszczednoscZl: number
  /** null = koszt nigdy się nie zwróci (oszczędność <= 0). */
  okresZwrotuMiesiecy: number | null
}

export type PorownanieMetodResult = {
  metody: WynikMetody[]
}

/**
 * Dawne 1.32 ("Ekonomiczny próg opłacalności eliminacji standby") + 1.39 ("Optymalizacja
 * wyłączania standby – koszt vs. zysk") + 1.44 ("Porównanie: wyłącznik ręczny vs. listwa vs.
 * gniazdo Wi-Fi vs. przekaźnik Zigbee") — trzy stare funkcje pytające o to samo (opłacalność
 * wariantów odłączania), scalone w jedną tabelę porównawczą (Wzorzec B). Przykład źródła 1.39
 * ("listwa: 40 zł / 120 zł rocznie → zwrot 4 miesiące"; "gniazdo Wi-Fi: 150 zł / 200 zł rocznie
 * → zwrot 9 miesięcy") zweryfikowany dokładnie: 40/120×12=4, 150/200×12=9. Koszt zakupu i roczna
 * oszczędność wpisywane ręcznie — źródło daje je tylko jako ilustrację, nie normę cenową.
 */
export function calculatePorownanieMetod(input: PorownanieMetodInput): CalcResult<PorownanieMetodResult> {
  const { errors } = validatePorownanieMetod(input)
  const inputs = Object.fromEntries(
    input.metody.flatMap((m) => [
      [`${m.id}-koszt`, m.kosztZakupuZl],
      [`${m.id}-oszczednosc`, m.rocznaOszczednoscZl],
    ]),
  )
  const pustyWynik: PorownanieMetodResult = { metody: [] }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "mies.",
      status: "INVALID_INPUT",
      formula: FORMULA_ZWROT,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const wypelnione = input.metody.filter((m) => m.kosztZakupuZl > 0 || m.rocznaOszczednoscZl > 0)

  if (wypelnione.length === 0) {
    return {
      value: pustyWynik,
      unit: "mies.",
      status: "INCOMPLETE",
      formula: FORMULA_ZWROT,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const warnings = wypelnione
    .filter((m) => m.rocznaOszczednoscZl <= 0 && m.kosztZakupuZl > 0)
    .map((m) => oszczednoscNiepozytywna(m.id))

  const metody: WynikMetody[] = wypelnione.map((m) => ({
    id: m.id,
    kosztZakupuZl: m.kosztZakupuZl,
    rocznaOszczednoscZl: m.rocznaOszczednoscZl,
    okresZwrotuMiesiecy: m.rocznaOszczednoscZl > 0 ? (m.kosztZakupuZl / m.rocznaOszczednoscZl) * 12 : null,
  }))

  return {
    value: { metody },
    unit: "mies.",
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA_ZWROT,
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}

// --- 1.33 + 1.46: dobór metody per urządzenie + wydzielenie obwodu ---

/**
 * Rekomendowana metoda per kategoria — dawne 1.33 wymienia własną listę etykiet (listwa/gniazdo
 * Wi-Fi/gniazdo z timerem/obwód w rozdzielni), TYLKO CZĘŚCIOWO pokrywającą się z 4 metodami
 * porównywanymi w 1.44 (wyłącznik ręczny/listwa/gniazdo Wi-Fi/przekaźnik Zigbee) — "gniazdo z
 * timerem" i "obwód w rozdzielni ze stycznikiem" to inne kategorie, nie da się ich sprowadzić do
 * 4 metod 1.44 bez zniekształcenia źródła. Zachowane jako własny typ etykiety, nie wymuszone na
 * `MetodaOdlaczaniaId`.
 */
export type EtykietaRekomendacji =
  | "listwa-z-wylacznikiem"
  | "gniazdo-wifi"
  | "gniazdo-z-timerem"
  | "obwod-w-rozdzielni-ze-stycznikiem"

export type WynikDoboru = {
  metoda: EtykietaRekomendacji
}

/**
 * Dawne 1.33 ("Rekomendacje: wyłączniki ręczne, listwy, gniazda sterowane, przekaźniki Wi-Fi") —
 * drzewo decyzyjne 1:1 ze źródła (ten sam wzorzec co Ekran 32, Moduł 4 "Hierarchia ładowania").
 * Rekomendacja wydzielenia obwodu standby w rozdzielni (dawne 1.46) jest treścią informacyjną,
 * nie osobną logiką — pokazywana w UI jako karta info, bez klasyfikatora.
 */
export function wybierzMetodeDlaKategorii(input: DoborMetodyInput): WynikDoboru {
  if (input.kategoria === "tv-konsola") return { metoda: "listwa-z-wylacznikiem" }
  if (input.kategoria === "router") return { metoda: "gniazdo-wifi" }
  if (input.kategoria === "ladowarki") return { metoda: "gniazdo-z-timerem" }
  return { metoda: "obwod-w-rozdzielni-ze-stycznikiem" }
}
