/**
 * Narzędzie AI (9.3) dla Ekranu 1, Moduł 3 — "Kąt pochylenia i azymut". `operationType: 'read'`.
 * Jak narzędzie Ekranu 4 M1: 8760 rekordów PVGIS TMY nie przechodzi przez model — handler pobiera je
 * po stronie serwera (`pobierzTmy`, D22). Błąd PVGIS → INCOMPLETE z komunikatem, nigdy wynik zgadnięty.
 */
import { z } from "zod"
import { NadpisanieTmyPola, pobierzTmyZNadpisaniem } from "./nadpisanie-tmy"
import { calculateKatIAzymut, obliczTabeleNapromieniowania } from "@/lib/core/modules/pv/kat-i-azymut/calculator"
import { KOMUNIKAT_PVGIS } from "@/lib/lokalizacja/dane-tmy"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const KatIAzymutToolInput = z.object({
  ...NadpisanieTmyPola,
  szerokoscGeograficzna: z.number().min(-90).max(90).describe("[°], np. 52.23 dla Warszawy"),
  dlugoscGeograficzna: z.number().min(-180).max(180).describe("[°], np. 21.01 dla Warszawy"),
  azymutDeg: z.number().describe("Kierunek paneli: N=0, E=90, S=180, W=270 [°]"),
  nachylenieDeg: z.number().describe("Kąt pochylenia paneli od poziomu [°], 0–90"),
  mocInstalacjiKwp: z.number().optional().describe("Moc instalacji [kWp] — tylko jeśli user podał"),
  wspolczynnikPr: z
    .number()
    .optional()
    .describe("Współczynnik wydajności PR (0–1] — tylko jeśli user podał; nie zgaduj, bez niego wynik to nasłonecznienie, nie kWh"),
})

export type KatIAzymutToolInputT = z.infer<typeof KatIAzymutToolInput>

export const KatIAzymutToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  napromieniowanieMiesieczneKwhM2: z.array(z.number()).nullable(),
  napromieniowanieRoczneKwhM2: z.number().nullable(),
  najlepszyKatStaly: z.object({ nachylenieDeg: z.number(), napromieniowanieRoczneKwhM2: z.number() }).nullable(),
  najlepszyKatWMiesiacu: z.array(z.number()).nullable().describe("Najlepszy kąt [°] dla każdego miesiąca, od stycznia"),
  zyskRegulacjiWzgledemWybranegoPct: z.number().nullable(),
  produkcjaMiesiecznaKwh: z.array(z.number()).nullable(),
  produkcjaRocznaKwh: z.number().nullable(),
  zrodloDanych: z.string().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string().optional(),
})

export type KatIAzymutToolOutputT = z.infer<typeof KatIAzymutToolOutput>

const PUSTY = {
  napromieniowanieMiesieczneKwhM2: null,
  napromieniowanieRoczneKwhM2: null,
  najlepszyKatStaly: null,
  najlepszyKatWMiesiacu: null,
  zyskRegulacjiWzgledemWybranegoPct: null,
  produkcjaMiesiecznaKwh: null,
  produkcjaRocznaKwh: null,
}

/** Fabryka — `fetchImpl` wstrzykiwany w testach (jak `pobierzTmy`). */
export function utworzKatIAzymutTool(
  fetchImpl: typeof fetch = fetch,
): AiToolDefinition<KatIAzymutToolInputT, KatIAzymutToolOutputT> {
  return {
    name: "policz_nasloneczenie_dla_kata_i_azymutu",
    description:
      "Dla lokalizacji pobiera dane PVGIS (typowy rok) i liczy miesięczne nasłonecznienie paneli przy " +
      "podanym kącie i azymucie, najlepszy kąt stały, najlepszy kąt w każdym miesiącu (stelaż z " +
      "regulacją) i zysk z przestawiania; produkcję kWh tylko gdy user podał moc i PR. Użyj, gdy user " +
      "pyta, ile wyprodukują panele w danym miesiącu, jaki kąt ustawić albo czy opłaca się regulować kąt.",
    inputSchema: KatIAzymutToolInput,
    outputSchema: KatIAzymutToolOutput,
    operationType: "read",
    requiresConfirmation: false,
    scope: "pv/kat-i-azymut",
    handler: async (input) => {
      const tmy = await pobierzTmyZNadpisaniem(input.szerokoscGeograficzna, input.dlugoscGeograficzna, fetchImpl, input)
      if (!tmy.ok) {
        return { status: "INCOMPLETE", ...PUSTY, zrodloDanych: null, ostrzezenia: [KOMUNIKAT_PVGIS[tmy.kod]], zalozenia: [] }
      }
      const tabela = obliczTabeleNapromieniowania({
        szerokoscGeograficzna: input.szerokoscGeograficzna,
        dlugoscGeograficzna: input.dlugoscGeograficzna,
        daneGodzinowe: tmy.dane.rekordy,
        azymutDeg: input.azymutDeg,
      })
      const m = tmy.dane.meta
      const zrodloDanych = `PVGIS TMY (${m.bazaPromieniowania}, lata ${m.rokOd}–${m.rokDo})`
      if (tabela.status !== "VALID") {
        return {
          status: tabela.status,
          ...PUSTY,
          zrodloDanych,
          ostrzezenia: tekstyOstrzezen(tabela.warnings),
          zalozenia: [],
          wersjaKalkulatora: tabela.calculatorVersion,
        }
      }
      const wynik = calculateKatIAzymut({
        tabela: tabela.value,
        nachylenieDeg: input.nachylenieDeg,
        mocInstalacjiKwp: input.mocInstalacjiKwp ?? 0,
        wspolczynnikPr: input.wspolczynnikPr ?? null,
      })
      const r = wynik.value
      return {
        status: wynik.status,
        napromieniowanieMiesieczneKwhM2: r?.napromieniowanieMiesieczneKwhM2 ?? null,
        napromieniowanieRoczneKwhM2: r?.napromieniowanieRoczneKwhM2 ?? null,
        najlepszyKatStaly: r?.optimumRoczne ?? null,
        najlepszyKatWMiesiacu: r?.optimumMiesieczne.map((o) => o.nachylenieDeg) ?? null,
        zyskRegulacjiWzgledemWybranegoPct: r?.zyskRegulacjiWzgledemWybranegoPct ?? null,
        produkcjaMiesiecznaKwh: r?.produkcjaMiesiecznaKwh ?? null,
        produkcjaRocznaKwh: r?.produkcjaRocznaKwh ?? null,
        zrodloDanych,
        ostrzezenia: tekstyOstrzezen(wynik.warnings),
        zalozenia: tekstyZalozen([...tabela.assumptions, ...wynik.assumptions]),
        wersjaKalkulatora: wynik.calculatorVersion,
      }
    },
  }
}

export const katIAzymutTool = utworzKatIAzymutTool()
