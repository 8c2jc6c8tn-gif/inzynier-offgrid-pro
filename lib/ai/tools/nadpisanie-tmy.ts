/**
 * Własne miesięczne nasłonecznienie i temperatury zamiast PVGIS TMY w narzędziach AI (INFRA-2). Ekrany czytają takie wpisy z przeglądarki
 * (`lib/lokalizacja/nadpisanie-nasloneczenia.ts`), a narzędzie działa na serwerze i nie ma do nich dostępu, więc dostaje je w wejściu
 * od modelu — wyłącznie to, co wpisał user (jak każdą inną daną w narzędziach). Dane PVGIS pobiera jak dotąd; wpisane miesiące skaluje
 * (promieniowanie) i przesuwa (temperatura) tą samą funkcją co ekran (`zastosujNadpisanie`), pozostałe zostają z TMY.
 */
import { z } from "zod"
import { pobierzTmy, type WynikTmy } from "@/lib/adapters/pvgis/tmy"
import { zastosujNadpisanie } from "@/lib/lokalizacja/nadpisanie-nasloneczenia"

/** Pola wejścia dopisywane do narzędzi, które pobierają PVGIS TMY. */
export const NadpisanieTmyPola = {
  nadpisanieGhiKwhM2: z
    .array(z.number().nullable())
    .length(12)
    .optional()
    .describe("Własne sumy promieniowania całkowitego na płaszczyznę poziomą [kWh/m²] dla miesięcy od stycznia, null = bez zmiany (zamiast PVGIS TMY). Tylko gdy user sam je podał, np. z pomiarów"),
  nadpisanieTempSrednieC: z
    .array(z.number().nullable())
    .length(12)
    .optional()
    .describe("Własne średnie temperatury powietrza [°C] dla miesięcy od stycznia, null = bez zmiany (zamiast PVGIS TMY). Tylko gdy user sam je podał"),
}

type PolaNadpisania = { nadpisanieGhiKwhM2?: (number | null)[]; nadpisanieTempSrednieC?: (number | null)[] }

/** `pobierzTmy` z zastosowanym nadpisaniem; bez wpisów zwraca dane PVGIS bez zmian. */
export async function pobierzTmyZNadpisaniem(szerokosc: number, dlugosc: number, fetchImpl: typeof fetch, pola: PolaNadpisania): Promise<WynikTmy> {
  const tmy = await pobierzTmy(szerokosc, dlugosc, fetchImpl)
  if (!tmy.ok || (!pola.nadpisanieGhiKwhM2 && !pola.nadpisanieTempSrednieC)) return tmy
  const zapis = zastosujNadpisanie(
    { szerokosc, dlugosc, pobrano: "", dane: tmy.dane },
    { szerokosc, dlugosc, ghiKwhM2: pola.nadpisanieGhiKwhM2 ?? Array<number | null>(12).fill(null), tempSrednieC: pola.nadpisanieTempSrednieC },
  )
  return { ok: true, dane: zapis.dane }
}
