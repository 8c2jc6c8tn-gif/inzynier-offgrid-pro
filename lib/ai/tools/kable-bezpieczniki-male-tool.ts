/**
 * Narzędzie AI (9.3) dla Modułu 12 "Szybki kalkulator/tryb mobilny" — Ekran 2 "Zabezpieczenia dla małych
 * instalacji" i Ekran 15 "Kable/bezpieczniki do kampera" (`pojazd: true`). `operationType: 'read'`. Prąd,
 * długość, warunki ułożenia i dopuszczalny spadek MUSZĄ pochodzić od usera — model ich nie zgaduje.
 */
import { z } from "zod"
import { calculateKableBezpiecznikiMale } from "@/lib/core/modules/kalkulator-mobilny/kable-bezpieczniki-male/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const KableBezpiecznikiMaleToolInput = z.object({
  pradA: z.number().describe("Prąd obciążenia obwodu [A] — od usera (albo moc ÷ napięcie)"),
  napiecieV: z.union([z.literal(12), z.literal(24)]).describe("Napięcie instalacji [V]"),
  dlugoscTrasyM: z.number().describe("Długość trasy kabla, jedna strona [m] — od usera"),
  sposobUlozenia: z.enum(["swobodnie", "w_peszlu", "w_ziemi", "w_wiazce"]).describe("Sposób ułożenia kabla"),
  temperaturaOtoczeniaC: z.number().describe("Temperatura otoczenia [°C] — od usera"),
  liczbaKabliWWiazce: z.number().optional().describe("Liczba kabli w wiązce (pomiń = brak wiązki)"),
  dopuszczalnySpadekNapieciaPct: z.number().describe("Dopuszczalny spadek napięcia [%] — od usera (typowo 3% DC)"),
  sprawdzanyPrzekrojMm2: z.number().optional().describe("Przekrój do sprawdzenia [mm²] — pomiń, aby dobrać automatycznie"),
  pojazd: z.boolean().optional().describe("true = instalacja w pojeździe/kamperze"),
})
export type KableBezpiecznikiMaleToolInputT = z.infer<typeof KableBezpiecznikiMaleToolInput>

export const KableBezpiecznikiMaleToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  przekrojMm2: z.number().describe("Przekrój dobrany albo sprawdzany [mm²]"),
  wymaganyMm2: z.number().describe("Minimalny przekrój (obciążalność + spadek + koordynacja z bezpiecznikiem) [mm²]"),
  obciazalnoscA: z.number().describe("Obciążalność Iz przekroju po korektach [A]"),
  spadekNapieciaPct: z.number(),
  bezpiecznikMinA: z.number().describe("Minimalny prąd znamionowy bezpiecznika 1,25 × I [A]"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type KableBezpiecznikiMaleToolOutputT = z.infer<typeof KableBezpiecznikiMaleToolOutput>

export const kableBezpiecznikiMaleTool: AiToolDefinition<KableBezpiecznikiMaleToolInputT, KableBezpiecznikiMaleToolOutputT> = {
  name: "dobierz_kabel_i_bezpiecznik_mala_instalacja",
  description:
    "Dobiera przekrój miedzianego kabla i minimalny bezpiecznik dla małej instalacji 12/24 V albo kampera/pojazdu " +
    "(Moduł 12): te same kalkulatory co Moduł 5 (obciążalność PN-HD 60364-5-52, spadek napięcia z drogą powrotną, " +
    "bezpiecznik 1,25 × I) plus koordynacja PN-IEC 60364-4-43: I ≤ In ≤ Iz. Twardy stop, gdy sprawdzany przekrój jest " +
    "poniżej minimum. Użyj, gdy user pyta, jaki kabel i bezpiecznik dać do akumulatora, lodówki, przetwornicy itp.",
  inputSchema: KableBezpiecznikiMaleToolInput,
  outputSchema: KableBezpiecznikiMaleToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/kable-bezpieczniki-male",
  handler: async (input) => {
    const wynik = calculateKableBezpiecznikiMale({
      ...input,
      liczbaKabliWWiazce: input.liczbaKabliWWiazce ?? 1,
      sprawdzanyPrzekrojMm2: input.sprawdzanyPrzekrojMm2 ?? null,
      pojazd: input.pojazd ?? false,
    })
    return {
      ...wynik.value,
      status: wynik.status,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
