/**
 * Narzędzie AI (9.3) dla Ekranu 18, Moduł 4 "Magazyn energii / baterie" — "Łączenie równoległe
 * różnych baterii (Mixing)". `operationType: 'read'`. Napięcia nominalne i rezystancje wewnętrzne
 * MUSZĄ pochodzić z pomiaru/karty katalogowej — dane bezpieczeństwa (twardy stop przy mieszaniu
 * różnych chemii).
 */
import { z } from "zod"
import { calculateMixingRownolegle } from "@/lib/core/modules/baterie/mixing-rownolegle/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const MixingRownoleglToolInput = z.object({
  chemia1: z.string().describe("Id chemii pierwszej baterii (np. z katalogu technologii Ekranu 30) — od usera"),
  chemia2: z.string().describe("Id chemii drugiej baterii — od usera"),
  napiecieNominalneV1: z.number().describe("Napięcie nominalne (spoczynkowe) pierwszej baterii [V] — z pomiaru"),
  napiecieNominalneV2: z.number().describe("Napięcie nominalne (spoczynkowe) drugiej baterii [V] — z pomiaru"),
  rezystancjaWewnetrznaMOhm1: z.number().describe("Rezystancja wewnętrzna pierwszej baterii [mΩ] — z pomiaru/karty katalogowej"),
  rezystancjaWewnetrznaMOhm2: z.number().describe("Rezystancja wewnętrzna drugiej baterii [mΩ] — z pomiaru/karty katalogowej"),
})
export type MixingRownoleglToolInputT = z.infer<typeof MixingRownoleglToolInput>

export const MixingRownoleglToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  roznicaNapiecV: z.number(),
  iWyrownawczyA: z.number(),
  udzialPradu1Pct: z.number(),
  udzialPradu2Pct: z.number(),
  chemiaZgodna: z.boolean(),
  napieciaOk: z.boolean(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type MixingRownoleglToolOutputT = z.infer<typeof MixingRownoleglToolOutput>

export const mixingRownoleglTool: AiToolDefinition<MixingRownoleglToolInputT, MixingRownoleglToolOutputT> = {
  name: "sprawdz_mixing_baterii_rownolegle",
  description:
    "Sprawdza bezpieczeństwo łączenia równoległego dwóch różnych baterii: zgodność chemii (twardy stop przy " +
    "różnych chemiach), różnicę napięć i prąd wyrównawczy między nimi (Moduł 4, Ekran 18). Napięcia i " +
    "rezystancje wewnętrzne MUSZĄ pochodzić z pomiaru/karty katalogowej — nie zgaduj. Użyj, gdy user pyta, " +
    "czy może połączyć równolegle dwie różne baterie.",
  inputSchema: MixingRownoleglToolInput,
  outputSchema: MixingRownoleglToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/mixing-rownolegle",
  handler: async (input) => {
    const wynik = calculateMixingRownolegle({
      chemia1: input.chemia1,
      chemia2: input.chemia2,
      napiecieNominalneV1: input.napiecieNominalneV1,
      napiecieNominalneV2: input.napiecieNominalneV2,
      rezystancjaWewnetrznaMOhm1: input.rezystancjaWewnetrznaMOhm1,
      rezystancjaWewnetrznaMOhm2: input.rezystancjaWewnetrznaMOhm2,
    })
    return {
      status: wynik.status,
      roznicaNapiecV: wynik.value.roznicaNapiecV,
      iWyrownawczyA: wynik.value.iWyrownawczyA,
      udzialPradu1Pct: wynik.value.udzialPradu1Pct,
      udzialPradu2Pct: wynik.value.udzialPradu2Pct,
      chemiaZgodna: wynik.value.chemiaZgodna,
      napieciaOk: wynik.value.napieciaOk,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
