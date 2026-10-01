/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 8 "Przetwornice" (dawne 8.9, 8.41, 8.42): ładowarka USB,
 * przetwornica DC/DC, falownik 12/24 V → 230 V. `operationType: 'read'`. Sprawność, zapas mocy
 * i krotność rozruchu MUSZĄ pochodzić od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { calculatePrzetwornica } from "@/lib/core/modules/kalkulator-mobilny/przetwornice/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PrzetwornicaToolInput = z.object({
  tryb: z.enum(["usb", "dcdc", "falownik"]).describe("usb = ładowarka 5 V, dcdc = przetwornica DC/DC (np. 12→24 V), falownik = 230 V"),
  napiecieAkumulatoraV: z.number().describe("Napięcie akumulatora [V]"),
  sprawnoscPct: z.number().describe("Sprawność przetwornicy/falownika [%] — od usera, nie zgaduj"),
  napiecieUrzadzeniaV: z.number().describe("Tryb dcdc: napięcie urządzenia [V]; w trybie usb ignorowane (5 V); w falowniku 0"),
  mocUrzadzeniaW: z.number().describe("Tryby usb/dcdc: moc urządzenia [W]; w falowniku 0"),
  pradPrzetwornicyA: z.number().describe("Tryby usb/dcdc: prąd wyjściowy posiadanej przetwornicy [A]; 0 = nie sprawdzaj"),
  urzadzenia: z
    .array(
      z.object({
        nazwa: z.string(),
        mocW: z.number().describe("Moc znamionowa [W]"),
        krotnoscRozruchu: z.number().describe("Krotność mocy rozruchowej (np. 3); 0 = nie podano — od usera, nie zgaduj"),
      }),
    )
    .describe("Tryb falownik: urządzenia 230 V pracujące jednocześnie; inne tryby: []"),
  zapasMocy: z.number().describe("Tryb falownik: mnożnik zapasu mocy (Biblia: 1,5–2) — od usera; 0 = brak"),
  mocFalownikaW: z.number().describe("Tryb falownik: moc ciągła posiadanego falownika [W]; 0 = nie sprawdzaj"),
  mocSzczytowaFalownikaW: z.number().describe("Tryb falownik: moc szczytowa falownika z karty [W]; 0 = nie podano"),
})
export type PrzetwornicaToolInputT = z.infer<typeof PrzetwornicaToolInput>

export const PrzetwornicaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  napiecieWyjscioweV: z.number(),
  pradWyjsciowyA: z.number().describe("Minimalny prąd wyjściowy przetwornicy/ładowarki [A]"),
  pradZAkumulatoraA: z.number(),
  sumaMocyW: z.number(),
  minimalnaMocFalownikaW: z.number(),
  szczytRozruchuW: z.number(),
  pradPrzyPelnejMocyA: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PrzetwornicaToolOutputT = z.infer<typeof PrzetwornicaToolOutput>

export const przetwornicaTool: AiToolDefinition<PrzetwornicaToolInputT, PrzetwornicaToolOutputT> = {
  name: "dobierz_przetwornice_lub_falownik",
  description:
    "Dobiera ładowarkę USB, przetwornicę DC/DC (np. 12→24 V, 24→12 V) albo falownik 230 V do małej instalacji: " +
    "prąd wyjściowy, prąd z akumulatora, minimalną moc ciągłą falownika (suma × zapas) i szczyt przy rozruchu. " +
    "Użyj, gdy user pyta, jaką przetwornicę albo jaki falownik kupić do kampera/akumulatora, czy falownik " +
    "uciągnie lodówkę lub narzędzie, albo ile amperów pobierze z akumulatora.",
  inputSchema: PrzetwornicaToolInput,
  outputSchema: PrzetwornicaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/przetwornice",
  handler: async (input) => {
    const wynik = calculatePrzetwornica(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
