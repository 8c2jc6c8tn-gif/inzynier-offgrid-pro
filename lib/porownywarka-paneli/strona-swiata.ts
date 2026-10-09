/**
 * Compass directions for the simple mode: the user picks "south" instead of typing an azimuth. Pure conversion with the azimuth
 * convention of the whole app (north 0°, east 90°, south 180°, west 270°); no physics here.
 */
export const STRONY_SWIATA = [
  { id: "N", azymut: 0 },
  { id: "NE", azymut: 45 },
  { id: "E", azymut: 90 },
  { id: "SE", azymut: 135 },
  { id: "S", azymut: 180 },
  { id: "SW", azymut: 225 },
  { id: "W", azymut: 270 },
  { id: "NW", azymut: 315 },
] as const

export type StronaSwiata = (typeof STRONY_SWIATA)[number]["id"]

export type OdczytStrony = { rodzaj: "brak" } | { rodzaj: "strona"; id: StronaSwiata } | { rodzaj: "wlasna"; azymut: number }

/** What the azimuth field currently holds, in terms of the eight directions; 0° and 360° are both north. */
export function odczytajStrone(azymutTekst: string): OdczytStrony {
  const tekst = azymutTekst.trim().replace(",", ".")
  if (tekst === "") return { rodzaj: "brak" }
  const x = Number(tekst)
  if (!Number.isFinite(x)) return { rodzaj: "brak" }
  const strona = STRONY_SWIATA.find((s) => s.azymut === x || (s.azymut === 0 && x === 360))
  return strona ? { rodzaj: "strona", id: strona.id } : { rodzaj: "wlasna", azymut: x }
}

export const azymutStrony = (id: StronaSwiata): number => STRONY_SWIATA.find((s) => s.id === id)!.azymut
