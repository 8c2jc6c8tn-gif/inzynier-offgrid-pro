/**
 * Narzędzie AI (9.3) dla Ekranu 12, Moduł 5 — "Analiza zwarciowa". `operationType: 'read'`.
 * Napięcie/rezystancja wewnętrzna baterii, Isc panelu, liczba stringów równoległych i AIC
 * zabezpieczenia MUSZĄ pochodzić od użytkownika (karta katalogowa baterii/panelu, dobrane
 * zabezpieczenie) — model nigdy ich nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateAnalizaZwarciowa } from "@/lib/core/modules/okablowanie/analiza-zwarciowa/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const AnalizaZwarciowaToolInput = z.object({
  napiecieBateriiV: z.number().describe("Napięcie baterii [V], z karty katalogowej/pomiaru. 0 = jeszcze nie podano"),
  rezystancjaWewnetrznaBateriiOhm: z
    .number()
    .describe("Rezystancja wewnętrzna baterii [Ω], z karty katalogowej producenta. 0 = jeszcze nie podano"),
  iscPanelaA: z.number().describe("Prąd zwarciowy panelu (Isc) [A], z karty katalogowej panelu. 0 = jeszcze nie podano"),
  liczbaStringowRownoleglych: z.number().describe("Liczba stringów PV połączonych równolegle. 0 = jeszcze nie podano"),
  aicZabezpieczeniaA: z
    .number()
    .describe("Zdolność wyłączania (AIC) sprawdzanego zabezpieczenia [A], z karty katalogowej. 0 = nie sprawdzane"),
})

export type AnalizaZwarciowaToolInputT = z.infer<typeof AnalizaZwarciowaToolInput>

export const AnalizaZwarciowaToolOutput = z.object({
  pradZwarciowyBateriaA: z.number(),
  pradZwarciowyPvA: z.number(),
  pradZwarciowyMaksymalnyA: z.number(),
  aicWystarczajace: z.boolean().nullable(),
  status: z.enum(STATUSY),
  zalozenia: z.array(z.string()),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type AnalizaZwarciowaToolOutputT = z.infer<typeof AnalizaZwarciowaToolOutput>

export const analizaZwarciowaTool: AiToolDefinition<AnalizaZwarciowaToolInputT, AnalizaZwarciowaToolOutputT> = {
  name: "policz_analize_zwarciowa",
  description:
    "Liczy szacowany prąd zwarciowy baterii (V/R_wewn) i PV (Isc × liczba stringów równoległych) " +
    "instalacji, i opcjonalnie sprawdza, czy zdolność wyłączania (AIC) zabezpieczenia jest wystarczająca. " +
    "Użyj, gdy user pyta o prąd zwarciowy instalacji off-grid, albo o dobór AIC zabezpieczeń. To uproszczony " +
    "model zwarcia pełnego (bez korekty wzajemnego oddziaływania), nie zastępuje pomiaru.",
  inputSchema: AnalizaZwarciowaToolInput,
  outputSchema: AnalizaZwarciowaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/analiza-zwarciowa",
  handler: async (input) => {
    const wynik = calculateAnalizaZwarciowa(input)
    return {
      pradZwarciowyBateriaA: wynik.value.pradZwarciowyBateriaA,
      pradZwarciowyPvA: wynik.value.pradZwarciowyPvA,
      pradZwarciowyMaksymalnyA: wynik.value.pradZwarciowyMaksymalnyA,
      aicWystarczajace: wynik.value.aicWystarczajace,
      status: wynik.status,
      zalozenia: tekstyZalozen(wynik.assumptions),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
