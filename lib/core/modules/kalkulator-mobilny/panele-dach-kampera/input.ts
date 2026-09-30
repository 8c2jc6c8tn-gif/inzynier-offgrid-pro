/**
 * Ekran 19, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Ile paneli na dachu kampera"
 * (dawne 8.39, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.27). Wzorzec D.
 * Dach dzielą klimatyzator i świetliki — user wpisuje wolne odcinki dachu między nimi (panel nie
 * może przechodzić nad przeszkodą), więc wynik to realne rozmieszczenie, nie dzielenie powierzchni.
 */
export type OdcinekDachu = {
  nazwa: string
  /** Długość wolnego odcinka wzdłuż dachu [m]. */
  dlugoscM: number
}

export type PaneleDachKamperaInput = {
  /** Szerokość dachu [m]. */
  szerokoscDachuM: number
  /** Odstęp od krawędzi dachu i od przeszkód [m] — od usera (mocowania, instrukcja). */
  marginesM: number
  /** Odstęp między panelami [m] — od usera. */
  odstepM: number
  panelDlugoscM: number
  panelSzerokoscM: number
  panelMocW: number
  odcinki: OdcinekDachu[]
}
