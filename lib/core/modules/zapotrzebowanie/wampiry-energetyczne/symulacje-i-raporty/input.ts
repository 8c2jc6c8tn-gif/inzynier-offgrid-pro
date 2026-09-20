/**
 * Moduł zbiorczy "Wampiry energetyczne", podzakładka 3: Symulacje i raporty (rdzeń modułu).
 * Trzy niezależne, ale powiązane obliczenia — dawne 1.28+1.31+1.42 (autonomia/drenaż baterii),
 * 1.43 (roczny koszt), 1.45 (wpływ na dobór systemu). 1.50 (audyt zbiorczy) to widok
 * podsumowujący nad wynikami tej i innych podzakładek, bez własnej logiki obliczeniowej.
 */

export type AutonomiaStandbyInput = {
  /** Sumaryczny pobór standby [W] — echo z podzakładki Katalog. */
  standbyW: number
  /** Pobór po wyłączeniu zbędnych urządzeń [W]. 0 = brak porównania (tylko jeden scenariusz). */
  standbyZredukowanyW: number
  pojemnoscUzytecznaKwh: number
  dodPct: number
}

export type KosztRocznyStandbyInput = {
  standbyW: number
  cenaEnergiiZlZaKwh: number
  /** Całkowite roczne zużycie domu [kWh] — do wyliczenia % udziału standby. 0 = pomiń. */
  zapotrzebowanieCalkowiteRocznaKwh: number
}

export type WplywNaDoborInput = {
  /** Dobowa energia standby [kWh/dobę] — echo z podzakładki Katalog. */
  standbyDobowaKwh: number
  /** Ile % standby użytkownik planuje wyeliminować (np. wyłącznikami). */
  eliminacjaPct: number
  dniAutonomii: number
  sprawnoscFalownikaPct: number
  dodPct: number
}
