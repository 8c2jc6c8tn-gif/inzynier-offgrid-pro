/**
 * Ekran 26, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Zasilanie urządzeń medycznych" (dawne 8.51,
 * docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.39). Wzorzec D. Moc, czas pracy, część
 * użyteczna i sprawność falownika — od usera (Dyrektywa #1).
 */
import type { UrzadzenieMedyczne } from "./constants"

export type UrzadzeniaMedyczneInput = {
  urzadzenie: UrzadzenieMedyczne | null
  /** Moc urządzenia [W] (z tabliczki / instrukcji). */
  mocW: number
  /** Godziny pracy na dobę [h] (zwykle cała noc). */
  godzinNaDobe: number
  napiecieV: number
  /** Część użyteczna pojemności (DoD) [%]. */
  uzytecznaPct: number
  /** Zasilanie przez falownik 230 V (true) albo bezpośrednio DC (false); null = nie wybrano. */
  przezFalownik: boolean | null
  /** Sprawność falownika [%] — tylko przy przezFalownik = true. */
  sprawnoscFalownikaPct: number
  /** Posiadany akumulator [Ah]; 0 = nie sprawdzaj. */
  posiadanyAh: number
  /** Czy jest drugie, niezależne źródło (drugi akumulator, powerbank medyczny, agregat); null = nie wiadomo. */
  maZapasoweZrodlo: boolean | null
}
