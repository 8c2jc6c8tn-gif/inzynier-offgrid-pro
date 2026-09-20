/**
 * Moduł zbiorczy "Wampiry energetyczne", podzakładka 2: Pomiar. Domyka dawne 1.30 ("Pomiar mocy
 * jałowej ładowarek, zasilaczy i transformatorów") + 1.38 ("Pobór własny przekaźników, sterowników
 * i modułów zdalnego sterowania") — ta sama struktura (nazwa urządzenia + zmierzona moc jałowa),
 * inna kategoria urządzeń, więc scalone w jedną ręczną listę pomiarów.
 */

export type PomiarPozycja = {
  id: string
  nazwa: string
  mocJalowaW: number
}

export type PomiarMocyJalowejInput = {
  pozycje: PomiarPozycja[]
}
