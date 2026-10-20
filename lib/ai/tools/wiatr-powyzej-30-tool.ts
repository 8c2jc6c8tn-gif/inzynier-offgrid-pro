/**
 * Narzędzie AI (9.3) — wiatr dla paneli na konstrukcji pod kątem powyżej 30° do 90° (Moduł 3). `operationType: 'read'`.
 * Norma (Eurokod, Tablica 7.6) kończy się na 30°; ten kalkulator zwraca SZACUNEK aplikacji (status `ESTIMATE`,
 * standard 3.3), nigdy wynik normowy. Strefa wiatrowa, wysokość n.p.m., kategoria terenu i wysokość konstrukcji pochodzą
 * od użytkownika — model ich nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateWiatrPowyzej30 } from "@/lib/core/modules/pv/wiatr-powyzej-30/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const WiatrPowyzej30ToolInput = z.object({
  nachylenieDeg: z.number().describe("Nachylenie paneli na konstrukcji [°], powyżej 30° do 90° — dana usera, nie zgaduj"),
  strefaWiatrowa: z.union([z.literal(1), z.literal(2), z.literal(3)]).describe("Strefa wiatrowa 1–3 (Załącznik krajowy, Tablica NA.1) — dana usera"),
  wysokoscNpmM: z.number().describe("Wysokość miejsca nad poziomem morza [m]"),
  kategoriaTerenu: z.enum(["0", "I", "II", "III", "IV"]).describe("Kategoria terenu wg Tablicy NA.3 — dana usera"),
  wysokoscKonstrukcjiM: z.number().describe("Wysokość konstrukcji (środka paneli) nad terenem [m]"),
  powierzchniaM2: z.number().optional().describe("Powierzchnia grupy paneli [m²] — pomiń, jeśli user nie podał; z φ pozwala policzyć siłę na stelaż i balast"),
  wspolczynnikPhi: z.number().optional().describe("Zabudowa pod stelażem φ (0 = pusto, 1 = zastawione), 0–1 — pomiń, jeśli user nie podał; nie zgaduj"),
  masaPaneliStelazaKg: z.number().optional().describe("Masa paneli i stelaża dla tej powierzchni bez balastu [kg] — tylko z karty/wagi, nigdy nie zgaduj; pomiń → balast bez odliczenia masy własnej (bezpieczniej)"),
  wspolczynnikTarcia: z.number().optional().describe("Współczynnik tarcia stelaża/balastu o podłoże μ = tan δk (charakterystyczny) — tylko od usera, nigdy nie zgaduj; razem z wysokością punktu przyłożenia siły i szerokością podstawy włącza sprawdzenie przesuwu i przewracania"),
  wysokoscSrodkaParciaM: z.number().optional().describe("Wysokość punktu przyłożenia siły wiatru nad terenem [m] (środek paneli) — tylko od usera"),
  szerokoscPodstawyM: z.number().optional().describe("Szerokość podstawy stelaża w kierunku wiatru [m] — tylko od usera"),
  metodaCf: z.enum(["liniowa", "trend"]).optional().describe("Metoda szacunku współczynnika siły cf dla kątów 31–89° (norma podaje tylko do 30° i 1,80 dla pionu): liniowa (domyślna) albo trend (ostrożniejsza). Użyj, gdy user pyta o inny sposób oszacowania albo chce porównać; pomiń → liniowa"),
})
export type WiatrPowyzej30ToolInputT = z.infer<typeof WiatrPowyzej30ToolInput>

const CisnienieNaPanel = z.object({ srodekPa: z.number(), krawedzPa: z.number() })

export const WiatrPowyzej30ToolOutput = z.object({
  status: z.enum(STATUSY),
  szczytoweCisnienieWiatruPa: z.number().describe("q_p = c_e·q_b [Pa]"),
  docisk: CisnienieNaPanel,
  odrywanie: CisnienieNaPanel,
  silaWiatruN: z.number().nullable().describe("Siła wiatru na stelaż z panelami [N] (szacunek) — tylko gdy podano powierzchnię i φ; 90° to siła pozioma"),
  balastProjektowyKg: z.number().nullable().describe("Balast wg PN-EN 1990 (EQU) [kg], szacunek = największy ze sprawdzonych warunków; null bez powierzchni i φ albo dla 90° bez danych stateczności (siła pozioma, balast zależy od tarcia i przewracania)"),
  balastOderwanieKg: z.number().nullable().describe("Składnik: balast przeciw oderwaniu [kg]; null dla 90° albo bez powierzchni i φ"),
  balastPrzesuwKg: z.number().nullable().describe("Składnik: balast przeciw przesuwowi [kg]; null bez μ, wysokości i podstawy"),
  podejscieEc7Przesuw: z.enum(["PO1-K1", "PO1-K2", "PO2", "PO3"]).nullable().describe("Podejście obliczeniowe PN-EN 1997-1 (p. 2.4.7.3.4), które daje największy balast przesuwu wg p. 6.5.3 — obwiednia czterech kombinacji, bo brak Załącznika krajowego; null bez danych stateczności. Przekaż userowi, że przesuw liczony jest wg Eurokodu 7, a nie wg EQU"),
  warunekRozstrzygajacy: z.enum(["oderwanie", "przesuw", "przewracanie"]).nullable().describe("Który ze sprawdzonych warunków daje największy balast i wyznacza balastKg/balastProjektowyKg — przekaż userowi, który to warunek"),
  balastPrzewracanieKg: z.number().nullable().describe("Składnik: balast przeciw przewróceniu [kg]; null bez μ, wysokości i podstawy"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type WiatrPowyzej30ToolOutputT = z.infer<typeof WiatrPowyzej30ToolOutput>

export const wiatrPowyzej30Tool: AiToolDefinition<WiatrPowyzej30ToolInputT, WiatrPowyzej30ToolOutputT> = {
  name: "policz_wiatr_na_panele_powyzej_30_stopni",
  description:
    "Szacuje ciśnienie wiatru na panele PV na konstrukcji pod kątem powyżej 30° do 90° (Moduł 3). Norma (Eurokod, " +
    "Tablica 7.6) kończy się na 30°, więc wynik jest SZACUNKIEM aplikacji (status ESTIMATE), nie wynikiem normowym: " +
    "współczynniki ciśnienia z 30° zachowane dla większych kątów, a współczynnik siły (stelaż) liczony dla każdego kąta interpolacją liniową między 30° (Tablica 7.6) a 90° (cf = 1,80). Do 30° zwraca OUT_OF_SCOPE i odsyła do wyniku normowego " +
    "(Porównywarka paneli, „Złoty środek”). Strefa wiatrowa, wysokość n.p.m., kategoria terenu i wysokość konstrukcji " +
    "podaje user — nie zgaduj. Gdy user poda też powierzchnię paneli i φ (opcjonalnie masę własną), liczy siłę wiatru na " +
    "stelaż i balast przeciw oderwaniu (EQU) — tym samym wzorem co do 30°; użytkownik ustawia taki kąt i zabezpiecza " +
    "konstrukcję na własną odpowiedzialność (zawsze to przekaż). Gdy user poda też współczynnik tarcia μ, wysokość punktu przyłożenia siły i szerokość podstawy, sprawdza także przesuw (wg PN-EN 1997-1 p. 6.5.3, obwiednia podejść obliczeniowych) i przewracanie (EQU) — szacunek; dla 90° to jedyny sposób na balast. Współczynnik tarcia user może policzyć z kąta tarcia gruntu φ′cv z dokumentacji geotechnicznej: μ = tan(2/3·φ′cv) dla bloczków prefabrykowanych — bez kompletu tych trzech tylko oderwanie. Użyj, gdy user pyta o wiatr na strome albo pionowe panele (np. ustawione pod zimowe " +
    "słońce) i trzeba uczciwie zaznaczyć, że to szacunek poza normą.",
  inputSchema: WiatrPowyzej30ToolInput,
  outputSchema: WiatrPowyzej30ToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "pv/wiatr-powyzej-30",
  handler: async (input) => {
    const wynik = calculateWiatrPowyzej30({
      nachylenieDeg: input.nachylenieDeg,
      strefaWiatrowa: input.strefaWiatrowa,
      wysokoscNpmM: input.wysokoscNpmM,
      kategoriaTerenu: input.kategoriaTerenu,
      wysokoscKonstrukcjiM: input.wysokoscKonstrukcjiM,
      powierzchniaM2: input.powierzchniaM2 ?? null,
      wspolczynnikPhi: input.wspolczynnikPhi ?? null,
      masaPaneliStelazaKg: input.masaPaneliStelazaKg ?? null,
      wspolczynnikTarcia: input.wspolczynnikTarcia ?? null,
      wysokoscSrodkaParciaM: input.wysokoscSrodkaParciaM ?? null,
      szerokoscPodstawyM: input.szerokoscPodstawyM ?? null,
      metodaCf: input.metodaCf ?? "liniowa",
    })
    const v = wynik.value
    return {
      status: wynik.status,
      szczytoweCisnienieWiatruPa: v.qpPa,
      docisk: { srodekPa: v.dociskSrodekPa, krawedzPa: v.dociskKrawedzPa },
      odrywanie: { srodekPa: v.odrywanieSrodekPa, krawedzPa: v.odrywanieKrawedzPa },
      silaWiatruN: v.silaWiatruN,
      balastProjektowyKg: v.balastProjektowyKg,
      balastOderwanieKg: v.balastOderwanieKg,
      balastPrzesuwKg: v.balastPrzesuwKg,
      balastPrzewracanieKg: v.balastPrzewracanieKg,
      warunekRozstrzygajacy: v.warunekRozstrzygajacy,
      podejscieEc7Przesuw: v.podejscieEc7Przesuw,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
