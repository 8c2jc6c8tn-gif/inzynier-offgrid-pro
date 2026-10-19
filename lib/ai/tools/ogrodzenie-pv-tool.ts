/**
 * Narzędzie AI (9.3) — ogrodzenie z paneli PV (Moduł 3). `operationType: 'read'`. Wynik to SZACUNEK (status `ESTIMATE`):
 * wiatr wg PN-EN 1991-1-4, fundament słupka wg obwiedni podejść PN-EN 1997-1, grunt wg PN-B-03020. Dane gruntu, strefa
 * wiatrowa i głębokość przemarzania pochodzą od użytkownika — model ich nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateOgrodzeniePv } from "@/lib/core/modules/pv/ogrodzenie-pv/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const OgrodzeniePvToolInput = z.object({
  dlugoscPanelaMm: z.number().describe("Długość panelu wzdłuż ogrodzenia [mm] — z niej wynika rozstaw słupków"),
  wysokoscPanelaMm: z.number().describe("Wymiar panelu w pionie [mm]"),
  przeswitMm: z.number().describe("Prześwit między gruntem a dolną krawędzią najniższego panelu [mm] — dana usera"),
  grubDoscPanelaMm: z.number().optional().describe("Grubość panelu [mm] — tylko do sprawdzenia licowania z rurą; pomiń, jeśli nie podano"),
  szczelinaPionowaMm: z.number().optional().describe("Szczelina pionowa między rzędami [mm]; pomiń → 0"),
  szczelinaPoziomaMm: z.number().optional().describe("Szczelina pozioma panel–słupek [mm]; pomiń → 0"),
  liczbaRzedow: z.number().optional().describe("Liczba rzędów paneli; pomiń → tyle, ile mieści się pod limitem wysokości"),
  maxWysokoscMm: z.number().optional().describe("Największa dopuszczalna wysokość ogrodzenia bez pozwolenia [mm] — dana usera, nie zgaduj"),
  dlugoscOgrodzeniaM: z.number().optional().describe("Długość ogrodzenia [m] — tylko do liczby słupków i paneli"),
  strefaWiatrowa: z.union([z.literal(1), z.literal(2), z.literal(3)]).describe("Strefa wiatrowa 1–3 — dana usera"),
  wysokoscNpmM: z.number().describe("Wysokość miejsca nad poziomem morza [m]"),
  kategoriaTerenu: z.enum(["0", "I", "II", "III", "IV"]).describe("Kategoria terenu — dana usera"),
  grupaGruntu: z.enum(["zwir-pospolka", "pr-ps", "pd-ppi"]).describe("Grupa gruntu niespoistego wg PN-B-03020 — wybiera user"),
  stopienZageszczeniaId: z.number().describe("Stopień zagęszczenia I_D gruntu, 0,2–1,0 — dana usera"),
  wilgotnoscGruntu: z.enum(["malo-wilgotne", "wilgotne", "mokre"]).describe("Wilgotność gruntu — dana usera"),
  gruntPodWoda: z.boolean().optional().describe("Grunt poniżej zwierciadła wody (wypór zmniejsza ciężar); pomiń → nie"),
  glebokoscPrzemarzaniaM: z.number().describe("Głębokość przemarzania w miejscu budowy [m] — dana usera, nie zgaduj"),
  gatunekStali: z.enum(["S235", "S355"]).describe("Gatunek stali rur — dana usera"),
  metodaOporuGruntu: z.enum(["zachowawcza", "broms"]).optional().describe("Metoda oporu gruntu: zachowawcza (c=1/6) albo Broms (c=1/2); pomiń → zachowawcza"),
  ugiecieDopuszczalneMm: z.number().optional().describe("Dopuszczalne ugięcie rygla [mm]; pomiń → tylko pokazane"),
})
export type OgrodzeniePvToolInputT = z.infer<typeof OgrodzeniePvToolInput>

const Profil = z.object({ glebokoscMm: z.number(), szerokoscMm: z.number(), grubosciMm: z.number() })
const Element = z.object({ profil: Profil, wykorzystanie: z.number(), ugiecieMm: z.number() }).nullable()

export const OgrodzeniePvToolOutput = z.object({
  status: z.enum(STATUSY),
  rzedy: z.number().nullable(),
  wysokoscCalkowitaMm: z.number().nullable(),
  rozstawSlupkowMm: z.number().nullable(),
  liczbaSlupkow: z.number().nullable(),
  liczbaPaneliWRzedzie: z.number().nullable(),
  szczytoweCisnienieWiatruPa: z.number().nullable(),
  silaNaSlupekN: z.number().nullable(),
  momentProjektowyNm: z.number().nullable(),
  slupek: Element.describe("Dobrany słupek — wykorzystanie 0–1, ugięcie [mm]"),
  rygiel: Element.describe("Dobrany rygiel poprzeczny"),
  katTarciaDeg: z.number().nullable(),
  fundament: z
    .object({
      srednicaMm: z.number(),
      zaglebienieKoncoweMm: z.number(),
      zaglebienieZachowawczaM: z.number(),
      zaglebienieBromsM: z.number(),
      podejscieEc7: z.enum(["PO1-K1", "PO1-K2", "PO2", "PO3"]),
      przemarzanieDecyduje: z.boolean(),
    })
    .nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type OgrodzeniePvToolOutputT = z.infer<typeof OgrodzeniePvToolOutput>

export const ogrodzeniePvTool: AiToolDefinition<OgrodzeniePvToolInputT, OgrodzeniePvToolOutputT> = {
  name: "policz_ogrodzenie_z_paneli_pv",
  description:
    "Szacuje ogrodzenie z paneli PV (Moduł 3): układ rzędów i wysokość całkowitą pod limitem wysokości bez pozwolenia, " +
    "rozstaw słupków z długości panelu, obciążenie wiatrem (PN-EN 1991-1-4), dobór profilu słupka i rygla ze stali oraz " +
    "średnicę i zagłębienie fundamentu słupka w gruncie (obwiednia podejść PN-EN 1997-1, grunt wg PN-B-03020; dwie metody " +
    "oporu gruntu pokazane obok siebie, głębokość nie mniejsza niż przemarzanie). Wynik to SZACUNEK (status ESTIMATE), " +
    "nie projekt budowlany — gatunek stali i wzór Bromsa są oznaczone „do potwierdzenia”; zawsze to przekaż. Grunt, strefę " +
    "wiatrową, przemarzanie i limit wysokości podaje user — nie zgaduj. Pod panelami zalecana geowłóknina, piasek i żwir. " +
    "Użyj, gdy user planuje ogrodzenie z paneli fotowoltaicznych i pyta o słupki, rury, fundamenty albo wysokość.",
  inputSchema: OgrodzeniePvToolInput,
  outputSchema: OgrodzeniePvToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "pv/ogrodzenie-pv",
  handler: async (input) => {
    const wynik = calculateOgrodzeniePv({
      dlugoscPanelaMm: input.dlugoscPanelaMm,
      wysokoscPanelaMm: input.wysokoscPanelaMm,
      grubDoscPanelaMm: input.grubDoscPanelaMm ?? null,
      szczelinaPionowaMm: input.szczelinaPionowaMm ?? null,
      szczelinaPoziomaMm: input.szczelinaPoziomaMm ?? null,
      przeswitMm: input.przeswitMm,
      liczbaRzedow: input.liczbaRzedow ?? null,
      maxWysokoscMm: input.maxWysokoscMm ?? null,
      dlugoscOgrodzeniaM: input.dlugoscOgrodzeniaM ?? null,
      strefaWiatrowa: input.strefaWiatrowa,
      wysokoscNpmM: input.wysokoscNpmM,
      kategoriaTerenu: input.kategoriaTerenu,
      grupaGruntu: input.grupaGruntu,
      stopienZageszczeniaId: input.stopienZageszczeniaId,
      wilgotnoscGruntu: input.wilgotnoscGruntu,
      gruntPodWoda: input.gruntPodWoda ?? false,
      glebokoscPrzemarzaniaM: input.glebokoscPrzemarzaniaM,
      gatunekStali: input.gatunekStali,
      metodaOporuGruntu: input.metodaOporuGruntu ?? "zachowawcza",
      ugiecieDopuszczalneMm: input.ugiecieDopuszczalneMm ?? null,
    })
    const v = wynik.value
    const f = v.fundament
    return {
      status: wynik.status,
      rzedy: v.rzedy,
      wysokoscCalkowitaMm: v.wysokoscCalkowitaMm,
      rozstawSlupkowMm: v.rozstawSlupkowMm,
      liczbaSlupkow: v.liczbaSlupkow,
      liczbaPaneliWRzedzie: v.liczbaPaneliWRzedzie,
      szczytoweCisnienieWiatruPa: v.qpPa,
      silaNaSlupekN: v.silaNaSlupekN,
      momentProjektowyNm: v.momentProjektowyNm,
      slupek: v.slupek,
      rygiel: v.rygiel,
      katTarciaDeg: v.katTarciaDeg,
      fundament: f && {
        srednicaMm: f.srednicaMm,
        zaglebienieKoncoweMm: f.zaglebienieKoncoweMm,
        zaglebienieZachowawczaM: f.zaglebienieZachowawczaM,
        zaglebienieBromsM: f.zaglebienieBromsM,
        podejscieEc7: f.podejscieEc7,
        przemarzanieDecyduje: f.przemarzanieDecyduje,
      },
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
