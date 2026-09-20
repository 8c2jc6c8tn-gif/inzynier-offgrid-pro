/**
 * Cztery metody odłączania standby — Biblia Offgrid, dawne 1.44. Zakresy poboru własnego ze
 * źródła, informacyjne (nie wchodzą do wzoru zwrotu — ten liczy się z kosztu i oszczędności
 * wpisanych przez użytkownika, bez wymyślania ceny energii ani kosztu sprzętu).
 */

export type MetodaOdlaczaniaDef = {
  id: "wylacznik-reczny" | "listwa-z-wylacznikiem" | "gniazdo-wifi" | "przekaznik-zigbee"
  label: string
  poborWlasnyOpis: string
}

export const METODY_ODLACZANIA: MetodaOdlaczaniaDef[] = [
  { id: "wylacznik-reczny", label: "Wyłącznik ręczny", poborWlasnyOpis: "0 W (brak elektroniki)" },
  { id: "listwa-z-wylacznikiem", label: "Listwa z wyłącznikiem", poborWlasnyOpis: "0 W (brak elektroniki)" },
  { id: "gniazdo-wifi", label: "Gniazdo Wi-Fi", poborWlasnyOpis: "1–2 W (moduł Wi-Fi zawsze aktywny)" },
  { id: "przekaznik-zigbee", label: "Przekaźnik Zigbee", poborWlasnyOpis: "0,5–1 W (moduł radiowy)" },
]

/** Dawne 1.33: dobór metody per kategoria urządzenia — mapowanie 1:1 ze źródła. */
export const KATEGORIE_URZADZEN: { id: "tv-konsola" | "router" | "ladowarki" | "agd-inne"; label: string }[] = [
  { id: "tv-konsola", label: "TV / konsola do gier" },
  { id: "router", label: "Router" },
  { id: "ladowarki", label: "Ładowarki" },
  { id: "agd-inne", label: "Sprzęt AGD / inne" },
]
