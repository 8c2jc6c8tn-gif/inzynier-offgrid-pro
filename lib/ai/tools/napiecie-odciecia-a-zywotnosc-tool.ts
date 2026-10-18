/**
 * Narzędzie AI (9.3) dla Moduł 4 "Magazyn energii / baterie" — "Napięcie odcięcia a żywotność
 * (DoD ↔ cykle życia)". `operationType: 'read'`. Napięcie odcięcia i liczba ogniw szeregowo
 * MUSZĄ pochodzić z ustawień BMS/pomiaru usera — interpolacja liniowa poza kalibracją jest tylko
 * szacunkiem, oznaczonym w ostrzeżeniach kalkulatora.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateNapiecieOdciecia } from "@/lib/core/modules/baterie/napiecie-odciecia-a-zywotnosc/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const NapiecieOdcieciaAZywotnoscToolInput = z.object({
  napiecieOdcieciaV: z.number().describe("Napięcie odcięcia całego pakietu, ustawione w BMS [V] — tylko od usera"),
  liczbaOgniwSzeregowo: z.number().describe("Liczba ogniw połączonych szeregowo w pakiecie"),
})
export type NapiecieOdcieciaAZywotnoscToolInputT = z.infer<typeof NapiecieOdcieciaAZywotnoscToolInput>

export const NapiecieOdcieciaAZywotnoscToolOutput = z.object({
  status: z.enum(STATUSY),
  napiecieOgniwaV: z.number(),
  dodPct: z.number(),
  cykleZycia: z.number(),
  wewnatrzKalibracji: z.boolean(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type NapiecieOdcieciaAZywotnoscToolOutputT = z.infer<typeof NapiecieOdcieciaAZywotnoscToolOutput>

export const napiecieOdcieciaAZywotnoscTool: AiToolDefinition<
  NapiecieOdcieciaAZywotnoscToolInputT,
  NapiecieOdcieciaAZywotnoscToolOutputT
> = {
  name: "sprawdz_napiecie_odciecia_a_zywotnosc",
  description:
    "Przelicza napięcie odcięcia pakietu na napięcie ogniwa, szacuje głębokość rozładowania (DoD) i liczbę " +
    "cykli życia przez interpolację między punktami kalibracji (Moduł 4). Napięcie odcięcia i liczba ogniw " +
    "MUSZĄ pochodzić z ustawień BMS/pomiaru usera — nie zgaduj. Poza zakresem kalibracji wynik to ekstrapolacja " +
    "(oznaczona w ostrzeżeniach). Użyj, gdy user pyta, jak ustawienie napięcia odcięcia wpłynie na żywotność.",
  inputSchema: NapiecieOdcieciaAZywotnoscToolInput,
  outputSchema: NapiecieOdcieciaAZywotnoscToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/napiecie-odciecia-a-zywotnosc",
  handler: async (input) => {
    const wynik = calculateNapiecieOdciecia({
      napiecieOdcieciaV: input.napiecieOdcieciaV,
      liczbaOgniwSzeregowo: input.liczbaOgniwSzeregowo,
    })
    return {
      status: wynik.status,
      napiecieOgniwaV: wynik.value.napiecieOgniwaV,
      dodPct: wynik.value.dodPct,
      cykleZycia: wynik.value.cykleZycia,
      wewnatrzKalibracji: wynik.value.wewnatrzKalibracji,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
