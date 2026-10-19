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
})
export type WiatrPowyzej30ToolInputT = z.infer<typeof WiatrPowyzej30ToolInput>

const CisnienieNaPanel = z.object({ srodekPa: z.number(), krawedzPa: z.number() })

export const WiatrPowyzej30ToolOutput = z.object({
  status: z.enum(STATUSY),
  szczytoweCisnienieWiatruPa: z.number().describe("q_p = c_e·q_b [Pa]"),
  docisk: CisnienieNaPanel,
  odrywanie: CisnienieNaPanel,
  silaWiatruN: z.number().nullable().describe("Siła wiatru na stelaż z panelami [N] (szacunek) — tylko gdy podano powierzchnię i φ; 90° to siła pozioma"),
  balastProjektowyKg: z.number().nullable().describe("Balast przeciw oderwaniu wg PN-EN 1990 (EQU) [kg], szacunek; null bez powierzchni i φ albo dla 90° (siła pozioma, balast zależy od tarcia i przewracania)"),
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
    "współczynniki z 30° zachowane dla większych kątów. Do 30° zwraca OUT_OF_SCOPE i odsyła do wyniku normowego " +
    "(Porównywarka paneli, „Złoty środek”). Strefa wiatrowa, wysokość n.p.m., kategoria terenu i wysokość konstrukcji " +
    "podaje user — nie zgaduj. Gdy user poda też powierzchnię paneli i φ (opcjonalnie masę własną), liczy siłę wiatru na " +
    "stelaż i balast przeciw oderwaniu (EQU) — tym samym wzorem co do 30°; użytkownik ustawia taki kąt i zabezpiecza " +
    "konstrukcję na własną odpowiedzialność (zawsze to przekaż), przesuw i przewracanie nie są sprawdzone. Użyj, gdy user pyta o wiatr na strome albo pionowe panele (np. ustawione pod zimowe " +
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
    })
    const v = wynik.value
    return {
      status: wynik.status,
      szczytoweCisnienieWiatruPa: v.qpPa,
      docisk: { srodekPa: v.dociskSrodekPa, krawedzPa: v.dociskKrawedzPa },
      odrywanie: { srodekPa: v.odrywanieSrodekPa, krawedzPa: v.odrywanieKrawedzPa },
      silaWiatruN: v.silaWiatruN,
      balastProjektowyKg: v.balastProjektowyKg,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
