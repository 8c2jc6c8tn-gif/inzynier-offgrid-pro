"use client"

/**
 * Obliczenia Modułu 1 w Web Workerze (`obliczenia.worker.ts`). Jeden worker na komponent; nowe
 * zadanie przerywa poprzednie (worker zamykany i tworzony od nowa) — wynik nieaktualnych danych
 * nigdy nie nadpisze wyniku aktualnych. Worker zamykany przy odmontowaniu ekranu.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTranslate } from "@/lib/i18n/language-context"
import { consoleReporter } from "@/lib/core/reporter"
import type { WiadomoscWorkera, ZadanieWorkera } from "./obliczenia-typy"

type BezId<T> = T extends unknown ? Omit<T, "id"> : never
type Wynik<Z extends ZadanieWorkera["typ"]> = Extract<WiadomoscWorkera, { typ: Z }>

export type StanObliczen = { liczy: boolean; gotowe: number; wszystkie: number; blad: string | null }

const STAN_SPOCZYNKU: StanObliczen = { liczy: false, gotowe: 0, wszystkie: 0, blad: null }

export function useObliczeniaWTle() {
  const t = useTranslate()
  const workerRef = useRef<Worker | null>(null)
  const idRef = useRef(0)
  const [stan, setStan] = useState<StanObliczen>(STAN_SPOCZYNKU)

  useEffect(() => () => workerRef.current?.terminate(), [])

  const uruchom = useCallback(<Z extends BezId<ZadanieWorkera>>(zadanie: Z): Promise<Wynik<Z["typ"]> | null> => {
    workerRef.current?.terminate()
    const worker = new Worker(new URL("./obliczenia.worker.ts", import.meta.url), { type: "module" })
    workerRef.current = worker
    const id = ++idRef.current
    setStan({ liczy: true, gotowe: 0, wszystkie: 0, blad: null })

    return new Promise((resolve) => {
      worker.onmessage = (e: MessageEvent<WiadomoscWorkera>) => {
        const w = e.data
        if (w.id !== idRef.current) return
        if (w.typ === "postep") {
          setStan({ liczy: true, gotowe: w.gotowe, wszystkie: w.wszystkie, blad: null })
          return
        }
        setStan(STAN_SPOCZYNKU)
        worker.terminate()
        if (workerRef.current === worker) workerRef.current = null
        resolve(w as Wynik<Z["typ"]>)
      }
      worker.onerror = (e) => {
        consoleReporter.reportError({
          userMessage: "Obliczenia nie powiodły się.",
          technicalDetails: `obliczenia.worker (${zadanie.typ}): ${e.message}`,
          source: "lib/lokalizacja/use-obliczenia-w-tle",
          cause: e,
        })
        setStan({ ...STAN_SPOCZYNKU, blad: "UI-BLAD-OBLICZENIA-NIEPOWODZENIE" })
        resolve(null)
      }
      worker.postMessage({ ...zadanie, id } as ZadanieWorkera)
    })
  }, [])

  // `stan.blad` holds a translation key; screens get the text in the current UI language.
  const stanTekst = useMemo(() => (stan.blad ? { ...stan, blad: t(stan.blad) } : stan), [stan, t])
  return { uruchom, stan: stanTekst }
}
