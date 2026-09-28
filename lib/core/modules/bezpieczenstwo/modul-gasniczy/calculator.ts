import type { CalcResult, Status, Warning } from "@/lib/core/calc-result"
import { MIN_CZUJNIKOW_POTWIERDZENIA, SRODKI_NIESKUTECZNE_LIFEPO4, SRODKI_WYMAGANE_LIFEPO4 } from "./constants"
import type { ModulGasniczyInput } from "./input"
import { validateInput } from "./validation"
import {
  brakOdcieciaWentylacji,
  innaChemiaMagazynu,
  modulRozladowany,
  srodekNiepotwierdzonyLifepo4,
  srodekNieskutecznyLifepo4,
  zaMaloCzujnikow,
} from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "gaszenie \\Leftarrow n_{czujnikow} \\ge 2"

export type ModulGasniczyResult = {
  /** Środek właściwy dla magazynu LiFePO4 w strefie. null = w strefie nie ma LiFePO4 albo brak danych. */
  srodekWlasciwyDlaLifepo4: boolean | null
  /** Liczba braków (ostrzeżeń 🟡/🔴). */
  liczbaBrakow: number
}

/**
 * Ekran 4, Moduł 8 — "Moduł gaśniczy / elektrozawór gazu" (dawne 11.52 + 12.51). Reguły ze źródła:
 * 🔴 proszek/CO2 w strefie LiFePO4 (nie gaszą reakcji ogniwa), wymagane mgła wodna albo środek do
 * magazynów energii — inne środki (gaz obojętny, aerozol) 🟡, bo źródło ich nie wyklucza wprost;
 * 🔴 moduł rozładowany (sekcja C); 🟡 potwierdzenie alarmu jednym czujnikiem (B.1: „np. dwa niezależne”)
 * i brak odcięcia wentylacji/klap (B.1). Sekwencja dowódcy AI (12.51) — treść na ekranie, nie wynik.
 */
export function calculateModulGasniczy(input: ModulGasniczyInput): CalcResult<ModulGasniczyResult> {
  const inputs = {
    liczbaCzujnikowPotwierdzenia: input.liczbaCzujnikowPotwierdzenia ?? 0,
    odcinaWentylacjeIKlapy: input.odcinaWentylacjeIKlapy ? 1 : 0,
  }
  const wynik = (status: Status, value: ModulGasniczyResult, warnings: Warning[]): CalcResult<ModulGasniczyResult> => ({
    value,
    unit: "",
    status,
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })
  const pusty: ModulGasniczyResult = { srodekWlasciwyDlaLifepo4: null, liczbaBrakow: 0 }

  const { errors } = validateInput(input)
  if (errors.length > 0) return wynik("INVALID_INPUT", pusty, errors)
  if (input.srodek === null || input.magazynWStrefie === null || input.liczbaCzujnikowPotwierdzenia === null || input.stanModulu === null) {
    return wynik("INCOMPLETE", pusty, [])
  }

  const warnings: Warning[] = []
  let srodekWlasciwyDlaLifepo4: boolean | null = null
  if (input.magazynWStrefie === "lifepo4") {
    srodekWlasciwyDlaLifepo4 = SRODKI_WYMAGANE_LIFEPO4.includes(input.srodek)
    if (SRODKI_NIESKUTECZNE_LIFEPO4.includes(input.srodek)) warnings.push(srodekNieskutecznyLifepo4(input.srodek))
    else if (!srodekWlasciwyDlaLifepo4) warnings.push(srodekNiepotwierdzonyLifepo4(input.srodek))
  } else if (input.magazynWStrefie === "inna") {
    warnings.push(innaChemiaMagazynu())
  }
  if (input.stanModulu === "rozladowany") warnings.push(modulRozladowany())
  if (input.liczbaCzujnikowPotwierdzenia < MIN_CZUJNIKOW_POTWIERDZENIA) warnings.push(zaMaloCzujnikow(input.liczbaCzujnikowPotwierdzenia))
  if (!input.odcinaWentylacjeIKlapy) warnings.push(brakOdcieciaWentylacji())

  const liczbaBrakow = warnings.filter((w) => w.level !== "info").length
  return wynik(liczbaBrakow > 0 ? "VALID_WITH_WARNINGS" : "VALID", { srodekWlasciwyDlaLifepo4, liczbaBrakow }, warnings)
}
