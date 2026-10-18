/**
 * Narzędzie AI (9.3) dla Ekranu 4, Moduł 1 — "Orientacja powierzchni". `operationType: 'read'`.
 *
 * Kalkulator potrzebuje godzinowych danych PVGIS TMY (8760 rekordów) — te nie przechodzą przez
 * model językowy, więc handler sam pobiera je po stronie serwera (`pobierzTmy`, ten sam adapter co
 * proxy `/api/pvgis/tmy`, D22 — serwer woła PVGIS, przeglądarka nie). Model podaje tylko
 * lokalizację i powierzchnie. Błąd PVGIS → status INCOMPLETE z komunikatem, nigdy wynik zgadnięty.
 */
import { z } from "zod"
import { NadpisanieTmyPola, pobierzTmyZNadpisaniem } from "./nadpisanie-tmy"
import { calculateOrientacjaPowierzchni } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/calculator"
import { KOMUNIKAT_PVGIS } from "@/lib/lokalizacja/dane-tmy"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const OrientacjaPowierzchniToolInput = z.object({
  ...NadpisanieTmyPola,
  szerokoscGeograficzna: z.number().min(-90).max(90).describe("[°], np. 52.23 dla Warszawy"),
  dlugoscGeograficzna: z.number().min(-180).max(180).describe("[°], np. 21.01 dla Warszawy"),
  powierzchnie: z
    .array(
      z.object({
        nazwa: z.string(),
        nachylenieDeg: z.number().describe("Nachylenie od poziomu [°]: 0 — płaski dach, 90 — ściana"),
        azymutDeg: z.number().describe("Kierunek, w który patrzy powierzchnia: N=0, E=90, S=180, W=270 [°]"),
      }),
    )
    .describe("Powierzchnie do porównania (połacie dachu, ściany, grunt); może być pusta — wtedy tylko optimum"),
  albedo: z.number().optional().describe("Współczynnik odbicia gruntu [-] — tylko jeśli podał go user (brak → wartość domyślna kalkulatora)"),
})

export type OrientacjaPowierzchniToolInputT = z.infer<typeof OrientacjaPowierzchniToolInput>

export const OrientacjaPowierzchniToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  optimum: z.object({ nachylenieDeg: z.number(), azymutDeg: z.number(), napromieniowanieRoczneKwhM2: z.number() }).nullable(),
  powierzchnie: z.array(
    z.object({
      nazwa: z.string(),
      nachylenieDeg: z.number(),
      azymutDeg: z.number(),
      napromieniowanieRoczneKwhM2: z.number(),
      wskaznikProcent: z.number().describe("Napromieniowanie względem optimum dla tej lokalizacji [%]"),
    }),
  ),
  zrodloDanych: z.string().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string().optional(),
})

export type OrientacjaPowierzchniToolOutputT = z.infer<typeof OrientacjaPowierzchniToolOutput>

/** Fabryka — `fetchImpl` wstrzykiwany w testach (jak `pobierzTmy`). */
export function utworzOrientacjaPowierzchniTool(
  fetchImpl: typeof fetch = fetch,
): AiToolDefinition<OrientacjaPowierzchniToolInputT, OrientacjaPowierzchniToolOutputT> {
  return {
    name: "ocen_orientacje_powierzchni",
    description:
      "Dla lokalizacji pobiera dane nasłonecznienia PVGIS (typowy rok) i liczy roczne napromieniowanie " +
      "każdej podanej powierzchni oraz wskaźnik opłacalności względem optymalnego nachylenia i kierunku " +
      "dla tego miejsca (optimum też zwraca). Użyj, gdy user pyta, która połać/ściana jest najlepsza pod " +
      "panele, ile traci panel na wschód/zachód/ścianie względem optimum, albo jaki kąt jest optymalny.",
    inputSchema: OrientacjaPowierzchniToolInput,
    outputSchema: OrientacjaPowierzchniToolOutput,
    operationType: "read",
    requiresConfirmation: false,
    scope: "lokalizacja/orientacja-powierzchni",
    handler: async (input) => {
      const tmy = await pobierzTmyZNadpisaniem(input.szerokoscGeograficzna, input.dlugoscGeograficzna, fetchImpl, input)
      if (!tmy.ok) {
        return {
          status: "INCOMPLETE",
          optimum: null,
          powierzchnie: [],
          zrodloDanych: null,
          ostrzezenia: [KOMUNIKAT_PVGIS[tmy.kod]],
          zalozenia: [],
        }
      }
      const wynik = calculateOrientacjaPowierzchni({
        szerokoscGeograficzna: input.szerokoscGeograficzna,
        dlugoscGeograficzna: input.dlugoscGeograficzna,
        daneGodzinowe: tmy.dane.rekordy,
        albedo: input.albedo,
        powierzchnie: input.powierzchnie,
      })
      const m = tmy.dane.meta
      return {
        status: wynik.status,
        optimum: wynik.value.optimum,
        powierzchnie: wynik.value.powierzchnie,
        zrodloDanych: `PVGIS TMY (${m.bazaPromieniowania}, lata ${m.rokOd}–${m.rokDo})`,
        ostrzezenia: tekstyOstrzezen(wynik.warnings),
        zalozenia: tekstyZalozen(wynik.assumptions),
        wersjaKalkulatora: wynik.calculatorVersion,
      }
    },
  }
}

export const orientacjaPowierzchniTool = utworzOrientacjaPowierzchniTool()
