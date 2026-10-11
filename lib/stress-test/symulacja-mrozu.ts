/**
 * Form of M7/E1 "Symulacja przy −20°C i −30°C" (strings) and its mapping to the calculator input.
 * UI layer (like `lib/ogrzewanie/draft-obciazenia-cieplnego.ts`), not domain.
 */
import type { DaneMrozuZEkranu1 } from "@/lib/ogrzewanie/draft-obciazenia-cieplnego"
import type { SymulacjaMrozuInput } from "@/lib/core/modules/stress-test/symulacja-mrozu/input"
import { liczba } from "@/lib/lokalizacja/model-dzialki"

export const KLUCZ_DRAFTU_SYMULACJI_MROZU = "symulacja-mrozu"

export type ScenariuszFormularza = { temperaturaC: string; cop: string; spadekPojemnosciPct: string }

export type StanSymulacjiMrozu = {
  /** "1".."12"; "" = not chosen. */
  miesiac: string
  mocKwp: string
  pr: string
  nachylenieDeg: string
  azymutDeg: string
  korektaProdukcjiPct: string
  zuzycieBazoweDobaKwh: string
  dodatkoweZuzycieDobaKwh: string
  /** General COP typed here; empty = the one from M6/E1. */
  cop: string
  magazynKwh: string
  magazynSprawnoscPct: string
  magazynStanPoczatkowyPct: string
  udzialNocyPct: string
  scenariusze: ScenariuszFormularza[]
}

/** The two scenarios the screen is named after (−20 °C and −30 °C); every other number is the user's. */
export const STAN_POCZATKOWY_SYMULACJI: StanSymulacjiMrozu = {
  miesiac: "",
  mocKwp: "",
  pr: "",
  nachylenieDeg: "",
  azymutDeg: "",
  korektaProdukcjiPct: "",
  zuzycieBazoweDobaKwh: "",
  dodatkoweZuzycieDobaKwh: "",
  cop: "",
  magazynKwh: "",
  magazynSprawnoscPct: "",
  magazynStanPoczatkowyPct: "",
  udzialNocyPct: "",
  scenariusze: [
    { temperaturaC: "-20", cop: "", spadekPojemnosciPct: "" },
    { temperaturaC: "-30", cop: "", spadekPojemnosciPct: "" },
  ],
}

export const PUSTY_SCENARIUSZ: ScenariuszFormularza = { temperaturaC: "", cop: "", spadekPojemnosciPct: "" }

const n = (s: string) => liczba(s) ?? null

/**
 * Optional "adders" (PV correction, extra consumption) are 0 when empty — "none"; the rest empty = no data.
 * A scenario row without a (readable) temperature is ignored — a row not filled in yet.
 */
export function wejscieSymulacjiMrozu(stan: StanSymulacjiMrozu, produkcjaDobowaKwh: number[], ekran1: DaneMrozuZEkranu1 | null): SymulacjaMrozuInput {
  const pojemnosc = n(stan.magazynKwh)
  return {
    produkcjaDobowaKwh,
    korektaProdukcjiPct: n(stan.korektaProdukcjiPct) ?? 0,
    zuzycieBazoweDobaKwh: n(stan.zuzycieBazoweDobaKwh),
    dodatkoweZuzycieDobaKwh: n(stan.dodatkoweZuzycieDobaKwh) ?? 0,
    budynek: ekran1?.budynek ?? null,
    zrodloCiepla: ekran1?.zrodlo ?? null,
    cop: n(stan.cop) ?? ekran1?.cop ?? null,
    magazyn:
      pojemnosc === null
        ? null
        : { pojemnoscUzytecznaKwh: pojemnosc, sprawnoscPct: n(stan.magazynSprawnoscPct), stanPoczatkowyPct: n(stan.magazynStanPoczatkowyPct) ?? 0 },
    udzialNocyPct: n(stan.udzialNocyPct),
    scenariusze: stan.scenariusze
      .flatMap((s) => {
        const temperaturaC = n(s.temperaturaC)
        return temperaturaC === null ? [] : [{ temperaturaC, cop: n(s.cop), spadekPojemnosciPct: n(s.spadekPojemnosciPct) }]
      }),
  }
}
