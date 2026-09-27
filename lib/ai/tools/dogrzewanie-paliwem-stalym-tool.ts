/**
 * Narzędzie AI (9.3) dla Modułu 8 "Bezpieczeństwo i sytuacje awaryjne", Ekran 2 "Bezpieczeństwo
 * pożarowe przy dogrzewaniu paliwem stałym" (dawne 6.25). `operationType: 'read'`. Dane
 * bezpieczeństwa (typ paliwa, zmierzona odległość od materiałów palnych, obecność nawiewu
 * powietrza do spalania, obecność czujnika CO) MUSZĄ pochodzić WYŁĄCZNIE z pomiaru/deklaracji
 * usera — model nigdy nie zgaduje ani nie zakłada domyślnie "tak" dla obecności nawiewu/czujnika
 * (dane bezpieczeństwa, brak czujnika CO to twardy stop, zagrożenie życia).
 */
import { z } from "zod"
import { calculateDogrzewaniePaliwemStalym } from "@/lib/core/modules/bezpieczenstwo/dogrzewanie-paliwem-stalym/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const DogrzewaniePaliwemStalymToolInput = z.object({
  typPaliwa: z
    .enum(["drewno", "pellet", "wegiel"])
    .nullable()
    .describe("Typ paliwa stałego — od usera. null = jeszcze nie wybrano"),
  odlegloscOdMaterialowPalnychCm: z
    .number()
    .describe("ZMIERZONA odległość pieca/kotła od materiałów palnych [cm] — WYŁĄCZNIE od usera/pomiaru. 0 = jeszcze nie wpisano"),
  maNawiewPowietrzaDoSpalania: z
    .boolean()
    .describe("Czy jest osobny nawiew powietrza do spalania — WYŁĄCZNIE deklaracja/pomiar usera, nigdy domyślnie true"),
  maCzujnikCo: z
    .boolean()
    .describe(
      "Czy jest zainstalowany czujnik czadu (CO) w pomieszczeniu — WYŁĄCZNIE deklaracja usera, nigdy domyślnie true; " +
        "dane bezpieczeństwa życia",
    ),
})
export type DogrzewaniePaliwemStalymToolInputT = z.infer<typeof DogrzewaniePaliwemStalymToolInput>

export const DogrzewaniePaliwemStalymToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  marginesOdlegloscCm: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type DogrzewaniePaliwemStalymToolOutputT = z.infer<typeof DogrzewaniePaliwemStalymToolOutput>

export const dogrzewaniePaliwemStalymTool: AiToolDefinition<
  DogrzewaniePaliwemStalymToolInputT,
  DogrzewaniePaliwemStalymToolOutputT
> = {
  name: "sprawdz_bezpieczenstwo_dogrzewania_paliwem_stalym",
  description:
    "Sprawdza bezpieczeństwo pożarowe dogrzewania paliwem stałym (drewno/pellet/węgiel): margines odległości od " +
    "materiałów palnych względem minimum 40 cm, obecność nawiewu powietrza do spalania i czujnika CO. Odległość, " +
    "obecność nawiewu i czujnika CO podaje user na podstawie realnego stanu instalacji — dane bezpieczeństwa życia, " +
    "nigdy nie zgaduj. Użyj, gdy user pyta o bezpieczeństwo pieca/kotła na paliwo stałe w systemie off-grid.",
  inputSchema: DogrzewaniePaliwemStalymToolInput,
  outputSchema: DogrzewaniePaliwemStalymToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "bezpieczenstwo/dogrzewanie-paliwem-stalym",
  handler: async (input) => {
    const wynik = calculateDogrzewaniePaliwemStalym({
      typPaliwa: input.typPaliwa,
      odlegloscOdMaterialowPalnychCm: input.odlegloscOdMaterialowPalnychCm,
      maNawiewPowietrzaDoSpalania: input.maNawiewPowietrzaDoSpalania,
      maCzujnikCo: input.maCzujnikCo,
    })
    return {
      status: wynik.status,
      marginesOdlegloscCm: wynik.value.marginesOdlegloscCm,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
