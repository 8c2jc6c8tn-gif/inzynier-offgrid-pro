/**
 * Narzędzie AI (9.3) dla Moduł 9 "ESP32/DIY", Katalog 1 — "Czujniki". `operationType: 'read'`.
 * Lista instancji czujników (typ, etykieta, lokalizacja) MUSI pochodzić od usera — to podsumowanie
 * stanu katalogu, nie obliczenie fizyczne (Wzorzec H, brak wzoru/wyniku fizycznego).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateKatalogCzujnikow } from "@/lib/core/modules/esp32/katalog-czujnikow/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const KatalogCzujnikowToolInput = z.object({
  instances: z
    .array(
      z.object({
        id: z.string(),
        typeId: z.string().describe("ID typu czujnika z katalogu (SENSOR_TYPES)"),
        etykieta: z.string().describe("Etykieta nadana przez usera"),
        lokalizacja: z.string().describe("Lokalizacja montażu czujnika — od usera"),
      }),
    )
    .describe("Instancje czujników dodane przez usera do katalogu — nie zgaduj, ile i jakich user dodał"),
})
export type KatalogCzujnikowToolInputT = z.infer<typeof KatalogCzujnikowToolInput>

export const KatalogCzujnikowToolOutput = z.object({
  status: z.enum(STATUSY),
  liczbaInstancji: z.number().describe("Liczba dodanych instancji czujników"),
  liczbaTypowUzytych: z.number().describe("Liczba różnych typów czujników użytych w katalogu"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type KatalogCzujnikowToolOutputT = z.infer<typeof KatalogCzujnikowToolOutput>

export const katalogCzujnikowTool: AiToolDefinition<KatalogCzujnikowToolInputT, KatalogCzujnikowToolOutputT> = {
  name: "podsumuj_katalog_czujnikow_esp32",
  description:
    "Podsumowuje stan katalogu czujników ESP32/DIY (Moduł 9) — ile instancji czujników user dodał i ile " +
    "różnych typów jest w użyciu. Brak instancji → INCOMPLETE. Użyj, gdy user pyta o podsumowanie swojego " +
    "katalogu czujników albo ile czujników/typów ma skonfigurowanych.",
  inputSchema: KatalogCzujnikowToolInput,
  outputSchema: KatalogCzujnikowToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "esp32/katalog-czujnikow",
  handler: async (input) => {
    const wynik = calculateKatalogCzujnikow(input)
    return {
      status: wynik.status,
      liczbaInstancji: wynik.value.liczbaInstancji,
      liczbaTypowUzytych: wynik.value.liczbaTypowUzytych,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
