/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 24 "Lista kontrolna na kemping" (dawne 8.47, Biblia §12.35).
 * `operationType: 'read'`. Wielkości (Ah, W) nie są zgadywane — pozycje odsyłają do kalkulatorów.
 */
import { z } from "zod"
import { calculateListaKemping } from "@/lib/core/modules/kalkulator-mobilny/lista-kemping/calculator"
import { t } from "@/lib/i18n/t"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const ListaKempingToolInput = z.object({
  osoby: z.number().describe("Liczba osób"),
  sezon: z.enum(["lato", "przejsciowy", "zima"]).nullable().describe("Sezon wyjazdu; null = nie wiadomo"),
  telefony: z.number().describe("Liczba telefonów/tabletów ładowanych na miejscu"),
  maPanel: z.boolean().describe("Czy zabiera panel"),
  maUrzadzenia230: z.boolean().describe("Czy zabiera urządzenia 230 V"),
  maLodowke: z.boolean().describe("Czy zabiera lodówkę turystyczną"),
  maOswietlenie: z.boolean().describe("Czy zabiera oświetlenie LED"),
  maRadio: z.boolean().describe("Czy zabiera radio"),
  zaznaczoneIds: z.array(z.string()).describe("Pozycje już spakowane (id); zwykle []"),
})
export type ListaKempingToolInputT = z.infer<typeof ListaKempingToolInput>

export const ListaKempingToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  konieczne: z.array(z.string()).describe("Pozycje konieczne (z ilością, gdy wynika z parametrów)"),
  opcjonalne: z.array(z.string()),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ListaKempingToolOutputT = z.infer<typeof ListaKempingToolOutput>

export const listaKempingTool: AiToolDefinition<ListaKempingToolInputT, ListaKempingToolOutputT> = {
  name: "przygotuj_liste_kontrolna_na_kemping",
  description:
    "Generuje listę rzeczy związanych z zasilaniem do zabrania na kemping (akumulator, panel, regulator, " +
    "przetwornica, kable, bezpieczniki, ładowarki, miernik, gaśnica), z podziałem na konieczne i opcjonalne, " +
    "zależnie od liczby osób, sezonu i zabieranych urządzeń. Użyj, gdy user pyta, co spakować na kemping, " +
    "biwak albo wyjazd kamperem, żeby mieć prąd.",
  inputSchema: ListaKempingToolInput,
  outputSchema: ListaKempingToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/lista-kemping",
  handler: async (input) => {
    const wynik = calculateListaKemping(input)
    const tekst = (p: { id: string; ilosc: number | null }) =>
      t("pl", `UI-M12-LKK-P-${p.id.toUpperCase()}`) + (p.ilosc !== null ? ` × ${p.ilosc}` : "")
    return {
      status: wynik.status,
      konieczne: wynik.value.pozycje.filter((p) => p.kategoria === "konieczne").map(tekst),
      opcjonalne: wynik.value.pozycje.filter((p) => p.kategoria === "opcjonalne").map(tekst),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
