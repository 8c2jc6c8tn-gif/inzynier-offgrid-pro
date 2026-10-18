/**
 * Narzędzie AI (9.3) dla Ekranu 3, Moduł 8 "Bezpieczeństwo i sytuacje awaryjne" — "Siłowniki drzwi i zamki
 * elektromagnetyczne" (dawne 11.51). `operationType: 'read'`. Zachowanie zamka przy zaniku prądu, zasilanie
 * awaryjne, ręczne otwarcie bez prądu (D53), przycisk, zwalnianie po alarmie i kontaktron — WYŁĄCZNIE od usera (karta zamka, stan instalacji);
 * model nigdy nie zakłada "tak" ani "fail-safe" — dane bezpieczeństwa życia (drogi ewakuacji).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateZamkiDrzwiEwakuacyjnych } from "@/lib/core/modules/bezpieczenstwo/zamki-drzwi-ewakuacyjnych/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const ZamkiDrzwiEwakuacyjnychToolInput = z.object({
  typZamka: z.enum(["elektromagnetyczny", "elektrozaczep", "silownik"]).nullable(),
  zachowaniePrzyZanikuZasilania: z
    .enum(["otwiera", "blokuje", "nie-wiem"])
    .nullable()
    .describe("Co robi zamek przy braku prądu (fail-safe = otwiera) — z karty zamka; gdy user nie wie: 'nie-wiem', nie zgaduj"),
  maZasilanieAwaryjne: z.boolean().describe("Zamek/sterownik na UPS lub akumulatorze — tylko deklaracja usera, nigdy domyślnie true"),
  maOtwarcieReczneMechaniczne: z
    .boolean()
    .optional()
    .describe(
      "Drzwi otwierają się ręcznie bez prądu (klamka, pochwyt antypaniczny, od środka, bez klucza) — tylko deklaracja usera; przycisk elektryczny się nie liczy",
    ),
  maPrzyciskEwakuacyjny: z.boolean().describe("Jest przycisk ewakuacyjny — tylko deklaracja usera"),
  zwalnianiePoAlarmiePozarowym: z.boolean().describe("Alarm pożarowy zwalnia zamek — tylko deklaracja usera"),
  maKontaktron: z.boolean().describe("Kontaktron potwierdza otwarcie — tylko deklaracja usera"),
})
export type ZamkiDrzwiEwakuacyjnychToolInputT = z.infer<typeof ZamkiDrzwiEwakuacyjnychToolInput>

export const ZamkiDrzwiEwakuacyjnychToolOutput = z.object({
  status: z.enum(STATUSY),
  failSafe: z.boolean().nullable(),
  liczbaBrakow: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ZamkiDrzwiEwakuacyjnychToolOutputT = z.infer<typeof ZamkiDrzwiEwakuacyjnychToolOutput>

export const zamkiDrzwiEwakuacyjnychTool: AiToolDefinition<ZamkiDrzwiEwakuacyjnychToolInputT, ZamkiDrzwiEwakuacyjnychToolOutputT> = {
  name: "sprawdz_zamki_drzwi_ewakuacyjnych",
  description:
    "Sprawdza konfigurację zamka drzwi ewakuacyjnych: czy przy zaniku prądu drzwi się otwierają (fail-safe), czy jest " +
    "zasilanie awaryjne, przycisk ewakuacyjny, zwalnianie po alarmie pożarowym i kontaktron (Moduł 8, Ekran 3). " +
    "Twardy stop: zamek blokujący bez zasilania awaryjnego i bez ręcznego otwarcia działającego bez prądu. Użyj, gdy user pyta, czy zamek elektryczny na drogach ewakuacji zachowa się bezpiecznie przy zaniku prądu i alarmie pożarowym.",
  inputSchema: ZamkiDrzwiEwakuacyjnychToolInput,
  outputSchema: ZamkiDrzwiEwakuacyjnychToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "bezpieczenstwo/zamki-drzwi-ewakuacyjnych",
  handler: async (input) => {
    const wynik = calculateZamkiDrzwiEwakuacyjnych(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
