"use client"

/**
 * A screen offers its RESULTS to the project (audit 4.2: the number of panels, the inverter power, the cable cross-section…
 * were computed and then went nowhere). The results appear in the quiet bar next to the screen's own field values; nothing is
 * written until the user saves. A result the user accepted becomes a design decision of the project — the other screens then
 * read it as their input (it is stored with its source screen and date, not as a hidden cache of a result).
 */
import { useCallback, useEffect, useId, useRef } from "react"
import { useAktywnyProjektId, useWartosciProjektu } from "./use-projekt"
import { kandydaciZWynikow } from "./powiazania"
import { ustawWpisPaska } from "./pasek"
import { zapiszWartosci } from "./magazyn-wartosci"
import type { WielkoscId } from "./wielkosci"

/** `wyniki`: quantity → result value, `null` while the result is not valid (nothing is offered then). */
export function useWynikiDoProjektu(kluczEkranu: string, wyniki: Partial<Record<WielkoscId, number | string | null | undefined>>): void {
  const projektId = useAktywnyProjektId()
  const wartosci = useWartosciProjektu(projektId)
  const id = useId()
  const klucz = JSON.stringify(wyniki)
  const wynikiRef = useRef(wyniki)
  const wartosciRef = useRef(wartosci)
  useEffect(() => {
    wynikiRef.current = wyniki
    wartosciRef.current = wartosci
  })

  const zapisz = useCallback(async () => {
    if (!projektId) return
    const k = kandydaciZWynikow(wynikiRef.current, wartosciRef.current ?? {})
    if (k.length > 0) await zapiszWartosci(projektId, Object.fromEntries(k.map((x) => [x.wielkosc, x.wartosc])), kluczEkranu)
  }, [projektId, kluczEkranu])

  useEffect(() => {
    if (wartosci === null) return
    ustawWpisPaska(id, { ekran: kluczEkranu, kandydaci: kandydaciZWynikow(JSON.parse(klucz), wartosci), zapisz })
  }, [id, kluczEkranu, klucz, wartosci, zapisz])
  useEffect(() => () => ustawWpisPaska(id, null), [id])
}
