/**
 * Narzędzie AI (9.3) dla Ekranu 1, Moduł 5 — "Dobór przekroju kabla" (mega-Doradca, tabele
 * normatywne PN-HD 60364-5-52). `operationType: 'read'`. Prąd, napięcie, długość trasy, materiał,
 * sposób ułożenia, temperatura otoczenia i liczba kabli w wiązce MUSZĄ pochodzić od użytkownika
 * (pomiar/projekt instalacji, karta katalogowa) — model nigdy ich nie zgaduje. Izolacja PVC 70°C i
 * liczba żył (dwie) są założeniami stałymi kalkulatora, nie ma potrzeby ich podawać.
 */
import { z } from "zod"
import { calculateDoborPrzekrojuKabla } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/calculator"
import type { Material, SposobUlozenia } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const MATERIALY = ["Cu", "Al"] as [Material, ...Material[]]
const SPOSOBY_ULOZENIA = ["swobodnie", "w_peszlu", "w_ziemi", "w_wiazce"] as [SposobUlozenia, ...SposobUlozenia[]]

export const DoborPrzekrojuKablaToolInput = z.object({
  pradA: z.number().describe("Prąd roboczy obwodu (I) [A]. 0 = jeszcze nie podano"),
  napiecieV: z.number().describe("Napięcie systemowe (U) [V] — DC (12/24/48V) lub AC (230V). 0 = jeszcze nie podano"),
  dlugoscTrasyM: z.number().describe("Długość trasy (L), jedna strona [m], z pomiaru. 0 = jeszcze nie podano"),
  material: z.enum(MATERIALY).describe("Materiał przewodnika"),
  sposobUlozenia: z.enum(SPOSOBY_ULOZENIA).describe("Sposób ułożenia kabla"),
  temperaturaOtoczeniaC: z
    .number()
    .nullable()
    .describe("Temperatura otoczenia [°C]. null = jeszcze nie podano (0°C to legalna wartość)"),
  liczbaKabliWWiazce: z.number().describe("Liczba kabli w wiązce — istotne dla ułożenia w_peszlu/w_ziemi/w_wiazce. 0/1 = brak wiązki"),
  dopuszczalnySpadekNapieciaPct: z
    .number()
    .describe("Dopuszczalny spadek napięcia [%] — typowo 2% AC / 3% DC, ale wartość ustala user. 0 = jeszcze nie podano"),
  sprawdzanyPrzekrojMm2: z
    .number()
    .nullable()
    .describe(
      "Opcja 'sprawdź mój przekrój' — jeśli podane, silnik ocenia TEN przekrój zamiast dobierać najmniejszy pasujący. null = dobór automatyczny",
    ),
})

export type DoborPrzekrojuKablaToolInputT = z.infer<typeof DoborPrzekrojuKablaToolInput>

export const DoborPrzekrojuKablaToolOutput = z.object({
  przekrojMm2: z.number(),
  obciazalnoscEfektywnaA: z.number(),
  spadekNapieciaPct: z.number(),
  marginesObciazalnosciPct: z.number(),
  marginesSpadkuPct: z.number(),
  strataRocznaKwh: z.number(),
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  zalozenia: z.array(z.string()),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type DoborPrzekrojuKablaToolOutputT = z.infer<typeof DoborPrzekrojuKablaToolOutput>

export const doborPrzekrojuKablaTool: AiToolDefinition<DoborPrzekrojuKablaToolInputT, DoborPrzekrojuKablaToolOutputT> = {
  name: "policz_dobor_przekroju_kabla",
  description:
    "Dobiera (lub sprawdza podany) przekrój kabla wg tabel normy PN-HD 60364-5-52 — obciążalność " +
    "z korektami temperatury i wiązki kabli, oraz sprawdzenie spadku napięcia. Zwraca margines " +
    "obciążalności i spadku, oraz orientacyjną roczną stratę energii w kablu. Użyj, gdy user pyta o " +
    "dobór/sprawdzenie przekroju kabla instalacji off-grid (DC lub AC). Wszystkie wejścia (prąd, " +
    "napięcie, długość trasy, materiał, sposób ułożenia, temperatura) muszą pochodzić od usera — nie zgaduj.",
  inputSchema: DoborPrzekrojuKablaToolInput,
  outputSchema: DoborPrzekrojuKablaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/dobor-przekroju-kabla",
  handler: async (input) => {
    const wynik = calculateDoborPrzekrojuKabla(input)
    return {
      przekrojMm2: wynik.value.przekrojMm2,
      obciazalnoscEfektywnaA: wynik.value.obciazalnoscEfektywnaA,
      spadekNapieciaPct: wynik.value.spadekNapieciaPct,
      marginesObciazalnosciPct: wynik.value.marginesObciazalnosciPct,
      marginesSpadkuPct: wynik.value.marginesSpadkuPct,
      strataRocznaKwh: wynik.value.strataRocznaKwh,
      status: wynik.status,
      zalozenia: tekstyZalozen(wynik.assumptions),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
