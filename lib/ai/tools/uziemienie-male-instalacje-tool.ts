/**
 * Narzędzie AI (9.3) dla Modułu 12 "Szybki kalkulator/tryb mobilny" — Ekran 38 "Uziemienie małej instalacji"
 * (dawne 8.65). `operationType: 'read'`. Rodzaj instalacji, miejsce i odpowiedzi o obudowie falownika i gniazdach
 * MUSZĄ pochodzić od usera — model ich nie zgaduje. Nie liczy uziomu prętowego (pełny projekt: M5/E9).
 */
import { z } from "zod"
import { calculateUziemienieMaleInstalacje } from "@/lib/core/modules/kalkulator-mobilny/uziemienie-male-instalacje/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const OdpowiedzKontrolna = z.enum(["tak", "nie", "nie-wiem"])

export const UziemienieMaleInstalacjeToolInput = z.object({
  rodzaj: z.enum(["dc", "ac230"]).describe("dc = tylko 12/24 V DC; ac230 = jest falownik 230 V — od usera"),
  miejsce: z.enum(["garaz", "kamper", "jacht", "zewnatrz"]).describe("Gdzie jest instalacja — od usera"),
  obudowaFalownikaUziemiona: OdpowiedzKontrolna.nullable().describe(
    "Tylko dla ac230: czy obudowa falownika jest uziemiona — od usera; gdy nie wie, 'nie-wiem'. Dla dc: null",
  ),
  gniazdaZeStykiemOchronnym: OdpowiedzKontrolna.nullable().describe(
    "Tylko dla ac230: czy gniazda 230 V mają podłączony styk ochronny — od usera; gdy nie wie, 'nie-wiem'. Dla dc: null",
  ),
})
export type UziemienieMaleInstalacjeToolInputT = z.infer<typeof UziemienieMaleInstalacjeToolInput>

export const UziemienieMaleInstalacjeToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  wymaganeUziemienieOchronne: z.boolean().nullable().describe("Czy uziemienie ochronne jest wymagane; null = brak danych"),
  zalecaneZeWzgleduNaWilgoc: z.boolean(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type UziemienieMaleInstalacjeToolOutputT = z.infer<typeof UziemienieMaleInstalacjeToolOutput>

export const uziemienieMaleInstalacjeTool: AiToolDefinition<UziemienieMaleInstalacjeToolInputT, UziemienieMaleInstalacjeToolOutputT> = {
  name: "sprawdz_uziemienie_malej_instalacji",
  description:
    "Sprawdza uziemienie małej, tymczasowej lub mobilnej instalacji (garaż, kamper, jacht, na zewnątrz): tylko 12/24 V DC " +
    "zwykle nie wymaga uziemienia ochronnego; przy falowniku 230 V wymagana jest uziemiona obudowa falownika i gniazda ze " +
    "stykiem ochronnym (brak lub „nie wiem” = twardy stop, ryzyko porażenia); w miejscu wilgotnym (jacht, na zewnątrz) " +
    "zaleca uziemienie. Nie liczy uziomu prętowego ani rezystancji uziemienia. Użyj, gdy user pyta o uziemienie kampera, jachtu albo małego zestawu.",
  inputSchema: UziemienieMaleInstalacjeToolInput,
  outputSchema: UziemienieMaleInstalacjeToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/uziemienie-male-instalacje",
  handler: async (input) => {
    const wynik = calculateUziemienieMaleInstalacje(input)
    return {
      status: wynik.status,
      wymaganeUziemienieOchronne: wynik.value.wymaganeUziemienieOchronne,
      zalecaneZeWzgleduNaWilgoc: wynik.value.zalecaneZeWzgleduNaWilgoc,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
