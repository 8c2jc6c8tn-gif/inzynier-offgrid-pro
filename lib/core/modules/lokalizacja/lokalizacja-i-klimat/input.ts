/**
 * Ekran 1, Moduł 1 "Lokalizacja i teren" — "GPS i dane klimatyczne" (dawne 0.1,
 * docs/domena/Tresc_Modul_1_Lokalizacja_Ekrany.md). Tryb offline ze źródła: "ręczne wpisanie
 * współrzędnych". Nie ma tu formuły — to ekran infrastrukturalny (zapis profilu lokalizacji),
 * dane klimatyczne (nasłonecznienie miesięczne, strefa mrozowa) wymagają docelowo integracji
 * z PVGIS/PVWatts (poza zakresem tego kroku) — nie zgadujemy ich tutaj.
 */

export type LokalizacjaInput = {
  adres?: string
  szerokoscGeograficzna?: number
  dlugoscGeograficzna?: number
  /** Temperatura minimalna w lokalizacji [°C] — wpisywana ręcznie, zasila stress-testy (Moduł 7). */
  temperaturaMinimalnaC?: number
}
