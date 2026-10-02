/**
 * Narzędzie AI (9.3) dla Modułu 8 "Bezpieczeństwo i sytuacje awaryjne", Ekran 6 "UPS krytyczny —
 * sprzęt i zarządzanie AI" (dobór sprzętowy, dawne 11.54; plan odcinania wg priorytetu, dawne 12.54). `operationType: 'read'`. Lista
 * urządzeń krytycznych (jakie urządzenia, ich moc [W], czy mają być podtrzymywane) oraz
 * pojemność [Ah] i napięcie [V] akumulatora UPS pochodzą WYŁĄCZNIE od usera (stan faktyczny
 * instalacji / karta katalogowa) — model nie może zgadywać mocy urządzeń ani parametrów UPS.
 */
import { z } from "zod"
import { calculateUpsKrytyczny } from "@/lib/core/modules/bezpieczenstwo/ups-krytyczny/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const UpsKrytycznyToolInput = z.object({
  urzadzenia: z
    .array(
      z.object({
        id: z.string().describe("Identyfikator urządzenia"),
        label: z.string().describe("Nazwa urządzenia — od usera"),
        powerW: z.number().describe("Moc urządzenia [W] — WYŁĄCZNIE od usera (karta katalogowa/pomiar), nigdy zgadywana"),
        selected: z.boolean().describe("Czy urządzenie ma być podtrzymywane przez ten UPS — decyzja usera"),
        priorytet: z
          .union([z.literal(1), z.literal(2), z.literal(3)])
          .nullable()
          .optional()
          .describe(
            "Priorytet odcinania: 1 = do końca, 3 = odciąć najpierw. Pominięty = domyślny ze źródła (centrala-pozarowa/esp32 1, " +
              "router 2, silowniki 3); dla innych urządzeń (np. oswietlenie-awaryjne) tylko od usera",
          ),
      }),
    )
    .describe("Lista urządzeń krytycznych do podtrzymania — od usera"),
  pojemnoscAh: z.number().describe("Pojemność akumulatora UPS [Ah] — od usera. 0 = jeszcze nie wpisano"),
  napiecieV: z.number().describe("Napięcie systemu UPS [V] — od usera. 0 = jeszcze nie wpisano"),
  efficiency: z
    .number()
    .optional()
    .describe("Sprawność układu (0,1] — opcjonalna, jeśli nieznana kalkulator użyje wartości domyślnej"),
  progOdcieciaMin: z
    .number()
    .optional()
    .describe("Próg [min]: odcięcie kolejnego poziomu, gdy przy bieżącym obciążeniu zostaje tyle minut — od usera; 0/pominięty = brak"),
  akumulatorSlaby: z.boolean().optional().describe("Czy UPS sygnalizuje słaby akumulator — od usera"),
})
export type UpsKrytycznyToolInputT = z.infer<typeof UpsKrytycznyToolInput>

export const UpsKrytycznyToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  laczonyPoborW: z.number(),
  czasPodtrzymaniaH: z.number(),
  planOdciecia: z
    .array(
      z.object({
        etap: z.number(),
        odcietyPriorytet: z.number().nullable(),
        aktywne: z.array(z.string()),
        mocW: z.number(),
        czasOdPelnegoH: z.number(),
        czasEtapuH: z.number().nullable(),
      }),
    )
    .nullable(),
  czasPriorytetu1H: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type UpsKrytycznyToolOutputT = z.infer<typeof UpsKrytycznyToolOutput>

export const upsKrytycznyTool: AiToolDefinition<UpsKrytycznyToolInputT, UpsKrytycznyToolOutputT> = {
  name: "policz_ups_krytyczny",
  description:
    "Dobór UPS dla urządzeń krytycznych off-grid (kontroler, router, siłowniki drzwi, centrala p.poż, oświetlenie " +
    "awaryjne itp.): łączny pobór zaznaczonych urządzeń [W] i czas podtrzymania [h] = (Ah × V × η) / P. Moc " +
    "urządzeń oraz pojemność/napięcie akumulatora UPS podaje user. Użyj, gdy user pyta, jak długo UPS podtrzyma " +
    "wskazane urządzenia lub jaki UPS dobrać, w jakiej kolejności odcinać urządzenia przy kończącym się UPS, o ile " +
    "dłużej popracuje centrala pożarowa po odcięciu siłowników i routera albo co zrobić, gdy UPS zgłasza słaby akumulator.",
  inputSchema: UpsKrytycznyToolInput,
  outputSchema: UpsKrytycznyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "bezpieczenstwo/ups-krytyczny",
  handler: async (input) => {
    const wynik = calculateUpsKrytyczny({
      urzadzenia: input.urzadzenia,
      pojemnoscAh: input.pojemnoscAh,
      napiecieV: input.napiecieV,
      efficiency: input.efficiency,
      progOdcieciaMin: input.progOdcieciaMin,
      akumulatorSlaby: input.akumulatorSlaby,
    })
    return {
      status: wynik.status,
      laczonyPoborW: wynik.value.laczonyPoborW,
      czasPodtrzymaniaH: wynik.value.czasPodtrzymaniaH,
      planOdciecia: wynik.value.planOdciecia,
      czasPriorytetu1H: wynik.value.czasPriorytetu1H,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
