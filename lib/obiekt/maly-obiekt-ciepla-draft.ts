/**
 * Draft of the screen "Bilans ciepła małego obiektu" (form strings) and its mapping to the engine input — shared by the screen,
 * the AI tool and the Porównywarka paneli (heating added to the winter balance of a micro-installation, spec 37.7 + 44).
 * UI layer, not domain (like `lib/ogrzewanie/draft-obciazenia-cieplnego.ts`).
 */
import { useMemo } from "react"
import { useOdczytDraftu } from "@/lib/adapters/use-persisted-draft"
import { STREFY_KLIMATYCZNE } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/constants"
import { calculateMalyObiektCiepla } from "@/lib/core/modules/ogrzewanie/maly-obiekt-bilans-ciepla/calculator"
import type { MalyObiektCieplaInput } from "@/lib/core/modules/ogrzewanie/maly-obiekt-bilans-ciepla/input"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { KLUCZ_PROFILU_OBIEKTU, type ProfilObiektu } from "./profil-obiektu"

export const KLUCZ_DRAFTU_MALY_OBIEKT = "maly-obiekt-ciepla"

export type SeedMalyObiekt = {
  dlugoscM: string
  szerokoscM: string
  wysokoscM: string
  uScianWM2K: string
  uDachuWM2K: string
  uPodlogiWM2K: string
  /** "" = not chosen, "powietrze" = floor against outdoor air, "inna" = ground / unheated room below. */
  podloga: "" | "powietrze" | "inna"
  temperaturaPodPodlogaC: string
  otworyM2: string
  uOtworowWM2K: string
  temperaturaWewnetrznaC: string
  strefa: string
  wymianyPowietrzaNaH: string
  sprawnoscOdzyskuPct: string
  zrodlo: "" | "prad" | "paliwo"
  cop: string
  paliwoJednostka: string
  paliwoWartoscOpalowaKwh: string
  paliwoSprawnoscPct: string
  paliwoZapas: string
  miesiace: string[]
}

export const PUSTY_SEED_MALY_OBIEKT: SeedMalyObiekt = {
  dlugoscM: "",
  szerokoscM: "",
  wysokoscM: "",
  uScianWM2K: "",
  uDachuWM2K: "",
  uPodlogiWM2K: "",
  podloga: "",
  temperaturaPodPodlogaC: "",
  otworyM2: "",
  uOtworowWM2K: "",
  temperaturaWewnetrznaC: "",
  strefa: "",
  wymianyPowietrzaNaH: "",
  sprawnoscOdzyskuPct: "",
  zrodlo: "",
  cop: "",
  paliwoJednostka: "",
  paliwoWartoscOpalowaKwh: "",
  paliwoSprawnoscPct: "",
  paliwoZapas: "",
  miesiace: Array(12).fill(""),
}

const n = (s: string | undefined) => liczba(s ?? "") ?? null

export function wejscieMalegoObiektu(seed: SeedMalyObiekt, miesiaceUzytkowania: boolean[]): MalyObiektCieplaInput {
  const paliwo = seed.zrodlo === "paliwo"
  return {
    dlugoscM: n(seed.dlugoscM),
    szerokoscM: n(seed.szerokoscM),
    wysokoscM: n(seed.wysokoscM),
    uScianWM2K: n(seed.uScianWM2K),
    uDachuWM2K: n(seed.uDachuWM2K),
    uPodlogiWM2K: n(seed.uPodlogiWM2K),
    podlogaNadPowietrzem: seed.podloga === "" ? null : seed.podloga === "powietrze",
    temperaturaPodPodlogaC: n(seed.temperaturaPodPodlogaC),
    otworyM2: n(seed.otworyM2),
    uOtworowWM2K: n(seed.uOtworowWM2K),
    temperaturaWewnetrznaC: n(seed.temperaturaWewnetrznaC),
    strefaKlimatyczna: STREFY_KLIMATYCZNE.find((s) => String(s) === seed.strefa) ?? null,
    wymianyPowietrzaNaH: n(seed.wymianyPowietrzaNaH),
    sprawnoscOdzyskuPct: n(seed.sprawnoscOdzyskuPct),
    cop: paliwo ? null : n(seed.cop),
    paliwo: paliwo
      ? {
          jednostka: seed.paliwoJednostka.trim(),
          wartoscOpalowaKwh: n(seed.paliwoWartoscOpalowaKwh),
          sprawnoscPct: n(seed.paliwoSprawnoscPct),
          zapas: n(seed.paliwoZapas),
        }
      : null,
    srednieTemperaturyMiesieczneC: (seed.miesiace ?? []).map(n),
    miesiaceUzytkowania,
  }
}

/** Electric heating energy per month for the PV balance of a micro-installation (months of use only) — or the reason it is not available. */
export type OgrzewanieMalegoObiektu =
  | { stan: "ok"; miesiaceKwh: number[]; rokKwh: number; temperaturaWewnetrznaC: number }
  | { stan: "brak-danych" | "paliwo" | "brak-cop" | "brak-miesiecy" | "brak-miesiecy-uzytkowania" }

/** Pure; the same shape of reasons as the building variant (`ogrzewanieElektryczneZSzkicu`), plus “no months of use chosen”. */
export function ogrzewanieMalegoObiektuZSzkicu(seed: SeedMalyObiekt | null, profil: ProfilObiektu | null): OgrzewanieMalegoObiektu {
  if (!seed) return { stan: "brak-danych" }
  if (seed.zrodlo === "paliwo") return { stan: "paliwo" }
  const wejscie = wejscieMalegoObiektu(seed, profil?.miesiaceUzytkowania ?? [])
  const wynik = calculateMalyObiektCiepla(wejscie)
  if (!wynik.value) return { stan: "brak-danych" }
  if (wejscie.cop === null) return { stan: "brak-cop" }
  if (!wynik.value.obciazenie.miesiace || wynik.value.obciazenie.miesiace.length < 12) return { stan: "brak-miesiecy" }
  if (!wejscie.miesiaceUzytkowania.some(Boolean)) return { stan: "brak-miesiecy-uzytkowania" }
  const e = wynik.value.energiaElektrycznaUzytkowanieKwh
  if (!e) return { stan: "brak-miesiecy" }
  if (wejscie.temperaturaWewnetrznaC === null) return { stan: "brak-danych" }
  return { stan: "ok", miesiaceKwh: e, rokKwh: wynik.value.rokUzytkowaniaKwh!, temperaturaWewnetrznaC: wejscie.temperaturaWewnetrznaC }
}

export function useOgrzewanieMalegoObiektu(): OgrzewanieMalegoObiektu {
  const { dane } = useOdczytDraftu<SeedMalyObiekt>(KLUCZ_DRAFTU_MALY_OBIEKT)
  const profil = useOdczytDraftu<ProfilObiektu>(KLUCZ_PROFILU_OBIEKTU).dane
  return useMemo(() => ogrzewanieMalegoObiektuZSzkicu(dane, profil), [dane, profil])
}
