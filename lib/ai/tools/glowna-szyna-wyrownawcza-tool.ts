/**
 * Narzędzie AI (9.3) dla Ekranu 10, Moduł 5 — "Główna Szyna Wyrównawcza (GSW)".
 * `operationType: 'read'`. Lista potwierdzonych elementów i to, czy GSW jest używana jako
 * przyłącze odbiorników, MUSI pochodzić od użytkownika (wizualne sprawdzenie instalacji) —
 * model nigdy tego nie zgaduje.
 */
import { z } from "zod"
import { calculateGlownaSzynaWyrownawcza } from "@/lib/core/modules/okablowanie/glowna-szyna-wyrownawcza/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/okablowanie/glowna-szyna-wyrownawcza/constants"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen } from "./teksty-wyniku"

const ID_ELEMENTOW = CHECKLIST_ITEMS.map((item) => item.id) as [string, ...string[]]

export const GlownaSzynaWyrownawczaToolInput = z.object({
  potwierdzoneIds: z
    .array(z.enum(ID_ELEMENTOW))
    .describe("Lista ID elementów, które user potwierdził jako podłączone do GSW"),
  uzywanaJakoPrzylaczeOdbiornikow: z
    .boolean()
    .describe("Czy GSW jest (błędnie) używana jako punkt przyłączeniowy dla odbiorników"),
})

export type GlownaSzynaWyrownawczaToolInputT = z.infer<typeof GlownaSzynaWyrownawczaToolInput>

export const GlownaSzynaWyrownawczaToolOutput = z.object({
  potwierdzone: z.number(),
  razem: z.number(),
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type GlownaSzynaWyrownawczaToolOutputT = z.infer<typeof GlownaSzynaWyrownawczaToolOutput>

export const glownaSzynaWyrownawczaTool: AiToolDefinition<
  GlownaSzynaWyrownawczaToolInputT,
  GlownaSzynaWyrownawczaToolOutputT
> = {
  name: "policz_glowna_szyna_wyrownawcza",
  description:
    "Sprawdza checklistę elementów (konstrukcja paneli, falownik, bateria, instalacja wodna, uziom), " +
    "które muszą być podłączone do Głównej Szyny Wyrównawczej (GSW), i twardo ostrzega, gdy GSW jest " +
    "błędnie używana jako punkt przyłączeniowy odbiorników (GSW to NIE szyna prądowa). Użyj, gdy user " +
    "pyta o wyrównanie potencjałów/GSW w instalacji off-grid.",
  inputSchema: GlownaSzynaWyrownawczaToolInput,
  outputSchema: GlownaSzynaWyrownawczaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/glowna-szyna-wyrownawcza",
  handler: async (input) => {
    const wynik = calculateGlownaSzynaWyrownawcza(input)
    return {
      potwierdzone: wynik.value.potwierdzone,
      razem: wynik.value.razem,
      status: wynik.status,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
