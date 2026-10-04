"use client"

/**
 * Pozycja GPS urządzenia do spaceru po działce (Moduł 1, Ekran 2, tryb offline ze źródła) —
 * Geolocation API przeglądarki działa bez internetu (GNSS w urządzeniu). Każdy "Zapisz punkt"
 * to świeży odczyt (`maximumAge: 0`), nie ostatnia zapamiętana pozycja — inaczej dwa rogi działki
 * mogłyby dostać te same współrzędne. Dokładność z urządzenia zawsze pokazywana użytkownikowi.
 */
import { useCallback, useState } from "react"
import { useTranslate } from "@/lib/i18n/language-context"
import type { PunktGps } from "@/lib/core/modules/lokalizacja/skaner-dzialki/input"

export type OdczytGps = { punkt: PunktGps; dokladnoscM: number; dokladnoscWysokosciM: number | null }

const OPCJE: PositionOptions = { enableHighAccuracy: true, maximumAge: 0, timeout: 30_000 }

const KLUCZ_BLEDU: Record<number, string> = {
  1: "UI-BLAD-GPS-BRAK-ZGODY",
  2: "UI-BLAD-GPS-BRAK-POLOZENIA",
  3: "UI-BLAD-GPS-TIMEOUT",
}

export function useGps() {
  const t = useTranslate()
  const [odczyt, setOdczyt] = useState<OdczytGps | null>(null)
  const [czeka, setCzeka] = useState(false)
  const [kluczBledu, setKluczBledu] = useState<string | null>(null)

  const odczytaj = useCallback((): Promise<OdczytGps | null> => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setKluczBledu("UI-BLAD-GPS-NIEDOSTEPNY")
      return Promise.resolve(null)
    }
    setCzeka(true)
    setKluczBledu(null)
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
          setKluczBledu(KLUCZ_BLEDU[err.code] ?? "UI-BLAD-GPS-INNY")
          setCzeka(false)
          resolve(null)
        },
        OPCJE,
      )
    })
  }, [])

  return { odczyt, czeka, blad: kluczBledu ? t(kluczBledu) : null, odczytaj }
}
