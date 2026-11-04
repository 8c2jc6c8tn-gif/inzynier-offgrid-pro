/**
 * Narzędzie AI (9.3) dla ekranu „Tor słońca i energia PV godzina po godzinie” (Moduł 3). `operationType: 'read'`.
 * PVGIS TMY pobierany w handlerze po stronie serwera tylko wtedy, gdy podano nachylenie, azymut, moc i PR (jak `odstep_rzedow_paneli`);
 * gdy się nie uda, zwracamy tor słońca i energię przy czystym niebie. Handler tylko deleguje do `calculateTorSlonca` —
 * model nie zgaduje ani kątów słońca, ani energii.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateTorSlonca } from "@/lib/core/modules/pv/tor-slonca/calculator"
import { KOMUNIKAT_PVGIS } from "@/lib/lokalizacja/dane-tmy"
import { NadpisanieTmyPola, pobierzTmyZNadpisaniem } from "./nadpisanie-tmy"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const TorSloncaToolInput = z.object({
  ...NadpisanieTmyPola,
  szerokoscGeograficzna: z.number().min(-90).max(90).describe("[°]"),
  dlugoscGeograficzna: z.number().min(-180).max(180).describe("[°]"),
  miesiac: z.number().describe("Miesiąc 1–12; tor i energię liczę dla 15. dnia tego miesiąca (czas urzędowy Polski)"),
  nachylenieDeg: z.number().optional().describe("Nachylenie paneli [°], 0–90 — z azymutem, mocą i PR włącza energię PV"),
  azymutDeg: z.number().optional().describe("Azymut paneli [°]: N=0, E=90, S=180, W=270"),
  mocKwp: z.number().optional().describe("Moc zainstalowana [kWp] = liczba paneli × moc panelu; wpisuje user, nie zgaduj"),
  pr: z.number().optional().describe("Współczynnik PR 0–1 wpisany przez usera (brak wartości domyślnej, nie podstawiaj własnej)"),
  albedo: z.number().optional().describe("Albedo gruntu 0–1; bez niego wartość domyślna silnika"),
})

export type TorSloncaToolInputT = z.infer<typeof TorSloncaToolInput>

const Luk = z.object({
  id: z.enum(["lato", "rownonoc", "zima", "wybrany"]).describe("lato = 21 VI, rownonoc = 23 IX, zima = 21 XII, wybrany = 15. dzień wybranego miesiąca"),
  miesiac: z.number(),
  dzien: z.number(),
  wschodH: z.number().nullable().describe("Czas urzędowy Polski [godz., ułamek]; środek tarczy, wysokość pozorna 0°"),
  zachodH: z.number().nullable(),
  gorowanieH: z.number().nullable(),
  maksWysokoscDeg: z.number().describe("Wysokość słońca w górowaniu [°]"),
  dlugoscDniaH: z.number().describe("Czas, gdy słońce jest nad horyzontem [godz.]"),
})

export const TorSloncaToolOutput = z.object({
  status: z.enum(STATUSY),
  luki: z.array(Luk),
  energia: z
    .object({
      godziny: z.array(
        z.object({
          godzinaH: z.number().describe("Początek godziny, czas urzędowy Polski (0–23)"),
          typowaKwh: z.number().nullable().describe("Średni dzień miesiąca z TMY [kWh]; null bez danych pogodowych"),
          czysteNiebo: z.number().describe("Czyste niebo, tylko promieniowanie bezpośrednie [kWh]"),
        }),
      ),
      typowaDobaKwh: z.number().nullable(),
      czysteNiebo: z.number().describe("Doba przy czystym niebie, tylko promieniowanie bezpośrednie [kWh]"),
      szczytTypowyH: z.number().nullable(),
      miesiacamiKwhNaDobe: z.array(z.number()).nullable().describe("Średnia doba typowego dnia w miesiącach [kWh/dobę], styczeń pierwszy"),
    })
    .nullable()
    .describe("Null bez nachylenia, azymutu, mocy i PR"),
  zrodloDanych: z.string().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string().optional(),
})

export type TorSloncaToolOutputT = z.infer<typeof TorSloncaToolOutput>

/** Fabryka — `fetchImpl` wstrzykiwany w testach (jak `pobierzTmy`). */
export function utworzTorSloncaTool(fetchImpl: typeof fetch = fetch): AiToolDefinition<TorSloncaToolInputT, TorSloncaToolOutputT> {
  return {
    name: "tor_slonca_i_energia_pv",
    description:
      "Liczy tor słońca w miejscu (współrzędne) dla 21 czerwca, 23 września, 21 grudnia i 15. dnia wybranego miesiąca: wschód, zachód, górowanie, wysokość i długość dnia, " +
      "oraz — gdy user poda nachylenie, azymut, moc [kWp] i PR — energię PV godzina po godzinie: typowy dzień miesiąca z danych PVGIS i dzień przy czystym niebie (tylko promieniowanie bezpośrednie), " +
      "a także średnią dobową energię w każdym miesiącu. Nachylenie, moc i PR podaje user — nie zgaduj ich. Model PR jest uproszczony (bez osobnej poprawki na temperaturę). " +
      "Użyj, gdy user pyta, o której wschodzi i zachodzi słońce, jak wysoko stoi zimą, ile godzin panele realnie pracują, o której godzinie dają najwięcej energii albo ile z letniego uzysku zostaje w grudniu.",
    inputSchema: TorSloncaToolInput,
    outputSchema: TorSloncaToolOutput,
    operationType: "read",
    requiresConfirmation: false,
    scope: "pv/tor-slonca",
    handler: async (input) => {
      const maEnergie = input.nachylenieDeg !== undefined && input.azymutDeg !== undefined && input.mocKwp !== undefined && input.pr !== undefined
      const tmy = maEnergie ? await pobierzTmyZNadpisaniem(input.szerokoscGeograficzna, input.dlugoscGeograficzna, fetchImpl, input) : null
      const wynik = calculateTorSlonca({
        szerokoscGeograficzna: input.szerokoscGeograficzna,
        dlugoscGeograficzna: input.dlugoscGeograficzna,
        miesiac: input.miesiac,
        nachylenieDeg: input.nachylenieDeg ?? null,
        azymutDeg: input.azymutDeg ?? null,
        mocKwp: input.mocKwp ?? null,
        pr: input.pr ?? null,
        ...(input.albedo !== undefined ? { albedo: input.albedo } : {}),
        ...(tmy?.ok ? { daneGodzinowe: tmy.dane.rekordy } : {}),
      })
      const v = wynik.value
      const m = tmy?.ok ? tmy.dane.meta : null
      const ostrzezenia = tekstyOstrzezen(wynik.warnings)
      if (tmy && !tmy.ok) ostrzezenia.push(`${KOMUNIKAT_PVGIS[tmy.kod]} Policzyłem tor słońca i energię przy czystym niebie, bez typowego dnia miesiąca.`)
      return {
        status: wynik.status,
        luki: (v?.luki ?? []).map((l) => ({
          id: l.id,
          miesiac: l.miesiac,
          dzien: l.dzien,
          wschodH: l.wschodH,
          zachodH: l.zachodH,
          gorowanieH: l.gorowanieH,
          maksWysokoscDeg: l.maksWysokoscDeg,
          dlugoscDniaH: l.dlugoscDniaH,
        })),
        energia: v?.energia ?? null,
        zrodloDanych: m ? `PVGIS TMY (${m.bazaPromieniowania}, lata ${m.rokOd}–${m.rokDo})` : null,
        ostrzezenia,
        zalozenia: tekstyZalozen(wynik.assumptions),
        wersjaKalkulatora: wynik.calculatorVersion,
      }
    },
  }
}

export const torSloncaTool = utworzTorSloncaTool()
