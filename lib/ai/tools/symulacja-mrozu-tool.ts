/**
 * Narzędzie AI (9.3) dla Modułu 7 "Stress-test zimowy", Ekran 1 „Symulacja przy −20°C i −30°C”. `operationType: 'read'`.
 * Produkcja dobowa PV, zużycie, współczynnik strat budynku, COP i spadek pojemności baterii tylko od usera — model ich nie
 * zgaduje (brak → INCOMPLETE). Bez danych budynku symulacja liczy zużycie bez ogrzewania i mówi o tym w ostrzeżeniu.
 */
import { z } from "zod"
import { calculateSymulacjaMrozu } from "@/lib/core/modules/stress-test/symulacja-mrozu/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const SymulacjaMrozuToolInput = z.object({
  produkcjaDobowaKwh: z.array(z.number()).describe("Produkcja PV każdego dnia symulowanego miesiąca [kWh/dobę], 1–31 wartości — od usera (np. z PVGIS lub z ekranu); nie zgaduj"),
  korektaProdukcjiPct: z.number().optional().describe("Korekta produkcji na szron/śnieg [%], ujemna = mniej energii; pomiń = 0"),
  zuzycieBazoweDobaKwh: z.number().nullable().describe("Zużycie dobowe domu bez ogrzewania [kWh/dobę]; null gdy user nie podał"),
  dodatkoweZuzycieDobaKwh: z.number().optional().describe("Dodatkowe zużycie z mrozu (grzałki BMS, odszranianie) [kWh/dobę]; pomiń = 0"),
  budynek: z
    .object({
      wspolczynnikStratZewnetrznychWK: z.number().describe("Σ U·A przegród zewnętrznych + H_V wentylacji [W/K] (wynik Modułu 6, Ekran 1)"),
      stalyStrumienStratW: z.number().optional().describe("Strumień strat do gruntu/nieogrzewanych pomieszczeń przy θi [W], ujemny = zysk; pomiń = 0"),
      temperaturaWewnetrznaC: z.number().describe("Temperatura wewnętrzna θi [°C]"),
    })
    .optional()
    .describe("Dane cieplne budynku; bez nich zużycie liczone jest bez ogrzewania"),
  zrodloCiepla: z.enum(["prad", "paliwo"]).optional().describe("'prad' — pompa ciepła/grzałka (ogrzewanie wchodzi do zużycia prądu), 'paliwo' — kocioł/piec (bez prądu)"),
  cop: z.number().nullable().optional().describe("Ogólny COP źródła ciepła (grzałka = 1) z karty; wymagany przy ogrzewaniu elektrycznym, chyba że każdy scenariusz ma własny"),
  magazyn: z
    .object({
      pojemnoscUzytecznaKwh: z.number().describe("Pojemność użyteczna baterii w temperaturze zwykłej [kWh]"),
      sprawnoscPct: z.number().nullable().describe("Sprawność ładowania [%] z karty; null gdy nieznana"),
      stanPoczatkowyPct: z.number().optional().describe("Stan naładowania na początku miesiąca [%]; pomiń = 0 (strona bezpieczna)"),
    })
    .optional()
    .describe("Magazyn energii; pomiń = bez magazynu"),
  udzialNocyPct: z.number().nullable().optional().describe("Udział zużycia w nocy [%]; null = dzień i noc doby bilansowane razem"),
  scenariusze: z
    .array(
      z.object({
        temperaturaC: z.number().describe("Stała temperatura zewnętrzna przez miesiąc [°C], np. −20 lub −30"),
        cop: z.number().nullable().optional().describe("COP pompy przy tej temperaturze z karty; pomiń = COP ogólny"),
        spadekPojemnosciPct: z.number().nullable().optional().describe("Spadek pojemności baterii w tym mrozie [%] z karty ogniwa; pomiń = brak spadku (nie zgaduj)"),
      }),
    )
    .describe("1–6 scenariuszy temperatury"),
})
export type SymulacjaMrozuToolInputT = z.infer<typeof SymulacjaMrozuToolInput>

const Scenariusz = z.object({
  temperaturaC: z.number(),
  cieploDobaKwh: z.number().nullable(),
  pradOgrzewaniaDobaKwh: z.number().nullable(),
  zapotrzebowanieDobaKwh: z.number(),
  pojemnoscEfektywnaKwh: z.number(),
  produkcjaMiesiacaKwh: z.number(),
  zapotrzebowanieMiesiacaKwh: z.number(),
  deficytMiesiacaKwh: z.number(),
  dniZDeficytem: z.number(),
  najdluzszaSeriaDni: z.number(),
  najwiekszyDeficytDobyKwh: z.number(),
  pierwszyDzienZDeficytem: z.number().nullable(),
  pokrycieEnergetycznePct: z.number(),
})

export const SymulacjaMrozuToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  liczbaDni: z.number(),
  ogrzewanieWPopycie: z.boolean(),
  scenariusze: z.array(Scenariusz),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type SymulacjaMrozuToolOutputT = z.infer<typeof SymulacjaMrozuToolOutput>

export const symulacjaMrozuTool: AiToolDefinition<SymulacjaMrozuToolInputT, SymulacjaMrozuToolOutputT> = {
  name: "policz_symulacje_mrozu",
  description:
    "Symulacja dzień po dniu jednego miesiąca przy stałym mrozie (np. −20 i −30°C): produkcja PV dni, zużycie domu plus ogrzewanie rosnące ze spadkiem " +
    "temperatury (ciepło budynku ÷ COP), dodatkowe zużycie z mrozu i spadek pojemności baterii; zwraca dni z deficytem, najdłuższą serię, deficyt miesiąca do " +
    "pokrycia agregatem i pokrycie energetyczne (Moduł 7). Produkcję dobową, zużycie, współczynnik strat budynku, COP i spadek pojemności podaje user — nie zgaduj; " +
    "bez danych budynku zużycie jest liczone bez ogrzewania (deficyty zaniżone) — zawsze to przekaż; temperatura stała w miesiącu i brak zysków słonecznych budynku to uproszczenia. " +
    "Użyj, gdy user pyta, ile dni z deficytem będzie przy mrozie −20/−30°C, czy system da radę w mroźnym miesiącu albo ile energii zabraknie do pokrycia agregatem.",
  inputSchema: SymulacjaMrozuToolInput,
  outputSchema: SymulacjaMrozuToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/symulacja-mrozu",
  handler: async (input) => {
    const wynik = calculateSymulacjaMrozu({
      produkcjaDobowaKwh: input.produkcjaDobowaKwh,
      korektaProdukcjiPct: input.korektaProdukcjiPct ?? 0,
      zuzycieBazoweDobaKwh: input.zuzycieBazoweDobaKwh,
      dodatkoweZuzycieDobaKwh: input.dodatkoweZuzycieDobaKwh ?? 0,
      budynek: input.budynek
        ? { wspolczynnikStratZewnetrznychWK: input.budynek.wspolczynnikStratZewnetrznychWK, stalyStrumienStratW: input.budynek.stalyStrumienStratW ?? 0, temperaturaWewnetrznaC: input.budynek.temperaturaWewnetrznaC }
        : null,
      zrodloCiepla: input.zrodloCiepla ?? null,
      cop: input.cop ?? null,
      magazyn: input.magazyn ? { pojemnoscUzytecznaKwh: input.magazyn.pojemnoscUzytecznaKwh, sprawnoscPct: input.magazyn.sprawnoscPct, stanPoczatkowyPct: input.magazyn.stanPoczatkowyPct ?? 0 } : null,
      udzialNocyPct: input.udzialNocyPct ?? null,
      scenariusze: input.scenariusze.map((s) => ({ temperaturaC: s.temperaturaC, cop: s.cop ?? null, spadekPojemnosciPct: s.spadekPojemnosciPct ?? null })),
    })
    const v = wynik.value
    return {
      status: wynik.status,
      liczbaDni: v.liczbaDni,
      ogrzewanieWPopycie: v.ogrzewanieWPopycie,
      scenariusze: v.scenariusze.map((s) => Scenariusz.parse(s)),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
