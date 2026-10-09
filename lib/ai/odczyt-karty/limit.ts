/**
 * Limit liczby odczytów kart po stronie serwera (standard 9.6, 12.2): okno przesuwne w pamięci procesu, osobno na klucz (adres IP)
 * i łącznie dla całej aplikacji. Aplikacja nie ma jeszcze kont, więc to jedyny dostępny egzekwowany limit; w środowisku z kilkoma
 * instancjami serwera każda liczy osobno (limit jest wtedy luźniejszy, nie ostrzejszy). Prawdziwy budżet na użytkownika i funkcja
 * „AI tylko w PRO” (12.9) wymagają kont — zob. docs/lista-do-zrobienia.md.
 */

export type WynikLimitu = { ok: true } | { ok: false; ponowZaSekund: number }

export type Limiter = { sprobuj: (klucz: string) => WynikLimitu }

/** Wartości wyjściowe do potwierdzenia przez właściciela (spec 33): 10 odczytów na godzinę z jednego adresu, 200 na dobę w całej aplikacji. */
export const LIMIT_NA_KLUCZ = { maks: 10, oknoMs: 60 * 60 * 1000 } as const
export const LIMIT_GLOBALNY = { maks: 200, oknoMs: 24 * 60 * 60 * 1000 } as const

export function utworzLimiter(maks: number, oknoMs: number, teraz: () => number = Date.now): Limiter {
  const znaczniki = new Map<string, number[]>()
  return {
    sprobuj(klucz) {
      const t = teraz()
      const swieze = (znaczniki.get(klucz) ?? []).filter((z) => t - z < oknoMs)
      if (swieze.length >= maks) {
        znaczniki.set(klucz, swieze)
        return { ok: false, ponowZaSekund: Math.max(1, Math.ceil((swieze[0] + oknoMs - t) / 1000)) }
      }
      swieze.push(t)
      znaczniki.set(klucz, swieze)
      // Keys that fell silent do not pile up: drop the stale ones when the map grows.
      if (znaczniki.size > 5000) for (const [k, v] of znaczniki) if (v.every((z) => t - z >= oknoMs)) znaczniki.delete(k)
      return { ok: true }
    },
  }
}

/** Dwa limity naraz: odczyt przechodzi, tylko gdy mieści się w obu (zużycie globalne liczy się dopiero po przejściu limitu klucza). */
export function utworzLimiterOdczytu(teraz: () => number = Date.now): Limiter {
  const naKlucz = utworzLimiter(LIMIT_NA_KLUCZ.maks, LIMIT_NA_KLUCZ.oknoMs, teraz)
  const globalny = utworzLimiter(LIMIT_GLOBALNY.maks, LIMIT_GLOBALNY.oknoMs, teraz)
  return {
    sprobuj(klucz) {
      const k = naKlucz.sprobuj(klucz)
      if (!k.ok) return k
      return globalny.sprobuj("*")
    },
  }
}
