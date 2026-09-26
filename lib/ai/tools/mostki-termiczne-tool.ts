/**
 * Narzędzie AI (9.3) dla Modułu 6, Ekran 7 "Mostki termiczne" (dawne 5.7). `operationType: 'read'`.
 * Ψ i długości tylko od usera (katalog mostków, projektant) — brak → INCOMPLETE, nigdy Ψ zgadnięte
 * przez model (PN-EN ISO 14683 poza aplikacją).
 */
import { z } from "zod"
import { calculateMostkiTermiczne } from "@/lib/core/modules/ogrzewanie/mostki-termiczne/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const Mostek = z.object({
  nazwa: z.string(),
  dlugoscM: z.number().describe("Długość mostka liniowego [m]"),
  psiWmK: z.number().describe("Współczynnik Ψ [W/(m·K)] — tylko jeśli user podał"),
  psiPoPoprawieWmK: z.number().optional().describe("Ψ po planowanej poprawie — tylko od usera"),
  nadprozeBezIzolacji: z.boolean().optional().describe("true = nadproże okienne bez izolacji"),
})

export const MostkiTermiczneToolInput = z.object({
  mostki: z.array(Mostek).min(1),
  temperaturaWewnetrznaC: z.number(),
  temperaturaZewnetrznaC: z.number().describe("Temperatura obliczeniowa na zewnątrz (strefa klimatyczna) [°C]"),
  obciazenieBezMostkowW: z.number().optional().describe("Straty z policz_straty_ciepla_budynku [W]; brak → bez udziału %"),
})
export type MostkiTermiczneToolInputT = z.infer<typeof MostkiTermiczneToolInput>

export const MostkiTermiczneToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  hMostkowWK: z.number().nullable(),
  strataMostkowW: z.number().nullable(),
  udzialMostkowPct: z.number().nullable(),
  obciazenieZMostkamiW: z.number().nullable(),
  strataMostkowPoPoprawieW: z.number().nullable(),
  mostki: z.array(z.object({ nazwa: z.string(), strataW: z.number() })),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type MostkiTermiczneToolOutputT = z.infer<typeof MostkiTermiczneToolOutput>

export const mostkiTermiczneTool: AiToolDefinition<MostkiTermiczneToolInputT, MostkiTermiczneToolOutputT> = {
  name: "policz_mostki_termiczne",
  description:
    "Straty ciepła przez liniowe mostki termiczne: H = Σ Ψ·l, strata = H·(θi − θe), udział w całości strat budynku " +
    "(z policz_straty_ciepla_budynku), opcjonalnie efekt poprawy (nowe Ψ). Ψ i długości podaje user — nie zgaduj Ψ " +
    "(tablic PN-EN ISO 14683 nie ma w aplikacji). Użyj, gdy user pyta o mostki cieplne, nadproża, balkony, ościeża.",
  inputSchema: MostkiTermiczneToolInput,
  outputSchema: MostkiTermiczneToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/mostki-termiczne",
  handler: async (input) => {
    const wynik = calculateMostkiTermiczne({
      mostki: input.mostki.map((m) => ({
        nazwa: m.nazwa,
        dlugoscM: m.dlugoscM,
        psiWmK: m.psiWmK,
        psiPoPoprawieWmK: m.psiPoPoprawieWmK ?? null,
        nadprozeBezIzolacji: m.nadprozeBezIzolacji ?? false,
      })),
      temperaturaWewnetrznaC: input.temperaturaWewnetrznaC,
      temperaturaZewnetrznaC: input.temperaturaZewnetrznaC,
      obciazenieBezMostkowW: input.obciazenieBezMostkowW ?? null,
    })
    const v = wynik.value
    return {
      status: wynik.status,
      hMostkowWK: v?.hMostkowWK ?? null,
      strataMostkowW: v?.strataMostkowW ?? null,
      udzialMostkowPct: v?.udzialMostkowPct ?? null,
      obciazenieZMostkamiW: v?.obciazenieZMostkamiW ?? null,
      strataMostkowPoPoprawieW: v?.strataMostkowPoPoprawieW ?? null,
      mostki: (v?.mostki ?? []).map((m) => ({ nazwa: m.nazwa, strataW: m.strataW })),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
