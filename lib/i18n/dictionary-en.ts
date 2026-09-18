/**
 * Słownik tłumaczeń — angielski. Klucze i placeholdery `{nazwa}` muszą dokładnie odpowiadać
 * `dictionary-pl.ts` — `satisfies Record<KluczTlumaczenia, string>` niżej wymusza to typem
 * (brakujący/dodatkowy klucz = błąd kompilacji, nie cichy fallback, docs/standards/17-i18n.md 17.1).
 */
import type { KluczTlumaczenia } from "./dictionary-pl"

export const dictionaryEn = {
  "WARTOSC-NIEDODATNIA": 'The value of "{label}" must be greater than zero.',
  "SPRAWNOSC-POZA-ZAKRESEM": "Efficiency must be a number in the range (0, 1].",
  "SPRAWNOSC-NISKA": "The entered efficiency is unusually low — check that you haven't mixed up units.",
  "MOC-NIETYPOWO-WYSOKA": "This is an unusually high power value — check that you haven't mixed up units.",
  "SPRAWNOSC-DOMYSLNA": "System efficiency assumed as {efficiency} (default value, not measured).",
  "WARTOSC-POZA-ZAKRESEM": 'Value of field "{label}" must be within the range {min}–{max}.',
  "POZYCJA-NIEDODATNIA": 'Selected item "{label}" must have power greater than zero.',
  "BRAK-ZAZNACZONYCH": "No critical load has been selected.",
  "POZYCJA-WARTOSC-DOMYSLNA": '"{label}" used with default power {value} W (not edited).',
  "COP-POZA-ZAKRESEM": "COP must be within the range {min}–{max} for a typical heat pump.",
  "MOC-CIEPLNA-NIETYPOWO-WYSOKA":
    "This is an unusually high thermal power value — check that you haven't mixed up the units (kW, not W).",
  "COP-ZALEZY-OD-TEMPERATURY":
    "COP depends on outdoor temperature — the given value applies only to current conditions and is not " +
    "constant throughout the season (see the manufacturer's COP curve).",
  "DANE-KLIMATYCZNE-TRYB-OFFLINE":
    "Solar irradiance/climate zone data will eventually require integration with PVGIS/PVWatts (online) — " +
    "at this stage, only offline mode with manual entry of the minimum temperature is available.",
  "LICZBA-DOMOWNIKOW-POZA-ZAKRESEM": "The number of household members must be within the range {min}–{max}.",
  "CWU-ZAKRES-ORIENTACYJNY":
    "A range of {min}–{max} l of domestic hot water per person per day — an indicative source value, not measured.",
  "ZAPOTRZEBOWANIE-UJEMNE": "Daily demand cannot be negative.",
  "SPRAWNOSC-PROCENT-POZA-ZAKRESEM": "Inverter efficiency must be within the range 0–100%.",
  "DOD-POZA-ZAKRESEM": "DoD (depth of discharge) must be within the range 0–100%.",
  "WPLYW-NA-MAGAZYN":
    "With {dni} days of autonomy and the entered parameters, the storage needs approx. {pojemnosc} kWh " +
    "of usable capacity (estimate — full calculation: Module 4, Screen 1).",
  "COS-FI-POZA-ZAKRESEM": "Power factor (cos φ) must be within the range 0–1.",
  "MOC-POZORNA-INFO":
    "Watts on the nameplate aren't the whole story — the inverter actually sees {va} VA, not {w} W, of real load.",
  "SZACUNEK-MAGAZYNU-WYMAGA-DANYCH":
    "Estimating the impact on storage size requires entering the daily demand, inverter efficiency, and DoD.",
} satisfies Record<KluczTlumaczenia, string>
