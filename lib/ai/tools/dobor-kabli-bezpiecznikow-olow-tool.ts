/**
 * Narzędzie AI (9.3) dla Modułu 11, Ekran B5 "Dobór kabli, bezpieczników i zabezpieczeń"
 * (kwasowo-ołowiowa). `operationType: 'read'`. Wzorzec echo — ten sam silnik co Moduł 5 (dobór
 * przekroju kabla + dobór bezpiecznika/rozłącznika), tylko inne typowe wartości wejściowe. Prąd,
 * napięcie, długość trasy, prąd zwarciowy i AIC bezpiecznika pochodzą wyłącznie z projektu/pomiaru
 * usera — nie zgaduj (dane bezpieczeństwa: dobór zabezpieczeń).
 */
import { z } from "zod"
import { calculateDoborKabliBezpiecznikowOlow } from "@/lib/core/modules/montaz-baterii/dobor-kabli-bezpiecznikow-olow/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const DoborKabliBezpiecznikowOlowToolInput = z.object({
  pradA: z.number().describe("Prąd ładowania/rozładowania [A] — z projektu instalacji, tylko od usera"),
  napiecieV: z.number().describe("Napięcie systemu [V] — tylko od usera"),
  dlugoscTrasyM: z.number().describe("Długość trasy kabla, jedna strona [m] — z pomiaru usera"),
  material: z.enum(["Cu", "Al"]).describe("Materiał żyły kabla"),
  sposobUlozenia: z
    .enum(["swobodnie", "w_peszlu", "w_ziemi", "w_wiazce"])
    .describe("Sposób ułożenia kabla, zgodnie z realną instalacją usera"),
  temperaturaOtoczeniaC: z.number().nullable().describe("Temperatura otoczenia [°C] — tylko od usera, null = jeszcze nie podano"),
  liczbaKabliWWiazce: z.number().describe("Liczba kabli w wiązce — 0/1 = brak wiązki"),
  dopuszczalnySpadekNapieciaPct: z.number().describe("Dopuszczalny spadek napięcia [%] — decyzja projektowa usera"),
  sprawdzanyPrzekrojMm2: z
    .number()
    .nullable()
    .describe("Opcja 'sprawdź mój przekrój' [mm²] — null = silnik dobiera automatycznie najmniejszy pasujący"),
  pradZwarciowyA: z.number().describe("Prąd zwarciowy zestawu kwasowego w tym punkcie [A] — z obliczeń/pomiaru usera, nie zgaduj"),
  aicBezpiecznikaA: z
    .number()
    .describe("Zdolność wyłączania (AIC) wybranego bezpiecznika [A], z karty katalogowej — tylko od usera"),
})
export type DoborKabliBezpiecznikowOlowToolInputT = z.infer<typeof DoborKabliBezpiecznikowOlowToolInput>

export const DoborKabliBezpiecznikowOlowToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  przekrojMm2: z.number(),
  obciazalnoscEfektywnaA: z.number(),
  spadekNapieciaPct: z.number(),
  pradBezpiecznikaZalecanyA: z.number(),
  aicWystarczajace: z.boolean().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type DoborKabliBezpiecznikowOlowToolOutputT = z.infer<typeof DoborKabliBezpiecznikowOlowToolOutput>

export const doborKabliBezpiecznikowOlowTool: AiToolDefinition<
  DoborKabliBezpiecznikowOlowToolInputT,
  DoborKabliBezpiecznikowOlowToolOutputT
> = {
  name: "dobierz_kable_bezpieczniki_olow",
  description:
    "Dobór przekroju kabla i bezpiecznika/rozłącznika dla instalacji akumulatorów kwasowo-ołowiowych " +
    "(Moduł 11, Ekran B5) — wzorzec echo Modułu 5 (ten sam silnik normatywny PN-HD 60364-5-52, tylko inne " +
    "typowe wartości wejściowe dla chemii kwasowej). Wymaga prądu, napięcia, długości trasy, materiału, " +
    "sposobu ułożenia, prądu zwarciowego i AIC bezpiecznika — wszystko tylko od usera, to dane bezpieczeństwa " +
    "doboru zabezpieczeń, nie zgaduj żadnej z tych wartości. Użyj, gdy user pyta o przekrój kabla albo dobór " +
    "bezpiecznika do akumulatorów kwasowych.",
  inputSchema: DoborKabliBezpiecznikowOlowToolInput,
  outputSchema: DoborKabliBezpiecznikowOlowToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "montaz-baterii/dobor-kabli-bezpiecznikow-olow",
  handler: async (input) => {
    const wynik = calculateDoborKabliBezpiecznikowOlow({
      pradA: input.pradA,
      napiecieV: input.napiecieV,
      dlugoscTrasyM: input.dlugoscTrasyM,
      material: input.material,
      sposobUlozenia: input.sposobUlozenia,
      temperaturaOtoczeniaC: input.temperaturaOtoczeniaC,
      liczbaKabliWWiazce: input.liczbaKabliWWiazce,
      dopuszczalnySpadekNapieciaPct: input.dopuszczalnySpadekNapieciaPct,
      sprawdzanyPrzekrojMm2: input.sprawdzanyPrzekrojMm2,
      pradZwarciowyA: input.pradZwarciowyA,
      aicBezpiecznikaA: input.aicBezpiecznikaA,
    })
    return {
      status: wynik.status,
      przekrojMm2: wynik.value.przekrojMm2,
      obciazalnoscEfektywnaA: wynik.value.obciazalnoscEfektywnaA,
      spadekNapieciaPct: wynik.value.spadekNapieciaPct,
      pradBezpiecznikaZalecanyA: wynik.value.pradBezpiecznikaZalecanyA,
      aicWystarczajace: wynik.value.aicWystarczajace,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
