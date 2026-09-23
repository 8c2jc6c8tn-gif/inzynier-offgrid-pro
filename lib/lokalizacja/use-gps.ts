"use client"

/**
 * Pozycja GPS urządzenia do spaceru po działce (Moduł 1, Ekran 2, tryb offline ze źródła) —
 * Geolocation API przeglądarki działa bez internetu (GNSS w urządzeniu). Każdy "Zapisz punkt"
 * to świeży odczyt (`maximumAge: 0`), nie ostatnia zapamiętana pozycja — inaczej dwa rogi działki
 * mogłyby dostać te same współrzędne. Dokładność z urządzenia zawsze pokazywana użytkownikowi.
 */
import { useCallback, useState } from "react"
import type { PunktGps } from "@/lib/core/modules/lokalizacja/skaner-dzialki/input"

export type OdczytGps = { punkt: PunktGps; dokladnoscM: number; dokladnoscWysokosciM: number | null }

const OPCJE: PositionOptions = { enableHighAccuracy: true, maximumAge: 0, timeout: 30_000 }

const KOMUNIKAT_BLEDU: Record<number, string> = {
  1: "Brak zgody na lokalizację — zezwól tej stronie na dostęp do położenia w ustawieniach przeglądarki.",
  2: "Urządzenie nie ustaliło położenia — wyjdź na otwartą przestrzeń i spróbuj ponownie.",
  3: "Upłynął czas oczekiwania na sygnał GPS — spróbuj ponownie.",
}

export function useGps() {
  const [odczyt, setOdczyt] = useState<OdczytGps | null>(null)
  const [czeka, setCzeka] = useState(false)
  const [blad, setBlad] = useState<string | null>(null)

  const odczytaj = useCallback((): Promise<OdczytGps | null> => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setBlad("Ta przeglądarka nie udostępnia GPS.")
      return Promise.resolve(null)
    }
    setCzeka(true)
    setBlad(null)
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (poz) => {
          const c = poz.coords
          const o: OdczytGps = {
            punkt: {
              szerokosc: c.latitude,
              dlugosc: c.longitude,
              ...(c.altitude !== null ? { wysokoscM: c.altitude } : {}),
            },
            dokladnoscM: c.accuracy,
            dokladnoscWysokosciM: c.altitudeAccuracy,
          }
          setOdczyt(o)
          setCzeka(false)
          resolve(o)
        },
        (err) => {
          setBlad(KOMUNIKAT_BLEDU[err.code] ?? err.message)
          setCzeka(false)
          resolve(null)
        },
        OPCJE,
      )
    })
  }, [])

  return { odczyt, czeka, blad, odczytaj }
}
