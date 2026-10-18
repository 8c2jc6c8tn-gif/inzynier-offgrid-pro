/**
 * Narzędzie AI (9.3) dla Ekranu 22, Moduł 7 "Stress-test zimowy" — "Ryzyko zamarznięcia", tryb
 * "Grunt / instalacje zewnętrzne" + rozmrażanie. `operationType: 'read'`. Głębokość przemarzania
 * pochodzi od usera (mapa stref / projekt) — model jej nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateRyzykoZamarzniecia } from "@/lib/core/modules/stress-test/ryzyko-zamarzniecia/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const Typ = z.enum(["kabel", "rura-wodna", "uziom", "inne"])

export const RyzykoZamarznieciaToolInput = z.object({
  glebokoscPrzemarzaniaCm: z
    .number()
    .nullable()
    .describe("Głębokość przemarzania gruntu [cm] — od usera (mapa stref / projekt); null gdy nie zna — nie zgaduj"),
  instalacje: z
    .array(
      z.object({
        nazwa: z.string(),
        typ: Typ,
        glebokoscCm: z.number().nullable().describe("Głębokość ułożenia do wierzchu elementu [cm]"),
      }),
    )
    .describe("Kable, rury wodne, uziomy w gruncie"),
  metodaRozmrazania: z.enum(["nie-dotyczy", "kabel-grzewczy", "otwarty-ogien"]).describe("Planowany sposób rozmrażania rury"),
})
export type RyzykoZamarznieciaToolInputT = z.infer<typeof RyzykoZamarznieciaToolInput>

export const RyzykoZamarznieciaToolOutput = z.object({
  status: z.enum(STATUSY),
  oceny: z.array(z.object({ nazwa: z.string(), typ: Typ, wymaganaCm: z.number(), zapasCm: z.number().nullable() })),
  liczbaWStrefie: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type RyzykoZamarznieciaToolOutputT = z.infer<typeof RyzykoZamarznieciaToolOutput>

export const ryzykoZamarznieciaTool: AiToolDefinition<RyzykoZamarznieciaToolInputT, RyzykoZamarznieciaToolOutputT> = {
  name: "sprawdz_instalacje_w_strefie_przemarzania",
  description:
    "Sprawdza, czy kable ziemne, rury wodne i uziomy leżą poniżej strefy przemarzania gruntu (rura wodna z zapasem " +
    "20 cm) oraz czy planowany sposób rozmrażania rury jest bezpieczny (Moduł 7, Ekran 22). Ułożenie płycej niż " +
    "strefa przemarzania i rozmrażanie otwartym ogniem to twarde stopy. Użyj, gdy user pyta, na jakiej głębokości ułożyć kable, rury lub uziomy albo jak bezpiecznie rozmrozić zamarzniętą rurę.",
  inputSchema: RyzykoZamarznieciaToolInput,
  outputSchema: RyzykoZamarznieciaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/ryzyko-zamarzniecia",
  handler: async (input) => {
    const wynik = calculateRyzykoZamarzniecia({
      ...input,
      instalacje: input.instalacje.map((e, i) => ({ ...e, id: String(i + 1) })),
    })
    return {
      status: wynik.status,
      oceny: wynik.value.oceny.map(({ nazwa, typ, wymaganaCm, zapasCm }) => ({ nazwa, typ, wymaganaCm, zapasCm })),
      liczbaWStrefie: wynik.value.liczbaWStrefie,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
