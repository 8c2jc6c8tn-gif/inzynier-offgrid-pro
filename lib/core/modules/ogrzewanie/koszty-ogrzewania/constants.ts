import type { RodzajZrodla, SposobLiczenia } from "./input"

/** Okres analizy ze źródła: "Generuje ranking opłacalności w skali 10 lat" (Biblia §6.27.13). */
export const LICZBA_LAT_ZRODLO = 10

/**
 * Grzanie oporowe (grzałka, kocioł elektryczny, promiennik IR) — cała energia elektryczna zamienia się
 * w ciepło w budynku: COP = 1 (jak `kociol-elektryczny`, źródło: "COP=1").
 */
export const COP_GRZANIA_OPOROWEGO = 1

export const SPOSOB_LICZENIA: Record<RodzajZrodla, SposobLiczenia> = {
  drewno: "paliwo",
  wegiel: "paliwo",
  pellet: "paliwo",
  gaz: "paliwo",
  olej: "paliwo",
  "inne-paliwo": "paliwo",
  "nagrzewnica-paliwowa": "karta",
  "kociol-elektryczny": "prad",
  "grzejniki-ir": "prad",
  "pompa-ciepla": "prad",
}

/** Paliwa stałe — ekran bezpieczeństwa M8/E2 (CO, odległości, nawiew). */
export const PALIWA_STALE: readonly RodzajZrodla[] = ["drewno", "wegiel", "pellet"]

/** Paliwa ciekłe olejowe — ryzyko gęstnienia na mrozie (źródło, Biblia §7: "przy –20°C olej napędowy gęstnieje"). */
export const PALIWA_OLEJOWE: readonly RodzajZrodla[] = ["olej", "nagrzewnica-paliwowa"]

/** Temperatura z tekstu źródła (parafinizacja diesla) — do komunikatu, nie próg obliczeniowy. */
export const TEMPERATURA_PARAFINIZACJI_ZRODLO_C = -20
