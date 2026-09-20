/**
 * Katalog typowych urządzeń standby — Biblia Offgrid, dawne 1.29 ("Katalog urządzeń z poborem
 * w trybie czuwania"), rozszerzony o pozycje z 1.41/1.48 (te same urządzenia, ta sama baza —
 * "rozszerzona" w źródle oznacza więcej pozycji, nie inną strukturę danych).
 *
 * `defaultPowerW` to ŚRODEK zakresu podanego w źródle, zaokrąglony do sensownej wartości —
 * NIE literalna wartość źródła (źródło podaje tylko zakres min–max), analogicznie do mnożnika
 * klasy energetycznej w Ekranie 3 ("środek zakresu, dopowiedziany", docs/memory.md). Zawsze
 * edytowalne — dla urządzeń o szerokim zakresie (np. TV 0,5–15 W) sam środek jest tylko punktem
 * startowym, nie realnym pomiarem konkretnego modelu.
 */

export type StandbyDeviceCatalogEntry = {
  id: string
  label: string
  minPowerW: number
  maxPowerW: number
  defaultPowerW: number
}

export const GODZIN_W_DOBIE = 24
export const DNI_W_ROKU = 365

export const KATALOG_URZADZEN_STANDBY: StandbyDeviceCatalogEntry[] = [
  { id: "telewizor", label: "Telewizor", minPowerW: 0.5, maxPowerW: 15, defaultPowerW: 8 },
  { id: "router", label: "Router", minPowerW: 5, maxPowerW: 15, defaultPowerW: 10 },
  { id: "konsola", label: "Konsola do gier", minPowerW: 5, maxPowerW: 20, defaultPowerW: 13 },
  { id: "ladowarka", label: "Ładowarka bez odbiornika", minPowerW: 0.2, maxPowerW: 1, defaultPowerW: 0.6 },
  { id: "listwa", label: "Listwa zasilająca", minPowerW: 0.1, maxPowerW: 0.5, defaultPowerW: 0.3 },
  {
    id: "mikrofalowka",
    label: "Mikrofalówka (z wyświetlaczem)",
    minPowerW: 2,
    maxPowerW: 5,
    defaultPowerW: 3.5,
  },
  { id: "dekoder", label: "Dekoder TV", minPowerW: 10, maxPowerW: 30, defaultPowerW: 20 },
]
