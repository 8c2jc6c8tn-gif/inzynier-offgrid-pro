/**
 * Draft of the screen "Tryb ograniczonego zużycia" (wyjazd / noc; M13 7.27 + 7.49 without telemetry) and the mapping of the appliance list
 * of Module 12 to the engine input. UI layer, not domain.
 */
import { calculateZuzyciePerUrzadzenie } from "@/lib/core/modules/kalkulator-mobilny/zuzycie-per-urzadzenie/calculator"
import type { OdbiornikTrybu, TrybOgraniczony, TrybOgraniczonegoZuzyciaInput } from "@/lib/core/modules/zapotrzebowanie/tryb-ograniczonego-zuzycia/input"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { odbiornikiObiektu, type DraftOdbiornikow } from "./zuzycie-z-odbiornikow"
import type { RodzajObiektu } from "./profil-obiektu"

export const KLUCZ_DRAFTU_TRYB_OGRANICZONY = "tryb-ograniczonego-zuzycia"

export type SeedTrybuOgraniczonego = {
  tryb: TrybOgraniczony
  /** Appliances that stay on, by id; an id absent from the map = switched off (the user chooses what stays, nothing is assumed). */
  zostaja: Record<string, boolean>
  dni: string
  godzinNocy: string
  pojemnoscKwh: string
}

export const PUSTY_SEED_TRYBU: SeedTrybuOgraniczonego = { tryb: "wyjazd", zostaja: {}, dni: "", godzinNocy: "", pojemnoscKwh: "" }

/** The appliances of the chosen site with their daily consumption [Wh]; incomplete rows of the list are left out (the list screen says so). */
export function odbiornikiDoTrybu(draft: DraftOdbiornikow | null, rodzaj: RodzajObiektu | "", zostaja: Record<string, boolean>): OdbiornikTrybu[] {
  const lista = odbiornikiObiektu(draft, rodzaj)
  if (!lista) return []
  const wynik = calculateZuzyciePerUrzadzenie({ urzadzenia: lista.urzadzenia })
  if (wynik.status === "INVALID_INPUT") return []
  return wynik.value.urzadzenia.map((u) => ({ id: u.id, nazwa: u.nazwa, zuzycieDobaWh: u.zuzycieWh, zostaje: zostaja[u.id] === true }))
}

export function wejscieTrybu(seed: SeedTrybuOgraniczonego, odbiorniki: OdbiornikTrybu[]): TrybOgraniczonegoZuzyciaInput {
  return {
    tryb: seed.tryb,
    odbiorniki,
    dniNieobecnosci: liczba(seed.dni) ?? null,
    godzinNocy: liczba(seed.godzinNocy) ?? null,
    pojemnoscUzytecznaKwh: liczba(seed.pojemnoscKwh) ?? null,
  }
}
