/**
 * Narzędzie AI (9.3) dla Modułu 6, Ekran 7 "Mostki termiczne" (dawne 5.7). `operationType: 'read'`.
 * Długości i Ψ tylko od usera (katalog mostków, projektant) albo kod detalu PN-EN ISO 14683 Tablica A.2, który
 * user wskazał/potwierdził (od 27.09.2026) — brak → INCOMPLETE, nigdy Ψ ani kod zgadnięte przez model.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateMostkiTermiczne } from "@/lib/core/modules/ogrzewanie/mostki-termiczne/calculator"
import { KATALOG_PSI_14683 } from "@/lib/core/modules/ogrzewanie/mostki-termiczne/katalog-psi"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const KODY = z.enum(KATALOG_PSI_14683.map((x) => x.kod) as [string, ...string[]])

const Mostek = z.object({
  nazwa: z.string(),
  dlugoscM: z.number().describe("Długość mostka liniowego [m]"),
  psiWmK: z.number().optional().describe("Współczynnik Ψ [W/(m·K)] — tylko jeśli user podał"),
  psiPoPoprawieWmK: z.number().optional().describe("Ψ po planowanej poprawie — tylko od usera"),
  kodKatalogu: KODY.optional().describe("Kod detalu PN-EN ISO 14683 Tablica A.2 (np. W8) — tylko gdy user go wskazał lub potwierdził"),
  kodKataloguPoPoprawie: KODY.optional().describe("Kod detalu po poprawie (np. W11) — tylko od usera"),
  nadprozeBezIzolacji: z.boolean().optional().describe("true = nadproże okienne bez izolacji"),
})

export const MostkiTermiczneToolInput = z.object({
  mostki: z.array(Mostek).min(1),
  temperaturaWewnetrznaC: z.number(),
  temperaturaZewnetrznaC: z.number().describe("Temperatura obliczeniowa na zewnątrz (strefa klimatyczna) [°C]"),
  systemWymiarow: z
    .enum(["e", "oi", "i"])
    .optional()
    .describe("System wymiarów powierzchni z Ekranu 1 (zewn./całk. wewn./wewn.) — wymagany przy kodach z tablicy, tylko od usera"),
  obciazenieBezMostkowW: z.number().optional().describe("Straty z policz_straty_ciepla_budynku [W]; brak → bez udziału %"),
})
export type MostkiTermiczneToolInputT = z.infer<typeof MostkiTermiczneToolInput>

export const MostkiTermiczneToolOutput = z.object({
  status: z.enum(STATUSY),
  hMostkowWK: z.number().nullable(),
  strataMostkowW: z.number().nullable(),
  udzialMostkowPct: z.number().nullable(),
  obciazenieZMostkamiW: z.number().nullable(),
  strataMostkowPoPoprawieW: z.number().nullable(),
  mostki: z.array(z.object({ nazwa: z.string(), psiWmK: z.number(), kodKatalogu: z.string().nullable(), strataW: z.number() })),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type MostkiTermiczneToolOutputT = z.infer<typeof MostkiTermiczneToolOutput>

export const mostkiTermiczneTool: AiToolDefinition<MostkiTermiczneToolInputT, MostkiTermiczneToolOutputT> = {
  name: "policz_mostki_termiczne",
  description:
    "Straty ciepła przez liniowe mostki termiczne: H = Σ Ψ·l, strata = H·(θi − θe), udział w całości strat budynku " +
    "(z policz_straty_ciepla_budynku), opcjonalnie efekt poprawy (nowe Ψ). Długości i Ψ podaje user — albo kod detalu " +
    "z tablicy wartości orientacyjnych PN-EN ISO 14683 (A.2, zawyżają stratę) wskazany przez usera, z systemem wymiarów. " +
    "Nie zgaduj Ψ ani kodu. Użyj, gdy user pyta o mostki cieplne, nadproża, balkony, ościeża.",
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
        psiWmK: m.psiWmK ?? null,
        psiPoPoprawieWmK: m.psiPoPoprawieWmK ?? null,
        nadprozeBezIzolacji: m.nadprozeBezIzolacji ?? false,
        kodKatalogu: m.kodKatalogu ?? null,
        kodKataloguPoPoprawie: m.kodKataloguPoPoprawie ?? null,
      })),
      systemWymiarow: input.systemWymiarow ?? null,
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
      mostki: (v?.mostki ?? []).map((m) => ({ nazwa: m.nazwa, psiWmK: m.psiWmK, kodKatalogu: m.kodKatalogu, strataW: m.strataW })),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
