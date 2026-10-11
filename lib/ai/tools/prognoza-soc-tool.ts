/**
 * Narzędzie AI (9.3) dla Modułu 10, ekran „Prognoza stanu naładowania i oś czasu” (dawne 12.4 + 12.43).
 * `operationType: 'read'`. Pojemność, stan baterii, profil doby i limity mocy MUSI podać user (karta baterii, falownik, pomiary) —
 * model nie zgaduje ani profilu produkcji, ani zużycia, ani sprawności. Brak sprawności = 100 % (brak danych), brak limitu mocy = bez limitu.
 */
import { z } from "zod"
import { calculatePrognozaSoc } from "@/lib/core/modules/ai/prognoza-soc/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PrognozaSocToolInput = z.object({
  pojemnoscUzytecznaKwh: z.number().describe("Pojemność użyteczna baterii [kWh] — z karty baterii"),
  socStartPct: z.number().describe("Stan naładowania na początku prognozy [%]"),
  socMinPct: z.number().describe("Najniższy dopuszczalny stan naładowania [%] — próg BMS/falownika albo rezerwa usera"),
  socMaksPct: z.number().optional().describe("Najwyższy stan naładowania [%] — brak = 100"),
  sprawnoscLadowaniaPct: z.number().optional().describe("Sprawność ładowania [%] z karty — brak = 100 % (nie zgaduj)"),
  sprawnoscRozladowaniaPct: z.number().optional().describe("Sprawność rozładowania [%] z karty — brak = 100 % (nie zgaduj)"),
  maksMocLadowaniaKw: z.number().optional().describe("Maks. moc ładowania [kW] (w mrozie obniżona) — brak = bez limitu"),
  maksMocRozladowaniaKw: z.number().optional().describe("Maks. moc rozładowania [kW] — brak = bez limitu"),
  godzinaStartu: z.number().describe("Godzina doby początku prognozy, 0–23"),
  horyzontH: z.number().describe("Długość prognozy [h], 1–72 (typowo 24, 48, 72)"),
  produkcjaKw: z.array(z.number()).length(8).describe("Średnia produkcja PV [kW] w 8 oknach 3-godzinnych doby, od 00–03 do 21–24 (0 gdy nic) — od usera"),
  zuzycieKw: z.array(z.number()).length(8).describe("Średnie zużycie [kW] w tych samych 8 oknach — od usera"),
  wspolczynnikDniPct: z.array(z.number().nullable()).max(3).optional().describe("Udział produkcji PV [%] w kolejnych dobach prognozy (np. 20 przy zachmurzeniu); brak = 100 % (ten sam profil)"),
})
export type PrognozaSocToolInputT = z.infer<typeof PrognozaSocToolInput>

export const PrognozaSocToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  socKoncowePct: z.number().nullable().describe("Stan naładowania na końcu prognozy [%]"),
  minSocPct: z.number().nullable(),
  minSocPoGodz: z.number().nullable().describe("Po ilu godzinach od startu SoC jest najniższy"),
  maksSocPct: z.number().nullable(),
  pierwszeMinimumPoGodz: z.number().nullable().describe("Po ilu godzinach od startu bateria osiągnie najniższy dopuszczalny stan; null = nie osiągnie w horyzoncie"),
  pierwszePelnaPoGodz: z.number().nullable().describe("Po ilu godzinach bateria osiągnie najwyższy stan"),
  niedoborKwh: z.number().nullable().describe("Energia zużycia, której bateria nie pokryje [kWh]"),
  godzinyBezZasilania: z.number().nullable(),
  nadmiarKwh: z.number().nullable().describe("Produkcja, która nie zmieści się w baterii [kWh] — czas na odbiornik elastyczny"),
  socCoGodzine: z.array(z.number()).nullable().describe("Stan naładowania [%] w godzinie 0, 1, … (horyzont + 1 wartości)"),
  osCzasu: z
    .array(z.object({ typ: z.enum(["ladowanie", "nadwyzka", "rozladowanie", "brak"]), odGodz: z.number(), doGodz: z.number() }))
    .nullable()
    .describe("Odcinki: ładowanie, nadwyżka (bateria pełna/limit mocy), rozładowanie, brak energii; godziny liczone od startu prognozy"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PrognozaSocToolOutputT = z.infer<typeof PrognozaSocToolOutput>

export const prognozaSocTool: AiToolDefinition<PrognozaSocToolInputT, PrognozaSocToolOutputT> = {
  name: "policz_prognoze_soc",
  description:
    "Prognoza stanu naładowania baterii na 24–72 godziny i oś czasu pracy (Moduł 10): symulacja godzinowa z profilu doby podanego przez usera " +
    "(średnia produkcja PV i zużycie w 8 oknach 3-godzinnych), z pojemnością, sprawnościami, limitami mocy i progiem minimum. Podaje stan co " +
    "godzinę, moment osiągnięcia minimum lub pełnej baterii, niedobór energii, nadwyżkę, która nie zmieści się w baterii (czas na odbiornik " +
    "elastyczny) oraz odcinki ładowania i rozładowania. Nie zna pogody ani temperatury — zimny akumulator user ujmuje obniżoną mocą ładowania; " +
    "profil, sprawności i limity podaje user, nie zgaduj. " +
    "Użyj, gdy user pyta, czy bateria dotrwa do rana, o której osiągnie minimum, ile energii zostanie jutro albo kiedy włączyć bojler lub pralkę, żeby użyć nadwyżki.",
  inputSchema: PrognozaSocToolInput,
  outputSchema: PrognozaSocToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ai/prognoza-soc",
  handler: async (input) => {
    const wynik = calculatePrognozaSoc({
      pojemnoscUzytecznaKwh: input.pojemnoscUzytecznaKwh,
      socStartPct: input.socStartPct,
      socMinPct: input.socMinPct,
      socMaksPct: input.socMaksPct ?? null,
      sprawnoscLadowaniaPct: input.sprawnoscLadowaniaPct ?? null,
      sprawnoscRozladowaniaPct: input.sprawnoscRozladowaniaPct ?? null,
      maksMocLadowaniaKw: input.maksMocLadowaniaKw ?? null,
      maksMocRozladowaniaKw: input.maksMocRozladowaniaKw ?? null,
      godzinaStartu: input.godzinaStartu,
      horyzontH: input.horyzontH,
      produkcjaKw: input.produkcjaKw,
      zuzycieKw: input.zuzycieKw,
      wspolczynnikDniPct: input.wspolczynnikDniPct ?? [],
    })
    const ma = wynik.status === "VALID" || wynik.status === "VALID_WITH_WARNINGS"
    const v = ma ? wynik.value : null
    return {
      status: wynik.status,
      socKoncowePct: v?.socKoncowePct ?? null,
      minSocPct: v?.minSocPct ?? null,
      minSocPoGodz: v?.minSocT ?? null,
      maksSocPct: v?.maksSocPct ?? null,
      pierwszeMinimumPoGodz: v?.pierwszeMinimumT ?? null,
      pierwszePelnaPoGodz: v?.pierwszeMaksimumT ?? null,
      niedoborKwh: v?.niedoborKwh ?? null,
      godzinyBezZasilania: v?.godzinyBezZasilania ?? null,
      nadmiarKwh: v?.nadmiarKwh ?? null,
      socCoGodzine: v?.socSeriaPct ?? null,
      osCzasu: v ? v.segmenty.map((s) => ({ typ: s.typ, odGodz: s.odT, doGodz: s.doT })) : null,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
