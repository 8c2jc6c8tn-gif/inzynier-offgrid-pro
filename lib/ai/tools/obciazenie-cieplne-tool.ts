/**
 * Narzędzie AI (9.3) dla Modułu 6, Ekran 1 "Charakterystyka termiczna budynku" (dawne 5.1).
 * `operationType: 'read'`. Współczynniki U, powierzchnie, temperatury, kubatura i wymiany powietrza
 * tylko od usera — brak → INCOMPLETE, nigdy wartość zgadnięta przez model.
 */
import { z } from "zod"
import { calculateObciazenieCieplne } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/calculator"
import type { StrefaKlimatyczna } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/constants"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const Przegroda = z.object({
  nazwa: z.string(),
  powierzchniaM2: z.number().describe("Powierzchnia przegrody [m²]"),
  uWM2K: z.number().describe("Współczynnik U [W/(m²·K)] — tylko jeśli user podał"),
  temperaturaPoDrugiejStronieC: z
    .number()
    .optional()
    .describe("Tylko dla gruntu/nieogrzewanego pomieszczenia — temperatura od usera; brak → powietrze zewnętrzne"),
})

export const ObciazenieCieplneToolInput = z.object({
  przegrody: z.array(Przegroda).min(1),
  temperaturaWewnetrznaC: z.number(),
  strefaKlimatyczna: z.number().int().min(1).max(5).describe("Strefa klimatyczna Polski I–V (1–5)"),
  kubaturaM3: z.number().describe("Kubatura ogrzewana [m³]"),
  wymianyPowietrzaNaH: z.number().describe("Wymiany powietrza na godzinę [1/h] — od usera"),
  cop: z.number().optional().describe("COP źródła ciepła (grzałka = 1); brak → bez energii elektrycznej"),
  srednieTemperaturyMiesieczneC: z.array(z.number().nullable()).length(12).optional().describe("Średnie temperatury miesięcy, od stycznia"),
})
export type ObciazenieCieplneToolInputT = z.infer<typeof ObciazenieCieplneToolInput>

export const ObciazenieCieplneToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  temperaturaZewnetrznaC: z.number().nullable(),
  obciazenieW: z.number().nullable(),
  strataPrzenikanieW: z.number().nullable(),
  strataWentylacjaW: z.number().nullable(),
  cieploDobaObliczeniowaKwh: z.number().nullable(),
  energiaElektrycznaDobaKwh: z.number().nullable(),
  przegrody: z.array(z.object({ nazwa: z.string(), strataW: z.number(), udzialPct: z.number() })),
  miesiace: z.array(z.object({ miesiac: z.number(), cieploKwh: z.number(), energiaElektrycznaKwh: z.number().nullable() })),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ObciazenieCieplneToolOutputT = z.infer<typeof ObciazenieCieplneToolOutput>

export const obciazenieCieplneTool: AiToolDefinition<ObciazenieCieplneToolInputT, ObciazenieCieplneToolOutputT> = {
  name: "policz_straty_ciepla_budynku",
  description:
    "Straty ciepła budynku (moc W przy temperaturze obliczeniowej strefy klimatycznej I–V): przez przegrody Σ U·A·ΔT i " +
    "przez wymianę powietrza, ciepło na najzimniejszą dobę, prąd przy danym COP, opcjonalnie ciepło w miesiącach ze " +
    "średnich temperatur. U, powierzchnie, kubaturę i wymiany powietrza podaje user — nie zgaduj. Bez mostków cieplnych " +
    "i zysków z pełnej PN-EN 12831-1 — zawsze to przekaż. Użyj, gdy user pyta, ile ciepła traci dom albo jaka moc grzania.",
  inputSchema: ObciazenieCieplneToolInput,
  outputSchema: ObciazenieCieplneToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/obciazenie-cieplne",
  handler: async (input) => {
    const wynik = calculateObciazenieCieplne({
      przegrody: input.przegrody.map((p) => ({
        nazwa: p.nazwa,
        powierzchniaM2: p.powierzchniaM2,
        uWM2K: p.uWM2K,
        zewnetrzna: p.temperaturaPoDrugiejStronieC === undefined,
        temperaturaPoDrugiejStronieC: p.temperaturaPoDrugiejStronieC ?? null,
      })),
      temperaturaWewnetrznaC: input.temperaturaWewnetrznaC,
      strefaKlimatyczna: input.strefaKlimatyczna as StrefaKlimatyczna,
      kubaturaM3: input.kubaturaM3,
      wymianyPowietrzaNaH: input.wymianyPowietrzaNaH,
      cop: input.cop ?? null,
      srednieTemperaturyMiesieczneC: input.srednieTemperaturyMiesieczneC ?? Array(12).fill(null),
    })
    const v = wynik.value
    return {
      status: wynik.status,
      temperaturaZewnetrznaC: v?.temperaturaZewnetrznaC ?? null,
      obciazenieW: v?.obciazenieW ?? null,
      strataPrzenikanieW: v?.strataPrzenikanieW ?? null,
      strataWentylacjaW: v?.strataWentylacjaW ?? null,
      cieploDobaObliczeniowaKwh: v?.cieploDobaObliczeniowaKwh ?? null,
      energiaElektrycznaDobaKwh: v?.energiaElektrycznaDobaKwh ?? null,
      przegrody: (v?.przegrody ?? []).map((p) => ({ nazwa: p.nazwa, strataW: p.strataW, udzialPct: p.udzialPct })),
      miesiace: (v?.miesiace ?? []).map((m) => ({ miesiac: m.miesiac, cieploKwh: m.cieploKwh, energiaElektrycznaKwh: m.energiaElektrycznaKwh })),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
