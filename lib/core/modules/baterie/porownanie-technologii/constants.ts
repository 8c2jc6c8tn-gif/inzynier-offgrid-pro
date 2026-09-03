/**
 * Katalog technologii magazynów — dane 1:1 z tabeli źródłowej (docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md,
 * Ekran 30). Tam gdzie źródło podaje przedział cykli, w `cyklePrzyDodReprezentatywne` używamy
 * środka przedziału jako wartości reprezentatywnej do obliczeń — jawnie oznaczone w `assumptions`
 * wyniku, nie ukryte. Tam gdzie źródło nie podaje liczby (np. sprawność akumulatora trakcyjnego —
 * w tabeli źródłowej „—"), pole jest `null`, nigdy nie zgadywane (docs/standards/15-wspolpraca-z-ai.md, 15.7).
 */

export type CenaStartowa = "niska" | "srednia" | "wysoka" | "niska-za-kwh"

export type BatteryTechnology = {
  id: string
  label: string
  cenaStartowa: CenaStartowa
  /** Tekst z tabeli źródłowej, np. "5000 (80% DoD)" — do wyświetlenia bez zmian. */
  cyklePrzyDodOpis: string
  /** Liczba cykli użyta do obliczeń (środek przedziału, gdy źródło podaje przedział). */
  cyklePrzyDodReprezentatywne: number
  /** Głębokość rozładowania [0,1] odpowiadająca powyższej liczbie cykli. */
  dod: number
  /** Sprawność [%] — `null` gdy źródło nie podaje wartości (akumulator trakcyjny). */
  sprawnoscPct: number | null
  wagaKgPerKwhOpis: string
  obsluga: string
}

export const BATTERY_TECHNOLOGIES: BatteryTechnology[] = [
  {
    id: "lifepo4",
    label: "LiFePO4",
    cenaStartowa: "wysoka",
    cyklePrzyDodOpis: "5000 (80% DoD)",
    cyklePrzyDodReprezentatywne: 5000,
    dod: 0.8,
    sprawnoscPct: 98,
    wagaKgPerKwhOpis: "~12 kg",
    obsluga: "bezobsługowa",
  },
  {
    id: "agm",
    label: "Kwasowa (AGM)",
    cenaStartowa: "niska",
    cyklePrzyDodOpis: "300–500 (50% DoD)",
    cyklePrzyDodReprezentatywne: 400,
    dod: 0.5,
    sprawnoscPct: 80,
    wagaKgPerKwhOpis: "25–30 kg",
    obsluga: "wentylacja gazów",
  },
  {
    id: "gel",
    label: "Żelowa (GEL)",
    cenaStartowa: "srednia",
    cyklePrzyDodOpis: "800–1000 (50% DoD)",
    cyklePrzyDodReprezentatywne: 900,
    dod: 0.5,
    sprawnoscPct: 80,
    wagaKgPerKwhOpis: "~30 kg",
    obsluga: "bezobsługowa, długie ładowanie",
  },
  {
    id: "trakcyjna",
    label: "Trakcyjna (wózek widłowy)",
    cenaStartowa: "niska-za-kwh",
    cyklePrzyDodOpis: "1500–2000 (80% DoD teoret.)",
    cyklePrzyDodReprezentatywne: 1750,
    dod: 0.8,
    sprawnoscPct: null,
    wagaKgPerKwhOpis: "bardzo duża (500–1000 kg/48V)",
    obsluga: "uzupełnianie wody, wentylacja",
  },
]

export const CENA_STARTOWA_LABELS: Record<CenaStartowa, string> = {
  niska: "niska",
  srednia: "średnia",
  wysoka: "wysoka",
  "niska-za-kwh": "niska za kWh (ale bardzo ciężka)",
}

/** Domyślna pojemność bazowa, gdy użytkownik nie poda swojej [kWh] — porównanie "per 1 kWh". */
export const POJEMNOSC_BASELINE_KWH = 1
