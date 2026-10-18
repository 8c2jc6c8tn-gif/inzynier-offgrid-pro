/**
 * Narzędzie AI (9.3) dla Ekranu 28, Moduł 5 — "Dobór izolacji kabla do warunków montażu".
 * `operationType: 'read'`. Wybrana izolacja i maksymalna spodziewana temperatura w miejscu trasy
 * MUSZĄ pochodzić od użytkownika (rzeczywisty pomiar/oszacowanie miejsca montażu) — model nigdy
 * ich nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateDoborIzolacjiKabla } from "@/lib/core/modules/okablowanie/dobor-izolacji-kabla/calculator"
import type { Izolacja, MiejsceTrasy } from "@/lib/core/modules/okablowanie/dobor-izolacji-kabla/input"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen } from "./teksty-wyniku"

const MIEJSCA_TRASY = ["ziemia", "zewnetrznie-blisko-paneli", "wewnatrz", "napowietrznie"] as [MiejsceTrasy, ...MiejsceTrasy[]]
const IZOLACJE = ["PVC", "XLPE"] as [Izolacja, ...Izolacja[]]

export const DoborIzolacjiKablaToolInput = z.object({
  miejsceTrasy: z
    .enum(MIEJSCA_TRASY)
    .nullable()
    .describe("Miejsce prowadzenia trasy kabla — informacyjna podpowiedź, nie decyduje o werdykcie"),
  izolacjaWybrana: z.enum(IZOLACJE).nullable().describe("Izolacja rozważanego kabla. null = jeszcze nie wybrano"),
  temperaturaMaksymalnaC: z
    .number()
    .describe("Maksymalna spodziewana temperatura w miejscu trasy [°C], z pomiaru/oszacowania. 0 = jeszcze nie podano"),
})

export type DoborIzolacjiKablaToolInputT = z.infer<typeof DoborIzolacjiKablaToolInput>

export const DoborIzolacjiKablaToolOutput = z.object({
  maksTemperaturaIzolacjiC: z.number(),
  status: z.enum(STATUSY),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type DoborIzolacjiKablaToolOutputT = z.infer<typeof DoborIzolacjiKablaToolOutput>

export const doborIzolacjiKablaTool: AiToolDefinition<DoborIzolacjiKablaToolInputT, DoborIzolacjiKablaToolOutputT> = {
  name: "policz_dobor_izolacji_kabla",
  description:
    "Sprawdza, czy izolacja kabla (PVC max 70°C, XLPE max 90°C) wytrzyma maksymalną spodziewaną " +
    "temperaturę w miejscu trasy — twardy stop dla kabla PVC w miejscu spodziewanej temperatury >70°C " +
    "(np. tuż pod panelami). Użyj, gdy user pyta o wybór izolacji kabla PVC vs XLPE albo o odporność " +
    "termiczną kabla w danym miejscu montażu.",
  inputSchema: DoborIzolacjiKablaToolInput,
  outputSchema: DoborIzolacjiKablaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/dobor-izolacji-kabla",
  handler: async (input) => {
    const wynik = calculateDoborIzolacjiKabla(input)
    return {
      maksTemperaturaIzolacjiC: wynik.value.maksTemperaturaIzolacjiC,
      status: wynik.status,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
