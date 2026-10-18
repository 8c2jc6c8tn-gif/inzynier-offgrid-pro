/**
 * Narzędzie AI (9.3) dla Ekranu 2, Moduł 1 — "Skaner działki". `operationType: 'read'`.
 *
 * Wejście to współrzędne GPS narożników (jak ze spaceru GPS albo odczytane z Geoportalu), nie
 * numer działki: ULDK jest wołany wyłącznie z przeglądarki (D23) — narzędzie po stronie serwera
 * nie pobiera geometrii z GUGiK. Wynik bez punktów w układzie lokalnym (dane dla rysunku, nie dla
 * rozmowy) — tylko wielkości, o które user pyta.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateSkanerDzialki } from "@/lib/core/modules/lokalizacja/skaner-dzialki/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const Punkt = z.object({
  szerokosc: z.number().describe("Szerokość geograficzna WGS84 [°]"),
  dlugosc: z.number().describe("Długość geograficzna WGS84 [°]"),
  wysokoscM: z.number().optional().describe("Wysokość z GPS [m] — potrzebna tylko dla połaci dachu i kalenicy"),
})

export const SkanerDzialkiToolInput = z.object({
  punktyDzialki: z.array(Punkt).optional().describe("Narożniki działki w kolejności obchodzenia"),
  punktyBudynku: z
    .array(Punkt)
    .optional()
    .describe("Narożniki budynku przy gruncie w kolejności obchodzenia (z wysokością, jeśli liczone są połacie)"),
  polacie: z
    .array(z.object({ nazwa: z.string(), punkty: z.array(Punkt).describe("Min. 3 punkty połaci, każdy z wysokoscM") }))
    .optional(),
  kalibracja: z
    .object({
      zbior: z.enum(["dzialka", "budynek"]),
      indeksA: z.number().int().describe("Indeks (od 0) pierwszego punktu odcinka o znanej długości"),
      indeksB: z.number().int(),
      znanaDlugoscM: z.number().describe("Długość odcinka A–B zmierzona taśmą [m]"),
    })
    .optional()
    .describe("Korekta skali GPS znanym wymiarem — tylko gdy user podał zmierzony odcinek"),
})

export type SkanerDzialkiToolInputT = z.infer<typeof SkanerDzialkiToolInput>

export const SkanerDzialkiToolOutput = z.object({
  status: z.enum(STATUSY),
  dzialka: z.object({ powierzchniaM2: z.number(), obwodM: z.number() }).nullable(),
  budynek: z
    .object({
      powierzchniaM2: z.number(),
      sciany: z.array(z.object({ odPunktu: z.number(), doPunktu: z.number(), dlugoscM: z.number(), azymutDeg: z.number() })),
    })
    .nullable(),
  polacie: z.array(
    z.object({
      nazwa: z.string(),
      nachylenieDeg: z.number(),
      azymutDeg: z.number().nullable(),
      poleRzeczywisteM2: z.number(),
      odchylenieOdPlaszczyznyM: z.number(),
    }),
  ),
  wysokoscKalenicyM: z.number().nullable(),
  skalaKalibracji: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type SkanerDzialkiToolOutputT = z.infer<typeof SkanerDzialkiToolOutput>

export const skanerDzialkiTool: AiToolDefinition<SkanerDzialkiToolInputT, SkanerDzialkiToolOutputT> = {
  name: "policz_skaner_dzialki",
  description:
    "Z współrzędnych GPS narożników działki i budynku liczy powierzchnię i obwód działki, powierzchnię " +
    "budynku, długość i kierunek (azymut zewnętrznej normalnej, N=0, E=90, S=180, W=270) każdej ściany, " +
    "a z punktów połaci z wysokościami — nachylenie, kierunek i pole połaci oraz wysokość kalenicy. " +
    "Użyj, gdy user podaje współrzędne narożników i pyta o wymiary działki/budynku, kierunki ścian albo " +
    "geometrię dachu. Nie pobiera działki po numerze — do tego jest ekran Skaner działki w aplikacji.",
  inputSchema: SkanerDzialkiToolInput,
  outputSchema: SkanerDzialkiToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "lokalizacja/skaner-dzialki",
  handler: async (input) => {
    const wynik = calculateSkanerDzialki(input)
    const v = wynik.value
    return {
      status: wynik.status,
      dzialka: v.dzialka && { powierzchniaM2: v.dzialka.powierzchniaM2, obwodM: v.dzialka.obwodM },
      budynek: v.budynek && {
        powierzchniaM2: v.budynek.powierzchniaM2,
        sciany: v.budynek.sciany.map((s) => ({ odPunktu: s.od, doPunktu: s.do, dlugoscM: s.dlugoscM, azymutDeg: s.azymutDeg })),
      },
      polacie: v.polacie.map((p) => ({
        nazwa: p.nazwa,
        nachylenieDeg: p.nachylenieDeg,
        azymutDeg: p.azymutDeg,
        poleRzeczywisteM2: p.poleRzeczywisteM2,
        odchylenieOdPlaszczyznyM: p.odchylenieOdPlaszczyznyM,
      })),
      wysokoscKalenicyM: v.wysokoscKalenicyM,
      skalaKalibracji: v.skalaKalibracji,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
