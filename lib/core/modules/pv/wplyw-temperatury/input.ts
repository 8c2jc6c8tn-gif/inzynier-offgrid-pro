/**
 * Ekran 18, Moduł 3 "Instalacja PV" — "Wpływ temperatury na wydajność" (dawne 2.33,
 * docs/zrodla/Tresc_Modul_3_PV_Ekrany.md). Wzorzec D.
 *
 * Zarówno przyrost temperatury panelu ponad otoczenie (źródło: "25-30°C"), jak i współczynnik
 * temperaturowy mocy γ (źródło: "typowo -0,3 do -0,45%/°C") są podane jako zakresy, nie
 * pojedyncze liczby — oba pola wymagają ręcznego wpisania (z podpowiedzią o typowym zakresie),
 * żeby nie ukrywać wyboru wewnątrz zakresu jako cichy domyślny.
 */

export type WplywTemperaturyInput = {
  /** Temperatura otoczenia [°C]. null = jeszcze nie wpisano (0°C to legalna wartość). */
  temperaturaOtoczeniaC: number | null
  /** Przyrost temperatury panelu ponad otoczenie [°C], typowo 25-30. 0 = jeszcze nie wpisano. */
  przyrostTemperaturyC: number
  /** Współczynnik temperaturowy mocy γ [%/°C], ujemny, typowo -0,3 do -0,45. 0 = jeszcze nie wpisano. */
  gammaPctNaC: number
  /** Moc nominalna panelu (przy 25°C, STC) [W]. 0 = jeszcze nie wpisano. */
  mocNominalnaW: number
}
