/**
 * Narzędzie AI (9.3) dla M14 — F7 „Magazyn (BESS) — strumienie korzyści” (echo M4/E23).
 * `operationType: 'read'`. Echo silnika `siec/strumienie-bess` (🔎 TD23): kWh i zysk na kWh każdego
 * strumienia podaje user, stawka mocowa ✅ z pliku danych, usługi systemowe tylko informacyjnie.
 * Cen magazynów nie ma w kodzie — model ich nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateStrumienieBess } from "@/lib/core/modules/siec/strumienie-bess/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const StrumienieBessToolInput = z.object({
  dataRozliczenia: z.string().describe("Data rozliczenia RRRR-MM-DD (wybiera stawkę opłaty mocowej)"),
  grupa: z.enum(["C1x", "C2x"]).describe("Grupa taryfowa firmy: C1x (≤ 40 kW) albo C2x (> 40 kW)"),
  kosztCykluZlKwh: z
    .number()
    .nullable()
    .describe("Koszt 1 kWh przepuszczonej przez magazyn [zł/kWh] = cena / (pojemność × cykle × η), z M4/E23 z ceną usera; null gdy nieznany"),
  cenaMagazynuZl: z.number().nullable().describe("Cena magazynu [zł] od usera — tylko do prostego zwrotu; null gdy nieznana"),
  autokonsumpcjaKwhRok: z.number().describe("Nadwyżka PV zmagazynowana i zużyta później [kWh/rok]; 0 gdy nie dotyczy"),
  autokonsumpcjaZyskZlKwh: z
    .number()
    .nullable()
    .describe("Zysk na kWh autokonsumpcji = cena zakupu − wartość oddania (bez opłaty mocowej) [zł/kWh] — od usera; null gdy nie podano"),
  arbitrazKwhRok: z.number().describe("Energia z sieci ładowana tanio i zużyta w szczycie [kWh/rok]; 0 gdy nie dotyczy"),
  arbitrazZyskZlKwh: z.number().nullable().describe("Różnica cen arbitrażu [zł/kWh] — od usera; null gdy nie podano"),
  mocowaKwhRok: z
    .number()
    .describe("Ta część rozładowań, która przypada na dni robocze 7:00–22:00 [kWh/rok] (podzbiór dwóch powyższych)"),
  mocUmownaZlRok: z
    .number()
    .nullable()
    .describe("Oszczędność na mocy umownej/przekroczeniach [zł/rok] — z narzędzia dobierz_moc_umowna; null = nie liczona"),
})
export type StrumienieBessToolInputT = z.infer<typeof StrumienieBessToolInput>

export const StrumienieBessToolOutput = z.object({
  status: z.enum(STATUSY),
  strumienie: z.array(z.object({ id: z.string(), korzyscRokZl: z.number() })),
  korzyscRokZl: z.number().nullable(),
  kosztZuzyciaRokZl: z.number().nullable(),
  bilansRokZl: z.number().nullable(),
  prostyZwrotLat: z.number().nullable(),
  stawkaMocowaZlKwh: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type StrumienieBessToolOutputT = z.infer<typeof StrumienieBessToolOutput>

export const strumienieBessTool: AiToolDefinition<StrumienieBessToolInputT, StrumienieBessToolOutputT> = {
  name: "policz_strumienie_korzysci_bess",
  description:
    "Sumuje roczne korzyści magazynu energii w firmie (M14, F7) ze strumieni: autokonsumpcja PV, arbitraż cenowy, " +
    "opłata mocowa (stawka z danych 2026) i moc umowna, odejmuje koszt zużycia magazynu i podaje bilans oraz prosty " +
    "zwrot. Usługi systemowe są tylko informacją (bez agregatora praktycznie niedostępne). kWh, zyski na kWh i cenę " +
    "magazynu podaje user — nie zgaduj cen magazynów. Użyj, gdy firma pyta, czy magazyn się opłaci, z czego wynika " +
    "jego zysk albo po ilu latach się zwróci.",
  inputSchema: StrumienieBessToolInput,
  outputSchema: StrumienieBessToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "siec/strumienie-bess",
  handler: async (input) => {
    const wynik = calculateStrumienieBess(input)
    const v = wynik.value
    return {
      status: wynik.status,
      strumienie: v?.strumienie ?? [],
      korzyscRokZl: v?.korzyscRokZl ?? null,
      kosztZuzyciaRokZl: v?.kosztZuzyciaRokZl ?? null,
      bilansRokZl: v?.bilansRokZl ?? null,
      prostyZwrotLat: v?.prostyZwrotLat ?? null,
      stawkaMocowaZlKwh: v?.stawkaMocowaZlKwh ?? null,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
