/**
 * Draft of M6/E1 "Straty ciepła budynku" (form strings) and its mapping to the calculator input —
 * shared by E1 and by screens that take E1 "auto" (M6/E2, source: "straty ciepła (auto z Ekranu 1)").
 * UI layer (like `lib/lokalizacja/model-dzialki.ts`), not domain.
 */
import { useMemo } from "react"
import { useOdczytDraftu } from "@/lib/adapters/use-persisted-draft"
import { calculateObciazenieCieplne, uPrzegrody, type ObciazenieCieplneResult } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/calculator"
import type { ObciazenieCieplneInput } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/input"
import { STREFY_KLIMATYCZNE } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/constants"
import { KIERUNKI_STRUMIENIA, uZWarstw } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/u-z-warstw"
import type { BudynekMrozu } from "@/lib/core/modules/stress-test/symulacja-mrozu/input"
import { liczba } from "@/lib/lokalizacja/model-dzialki"

export const KLUCZ_DRAFTU_OBCIAZENIA = "obciazenie-cieplne"

/** `materialId`: optional library pick (lib/core/dane/materialy-przegrod) — shows the status of its λ; typing λ by hand clears it. */
export type WarstwaSeed = { nazwa: string; gruboscMm: string; lambdaWmK: string; oporM2KW: string; materialId?: string }
/** `warstwy`/`kierunek` are optional: drafts saved before the layers existed have neither. */
export type PrzegrodaSeed = {
  nazwa: string
  powierzchniaM2: string
  uWM2K: string
  zewnetrzna: boolean
  temperaturaPoDrugiejStronieC: string
  warstwy?: WarstwaSeed[]
  kierunek?: string
}
/** Window or door: only area and U (no layers), always against outdoor air. A row with neither entered is ignored. */
export type OtworSeed = { nazwa: string; powierzchniaM2: string; uWM2K: string }
export type ZrodloCieplaSeed = "" | "prad" | "paliwo"
export type SeedObciazenia = {
  przegrody: PrzegrodaSeed[]
  /** Optional: drafts saved before the openings section existed have none (their windows are in `przegrody`). */
  otwory?: OtworSeed[]
  /** Optional ventilation heat recovery [%]. */
  sprawnoscOdzyskuPct?: string
  /** Heat source: "" = not chosen (a typed COP still counts as electric, as before), "prad" = electric/heat pump, "paliwo" = fuel with a stock. */
  zrodlo?: ZrodloCieplaSeed
  paliwoJednostka?: string
  paliwoWartoscOpalowaKwh?: string
  paliwoSprawnoscPct?: string
  paliwoZapas?: string
  temperaturaWewnetrznaC: string
  strefa: string
  kubaturaM3: string
  wymianyPowietrzaNaH: string
  cop: string
  miesiace: string[]
}

const n = (s: string) => liczba(s) ?? null

const czyPustyOtwor = (o: OtworSeed) => o.powierzchniaM2.trim() === "" && o.uWM2K.trim() === ""

export function wejscieObciazenia(stan: SeedObciazenia): ObciazenieCieplneInput {
  const paliwo = stan.zrodlo === "paliwo"
  return {
    przegrody: [
      ...stan.przegrody.map((p) => ({
        nazwa: p.nazwa.trim(),
        powierzchniaM2: n(p.powierzchniaM2),
        uWM2K: n(p.uWM2K),
        warstwy: (p.warstwy ?? []).map((w) => ({ nazwa: w.nazwa.trim(), gruboscMm: n(w.gruboscMm), lambdaWmK: n(w.lambdaWmK), oporM2KW: n(w.oporM2KW) })),
        kierunekStrumienia: KIERUNKI_STRUMIENIA.find((k) => k === p.kierunek) ?? null,
        zewnetrzna: p.zewnetrzna,
        temperaturaPoDrugiejStronieC: p.zewnetrzna ? null : n(p.temperaturaPoDrugiejStronieC),
      })),
      ...(stan.otwory ?? [])
        .filter((o) => !czyPustyOtwor(o))
        .map((o) => ({
          nazwa: o.nazwa.trim(),
          powierzchniaM2: n(o.powierzchniaM2),
          uWM2K: n(o.uWM2K),
          warstwy: [],
          kierunekStrumienia: null,
          zewnetrzna: true,
          temperaturaPoDrugiejStronieC: null,
        })),
    ],
    temperaturaWewnetrznaC: n(stan.temperaturaWewnetrznaC),
    strefaKlimatyczna: STREFY_KLIMATYCZNE.find((s) => String(s) === stan.strefa) ?? null,
    kubaturaM3: n(stan.kubaturaM3),
    wymianyPowietrzaNaH: n(stan.wymianyPowietrzaNaH),
    cop: paliwo ? null : n(stan.cop),
    sprawnoscOdzyskuPct: n(stan.sprawnoscOdzyskuPct ?? ""),
    paliwo: paliwo
      ? {
          jednostka: (stan.paliwoJednostka ?? "").trim(),
          wartoscOpalowaKwh: n(stan.paliwoWartoscOpalowaKwh ?? ""),
          sprawnoscPct: n(stan.paliwoSprawnoscPct ?? ""),
          zapas: n(stan.paliwoZapas ?? ""),
        }
      : null,
    // Drafts saved before the months section existed have no `miesiace`.
    srednieTemperaturyMiesieczneC: (stan.miesiace ?? []).map(n),
  }
}

/** Effective U of a partition as a form string — the typed U, otherwise U from its layers (`""` = not known yet). */
export function uPrzegrodySeed(p: PrzegrodaSeed): string {
  const u = uPrzegrody(wejscieObciazenia({ ...PUSTY_SEED, przegrody: [p] }).przegrody[0]!).u
  return u === null ? "" : String(u)
}

/** U from layers of one partition for the live preview (`null` until the direction and every layer are complete). */
export function podgladUZWarstw(p: PrzegrodaSeed) {
  const przegroda = wejscieObciazenia({ ...PUSTY_SEED, przegrody: [p] }).przegrody[0]!
  return przegroda.warstwy && przegroda.warstwy.length > 0 && przegroda.kierunekStrumienia ? uZWarstw(przegroda.warstwy, przegroda.kierunekStrumienia) : null
}

const PUSTY_SEED: SeedObciazenia = { przegrody: [], temperaturaWewnetrznaC: "", strefa: "", kubaturaM3: "", wymianyPowietrzaNaH: "", cop: "", miesiace: [] }

export type WynikEkranu1 = ObciazenieCieplneResult & { temperaturaWewnetrznaC: number }

/**
 * Screen 1 result read from its draft — for the Part 2B additions that take the design load, θe/θi or the monthly heat
 * "auto z Ekranu 1" (an empty field = this value). Null until Screen 1 is complete and valid.
 */
export function useWynikEkranu1(): WynikEkranu1 | null {
  const ekran1 = useOdczytDraftu<SeedObciazenia>(KLUCZ_DRAFTU_OBCIAZENIA)
  return useMemo(() => {
    if (!ekran1.dane) return null
    const wejscie = wejscieObciazenia(ekran1.dane)
    const w = calculateObciazenieCieplne(wejscie)
    return w.value && wejscie.temperaturaWewnetrznaC !== null ? { ...w.value, temperaturaWewnetrznaC: wejscie.temperaturaWewnetrznaC } : null
  }, [ekran1.dane])
}

/** Electric heating energy per month for the PV balance, taken from Screen 1 — or the reason why it is not available. */
export type OgrzewanieElektryczne =
  | { stan: "ok"; miesiaceKwh: number[]; rokKwh: number; temperaturaWewnetrznaC: number }
  | { stan: "brak-danych" | "paliwo" | "brak-cop" | "brak-miesiecy" }

/** Pure: 12 monthly values of electric energy for heating, only when every month is known (a missing month would silently lower the demand). */
export function ogrzewanieElektryczneZSzkicu(seed: SeedObciazenia | null): OgrzewanieElektryczne {
  if (!seed) return { stan: "brak-danych" }
  if (seed.zrodlo === "paliwo") return { stan: "paliwo" }
  const wejscie = wejscieObciazenia(seed)
  const wynik = calculateObciazenieCieplne(wejscie).value
  if (!wynik) return { stan: "brak-danych" }
  if (wejscie.cop === null) return { stan: "brak-cop" }
  const miesiace = Array<number | null>(12).fill(null)
  for (const m of wynik.miesiace ?? []) miesiace[m.miesiac - 1] = m.energiaElektrycznaKwh
  if (miesiace.some((x) => x === null)) return { stan: "brak-miesiecy" }
  const kwh = miesiace as number[]
  if (wejscie.temperaturaWewnetrznaC === null) return { stan: "brak-danych" }
  return { stan: "ok", miesiaceKwh: kwh, rokKwh: kwh.reduce((a, b) => a + b, 0), temperaturaWewnetrznaC: wejscie.temperaturaWewnetrznaC }
}

export function useOgrzewanieElektryczne(): OgrzewanieElektryczne {
  const { dane } = useOdczytDraftu<SeedObciazenia>(KLUCZ_DRAFTU_OBCIAZENIA)
  return useMemo(() => ogrzewanieElektryczneZSzkicu(dane), [dane])
}

/** What M7/E1 takes from Screen 1: the building's heat-loss coefficients, the heat source and the COP typed there (`null` = none). */
export type DaneMrozuZEkranu1 = { budynek: BudynekMrozu; zrodlo: "prad" | "paliwo"; cop: number | null }

/** Pure: only a complete and valid Screen 1 yields data; an unchosen source with a typed COP counts as electric, as in the rest of the app. */
export function daneMrozuZSzkicu(seed: SeedObciazenia | null): DaneMrozuZEkranu1 | null {
  if (!seed) return null
  const wejscie = wejscieObciazenia(seed)
  const w = calculateObciazenieCieplne(wejscie).value
  if (!w || wejscie.temperaturaWewnetrznaC === null) return null
  return {
    budynek: { wspolczynnikStratZewnetrznychWK: w.hZewnetrznyWK, stalyStrumienStratW: w.strataStalaW, temperaturaWewnetrznaC: wejscie.temperaturaWewnetrznaC },
    zrodlo: seed.zrodlo === "paliwo" ? "paliwo" : "prad",
    cop: wejscie.cop,
  }
}

export function useDaneMrozuZEkranu1(): DaneMrozuZEkranu1 | null {
  const { dane } = useOdczytDraftu<SeedObciazenia>(KLUCZ_DRAFTU_OBCIAZENIA)
  return useMemo(() => daneMrozuZSzkicu(dane), [dane])
}
