/**
 * Narzędzie AI (9.3) dla Ekranu 15, Moduł 3 — "Technologie paneli". `operationType: 'read'`.
 * Dane porównawcze to treść źródła (constants.ts) — model dostaje je razem z założeniem 🔎
 * o uzysku, żeby nie przedstawiał procentów uzysku ze źródła jako pewnego wyniku.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateTechnologiePaneli } from "@/lib/core/modules/pv/technologie-paneli/calculator"
import { GRUPY_TECHNOLOGII, TECHNOLOGIE_KRYSTALICZNE } from "@/lib/core/modules/pv/technologie-paneli/constants"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const TechnologiePaneliToolInput = z.object({
  mocInstalacjiKwp: z
    .number()
    .describe("Planowana moc instalacji PV w kWp — do przeliczenia na powierzchnię modułów; 0, jeśli user nie podał"),
})

export type TechnologiePaneliToolInputT = z.infer<typeof TechnologiePaneliToolInput>

const Powierzchnia = z.object({ minM2: z.number().nullable(), maxM2: z.number() }).nullable()

export const TechnologiePaneliToolOutput = z.object({
  technologie: z.array(
    z.object({
      nazwa: z.string(),
      sprawnoscMinPct: z.number(),
      sprawnoscMaxPct: z.number().nullable(),
      degradacjaRocznaPct: z.number().nullable(),
      lid: z.string().nullable(),
      pid: z.string().nullable(),
      uzyskWzgledemPercWgZrodla: z.string(),
      powierzchniaModulow: Powierzchnia,
    }),
  ),
  grupy: z.array(
    z.object({
      nazwa: z.string(),
      sprawnoscMinPct: z.number(),
      sprawnoscMaxPct: z.number().nullable(),
      zalety: z.string(),
      zastosowanie: z.string(),
      powierzchniaModulow: Powierzchnia,
    }),
  ),
  status: z.enum(STATUSY),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type TechnologiePaneliToolOutputT = z.infer<typeof TechnologiePaneliToolOutput>

export const technologiePaneliTool: AiToolDefinition<TechnologiePaneliToolInputT, TechnologiePaneliToolOutputT> = {
  name: "porownaj_technologie_paneli",
  description:
    "Zwraca porównanie technologii paneli PV (PERC, Half-Cut, TOPCon, HJT; krystaliczne vs " +
    "cienkowarstwowe): sprawność, degradację, LID/PID, uzysk względem PERC według źródła oraz — gdy " +
    "podano moc — powierzchnię modułów w m². Procenty uzysku to dane źródła do weryfikacji, nie " +
    "obliczenie. Użyj, gdy user pyta, jaką technologię paneli wybrać albo ile miejsca zajmą panele.",
  inputSchema: TechnologiePaneliToolInput,
  outputSchema: TechnologiePaneliToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "pv/technologie-paneli",
  handler: async (input) => {
    const wynik = calculateTechnologiePaneli(input)
    const powierzchnia = (id: string) => {
      const p = [...wynik.value.krystaliczne, ...wynik.value.grupy].find((x) => x.id === id)
      return p ? { minM2: p.powierzchniaMinM2, maxM2: p.powierzchniaMaxM2 } : null
    }
    return {
      technologie: TECHNOLOGIE_KRYSTALICZNE.map((tech) => ({
        nazwa: tech.nazwa,
        sprawnoscMinPct: tech.sprawnosc.minPct,
        sprawnoscMaxPct: tech.sprawnosc.maxPct,
        degradacjaRocznaPct: tech.degradacjaRocznaPct,
        lid: tech.lidOpis,
        pid: tech.pidOpis,
        uzyskWzgledemPercWgZrodla: tech.uzyskWzgledemPercOpis,
        powierzchniaModulow: powierzchnia(tech.id),
      })),
      grupy: GRUPY_TECHNOLOGII.map((grupa) => ({
        nazwa: grupa.nazwa,
        sprawnoscMinPct: grupa.sprawnosc.minPct,
        sprawnoscMaxPct: grupa.sprawnosc.maxPct,
        zalety: grupa.zalety,
        zastosowanie: grupa.zastosowanie,
        powierzchniaModulow: powierzchnia(grupa.id),
      })),
      status: wynik.status,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(
        wynik.status === "VALID" ? wynik.assumptions : [{ kod: "TECHNOLOGIE-SPRAWNOSC-TO-POWIERZCHNIA" }],
      ),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
