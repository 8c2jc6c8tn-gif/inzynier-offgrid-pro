/**
 * komponenty-lokalizacja — screen text migrated from JSX (D58, ratchet list). Screens: components/lokalizacja/lista-punktow.tsx, components/lokalizacja/mapa-dzialki.tsx, components/lokalizacja/sekcja-dane-nasloniecznienia.tsx, components/lokalizacja/temperatury-z-pvgis.tsx, components/lokalizacja/widok-3d.tsx, components/lokalizacja/wykresy-zacienienia.tsx.
 */
// English: ./komponenty-lokalizacja.en.ts, Russian: ./komponenty-lokalizacja.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
export const pl = {
  "UI-LISPUN-BRAK-PUNKTOW": "Brak punktów.",
  "UI-LISPUN-WYSOKOSC-PUNKTU": "Wysokość punktu {p}",
  "UI-LISPUN-PUNKTOW-POKAZ-LISTE": "{length} punktów — pokaż listę",
  "UI-LISPUN-WYS": "wys.",
  "UI-LISPUN-USUN-PUNKT": "Usuń punkt {p}",
  "UI-MAPDZI-MAPA-DZIALKI": "Mapa działki",
  "UI-SEKDANNAS-DANE-NASLONECZNIENIA": "Dane nasłonecznienia",
  "UI-SEKDANNAS-EKRAN": "→ Ekran 2",
  "UI-SEKDANNAS-EKRAN-2": "→ Ekran 1",
  "UI-SEKDANNAS-LOKALIZACJA": "Lokalizacja: {szerokosc}°, {dlugosc}° — z: {zrodlo}",
  "UI-SEKDANNAS-TYPOWY-ROK-METEOROLOGICZNY":
    "Typowy rok meteorologiczny PVGIS ({bazaPromieniowania}, lata {rokOd}–{rokDo}), zapisany na urządzeniu {p} — działa offline.",
  "UI-SEKDANNAS-POTRZEBNE-GODZINOWE-DANE":
    "Potrzebne godzinowe dane nasłonecznienia z PVGIS (Komisja Europejska) — pobierane raz, potem zapisane na urządzeniu.",
  "UI-SEKDANNAS-BRAK-POLACZENIA-POBIERZ": "Brak połączenia — pobierz dane, gdy będziesz online.",
  "UI-SEKDANNAS-BRAK-LOKALIZACJI-ZBIERZ":
    "Brak lokalizacji — zbierz model działki (Ekran 2) albo wpisz współrzędne na Ekranie 1.",
  "UI-SEKDANNAS-POBIERAM-PVGIS": "Pobieram z PVGIS…",
  "UI-SEKDANNAS-POBIERZ-PONOWNIE": "Pobierz ponownie",
  "UI-SEKDANNAS-POBIERZ-DANE-NASLONECZNIENIA": "Pobierz dane nasłonecznienia (PVGIS)",
  "UI-TEMZPVG-TEMPERATURY-MOZE-WSTAWIC":
    "Temperatury może wstawić aplikacja z danych PVGIS dla Twojej lokalizacji — najpierw wpisz współrzędne na",
  "UI-TEMZPVG-ALBO-ZBIERZ": "albo zbierz",
  "UI-TEMZPVG-EKRANIE-LOKALIZACJI": "Ekranie 1 Lokalizacji",
  "UI-TEMZPVG-MODEL-DZIALKI": "model działki",
  "UI-TEMZPVG-SREDNIE-MIESIECZNE-TEMPERATU":
    "Średnie miesięczne temperatury powietrza z typowego roku meteorologicznego PVGIS (baza {bazaMeteo}, lata {rokOd}–{rokDo}) dla lokalizacji projektu: od {p} do {p2} °C.",
  "UI-TEMZPVG-WSTAW-TEMPERATURY-PVGIS": "Wstaw temperatury z PVGIS",
  "UI-TEMZPVG-BRAK-POLACZENIA-POBIERZ": "Brak połączenia — pobierz dane, gdy będziesz online.",
  "UI-TEMZPVG-DANE-PVGIS-ZAPISANE":
    "Dane PVGIS zapisane {p} nie zawierają temperatur (starsza wersja zapisu) — pobierz je ponownie.",
  "UI-TEMZPVG-TEMPERATURY-MOZE-WSTAWIC-2":
    "Temperatury może wstawić aplikacja z danych PVGIS (Komisja Europejska) dla lokalizacji projektu — pobierane raz, potem zapisane na urządzeniu.",
  "UI-TEMZPVG-POBIERAM-PVGIS": "Pobieram z PVGIS…",
  "UI-TEMZPVG-POBIERZ-DANE-PVGIS": "Pobierz dane PVGIS",
  "UI-WID3D-WIDOK-DZIALKI-MAPA": "Widok 3D działki z mapą cieplną zacienienia",
  "UI-WYKZAC-STRATA-MIESIACACH": "Strata w miesiącach [%]",
  "UI-WYKZAC-MAKS": "maks. {max}%",
  "UI-WYKZAC-PROFIL-HORYZONTU-PRZESZKOD": "Profil horyzontu przeszkód (wzniesienie nad horyzontem)",
  "UI-WYKZAC-OBECNIE-PELNE-PROGNOZA": "— obecnie (pełne) i prognoza (obrys)",
  "UI-WYKZAC-STRATA-PROMIENIOWANIA-KOLEJN": "Strata promieniowania w kolejnych miesiącach",
  "UI-WYKZAC-PROGNOZA": "{p} (prognoza): {p2}%",
  "UI-WYKZAC-PROFIL-HORYZONTU-PRZESZKOD-2": "Profil horyzontu przeszkód w funkcji azymutu",
  "UI-SEKDANNAS-NADPISANIE-TYTUL": "Własne miesięczne sumy promieniowania (opcjonalnie)",
  "UI-SEKDANNAS-NADPISANIE-OPIS": "Jeśli masz własne pomiary albo inne źródło danych, wpisz sumę promieniowania na płaszczyznę poziomą dla wybranych miesięcy. Godzinowe dane PVGIS tego miesiąca zostaną przeskalowane tak, żeby suma się zgadzała; puste pole = dane PVGIS bez zmian. Dotyczy kalkulatorów w aplikacji, nie narzędzia AI.",
  "UI-SEKDANNAS-NADPISANIE-PVGIS": "PVGIS: {suma} kWh/m²",
  "UI-SEKDANNAS-NADPISANIE-WSPOLCZYNNIK": "Skala względem PVGIS: ×{k}",
  "UI-SEKDANNAS-NADPISANIE-NIEPOPRAWNE": "Wartość musi być dodatnia — pole jest pomijane.",
  "UI-SEKDANNAS-NADPISANIE-WYCZYSC": "Wróć do danych PVGIS",
  "UI-SEKDANNAS-TEMP-TYTUL": "Własne średnie temperatury miesięczne",
  "UI-SEKDANNAS-TEMP-OPIS": "Wpisz średnią temperaturę powietrza wybranych miesięcy (°C), jeśli Twoje miejsce jest cieplejsze albo zimniejsze niż punkt PVGIS. Temperatury godzinowe tego miesiąca przesuwam o tę samą różnicę — przebieg dobowy zostaje, średnia równa się wpisanej. Puste pole = dane PVGIS.",
  "UI-SEKDANNAS-TEMP-PVGIS": "PVGIS: {temp} °C",
  "UI-SEKDANNAS-TEMP-PRZESUNIECIE": "Przesunięcie: {dt} K",
  "UI-SEKDANNAS-TEMP-NIEPOPRAWNE": "Wpisz temperaturę od −60 do 60 °C albo zostaw puste.",
  "UI-SEKDANNAS-TEMP-AKTYWNE": "Własne temperatury: {n} mies.",
  "UI-SEKDANNAS-NADPISANIE-AKTYWNE": "Liczone z własnych sum miesięcznych ({n} z 12 miesięcy).",
} as const
