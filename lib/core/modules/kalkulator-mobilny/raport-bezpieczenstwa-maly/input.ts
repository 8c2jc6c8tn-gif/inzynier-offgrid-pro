/**
 * Ekran 14, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Raport bezpieczeństwa małej instalacji" (dawne 8.22,
 * docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.22). Wzorzec G.
 */
import type { IdPunktuRaportu } from "./constants"

/** null = not checked yet. */
export type OdpowiedzRaportu = "ok" | "blad" | null

export type RaportBezpieczenstwaInput = {
  odpowiedzi: Partial<Record<IdPunktuRaportu, OdpowiedzRaportu>>
}
