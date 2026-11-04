// English texts of ./komponenty-lokalizacja.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./komponenty-lokalizacja"

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-LISPUN-BRAK-PUNKTOW": "No points.",
  "UI-LISPUN-WYSOKOSC-PUNKTU": "Height of point {p}",
  "UI-LISPUN-PUNKTOW-POKAZ-LISTE": "{length} points — show the list",
  "UI-LISPUN-WYS": "h.",
  "UI-LISPUN-USUN-PUNKT": "Remove point {p}",
  "UI-MAPDZI-MAPA-DZIALKI": "Plot map",
  "UI-SEKDANNAS-DANE-NASLONECZNIENIA": "Irradiation data",
  "UI-SEKDANNAS-EKRAN": "→ Screen 2",
  "UI-SEKDANNAS-EKRAN-2": "→ Screen 1",
  "UI-SEKDANNAS-LOKALIZACJA": "Location: {szerokosc}°, {dlugosc}° — from: {zrodlo}",
  "UI-SEKDANNAS-TYPOWY-ROK-METEOROLOGICZNY":
    "PVGIS typical meteorological year ({bazaPromieniowania}, years {rokOd}–{rokDo}), stored on the device {p} — works offline.",
  "UI-SEKDANNAS-POTRZEBNE-GODZINOWE-DANE":
    "Hourly irradiation data from PVGIS (European Commission) is needed — downloaded once, then stored on the device.",
  "UI-SEKDANNAS-BRAK-POLACZENIA-POBIERZ": "No connection — download the data when you are online.",
  "UI-SEKDANNAS-BRAK-LOKALIZACJI-ZBIERZ":
    "No location — capture the plot model (Screen 2) or enter the coordinates on Screen 1.",
  "UI-SEKDANNAS-POBIERAM-PVGIS": "Downloading from PVGIS…",
  "UI-SEKDANNAS-POBIERZ-PONOWNIE": "Download again",
  "UI-SEKDANNAS-POBIERZ-DANE-NASLONECZNIENIA": "Download irradiation data (PVGIS)",
  "UI-TEMZPVG-TEMPERATURY-MOZE-WSTAWIC":
    "The app can insert the temperatures from PVGIS data for your location — first enter the coordinates on",
  "UI-TEMZPVG-ALBO-ZBIERZ": "or capture the",
  "UI-TEMZPVG-EKRANIE-LOKALIZACJI": "Location Screen 1",
  "UI-TEMZPVG-MODEL-DZIALKI": "plot model",
  "UI-TEMZPVG-SREDNIE-MIESIECZNE-TEMPERATU":
    "Monthly mean air temperatures from the PVGIS typical meteorological year (database {bazaMeteo}, years {rokOd}–{rokDo}) for the project location: from {p} to {p2} °C.",
  "UI-TEMZPVG-WSTAW-TEMPERATURY-PVGIS": "Insert temperatures from PVGIS",
  "UI-TEMZPVG-BRAK-POLACZENIA-POBIERZ": "No connection — download the data when you are online.",
  "UI-TEMZPVG-DANE-PVGIS-ZAPISANE":
    "The PVGIS data saved {p} contains no temperatures (older save format) — download it again.",
  "UI-TEMZPVG-TEMPERATURY-MOZE-WSTAWIC-2":
    "The app can insert the temperatures from PVGIS data (European Commission) for the project location — downloaded once, then stored on the device.",
  "UI-TEMZPVG-POBIERAM-PVGIS": "Downloading from PVGIS…",
  "UI-TEMZPVG-POBIERZ-DANE-PVGIS": "Download PVGIS data",
  "UI-WID3D-WIDOK-DZIALKI-MAPA": "3D view of the plot with the shading heat map",
  "UI-WYKZAC-STRATA-MIESIACACH": "Loss by month [%]",
  "UI-WYKZAC-MAKS": "max. {max}%",
  "UI-WYKZAC-PROFIL-HORYZONTU-PRZESZKOD": "Obstacle horizon profile (elevation above the horizon)",
  "UI-WYKZAC-OBECNIE-PELNE-PROGNOZA": "— now (filled) and forecast (outline)",
  "UI-WYKZAC-STRATA-PROMIENIOWANIA-KOLEJN": "Radiation loss in successive months",
  "UI-WYKZAC-PROGNOZA": "{p} (forecast): {p2}%",
  "UI-WYKZAC-PROFIL-HORYZONTU-PRZESZKOD-2": "Obstacle horizon profile as a function of azimuth",
  "UI-SEKDANNAS-NADPISANIE-TYTUL": "Your own monthly radiation totals (optional)",
  "UI-SEKDANNAS-NADPISANIE-OPIS": "If you have your own measurements or another data source, enter the radiation total on the horizontal plane for the chosen months. The hourly PVGIS data of that month is rescaled so that the total matches; an empty field = PVGIS data unchanged. It applies to the calculators in the app, not to the AI tool.",
  "UI-SEKDANNAS-NADPISANIE-PVGIS": "PVGIS: {suma} kWh/m²",
  "UI-SEKDANNAS-NADPISANIE-WSPOLCZYNNIK": "Scale relative to PVGIS: ×{k}",
  "UI-SEKDANNAS-NADPISANIE-NIEPOPRAWNE": "The value must be positive — the field is ignored.",
  "UI-SEKDANNAS-NADPISANIE-WYCZYSC": "Back to PVGIS data",
  "UI-SEKDANNAS-TEMP-TYTUL": "Own monthly mean temperatures",
  "UI-SEKDANNAS-TEMP-OPIS": "Enter the mean air temperature of selected months (°C) if your place is warmer or colder than the PVGIS point. I shift the hourly temperatures of that month by the same difference — the daily shape stays, the mean equals the typed value. An empty field = PVGIS data.",
  "UI-SEKDANNAS-TEMP-PVGIS": "PVGIS: {temp} °C",
  "UI-SEKDANNAS-TEMP-PRZESUNIECIE": "Shift: {dt} K",
  "UI-SEKDANNAS-TEMP-NIEPOPRAWNE": "Enter a temperature from −60 to 60 °C or leave it empty.",
  "UI-SEKDANNAS-TEMP-AKTYWNE": "Own temperatures: {n} mo.",
  "UI-SEKDANNAS-NADPISANIE-AKTYWNE": "Calculated from your own monthly totals ({n} of 12 months).",
}
