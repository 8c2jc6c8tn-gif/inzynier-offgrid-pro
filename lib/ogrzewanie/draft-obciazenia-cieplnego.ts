/**
 * Draft of M6/E1 "Straty ciepła budynku" (form strings) and its mapping to the calculator input —
 * shared by E1 and by screens that take E1 "auto" (M6/E2, source: "straty ciepła (auto z Ekranu 1)").
 * UI layer (like `lib/lokalizacja/model-dzialki.ts`), not domain.
 */
import type { ObciazenieCieplneInput } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/input"
import { STREFY_KLIMATYCZNE } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/constants"
import { liczba } from "@/lib/lokalizacja/model-dzialki"

export const KLUCZ_DRAFTU_OBCIAZENIA = "obciazenie-cieplne"

export type PrzegrodaSeed = { nazwa: string; powierzchniaM2: string; uWM2K: string; zewnetrzna: boolean; temperaturaPoDrugiejStronieC: string }
export type SeedObciazenia = {
  przegrody: PrzegrodaSeed[]
  temperaturaWewnetrznaC: string
  strefa: string
  kubaturaM3: string
  wymianyPowietrzaNaH: string
  cop: string
  miesiace: string[]
}

const n = (s: string) => liczba(s) ?? null

export function wejscieObciazenia(stan: SeedObciazenia): ObciazenieCieplneInput {
  return {
    przegrody: stan.przegrody.map((p) => ({
      nazwa: p.nazwa.trim(),
      powierzchniaM2: n(p.powierzchniaM2),
      uWM2K: n(p.uWM2K),
      zewnetrzna: p.zewnetrzna,
      temperaturaPoDrugiejStronieC: p.zewnetrzna ? null : n(p.temperaturaPoDrugiejStronieC),
    })),
    temperaturaWewnetrznaC: n(stan.temperaturaWewnetrznaC),
    strefaKlimatyczna: STREFY_KLIMATYCZNE.find((s) => String(s) === stan.strefa) ?? null,
    kubaturaM3: n(stan.kubaturaM3),
    wymianyPowietrzaNaH: n(stan.wymianyPowietrzaNaH),
    cop: n(stan.cop),
    // Drafts saved before the months section existed have no `miesiace`.
    srednieTemperaturyMiesieczneC: (stan.miesiace ?? []).map(n),
  }
}
