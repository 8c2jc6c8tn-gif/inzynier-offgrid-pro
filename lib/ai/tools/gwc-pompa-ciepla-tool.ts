/**
 * Narzędzie AI (9.3) dla Modułu 6, Część 2B — GWC jako wsparcie dolnego źródła pompy ciepła (dawne 5.54), dokładka
 * do Ekranu 4. `operationType: 'read'`. Przyrost w GWC — pomiar/producent; strumień parownika i COP — karta pompy.
 */
import { z } from "zod"
import { calculateGwcPompaCiepla } from "@/lib/core/modules/ogrzewanie/gwc-pompa-ciepla/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const GwcPompaCieplaToolInput = z.object({
  strumienGwcM3H: z.number().describe("Strumień powietrza przez GWC [m³/h]"),
  przyrostGwcK: z.number().describe("Zimowy przyrost temperatury powietrza w GWC [K] (pomiar / producent)"),
  strumienParownikaM3H: z.number().describe("Strumień powietrza przez parownik pompy ciepła [m³/h] (karta)"),
  mocPompyKw: z.number().describe("Moc grzewcza pompy ciepła [kW] (karta, zima)"),
  copBezGwc: z.number().describe("COP pompy przy obecnej temperaturze powietrza (karta)"),
  copZGwc: z.number().describe("COP pompy przy temperaturze podniesionej przez GWC (karta); 0 = nie podano"),
  cieploKwh: z.number().describe("Ciepło z pompy w okresie pracy GWC [kWh]; 0 = bez oszczędności prądu"),
})
export type GwcPompaCieplaToolInputT = z.infer<typeof GwcPompaCieplaToolInput>

export const GwcPompaCieplaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  wzrostTempParownikaK: z.number(),
  mocGwcKw: z.number(),
  mocDolnegoZrodlaKw: z.number(),
  udzialGwcPct: z.number(),
  wzrostCopPct: z.number().nullable(),
  oszczednoscKwh: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type GwcPompaCieplaToolOutputT = z.infer<typeof GwcPompaCieplaToolOutput>

export const gwcPompaCieplaTool: AiToolDefinition<GwcPompaCieplaToolInputT, GwcPompaCieplaToolOutputT> = {
  name: "ocen_gwc_jako_wsparcie_pompy_ciepla",
  description:
    "GWC przed parownikiem pompy ciepła powietrze-woda: o ile podniesie temperaturę powietrza na wlocie (mieszanie " +
    "strumieni), jaką część dolnego źródła P(1 − 1/COP) pokryje, wzrost COP z karty i oszczędność prądu. Użyj, gdy " +
    "user pyta, czy GWC pomoże pompie ciepła, o ile wzrośnie COP z GWC albo czy GWC może być dolnym źródłem.",
  inputSchema: GwcPompaCieplaToolInput,
  outputSchema: GwcPompaCieplaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/gwc-pompa-ciepla",
  handler: async (input) => {
    const wynik = calculateGwcPompaCiepla(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
