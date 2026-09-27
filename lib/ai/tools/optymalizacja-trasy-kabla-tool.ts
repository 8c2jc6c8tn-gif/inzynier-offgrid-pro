/**
 * Narzędzie AI (9.3) dla Ekranu 26, Moduł 5 — "Optymalizacja trasy i kosztu kabla".
 * `operationType: 'read'`. Prąd, napięcie, dane obu tras (długość, przekrój, koszt zakupu), cena
 * energii i horyzont porównania MUSZĄ pochodzić od użytkownika (pomiar/projekt, oferta handlowa) —
 * model nigdy ich nie zgaduje. Straty roczne liczone wewnętrznie przez echo Ekranu 1 (Dobór
 * przekroju kabla), nie uproszczonym wzorem tego narzędzia.
 */
import { z } from "zod"
import { calculateOptymalizacjaTrasyKabla } from "@/lib/core/modules/okablowanie/optymalizacja-trasy-kabla/calculator"
import type { Material, SposobUlozenia } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const MATERIALY = ["Cu", "Al"] as [Material, ...Material[]]
const SPOSOBY_ULOZENIA = ["swobodnie", "w_peszlu", "w_ziemi", "w_wiazce"] as [SposobUlozenia, ...SposobUlozenia[]]

const TrasaSchema = z.object({
  dlugoscTrasyM: z.number().describe("Długość trasy [m]. 0 = jeszcze nie podano"),
  przekrojMm2: z.number().describe("Przekrój rozważany dla tej trasy [mm²]. 0 = jeszcze nie podano"),
  kosztZakupuZl: z.number().describe("Koszt zakupu (kabel + osłony + robocizna) [zł]. 0 = jeszcze nie podano"),
})

export const OptymalizacjaTrasyKablaToolInput = z.object({
  pradA: z.number().describe("Prąd roboczy obwodu [A] — wspólny dla obu tras (ten sam obwód). 0 = jeszcze nie podano"),
  napiecieV: z.number().describe("Napięcie systemowe [V]. 0 = jeszcze nie podano"),
  material: z.enum(MATERIALY).describe("Materiał przewodnika"),
  sposobUlozenia: z.enum(SPOSOBY_ULOZENIA).describe("Sposób ułożenia kabla"),
  temperaturaOtoczeniaC: z.number().nullable().describe("Temperatura otoczenia [°C]. null = jeszcze nie podano"),
  liczbaKabliWWiazce: z.number().describe("Liczba kabli w wiązce. 0/1 = brak wiązki"),
  dopuszczalnySpadekNapieciaPct: z.number().describe("Dopuszczalny spadek napięcia [%]. 0 = jeszcze nie podano"),
  cenaEnergiiZlZaKwh: z.number().describe("Cena energii elektrycznej [zł/kWh]. 0 = jeszcze nie podano"),
  liczbaLat: z.number().describe("Horyzont porównania [lat] — domyślnie 10, edytowalny. 0 = jeszcze nie podano"),
  trasaA: TrasaSchema.describe("Parametry trasy A"),
  trasaB: TrasaSchema.describe("Parametry trasy B"),
})

export type OptymalizacjaTrasyKablaToolInputT = z.infer<typeof OptymalizacjaTrasyKablaToolInput>

export const OptymalizacjaTrasyKablaToolOutput = z.object({
  strataRocznaAKwh: z.number(),
  strataRocznaBKwh: z.number(),
  tcoAZl: z.number(),
  tcoBZl: z.number(),
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  zalozenia: z.array(z.string()),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type OptymalizacjaTrasyKablaToolOutputT = z.infer<typeof OptymalizacjaTrasyKablaToolOutput>

export const optymalizacjaTrasyKablaTool: AiToolDefinition<
  OptymalizacjaTrasyKablaToolInputT,
  OptymalizacjaTrasyKablaToolOutputT
> = {
  name: "policz_optymalizacje_trasy_kabla",
  description:
    "Porównuje całkowity koszt posiadania (TCO = koszt zakupu + strata energii × lata × cena kWh) dwóch " +
    "wariantów trasy tego samego obwodu (ten sam prąd/napięcie, różna długość/przekrój/koszt). Straty " +
    "roczne liczone realnymi wzorami normy (echo Ekranu 1), nie szacunkiem. TCO nie jest pokazywane, " +
    "gdy którakolwiek trasa nie spełnia wymagań normy (za mały przekrój). Użyj, gdy user porównuje dwie " +
    "trasy kablowe pod kątem opłacalności.",
  inputSchema: OptymalizacjaTrasyKablaToolInput,
  outputSchema: OptymalizacjaTrasyKablaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/optymalizacja-trasy-kabla",
  handler: async (input) => {
    const wynik = calculateOptymalizacjaTrasyKabla(input)
    return {
      strataRocznaAKwh: wynik.value.strataRocznaAKwh,
      strataRocznaBKwh: wynik.value.strataRocznaBKwh,
      tcoAZl: wynik.value.tcoAZl,
      tcoBZl: wynik.value.tcoBZl,
      status: wynik.status,
      zalozenia: tekstyZalozen(wynik.assumptions),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
