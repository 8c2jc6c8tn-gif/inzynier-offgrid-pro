/**
 * Narzędzie AI (9.3) dla Ekranu 20, Moduł 3 — "Orientacja wschód-zachód". `operationType: 'read'`.
 * PVGIS TMY pobierany w handlerze po stronie serwera (jak Ekran 1 M3 / Ekran 4 M1, D22).
 */
import { z } from "zod"
import { NadpisanieTmyPola, pobierzTmyZNadpisaniem } from "./nadpisanie-tmy"
import { calculateWschodZachod, obliczDaneWschodZachod } from "@/lib/core/modules/pv/wschod-zachod/calculator"
import { KOMUNIKAT_PVGIS } from "@/lib/lokalizacja/dane-tmy"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const Polac = z.object({
  nachylenieDeg: z.number().describe("Nachylenie połaci [°], 0–90"),
  azymutDeg: z.number().describe("Azymut połaci [°]: wschód ≈ 90, zachód ≈ 270"),
})

export const WschodZachodToolInput = z.object({
  ...NadpisanieTmyPola,
  szerokoscGeograficzna: z.number().min(-90).max(90).describe("[°]"),
  dlugoscGeograficzna: z.number().min(-180).max(180).describe("[°]"),
  wschod: Polac,
  zachod: Polac,
  udzialWschodPct: z.number().describe("Udział mocy paneli na połaci wschodniej [%], 0–100 — dopytaj usera, nie zakładaj 50"),
})

export type WschodZachodToolInputT = z.infer<typeof WschodZachodToolInput>

export const WschodZachodToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  stosunekDoPoludniaPct: z.number().nullable().describe("Roczna energia wschód-zachód względem południa pod najlepszym kątem [%]"),
  stosunekMiesiecznyPct: z.array(z.number()).nullable(),
  udzialEnergiiPrzedPoludniemPct: z.number().nullable(),
  udzialEnergiiPrzedPoludniemPoludniePct: z.number().nullable(),
  katOdniesieniaPoludnieDeg: z.number().nullable(),
  zrodloDanych: z.string().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string().optional(),
})

export type WschodZachodToolOutputT = z.infer<typeof WschodZachodToolOutput>

const PUSTY = {
  stosunekDoPoludniaPct: null,
  stosunekMiesiecznyPct: null,
  udzialEnergiiPrzedPoludniemPct: null,
  udzialEnergiiPrzedPoludniemPoludniePct: null,
  katOdniesieniaPoludnieDeg: null,
}

/** Fabryka — `fetchImpl` wstrzykiwany w testach (jak `pobierzTmy`). */
export function utworzWschodZachodTool(
  fetchImpl: typeof fetch = fetch,
): AiToolDefinition<WschodZachodToolInputT, WschodZachodToolOutputT> {
  return {
    name: "porownaj_wschod_zachod_z_poludniem",
    description:
      "Dla lokalizacji (dane PVGIS) porównuje panele na połaciach wschodniej i zachodniej z panelami na " +
      "południe pod najlepszym kątem: ile % energii rocznie i w każdym miesiącu, oraz jaka część energii " +
      "powstaje przed południem. Użyj, gdy user ma dach wschód-zachód albo pyta, czy taki układ się opłaca.",
    inputSchema: WschodZachodToolInput,
    outputSchema: WschodZachodToolOutput,
    operationType: "read",
    requiresConfirmation: false,
    scope: "pv/wschod-zachod",
    handler: async (input) => {
      const tmy = await pobierzTmyZNadpisaniem(input.szerokoscGeograficzna, input.dlugoscGeograficzna, fetchImpl, input)
      if (!tmy.ok) return { status: "INCOMPLETE", ...PUSTY, zrodloDanych: null, ostrzezenia: [KOMUNIKAT_PVGIS[tmy.kod]], zalozenia: [] }
      const m = tmy.dane.meta
      const zrodloDanych = `PVGIS TMY (${m.bazaPromieniowania}, lata ${m.rokOd}–${m.rokDo})`
      const ciezki = obliczDaneWschodZachod({
        szerokoscGeograficzna: input.szerokoscGeograficzna,
        dlugoscGeograficzna: input.dlugoscGeograficzna,
        daneGodzinowe: tmy.dane.rekordy,
        wschod: input.wschod,
        zachod: input.zachod,
      })
      if (ciezki.status !== "VALID") {
        return { status: ciezki.status, ...PUSTY, zrodloDanych, ostrzezenia: tekstyOstrzezen(ciezki.warnings), zalozenia: [], wersjaKalkulatora: ciezki.calculatorVersion }
      }
      const wynik = calculateWschodZachod({ dane: ciezki.value, udzialWschodPct: input.udzialWschodPct })
      const v = wynik.value
      return {
        status: wynik.status,
        stosunekDoPoludniaPct: v?.stosunekRocznyPct ?? null,
        stosunekMiesiecznyPct: v?.stosunekMiesiecznyPct ?? null,
        udzialEnergiiPrzedPoludniemPct: v?.udzialRanoWzPct ?? null,
        udzialEnergiiPrzedPoludniemPoludniePct: v?.udzialRanoPoludniePct ?? null,
        katOdniesieniaPoludnieDeg: v?.nachylenieOdniesieniaDeg ?? null,
        zrodloDanych,
        ostrzezenia: tekstyOstrzezen(wynik.warnings),
        zalozenia: tekstyZalozen([...ciezki.assumptions, ...wynik.assumptions]),
        wersjaKalkulatora: wynik.calculatorVersion,
      }
    },
  }
}

export const wschodZachodTool = utworzWschodZachodTool()
