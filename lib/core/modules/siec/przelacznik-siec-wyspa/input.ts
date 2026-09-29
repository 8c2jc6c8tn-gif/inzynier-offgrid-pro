/**
 * M14 — D11 „Przełącznik sieć/wyspa i bezpieczeństwo” (wspólny Dom/Firma), Wzorzec F + E.
 * `03_M14_Dom_i_Firma_Siec.md` §6, opracowanie §6.1–6.2. Hard stops 1–3 of the chapter:
 * backfeed, generator without a switch (M2/E17 block, D48), combustion generator indoors (CO).
 * Normative detail (HD 60364-5-551) is not in the repo (🔎, `docs/normy-brakujace.md`, D47).
 */
import type { BezpieczenstwoAgregatuInput } from "@/lib/core/modules/zapotrzebowanie/agregat-pradotworczy/bezpieczenstwo"

/** How the island/hybrid installation meets the grid. null = not answered. */
export type TrybPracy = "przelaczany" | "rownolegle" | "bez-sieci"

/** Switching device between grid and island (only for „przelaczany”). */
export type RodzajPrzelacznika = "reczny-z-zerem-blokada" | "szr-blokada-el-mech" | "brak-lub-bez-blokady"

export type PrzelacznikInput = BezpieczenstwoAgregatuInput & {
  trybPracy: TrybPracy | null
  przelacznik: RodzajPrzelacznika | null
  /** Neutral switched together with phases, as required by the network system. null = not known. */
  przelaczaN: boolean | null
  /** Parallel operation: microinstallation notified to the DSO (with NC RfG certificate). null = not answered. */
  zgloszenieOsd: boolean | null
  /** A generator feeds the building installation. */
  maAgregat: boolean
}
