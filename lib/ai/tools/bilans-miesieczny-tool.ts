/**
 * Narzędzie AI (9.3) dla M14 — miesięczny bilans energii części przejściowej (D4 „Ile PV i magazynu”,
 * D5 „Zima bez sieci”). `operationType: 'read'`. Echo silnika `siec/bilans-miesieczny`: uzysk PV
 * miesiąc po miesiącu pochodzi z lokalizacji (PVGIS, M3) albo od usera, autokonsumpcja i sprawność
 * magazynu — wyłącznie od usera (brak profili OSD, D38) — model ich nie zgaduje.
 */
import { z } from "zod"
import { calculateBilansMiesieczny } from "@/lib/core/modules/siec/bilans-miesieczny/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const Miesiace = z.array(z.number()).length(12)

export const BilansMiesiecznyToolInput = z.object({
  tryb: z
    .enum(["siec", "wyspa"])
    .describe("siec = niedobór pobierany z sieci, nadwyżka oddawana; wyspa = niedobór musi pokryć agregat, nadwyżka przepada"),
  zuzycieMiesieczneKwh: Miesiace.describe("Zużycie w 12 miesiącach [kWh], od stycznia — z faktur albo profilu usera"),
  uzyskMiesiecznyKwhNaKwp: Miesiace.describe("Uzysk PV w 12 miesiącach [kWh/kWp], od stycznia — z lokalizacji (PVGIS) albo od usera; nie zgaduj"),
  mocPvKwp: z.number().describe("Moc PV [kWp]; 0 = bez PV"),
  autokonsumpcjaBezposrednia: z
    .number()
    .nullable()
    .describe("Udział produkcji PV zużyty od razu (0–1] — tylko od usera („znam swoją autokonsumpcję”); null gdy nie zna"),
  pojemnoscMagazynuKwh: z.number().describe("Pojemność użytkowa magazynu [kWh]; 0 = bez magazynu"),
  sprawnoscMagazynu: z
    .number()
    .nullable()
    .describe("Sprawność cyklu magazynu (0–1] z karty katalogowej (M4); null gdy nie podano — potrzebna tylko z magazynem"),
})
export type BilansMiesiecznyToolInputT = z.infer<typeof BilansMiesiecznyToolInput>

export const BilansMiesiecznyToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  miesiace: z.array(
    z.object({
      miesiac: z.number(),
      zuzycieKwh: z.number(),
      produkcjaKwh: z.number(),
      niedoborKwh: z.number(),
      nadwyzkaKwh: z.number(),
    }),
  ),
  zuzycieRokKwh: z.number().nullable(),
  produkcjaRokKwh: z.number().nullable(),
  niedoborRokKwh: z.number().nullable(),
  nadwyzkaRokKwh: z.number().nullable(),
  pokrycieWlasne: z.number().nullable(),
  najgorszyMiesiac: z.number().nullable(),
  niedoborZimaKwh: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type BilansMiesiecznyToolOutputT = z.infer<typeof BilansMiesiecznyToolOutput>

export const bilansMiesiecznyTool: AiToolDefinition<BilansMiesiecznyToolInputT, BilansMiesiecznyToolOutputT> = {
  name: "policz_bilans_miesieczny_energii",
  description:
    "Liczy miesiąc po miesiącu bilans energii domu/firmy z PV i magazynem (M14, D4/D5): ile energii brakuje " +
    "(z sieci albo z agregatu w trybie wyspy), ile zostaje w nadwyżce, pokrycie własne w roku, najgorszy miesiąc i " +
    "niedobór zimą (grudzień + styczeń). Wzór: E_sieć = max(0, E_zuż − E_PV·η − ΔE_mag). Uzysk PV z lokalizacji, " +
    "autokonsumpcję i sprawność magazynu podaje user — nie zgaduj. Użyj, gdy user pyta, ile PV i magazynu potrzeba, " +
    "ile energii zabraknie zimą bez sieci albo ile prądu nadal pobierze z sieci.",
  inputSchema: BilansMiesiecznyToolInput,
  outputSchema: BilansMiesiecznyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "siec/bilans-miesieczny",
  handler: async (input) => {
    const wynik = calculateBilansMiesieczny(input)
    const v = wynik.value
    return {
      status: wynik.status,
      miesiace: (v?.miesiace ?? []).map((m, i) => ({
        miesiac: i + 1,
        zuzycieKwh: m.zuzycieKwh,
        produkcjaKwh: m.produkcjaKwh,
        niedoborKwh: m.niedoborKwh,
        nadwyzkaKwh: m.nadwyzkaKwh,
      })),
      zuzycieRokKwh: v?.zuzycieRokKwh ?? null,
      produkcjaRokKwh: v?.produkcjaRokKwh ?? null,
      niedoborRokKwh: v?.niedoborRokKwh ?? null,
      nadwyzkaRokKwh: v?.nadwyzkaRokKwh ?? null,
      pokrycieWlasne: v?.pokrycieWlasne ?? null,
      najgorszyMiesiac: v?.najgorszyMiesiac == null ? null : v.najgorszyMiesiac + 1,
      niedoborZimaKwh: v?.niedoborZimaKwh ?? null,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
