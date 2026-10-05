/**
 * Narzędzie AI (9.3) dla Modułu 7 — Ekran 12 "Ocena ryzyka i Współczynnik Bezpieczeństwa Zimowego" (dawne 6.14).
 * `operationType: 'read'`. Wagi domyślne są WSTĘPNE (propozycja asystenta, przyjęta „na razie” przez właściciela) —
 * asystent musi to powiedzieć userowi razem z wynikiem (Dyrektywa #1); wartości składowych MUSZĄ pochodzić od usera.
 */
import { z } from "zod"
import { calculateWspolczynnik } from "@/lib/core/modules/stress-test/wspolczynnik-bezpieczenstwa-zimowego/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const liczbaLubNull = (opis: string) => z.number().nullable().describe(opis)

export const WspolczynnikToolInput = z.object({
  produkcjaNajgorszyMiesiacKwh: liczbaLubNull("Produkcja PV w najgorszym miesiącu zimy [kWh]; null = nie podano"),
  zapotrzebowanieNajgorszyMiesiacKwh: liczbaLubNull("Zapotrzebowanie w tym samym miesiącu [kWh]; null = nie podano"),
  autonomiaDni: liczbaLubNull("Ile dni system działa bez słońca [dni] (np. z ekranu Blackout); null = nie podano"),
  wymaganaAutonomiaDni: liczbaLubNull("Ile dni bez słońca system ma przetrwać [dni]; null = nie podano"),
  liczbaKomponentow: liczbaLubNull("Liczba komponentów sprawdzonych pod kątem pojedynczego punktu awarii (ekran Analiza SPOF)"),
  liczbaSpof: liczbaLubNull("Ile z nich nie ma redundancji (SPOF)"),
  brakAgregatu: z.boolean().describe("true, gdy user nie ma agregatu (składowa agregatu = 0%)"),
  mocAgregatuKw: liczbaLubNull("Moc agregatu [kW]; null = nie podano"),
  mocWymaganaAgregatuKw: liczbaLubNull("Moc, którą agregat musi udźwignąć [kW]; null = nie podano"),
  oknoReakcjiH: liczbaLubNull("Ile godzin instalacja sama utrzymuje ochronę przed zamarznięciem (odbiorniki krytyczne) [h]"),
  wymaganyCzasReakcjiH: liczbaLubNull("Ile godzin user potrzebuje na reakcję (dojazd, uruchomienie agregatu) [h]"),
  wagiWlasne: z
    .object({
      pokrycie: z.number(),
      autonomia: z.number(),
      odpornosc: z.number(),
      agregat: z.number(),
      reakcja: z.number(),
    })
    .nullable()
    .describe("Własne wagi składowych [%], suma 100; null = wagi domyślne 30/25/20/15/10 (wstępne, do dopracowania)"),
  progSlabegoPunktuPct: z
    .number()
    .nullable()
    .default(null)
    .describe("Próg słabego punktu [%] podany przez usera; null = brak progu (tylko ranking składowych od najsłabszej)"),
})
export type WspolczynnikToolInputT = z.infer<typeof WspolczynnikToolInput>

export const WspolczynnikToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  wskaznikPct: z.number().nullable(),
  zestawWag: z.enum(["domyslne", "wlasne"]),
  najslabsza: z.object({ id: z.string(), wynikPct: z.number() }).nullable(),
  slabePunkty: z.array(z.string()),
  ranking: z.array(z.string()),
  brakujace: z.array(z.string()),
  skladowe: z.array(z.object({ id: z.string(), wynikPct: z.number().nullable(), wagaPct: z.number() })),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type WspolczynnikToolOutputT = z.infer<typeof WspolczynnikToolOutput>

export const wspolczynnikBezpieczenstwaZimowegoTool: AiToolDefinition<WspolczynnikToolInputT, WspolczynnikToolOutputT> = {
  name: "policz_wspolczynnik_bezpieczenstwa_zimowego",
  description:
    "Współczynnik Bezpieczeństwa Zimowego: jeden wskaźnik w procentach (średnia ważona pięciu składowych — pokrycie " +
    "energetyczne w najgorszym miesiącu, czas autonomii, odporność na awarie bez pojedynczych punktów awarii, zapas " +
    "mocy agregatu, czas reakcji na zamarznięcie), najsłabsza składowa i lista słabych punktów. Wagi domyślne są " +
    "wstępne — do dopracowania przez właściciela aplikacji; user może wpisać własne (suma 100%). Użyj, gdy user pyta, " +
    "czy jego system zda zimę, jaka jest ogólna ocena odporności zimowej albo co jest najsłabszym punktem instalacji.",
  inputSchema: WspolczynnikToolInput,
  outputSchema: WspolczynnikToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/wspolczynnik-bezpieczenstwa-zimowego",
  handler: async (input) => {
    const wynik = calculateWspolczynnik(input)
    const v = wynik.value
    return {
      status: wynik.status,
      wskaznikPct: v.wskaznikPct,
      zestawWag: v.zestawWag,
      najslabsza: v.najslabsza,
      slabePunkty: v.slabePunkty,
      ranking: v.ranking,
      brakujace: v.brakujace,
      skladowe: v.skladowe.map((c) => ({ id: c.id, wynikPct: c.wynikPct, wagaPct: c.wagaPct })),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
