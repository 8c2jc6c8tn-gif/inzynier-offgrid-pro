import type { CalcResult } from "@/lib/core/calc-result"
import type { AnalizaZacienieniaResult } from "@/lib/core/modules/lokalizacja/analiza-zacienienia/calculator"
import type { AnalizaZacienieniaInput } from "@/lib/core/modules/lokalizacja/analiza-zacienienia/input"
import type { OrientacjaPowierzchniResult } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/calculator"
import type { OrientacjaPowierzchniInput } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"

/** Protokół `obliczenia.worker.ts` ↔ `use-obliczenia-w-tle.ts`. */
export type ZadanieWorkera =
  | { id: number; typ: "zacienienie"; wejscia: AnalizaZacienieniaInput[] }
  | { id: number; typ: "orientacja"; wejscie: OrientacjaPowierzchniInput }

export type WiadomoscWorkera =
  | { id: number; typ: "postep"; gotowe: number; wszystkie: number }
  | { id: number; typ: "zacienienie"; wyniki: CalcResult<AnalizaZacienieniaResult>[] }
  | { id: number; typ: "orientacja"; wynik: CalcResult<OrientacjaPowierzchniResult> }
