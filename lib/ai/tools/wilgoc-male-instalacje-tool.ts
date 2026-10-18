/**
 * Narzędzie AI (9.3) dla Modułu 12 "Szybki kalkulator/tryb mobilny" — Ekran 23 "Zabezpieczenia
 * przeciwwilgociowe dla małych instalacji" (dawne 8.46). `operationType: 'read'`. Miejsce, narażenie na
 * wilgoć i stopień IP obudowy MUSZĄ pochodzić od usera — model ich nie zgaduje. Punktu rosy nie liczy
 * (pełny kalkulator: M4/E10, narzędzie modułu baterii).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateWilgocMaleInstalacje } from "@/lib/core/modules/kalkulator-mobilny/wilgoc-male-instalacje/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const WilgocMaleInstalacjeToolInput = z.object({
  miejsce: z.enum(["garaz", "piwnica", "namiot", "jacht"]).describe("Gdzie stoi instalacja — od usera"),
  narazoneNaWilgoc: z.boolean().describe("Czy miejsce jest narażone na wilgoć (para, skropliny, bryzgi) — od usera; gdy nie wie, true. Dla namiotu i jachtu ignorowane (zawsze wilgoć)"),
  ipKod: z.number().describe("Stopień IP obudowy jako liczba (np. 55 dla IP55) — z tabliczki/karty, nie zgaduj"),
})
export type WilgocMaleInstalacjeToolInputT = z.infer<typeof WilgocMaleInstalacjeToolInput>

export const WilgocMaleInstalacjeToolOutput = z.object({
  status: z.enum(STATUSY),
  minimalneIp: z.number().nullable().describe("Minimalny stopień IP dla miejsca; null = miejsce suche, próg nie dotyczy"),
  ipWystarczajace: z.boolean(),
  zalecenia: z.array(z.string()).describe("Zalecane osłony (identyfikatory): obudowy IP, puszki z uszczelką, peszel, osuszacz/pochłaniacz"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type WilgocMaleInstalacjeToolOutputT = z.infer<typeof WilgocMaleInstalacjeToolOutput>

export const wilgocMaleInstalacjeTool: AiToolDefinition<WilgocMaleInstalacjeToolInputT, WilgocMaleInstalacjeToolOutputT> = {
  name: "sprawdz_ochrone_przed_wilgocia_malej_instalacji",
  description:
    "Sprawdza, czy obudowa małej instalacji (garaż, piwnica, namiot, jacht) ma wystarczający stopień IP: w miejscu " +
    "narażonym na wilgoć minimum IP55 (ten sam próg co Moduł 4, Ekran 10), zalecane IP65 (poniżej ostrzeżenie); namiot i " +
    "jacht zawsze jako wilgotne — minimum IP65 (poniżej twardy stop), zalecane IP67–IP68. Podaje listę osłon: " +
    "obudowy IP, puszki z uszczelką, przewody w peszlu, osuszacz/pochłaniacz. Nie liczy punktu rosy. Użyj, gdy user pyta o wilgoć, stopień IP albo osłony dla małego zestawu.",
  inputSchema: WilgocMaleInstalacjeToolInput,
  outputSchema: WilgocMaleInstalacjeToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/wilgoc-male-instalacje",
  handler: async (input) => {
    const wynik = calculateWilgocMaleInstalacje(input)
    return {
      status: wynik.status,
      minimalneIp: wynik.value.minimalneIp,
      ipWystarczajace: wynik.value.ipWystarczajace,
      zalecenia: wynik.value.zalecenia,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
