/**
 * Screen-side translation of the `label:` constants of the demand modules. The engine keeps its
 * Polish labels (warnings and calculations use them, saved drafts store them); the screen shows
 * `t(KLUCZ[id])` and falls back to the stored label for ids unknown here. The domain never imports this file.
 */
import { KATEGORIE } from "@/lib/core/modules/zapotrzebowanie/kategorie-specjalne/constants"
import { DEFAULT_CRITICAL_LOADS } from "@/lib/core/modules/zapotrzebowanie/systemy-podtrzymania-zycia/constants"
import { KATALOG_URZADZEN_ZMIENNYCH } from "@/lib/core/modules/zapotrzebowanie/urzadzenia-zmienne/constants"
import { KATALOG_URZADZEN_STANDBY } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/katalog-urzadzen/constants"
import { METODY_ODLACZANIA } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/rekomendacje-sprzetowe/constants"

type Tlumacz = (kod: string, params?: Record<string, string | number>) => string
export type WpisEtykiety = { z: string; key: string }

export const KLUCZ_KATEGORII: Record<string, string> = {
  warsztat: "UI-STAZAP-KAT-WARSZTAT",
  gospodarstwo: "UI-STAZAP-KAT-GOSPODARSTWO",
  "oswietlenie-terenowe": "UI-STAZAP-KAT-OSWIETLENIE-TERENOWE",
}

/** Same order as `PRZYKLADOWE_URZADZENIA_WARSZTAT` (Szlifierka, Wiertarka, Spawarka). */
export const KLUCZE_PRZYKLADOWYCH_WARSZTAT = ["UI-STAZAP-PRZ-SZLIFIERKA", "UI-STAZAP-PRZ-WIERTARKA", "UI-STAZAP-PRZ-SPAWARKA"]

export const KLUCZ_ODBIORNIKA_KRYTYCZNEGO: Record<string, string> = {
  "pompa-glebinowa": "UI-STAZAP-SYS-POMPA-GLEBINOWA",
  "przepompownia-sciekow": "UI-STAZAP-SYS-PRZEPOMPOWNIA-SCIEKOW",
  "wentylacja-rekuperator": "UI-STAZAP-SYS-WENTYLACJA-REKUPERATOR",
  router: "UI-STAZAP-SYS-ROUTER",
  "monitoring-kamery": "UI-STAZAP-SYS-MONITORING-KAMERY",
  ogrzewanie: "UI-STAZAP-SYS-OGRZEWANIE",
}

export const KLUCZ_URZADZENIA_ZMIENNEGO: Record<string, string> = {
  pralka: "UI-STAZAP-ZMI-PRALKA",
  zmywarka: "UI-STAZAP-ZMI-ZMYWARKA",
  "lodowka-230v": "UI-STAZAP-ZMI-LODOWKA-230V",
  czajnik: "UI-STAZAP-ZMI-CZAJNIK",
  mikrofalowka: "UI-STAZAP-ZMI-MIKROFALOWKA",
  laptop: "UI-STAZAP-ZMI-LAPTOP",
  tv: "UI-STAZAP-ZMI-TV",
  "led-230v": "UI-STAZAP-ZMI-LED-230V",
}

export const KLUCZ_URZADZENIA_STANDBY: Record<string, string> = {
  telewizor: "UI-STAZAP-STB-TELEWIZOR",
  router: "UI-STAZAP-STB-ROUTER",
  konsola: "UI-STAZAP-STB-KONSOLA",
  ladowarka: "UI-STAZAP-STB-LADOWARKA",
  listwa: "UI-STAZAP-STB-LISTWA",
  mikrofalowka: "UI-STAZAP-STB-MIKROFALOWKA",
  dekoder: "UI-STAZAP-STB-DEKODER",
}

export const KLUCZ_METODY_ODLACZANIA: Record<string, string> = {
  "wylacznik-reczny": "UI-STAZAP-MET-WYLACZNIK-RECZNY",
  "listwa-z-wylacznikiem": "UI-STAZAP-MET-LISTWA-Z-WYLACZNIKIEM",
  "gniazdo-wifi": "UI-STAZAP-MET-GNIAZDO-WIFI",
  "przekaznik-zigbee": "UI-STAZAP-MET-PRZEKAZNIK-ZIGBEE",
}

export const KLUCZ_KATEGORII_URZADZEN: Record<string, string> = {
  "tv-konsola": "UI-STAZAP-KUR-TV-KONSOLA",
  router: "UI-STAZAP-KUR-ROUTER",
  ladowarki: "UI-STAZAP-KUR-LADOWARKI",
  "agd-inne": "UI-STAZAP-KUR-AGD-INNE",
}

/** Translated label for `id`; `fallback` (the stored/engine label or the id) when the id has no key. */
export function etykieta(t: Tlumacz, mapa: Record<string, string>, id: string, fallback: string): string {
  const key = mapa[id]
  return key ? t(key) : fallback
}

function wpisy(
  lista: { id: string; label: string }[],
  mapa: Record<string, string>,
  takzePoId = false,
): WpisEtykiety[] {
  return lista.flatMap((d) => {
    const key = mapa[d.id]
    if (!key) return []
    return takzePoId ? [{ z: d.label, key }, { z: d.id, key }] : [{ z: d.label, key }]
  })
}

export const WPISY_SYSTEMY = wpisy(DEFAULT_CRITICAL_LOADS, KLUCZ_ODBIORNIKA_KRYTYCZNEGO)
export const WPISY_URZADZENIA_ZMIENNE = wpisy(KATALOG_URZADZEN_ZMIENNYCH, KLUCZ_URZADZENIA_ZMIENNEGO)
export const WPISY_STANDBY = wpisy(KATALOG_URZADZEN_STANDBY, KLUCZ_URZADZENIA_STANDBY)
// Method warnings carry the method id (not the label) as `label` param, so id is matched too.
export const WPISY_METODY = wpisy(METODY_ODLACZANIA, KLUCZ_METODY_ODLACZANIA, true)
export const WPISY_KATEGORIE = wpisy(KATEGORIE, KLUCZ_KATEGORII)

/**
 * Replaces engine (Polish) labels inside string params of a warning/assumption with their translation —
 * also inside comma-joined lists. Longest labels first so "Mikrofalówka (z wyświetlaczem)" wins over a prefix.
 */
export function tlumaczParamsEtykiet<P extends Record<string, string | number> | undefined>(
  t: Tlumacz,
  params: P,
  lista: WpisEtykiety[],
): P {
  if (!params) return params
  const posortowane = [...lista].sort((a, b) => b.z.length - a.z.length)
  const wynik: Record<string, string | number> = {}
  for (const [k, v] of Object.entries(params)) {
    if (typeof v !== "string") {
      wynik[k] = v
      continue
    }
    let s = v
    for (const w of posortowane) s = s.split(w.z).join(t(w.key))
    wynik[k] = s
  }
  return wynik as P
}
