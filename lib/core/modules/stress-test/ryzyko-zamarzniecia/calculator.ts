import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { ZAPAS_RURY_WODNEJ_POD_STREFA_CM } from "./constants"
import type { RyzykoZamarznieciaInput, TypInstalacjiGruntowej } from "./input"
import { validateInput } from "./validation"
import { brakGlebokosci, plycejNizPrzemarzanie, rozmrazanieOgniem, ruraBezZapasu } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "h_{ulozenia} \\ge h_z \\;(\\text{rura wodna: } h_z + 20\\,\\text{cm})"

export type OcenaInstalacji = {
  id: string
  nazwa: string
  typ: TypInstalacjiGruntowej
  /** Wymagana minimalna głębokość [cm]: h_z, dla rury wodnej h_z + 20. */
  wymaganaCm: number
  /** Głębokość ułożenia − wymagana [cm]; null = brak danych. Ujemny = za płytko. */
  zapasCm: number | null
  /** Ułożenie płycej niż sama strefa przemarzania (twardy stop). */
  wStrefiePrzemarzania: boolean
}

export type RyzykoZamarznieciaResult = {
  oceny: OcenaInstalacji[]
  liczbaWStrefie: number
}

const PUSTY_WYNIK: RyzykoZamarznieciaResult = { oceny: [], liczbaWStrefie: 0 }

/**
 * Ekran 22, Moduł 7 — tryb "Grunt / instalacje zewnętrzne" (dawne 6.35) + sekcja wspólna
 * rozmrażania (6.37). Twarde stopy 🔴 1:1 ze źródła: instalacja płycej niż strefa przemarzania;
 * zbyt szybkie rozmrażanie (otwarty ogień). Zapas 20 cm dla wodociągu — Biblia v2.0 (🟡, bo
 * źródło podaje to jako komunikat, nie twardy stop). Energia rozmrażania (`f(ciepło właściwe lodu,
 * straty, moc kabla)`) nieliczona — źródło nie podaje modelu (Dyrektywa #1).
 */
export function calculateRyzykoZamarzniecia(input: RyzykoZamarznieciaInput): CalcResult<RyzykoZamarznieciaResult> {
  const inputs: Record<string, number> = {
    glebokoscPrzemarzaniaCm: input.glebokoscPrzemarzaniaCm ?? 0,
    liczbaInstalacji: input.instalacje.length,
    rozmrazanieOgniem: input.metodaRozmrazania === "otwarty-ogien" ? 1 : 0,
  }
  const wynik = (status: CalcResult<unknown>["status"], warnings: Warning[]): CalcResult<RyzykoZamarznieciaResult> => ({
    value: PUSTY_WYNIK,
    unit: "cm",
    status,
    formula: FORMULA, formulaKey: "UI-FORMULA-STRESS-TEST-RYZYKO-ZAMARZNIECIA",
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  const { errors } = validateInput(input)
  if (errors.length > 0) return wynik("INVALID_INPUT", errors)

  const hz = input.glebokoscPrzemarzaniaCm
  const ogien = input.metodaRozmrazania === "otwarty-ogien"
  const maGrunt = hz !== null && input.instalacje.length > 0
  if (!maGrunt && !ogien) return wynik("INCOMPLETE", [])

  const warnings: Warning[] = []
  const oceny: OcenaInstalacji[] = !maGrunt
    ? []
    : input.instalacje.map((e, i) => {
        const nazwa = e.nazwa.trim() === "" ? `instalacja ${i + 1}` : e.nazwa.trim()
        const wymaganaCm = e.typ === "rura-wodna" ? hz + ZAPAS_RURY_WODNEJ_POD_STREFA_CM : hz
        if (e.glebokoscCm === null) {
          warnings.push(brakGlebokosci(nazwa))
          return { id: e.id, nazwa, typ: e.typ, wymaganaCm, zapasCm: null, wStrefiePrzemarzania: false }
        }
        const wStrefiePrzemarzania = e.glebokoscCm < hz
        if (wStrefiePrzemarzania) warnings.push(plycejNizPrzemarzanie(nazwa, e.glebokoscCm, hz))
        else if (e.glebokoscCm < wymaganaCm) warnings.push(ruraBezZapasu(nazwa, e.glebokoscCm, wymaganaCm))
        return { id: e.id, nazwa, typ: e.typ, wymaganaCm, zapasCm: e.glebokoscCm - wymaganaCm, wStrefiePrzemarzania }
      })
  if (ogien) warnings.push(rozmrazanieOgniem())

  const assumptions: Assumption[] = maGrunt
    ? [{ kod: "ZAMARZ-ZALOZENIE-HZ-USERA" }, { kod: "ZAMARZ-ZALOZENIE-DO-WIERZCHU" }]
    : []

  return {
    value: { oceny, liczbaWStrefie: oceny.filter((o) => o.wStrefiePrzemarzania).length },
    unit: "cm",
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA, formulaKey: "UI-FORMULA-STRESS-TEST-RYZYKO-ZAMARZNIECIA",
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
