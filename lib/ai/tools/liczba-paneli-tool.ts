/**
 * Narzędzie AI (9.3) dla Ekranu 4, Moduł 3 — "Ile paneli potrzebujesz" (D25). `operationType: 'read'`.
 * Dane PVGIS TMY pobierane po stronie serwera (`pobierzTmy`, jak M3/E1). Błąd PVGIS → INCOMPLETE.
 */
import { z } from "zod"
import { pobierzTmy } from "@/lib/adapters/pvgis/tmy"
import { obliczTabeleNapromieniowania } from "@/lib/core/modules/pv/kat-i-azymut/calculator"
import { calculateLiczbaPaneli } from "@/lib/core/modules/pv/liczba-paneli/calculator"
import { KOMUNIKAT_PVGIS } from "@/lib/lokalizacja/dane-tmy"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const LiczbaPaneliToolInput = z.object({
  szerokoscGeograficzna: z.number().min(-90).max(90),
  dlugoscGeograficzna: z.number().min(-180).max(180),
  azymutDeg: z.number().describe("Kierunek paneli: S=180 [°]"),
  nachylenieDeg: z.number().optional().describe("Stały kąt [°]; pomiń przy stelażu regulowanym"),
  stelazRegulowany: z.boolean().describe("true = user przestawia kąt co miesiąc"),
  mocPaneluWp: z.number().describe("Moc jednego panelu [Wp]"),
  powierzchniaPaneluM2: z.number().optional(),
  wspolczynnikPr: z.number().describe("PR (0–1] — tylko jeśli user podał; nie zgaduj"),
  zapotrzebowanieDoboweKwh: z.number().describe("Zużycie [kWh/dzień]"),
  dodatkoweZimaKwhDzien: z.number().describe("Dodatkowe zużycie w sezonie grzewczym [kWh/dzień], 0 = brak"),
  miesiaceGrzewcze: z.array(z.number().int().min(0).max(11)).describe("Miesiące grzania, 0 = styczeń — tylko wg usera"),
  limitMontazowy: z.number().int().optional().describe("Ile paneli user realnie zamontuje; brak → bez rekomendacji"),
})
export type LiczbaPaneliToolInputT = z.infer<typeof LiczbaPaneliToolInput>

export const LiczbaPaneliToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  warianty: z.array(
    z.object({
      okres: z.enum(["lato", "marPaz", "lutLis", "rok"]),
      liczbaPaneli: z.number().nullable(),
      miesiacDecydujacy: z.number().nullable().describe("0 = styczeń"),
      mocKwp: z.number().nullable(),
      miesciSieWLimicie: z.boolean().nullable(),
    }),
  ),
  rekomendacja: z.enum(["lato", "marPaz", "lutLis", "rok"]).nullable(),
  deficytMiesiecznyKwh: z.array(z.number()).nullable(),
  zrodloDanych: z.string().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string().optional(),
})
export type LiczbaPaneliToolOutputT = z.infer<typeof LiczbaPaneliToolOutput>

const PUSTY = { warianty: [], rekomendacja: null, deficytMiesiecznyKwh: null }

export function utworzLiczbaPaneliTool(
  fetchImpl: typeof fetch = fetch,
): AiToolDefinition<LiczbaPaneliToolInputT, LiczbaPaneliToolOutputT> {
  return {
    name: "policz_liczbe_paneli_dla_okresow",
    description:
      "Liczy, ile paneli pokryje zużycie w okresach: lato (cze–sie), mar–paź, lut–lis, cały rok — z danych " +
      "PVGIS lokalizacji; z limitem montażowym usera wskazuje najszerszy okres w limicie i deficyt kWh w " +
      "pozostałych miesiącach (do pokrycia agregatem/kotłem/ogrzewaniem paliwowym). Użyj, gdy user pyta, " +
      "ile paneli potrzebuje, czy wystarczy na zimę albo ile energii zabraknie w grudniu.",
    inputSchema: LiczbaPaneliToolInput,
    outputSchema: LiczbaPaneliToolOutput,
    operationType: "read",
    requiresConfirmation: false,
    scope: "pv/liczba-paneli",
    handler: async (input) => {
      const tmy = await pobierzTmy(input.szerokoscGeograficzna, input.dlugoscGeograficzna, fetchImpl)
      if (!tmy.ok) {
        return { status: "INCOMPLETE", ...PUSTY, zrodloDanych: null, ostrzezenia: [KOMUNIKAT_PVGIS[tmy.kod]], zalozenia: [] }
      }
      const m = tmy.dane.meta
      const zrodloDanych = `PVGIS TMY (${m.bazaPromieniowania}, lata ${m.rokOd}–${m.rokDo})`
      const tabela = obliczTabeleNapromieniowania({
        szerokoscGeograficzna: input.szerokoscGeograficzna,
        dlugoscGeograficzna: input.dlugoscGeograficzna,
        daneGodzinowe: tmy.dane.rekordy,
        azymutDeg: input.azymutDeg,
      })
      if (tabela.status !== "VALID") {
        return { status: tabela.status, ...PUSTY, zrodloDanych, ostrzezenia: tekstyOstrzezen(tabela.warnings), zalozenia: [] }
      }
      const wynik = calculateLiczbaPaneli({
        tabela: tabela.value,
        nachylenieDeg: input.nachylenieDeg ?? null,
        stelazRegulowany: input.stelazRegulowany,
        mocPaneluWp: input.mocPaneluWp,
        powierzchniaPaneluM2: input.powierzchniaPaneluM2 ?? null,
        wspolczynnikPr: input.wspolczynnikPr,
        zapotrzebowanieDoboweKwh: input.zapotrzebowanieDoboweKwh,
        dodatkoweZimaKwhDzien: input.dodatkoweZimaKwhDzien,
        miesiaceGrzewcze: input.miesiaceGrzewcze,
        limitMontazowy: input.limitMontazowy ?? null,
      })
      const r = wynik.value
      return {
        status: wynik.status,
        warianty:
          r?.warianty.map((w) => ({
            okres: w.id,
            liczbaPaneli: w.liczbaPaneli,
            miesiacDecydujacy: w.miesiacDecydujacy,
            mocKwp: w.mocKwp,
            miesciSieWLimicie: w.miesciSieWLimicie,
          })) ?? [],
        rekomendacja: r?.rekomendacja ?? null,
        deficytMiesiecznyKwh: r?.deficytMiesiecznyKwh ?? null,
        zrodloDanych,
        ostrzezenia: tekstyOstrzezen(wynik.warnings),
        zalozenia: r ? tekstyZalozen([...tabela.assumptions, ...wynik.assumptions]) : [],
        wersjaKalkulatora: wynik.calculatorVersion,
      }
    },
  }
}

export const liczbaPaneliTool = utworzLiczbaPaneliTool()
