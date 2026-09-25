/**
 * Narzędzie AI (9.3) dla Ekranu 25, Moduł 3 — "Warunki nadmorskie i pyliste". `operationType: 'read'`.
 */
import { z } from "zod"
import { calculateWarunkiNadmorskiePyliste } from "@/lib/core/modules/pv/warunki-nadmorskie-pyliste/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen } from "./teksty-wyniku"

export const WarunkiNadmorskiePylisteToolInput = z.object({
  typLokalizacji: z
    .enum(["nadmorska", "pylista", "standardowa"])
    .describe("Typ lokalizacji instalacji PV: nadmorska (mgła solna), pylista (piasek/pył) albo standardowa"),
  wilgotnoscWysoka: z.boolean().describe("Czy w miejscu montażu panuje wysoka wilgotność"),
  certyfikatIec61701: z.boolean().describe("Czy panel ma certyfikat IEC 61701 (odporność na mgłę solną); false, jeśli nieznane"),
  ramaAnodowana: z.boolean().describe("Czy panel ma ramę anodowaną; false, jeśli nieznane"),
  zlaczkiMorskie: z.boolean().describe("Czy złączki MC4 są przeznaczone do warunków morskich; false, jeśli nieznane"),
  certyfikatAntyPid: z.boolean().describe("Czy panel ma certyfikat anty-PID; false, jeśli nieznane"),
})

export type WarunkiNadmorskiePylisteToolInputT = z.infer<typeof WarunkiNadmorskiePylisteToolInput>

export const WarunkiNadmorskiePylisteToolOutput = z.object({
  niespelnioneReguly: z.number(),
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type WarunkiNadmorskiePylisteToolOutputT = z.infer<typeof WarunkiNadmorskiePylisteToolOutput>

export const warunkiNadmorskiePylisteTool: AiToolDefinition<
  WarunkiNadmorskiePylisteToolInputT,
  WarunkiNadmorskiePylisteToolOutputT
> = {
  name: "ocen_panele_dla_warunkow_nadmorskich_pylistych",
  description:
    "Sprawdza, czy panele PV są przystosowane do lokalizacji nadmorskiej (IEC 61701, rama anodowana, " +
    "złączki morskie, anty-PID), pylistej (rysowanie szkła) albo wilgotnej (ryzyko PID). Użyj, gdy user " +
    "montuje instalację nad morzem, na terenie pylistym/piaszczystym albo pyta o korozję paneli.",
  inputSchema: WarunkiNadmorskiePylisteToolInput,
  outputSchema: WarunkiNadmorskiePylisteToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "pv/warunki-nadmorskie-pyliste",
  handler: async (input) => {
    const wynik = calculateWarunkiNadmorskiePyliste(input)
    return {
      niespelnioneReguly: wynik.value.niespelnioneReguly,
      status: wynik.status,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
