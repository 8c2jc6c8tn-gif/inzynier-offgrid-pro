/**
 * Narzędzie AI (9.3) dla M14 — D7 (dom) / F8 (firma) „Porównanie scenariuszy A–D”. `operationType: 'read'`.
 * Echo silnika `siec/scenariusze-przejscia`: ceny sprzętu, paliwa, serwisu i koszty sieci podaje user
 * (albo pochodzą z narzędzia `rozbij_rachunek_za_prad`); braków narzędzie nie zgaduje — zwraca listę braków.
 * Zawsze pełna tabela A–D, nigdy jeden „najlepszy” werdykt.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { DANE_ROZLICZEN } from "@/lib/core/dane/rozliczenia-pl-2026"
import { calculateScenariuszePrzejscia } from "@/lib/core/modules/siec/scenariusze-przejscia/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const Miesiace = z.array(z.number()).length(12)

const ScenariuszSchema = z.object({
  inwestycjaZl: z.number().nullable().describe("Inwestycja [zł] — cena od usera; null = scenariusz pominięty"),
  dotacjaZl: z.number().describe("Dotacja [zł]; 0 = brak"),
  mocPvKwp: z.number().describe("Moc PV [kWp]"),
  pojemnoscMagazynuKwh: z.number().describe("Pojemność użyteczna magazynu [kWh]; w A ignorowana (0)"),
  kosztMagazynuZl: z.number().describe("Część inwestycji przypadająca na magazyn [zł] — do wymian; 0 = nie liczyć"),
  serwisRokZl: z.number().describe("Serwis całej instalacji [zł/rok] — od usera; 0 = brak"),
})

export const PorownajScenariuszeToolInput = z.object({
  segment: z.enum(["dom", "firma"]),
  horyzontLat: z.number().describe("Horyzont N [lat], 10–25 (domyślnie 15)"),
  tryb: z
    .discriminatedUnion("rodzaj", [
      z.object({ rodzaj: z.literal("suwak"), gProcent: z.number().describe("Realna zmiana cen energii ponad inflację [%/rok]: -3, 0, 5 albo 10") }),
      z.object({ rodzaj: z.literal("ue") }),
      z.object({
        rodzaj: z.literal("ue-inflacja"),
        zrodloInflacji: z.enum(["gus", "nbp", "wlasna"]),
        wlasnaInflacjaProcent: z.number().nullable(),
      }),
    ])
    .describe("Wzrost cen energii (D42): suwak (domyślnie 0), dynamika UE Reference Scenario 2020 albo UE + inflacja"),
  stopaDyskontowaProcent: z.number().describe("Stopa dyskontowa r [%/rok]; 0 = tryb prosty"),
  zuzycieMiesieczneKwh: Miesiace.describe("Zużycie w 12 miesiącach I–XII [kWh] — z faktur usera"),
  uzyskMiesiecznyKwhNaKwp: Miesiace.describe("Uzysk PV w 12 miesiącach [kWh/kWp] — z lokalizacji (PVGIS) albo od usera"),
  autokonsumpcjaBezposrednia: z.number().nullable().describe("Udział produkcji zużytej od razu (0–1)"),
  sprawnoscMagazynu: z.number().nullable().describe("Sprawność cyklu magazynu (0–1)"),
  zywotnoscMagazynuLat: z.number().nullable().describe("Żywotność magazynu [lat] z karty katalogowej"),
  siec: z.object({
    kosztStalyRokBruttoZl: z.number().nullable().describe("„Cena trzymania sieci” brutto [zł/rok] (z rozbij_rachunek_za_prad)"),
    cenaZmiennaKwhBruttoZl: z.number().nullable().describe("Koszt zmienny 1 kWh pobranej brutto [zł/kWh]"),
    wartoscNadwyzkiKwhZl: z.number().nullable().describe("Wartość 1 kWh oddanej [zł/kWh] (depozyt net-billing); 0 dozwolone"),
  }),
  agregat: z.object({
    mocKw: z.number().describe("Moc agregatu w scenariuszu D [kW]; 0 = bez agregatu"),
    zuzycieLH: z.number().nullable(),
    cenaPaliwaZlL: z.number().nullable(),
  }),
  scenariusze: z.object({ A: ScenariuszSchema, B: ScenariuszSchema, C: ScenariuszSchema, D: ScenariuszSchema }),
  kontrola: z.object({
    osobyZalezneOdZasilania: z.boolean().nullable().describe("R4: czy ktoś zależy od zasilanego sprzętu medycznego; null = nie odpowiedziano"),
    zapasRedundantny: z.boolean(),
    progGodzinAgregatuMies: z.number().nullable(),
    dopuszczalnyCzasBezZasilaniaH: z.number().nullable().describe("RF1 (firma): dopuszczalny czas bez zasilania [h]"),
  }),
})
export type PorownajScenariuszeToolInputT = z.infer<typeof PorownajScenariuszeToolInput>

const Id = z.enum(["A", "B", "C", "D"])

export const PorownajScenariuszeToolOutput = z.object({
  status: z.enum(STATUSY),
  scenariusze: z.array(
    z.object({
      id: Id,
      inwestycjaNettoZl: z.number(),
      kosztRok1Zl: z.number(),
      tcoNominalneZl: z.number(),
      tcoDzisiejszeZl: z.number(),
      okresZwrotuLat: z.number().nullable(),
      pokrycieWlasne: z.number(),
      godzinyAgregatuRok: z.number(),
      godzinyAgregatuMaxMies: z.number(),
      wymianyMagazynu: z.array(z.number()),
      odwracalny: z.boolean(),
    }),
  ),
  najtanszy: Id.nullable(),
  najbardziejNiezalezny: Id.nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PorownajScenariuszeToolOutputT = z.infer<typeof PorownajScenariuszeToolOutput>

export const porownajScenariuszeTool: AiToolDefinition<PorownajScenariuszeToolInputT, PorownajScenariuszeToolOutputT> = {
  name: "porownaj_scenariusze_przejscia",
  description:
    "Porównuje cztery scenariusze (M14, D7 dom / F8 firma): A sieć+PV, B sieć+PV+magazyn, C off-grid z siecią jako " +
    "zapasem, D pełne odłączenie z agregatem — TCO w horyzoncie N lat (dzisiejsze i nominalne zł), okres zwrotu " +
    "względem A, pokrycie własne, godziny agregatu, wymiany magazynu, odwracalność. Twarde stopy: D bez agregatu, " +
    "D przy osobach zależnych medycznie bez redundancji. Ceny sprzętu, paliwa i serwisu podaje user — nie zgaduj. " +
    "Pokazuj oba wyniki: najtańszy i najbardziej niezależny. Użyj, gdy user pyta, czy lepiej zostać przy sieci, dodać magazyn czy przejść na off-grid, i ile to kosztuje w horyzoncie lat.",
  inputSchema: PorownajScenariuszeToolInput,
  outputSchema: PorownajScenariuszeToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "siec/scenariusze-przejscia",
  handler: async (input) => {
    const wynik = calculateScenariuszePrzejscia({ ...input, rokBazowy: Number(DANE_ROZLICZEN.stanNa.slice(0, 4)) })
    const v = wynik.value
    return {
      status: wynik.status,
      scenariusze: (v?.scenariusze ?? []).map((s) => ({
        id: s.id,
        inwestycjaNettoZl: s.inwestycjaNettoZl,
        kosztRok1Zl: s.kosztRok1Zl,
        tcoNominalneZl: s.tcoNominalneZl,
        tcoDzisiejszeZl: s.tcoDzisiejszeZl,
        okresZwrotuLat: s.okresZwrotuLat,
        pokrycieWlasne: s.pokrycieWlasne,
        godzinyAgregatuRok: s.godzinyAgregatuRok,
        godzinyAgregatuMaxMies: s.godzinyAgregatuMaxMies,
        wymianyMagazynu: s.wymianyMagazynu,
        odwracalny: s.odwracalny,
      })),
      najtanszy: v?.najtanszy ?? null,
      najbardziejNiezalezny: v?.najbardziejNiezalezny ?? null,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
