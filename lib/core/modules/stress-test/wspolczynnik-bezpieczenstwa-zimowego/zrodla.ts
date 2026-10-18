import { calculateAnalizaSpof } from "@/lib/core/modules/stress-test/analiza-spof/calculator"
import type { KomponentSystemu } from "@/lib/core/modules/stress-test/analiza-spof/input"
import { calculateBlackout } from "@/lib/core/modules/stress-test/blackout/calculator"
import type { BlackoutInput } from "@/lib/core/modules/stress-test/blackout/input"
import { calculateStrategiaZamarzanie } from "@/lib/core/modules/stress-test/strategia-zamarzanie/calculator"
import type { OdbiornikZimowy } from "@/lib/core/modules/stress-test/strategia-zamarzanie/input"

/**
 * Values the Ekran 12 can take from the saved forms of the existing winter screens (read-only: each screen owns
 * its own draft). The seeds are the screens' form states (strings), recomputed here with the screens' own
 * engines — nothing is re-implemented. Every function returns null when the source screen is not filled in.
 *
 * Mapping of the source's cross-refs (6.1, 6.4, 6.7, 6.9, 6.11) to the current screens — see
 * `docs/lista-do-zrobienia.md` (table „M7/E12 — skąd składowe”).
 */

const liczbaLubNull = (v: string | undefined): number | null => (v === undefined || v === "" ? null : Number.isFinite(Number(v)) ? Number(v) : null)

/** Seed of `deficyty-miesieczne` (Ekran 2). */
export type SeedDeficytow = { deficyty?: string[]; moc?: string }

/** Largest monthly shortfall [kWh] and the generator power [kW] from Ekran 2. */
export function zDeficytow(seed: SeedDeficytow | null): { najwiekszyDeficytKwh: number | null; mocAgregatuKw: number | null } {
  const deficyty = (seed?.deficyty ?? []).map((v) => liczbaLubNull(v) ?? 0)
  const max = deficyty.length > 0 ? Math.max(...deficyty) : 0
  const moc = liczbaLubNull(seed?.moc)
  return { najwiekszyDeficytKwh: max > 0 ? max : null, mocAgregatuKw: moc !== null && moc > 0 ? moc : null }
}

/** Seed of `blackout` (Ekran 4): the form state, every field a string. */
export type SeedBlackout = Partial<Record<keyof BlackoutInput, string>>

/** Days of autonomy without sun vs. the scenario length, from Ekran 4. `null` = Ekran 4 incomplete. */
export function zBlackoutu(seed: SeedBlackout | null): { autonomiaDni: number; wymaganaAutonomiaDni: number; dodatkowaPojemnoscKwh: number | null } | null {
  if (!seed) return null
  const input = Object.fromEntries(
    (["pojemnoscKwh", "socStartPct", "socMinPct", "sprawnoscFalownikaPct", "zuzycieDoboweKwh", "dniScenariusza", "agregatKwhDoba"] as const).map(
      (k) => [k, liczbaLubNull(seed[k])],
    ),
  ) as BlackoutInput
  const wynik = calculateBlackout(input)
  if (wynik.status === "INCOMPLETE" || wynik.status === "INVALID_INPUT" || input.dniScenariusza === null) return null
  // dniPrzetrwania = null: the generator covers the whole daily use — the system lasts the whole scenario (this model).
  return { autonomiaDni: wynik.value.dniPrzetrwania ?? input.dniScenariusza, wymaganaAutonomiaDni: input.dniScenariusza, dodatkowaPojemnoscKwh: wynik.value.dodatkowaPojemnoscKwh }
}

/** Seed of `strategia-zamarzanie` (Ekran 6). */
export type SeedStrategii = {
  pojemnoscKwh?: string
  socPct?: string
  socMinPct?: string
  sprawnoscFalownikaPct?: string
  odbiorniki?: OdbiornikZimowy[]
}

/** How long the critical loads (freeze protection) run from the battery [h], from Ekran 6. `null` = incomplete. */
export function zStrategiiZamarzanie(seed: SeedStrategii | null): { czasKrytycznychH: number } | null {
  if (!seed) return null
  const wynik = calculateStrategiaZamarzanie({
    pojemnoscKwh: liczbaLubNull(seed.pojemnoscKwh),
    socPct: liczbaLubNull(seed.socPct),
    socMinPct: liczbaLubNull(seed.socMinPct),
    sprawnoscFalownikaPct: liczbaLubNull(seed.sprawnoscFalownikaPct),
    odbiorniki: seed.odbiorniki ?? [],
  })
  const h = wynik.value.czasKrytycznychH
  return h === null || wynik.status === "INVALID_INPUT" || wynik.status === "INCOMPLETE" ? null : { czasKrytycznychH: h }
}

/** Seed of `analiza-spof` (Ekran 10). */
export type SeedSpof = { komponenty?: KomponentSystemu[] }

/** Number of components checked and how many have no redundancy, from Ekran 10. `null` = empty list. */
export function zAnalizySpof(seed: SeedSpof | null): { liczbaKomponentow: number; liczbaSpof: number } | null {
  const komponenty = seed?.komponenty ?? []
  if (komponenty.length === 0) return null
  const wynik = calculateAnalizaSpof({ komponenty })
  return { liczbaKomponentow: wynik.value.liczbaKomponentow, liczbaSpof: wynik.value.liczbaSpof }
}
