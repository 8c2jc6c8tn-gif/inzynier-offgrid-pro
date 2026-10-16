import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { TrybOgraniczonegoZuzyciaInput } from "./input"
import { validateInput } from "./validation"
import { nicNieZostajeTo, pustaListaTo } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type TrybOgraniczonegoZuzyciaResult = {
  /** Dobowe zużycie wszystkich odbiorników / tylko tych, które zostają [kWh]. */
  normalnieDobaKwh: number
  ograniczoneDobaKwh: number
  /** Oszczędność na dobę [kWh] i jako część normalnego zużycia [%] (0 przy zerowym zużyciu). */
  oszczednoscDobaKwh: number
  oszczednoscPct: number
  /** Tryb „wyjazd": zużycie w całym okresie nieobecności [kWh]\; `null` w innym trybie albo bez liczby dób. */
  okresNormalnieKwh: number | null
  okresOgraniczoneKwh: number | null
  /** Tryb „noc": zużycie w nocnym oknie [kWh]\; `null` w innym trybie albo bez długości okna. */
  nocNormalnieKwh: number | null
  nocOgraniczoneKwh: number | null
  /** Na ile dób (wyjazd) lub nocy (noc) wystarczy energii użytecznej baterii bez ładowania\; `null` bez pojemności albo przy zerowym zużyciu. */
  bateriaWystarczaNormalnie: number | null
  bateriaWystarczaOgraniczone: number | null
  zostaja: string[]
  wylaczone: string[]
}

const FORMULA =
  "E_{ogr} = \\sum_{zostaje} E_i,\\; E_{okres} = E_{ogr} \\cdot N_{dni}\\;\\text{(wyjazd)},\\; E_{noc} = E_{ogr} \\cdot \\frac{h}{24}\\;\\text{(noc)},\\; t_{bat} = \\frac{C}{E}"

const suma = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

/**
 * Tryb ograniczonego zużycia (7.27 wyjazd, 7.49 noc), bez telemetrii: dobowe zużycie odbiorników z listy Modułu 12, część zostaje włączona
 * (wybór użytkownika), reszta jest wyłączona. W trybie „noc" zakładam, że odbiornik zużywa energię równomiernie w ciągu doby, więc okno
 * nocne dostaje h/24 jego dobowego zużycia — to uproszczenie, bo lista nie niesie pór pracy.
 */
export function calculateTrybOgraniczonegoZuzycia(input: TrybOgraniczonegoZuzyciaInput): CalcResult<TrybOgraniczonegoZuzyciaResult | null> {
  const bledy = validateInput(input)
  const inputs: Record<string, number> = {}
  if (input.dniNieobecnosci !== null) inputs.dniNieobecnosci = input.dniNieobecnosci
  if (input.godzinNocy !== null) inputs.godzinNocy = input.godzinNocy
  if (input.pojemnoscUzytecznaKwh !== null) inputs.pojemnoscUzytecznaKwh = input.pojemnoscUzytecznaKwh
  const zalozenia: Assumption[] = [{ kod: "TOGR-ZAL-BEZ-OCENY-BEZPIECZENSTWA" }]
  if (input.tryb === "noc") zalozenia.push({ kod: "TOGR-ZAL-ROWNOMIERNIE" })
  const baza = { unit: "kWh", formula: FORMULA, formulaKey: "UI-FORMULA-TRYB-OGRANICZONEGO-ZUZYCIA", inputs, calculatorVersion: CALCULATOR_VERSION }
  if (bledy.length > 0) return { ...baza, value: null, status: "INVALID_INPUT", assumptions: zalozenia, warnings: bledy }

  const normalnieWh = suma(input.odbiorniki.map((o) => o.zuzycieDobaWh))
  const zostajace = input.odbiorniki.filter((o) => o.zostaje)
  const ograniczoneWh = suma(zostajace.map((o) => o.zuzycieDobaWh))
  const ostrzezenia: Warning[] = []
  if (normalnieWh === 0) ostrzezenia.push(pustaListaTo())
  else if (zostajace.length === 0) ostrzezenia.push(nicNieZostajeTo())

  const kwh = (wh: number) => wh / 1000
  const wyjazd = input.tryb === "wyjazd" && input.dniNieobecnosci !== null
  const noc = input.tryb === "noc" && input.godzinNocy !== null
  const okresN = wyjazd ? kwh(normalnieWh) * input.dniNieobecnosci! : null
  const okresO = wyjazd ? kwh(ograniczoneWh) * input.dniNieobecnosci! : null
  const nocN = noc ? (kwh(normalnieWh) * input.godzinNocy!) / 24 : null
  const nocO = noc ? (kwh(ograniczoneWh) * input.godzinNocy!) / 24 : null
  // The battery lasts for that many days (trip) / nights (night window) at the entered consumption.
  const naJednostke = (kwhJednostki: number) => (input.pojemnoscUzytecznaKwh !== null && kwhJednostki > 0 ? input.pojemnoscUzytecznaKwh / kwhJednostki : null)
  const jednostkaN = input.tryb === "wyjazd" ? kwh(normalnieWh) : noc ? nocN! : null
  const jednostkaO = input.tryb === "wyjazd" ? kwh(ograniczoneWh) : noc ? nocO! : null

  return {
    ...baza,
    value: {
      normalnieDobaKwh: kwh(normalnieWh),
      ograniczoneDobaKwh: kwh(ograniczoneWh),
      oszczednoscDobaKwh: kwh(normalnieWh - ograniczoneWh),
      oszczednoscPct: normalnieWh > 0 ? ((normalnieWh - ograniczoneWh) / normalnieWh) * 100 : 0,
      okresNormalnieKwh: okresN,
      okresOgraniczoneKwh: okresO,
      nocNormalnieKwh: nocN,
      nocOgraniczoneKwh: nocO,
      bateriaWystarczaNormalnie: jednostkaN === null ? null : naJednostke(jednostkaN),
      bateriaWystarczaOgraniczone: jednostkaO === null ? null : naJednostke(jednostkaO),
      zostaja: zostajace.map((o) => o.nazwa),
      wylaczone: input.odbiorniki.filter((o) => !o.zostaje).map((o) => o.nazwa),
    },
    status: ostrzezenia.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions: zalozenia,
    warnings: ostrzezenia,
  }
}
