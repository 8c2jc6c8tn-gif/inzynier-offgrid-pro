import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { KAT_PIONU_DEG, LICZBA_MIESIECY } from "./constants"
import type { PionowyInput } from "./input"
import { validatePionowy } from "./validation"
import { zaspaZacieniaDolneOgniwa } from "./warnings"
import { fabrykaWyniku, statusZOstrzezen } from "./wynik"

export type MiesiacPionowy = {
  /** 0 = styczeń. */
  miesiac: number
  pionowyKwhM2: number
  optimumKwhM2: number
  /** (pion − optimum) / optimum × 100 [%]; `null` gdy optimum = 0 (noc polarna). */
  roznicaPct: number | null
}

export type PionowyResult = {
  /** Najlepszy stały kąt przy tym azymucie — odniesienie porównania [°]. */
  optimumDeg: number
  miesiace: MiesiacPionowy[]
  pionowyRocznieKwhM2: number
  optimumRocznieKwhM2: number
  roznicaRocznaPct: number
  /** Miesiące (0 = styczeń), w których pion zbiera więcej niż najlepszy kąt stały. */
  miesiaceZysku: number[]
  /** Suma nadwyżki pionu w miesiącach zysku [kWh/m²]. */
  zyskKwhM2: number
  /** Suma niedoboru pionu w pozostałych miesiącach [kWh/m²] (wartość dodatnia). */
  strataKwhM2: number
  /** Trawa/zaspa ponad dolną krawędzią; `null` = nie podano obu wysokości. */
  zaspaZacienia: boolean | null
}

const FORMULA =
  "\\Delta_m = \\frac{H_m(90^\\circ) - H_m(\\beta^*)}{H_m(\\beta^*)},\\quad \\beta^* = \\arg\\max_\\beta \\sum_m H_m(\\beta)"

const suma = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

/**
 * Tryb "Pionowy" (dawne 2.4). Źródło (B): "zimą słońce świeci nisko — pionowe panele mają lepszy kąt
 * padania niż latem [...] System liczy bilans: strata latem vs zysk zimą". Realizacja: pion (90°) vs
 * najlepszy stały kąt przy tym samym azymucie, miesiąc po miesiącu, z tabeli napromieniowania M3/E1
 * (PVGIS TMY, Muneer). Granicy "lato/zima" nie przyjmujemy z góry — miesiące zysku wynikają z danych.
 * Przykład "−22% / +35% / +5%" ze źródła to ilustracja, nie wartość do odtworzenia.
 *
 * Zaspa/trawa: źródło podaje próg "> 30 cm" bez odniesienia do wysokości montażu — liczymy geometrię
 * (przeszkoda wyżej niż dolna krawędź paneli). Źródłowe "strata ok. 8%" nie ma wzoru — bez liczby.
 */
export function calculatePionowy(input: PionowyInput): CalcResult<PionowyResult | null> {
  const wynik = fabrykaWyniku<PionowyResult>(input, FORMULA, "kWh/m²")
  const errors = validatePionowy(input)
  if (errors.length > 0) return wynik("INVALID_INPUT", null, errors)

  const { tabela } = input
  const iPion = tabela === null ? -1 : tabela.katyDeg.indexOf(KAT_PIONU_DEG)
  if (tabela === null || iPion < 0) return wynik("INCOMPLETE", null)

  const roczne = tabela.miesiace.map(suma)
  const iOpt = roczne.indexOf(Math.max(...roczne))
  const pion = tabela.miesiace[iPion]!
  const opt = tabela.miesiace[iOpt]!

  const miesiace: MiesiacPionowy[] = Array.from({ length: LICZBA_MIESIECY }, (_, m) => ({
    miesiac: m,
    pionowyKwhM2: pion[m]!,
    optimumKwhM2: opt[m]!,
    roznicaPct: opt[m]! > 0 ? (100 * (pion[m]! - opt[m]!)) / opt[m]! : null,
  }))
  const miesiaceZysku = miesiace.filter((x) => x.pionowyKwhM2 > x.optimumKwhM2).map((x) => x.miesiac)
  const zyskKwhM2 = suma(miesiace.map((x) => Math.max(0, x.pionowyKwhM2 - x.optimumKwhM2)))
  const strataKwhM2 = suma(miesiace.map((x) => Math.max(0, x.optimumKwhM2 - x.pionowyKwhM2)))

  const warnings: Warning[] = []
  const { wysokoscDolnejKrawedziM: krawedzM, wysokoscTrawySnieguCm: przeszkodaCm } = input
  let zaspaZacienia: boolean | null = null
  if (krawedzM !== null && przeszkodaCm !== null) {
    const krawedzCm = krawedzM * 100
    zaspaZacienia = przeszkodaCm > krawedzCm
    if (zaspaZacienia) warnings.push(zaspaZacieniaDolneOgniwa(przeszkodaCm, Math.round(krawedzCm)))
  }

  const assumptions: Assumption[] = [
    { kod: "KAT-ZALOZENIE-TABELA-PVGIS", params: { azymut: tabela.azymutDeg, albedo: tabela.albedo } },
    { kod: "TM-ZALOZENIE-PION-VS-OPTIMUM", params: { kat: tabela.katyDeg[iOpt]! } },
    { kod: "TM-ZALOZENIE-NAPROMIENIOWANIE" },
  ]

  return wynik(
    statusZOstrzezen(warnings),
    {
      optimumDeg: tabela.katyDeg[iOpt]!,
      miesiace,
      pionowyRocznieKwhM2: roczne[iPion]!,
      optimumRocznieKwhM2: roczne[iOpt]!,
      roznicaRocznaPct: roczne[iOpt]! > 0 ? (100 * (roczne[iPion]! - roczne[iOpt]!)) / roczne[iOpt]! : 0,
      miesiaceZysku,
      zyskKwhM2,
      strataKwhM2,
      zaspaZacienia,
    },
    warnings,
    assumptions,
  )
}
