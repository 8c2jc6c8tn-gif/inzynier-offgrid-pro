/**
 * Lokalny zapis danych PVGIS TMY dla Ekranu 4 Modułu 1 (rejestr-decyzji.md D22; 05, 5.3 —
 * pobrane raz online przez `/api/pvgis/tmy`, potem używane offline z zapisu). Czyste funkcje.
 */
import type { DaneTmy, KodBleduPvgis } from "@/lib/adapters/pvgis/tmy"

export const KLUCZ_TMY = "offgrid.pvgis-tmy.v1"

export type ZapisTmy = {
  /** Współrzędne, dla których wysłano zapytanie (nie punkt siatki zwrócony przez PVGIS). */
  szerokosc: number
  dlugosc: number
  /** ISO 8601 — kiedy pobrano. */
  pobrano: string
  dane: DaneTmy
}

/**
 * Tolerancja dopasowania zapisu do lokalizacji [°] — ok. 1 km. Piksel danych satelitarnych
 * SARAH, z których PVGIS liczy TMY, ma kilka kilometrów, więc przesunięcie punktu działki o
 * mniej niż ~1 km nie zmienia danych, a nie zmusza do ponownego pobierania przy każdej korekcie.
 */
export const TOLERANCJA_ZAPISU_DEG = 0.01

export function zapisPasuje(zapis: ZapisTmy | null, szerokosc: number, dlugosc: number): zapis is ZapisTmy {
  return (
    zapis !== null &&
    Math.abs(zapis.szerokosc - szerokosc) <= TOLERANCJA_ZAPISU_DEG &&
    Math.abs(zapis.dlugosc - dlugosc) <= TOLERANCJA_ZAPISU_DEG
  )
}

export const KOMUNIKAT_PVGIS: Record<KodBleduPvgis | "SIEC", string> = {
  "PVGIS-PARAMETRY-NIEPOPRAWNE": "Niepoprawne współrzędne lokalizacji.",
  "PVGIS-ODRZUCIL-ZAPYTANIE": "PVGIS nie ma danych dla tego miejsca (np. punkt na morzu albo poza zasięgiem bazy).",
  "PVGIS-TIMEOUT": "PVGIS nie odpowiedział na czas — spróbuj ponownie za chwilę.",
  "PVGIS-NIEDOSTEPNY": "Serwis PVGIS jest chwilowo niedostępny — spróbuj ponownie później.",
  "PVGIS-NIEOCZEKIWANY-FORMAT": "PVGIS zwrócił dane w nieoczekiwanym formacie.",
  SIEC: "Brak połączenia — dane nasłonecznienia trzeba pobrać raz online, potem działają offline.",
}

/** Translation keys of the same messages for screens (`lib/i18n/ui/bledy-hookow.ts`); `KOMUNIKAT_PVGIS` stays for AI tool output. */
export const KLUCZ_BLEDU_PVGIS: Record<KodBleduPvgis | "SIEC", string> = {
  "PVGIS-PARAMETRY-NIEPOPRAWNE": "UI-BLAD-PVGIS-PARAMETRY-NIEPOPRAWNE",
  "PVGIS-ODRZUCIL-ZAPYTANIE": "UI-BLAD-PVGIS-ODRZUCIL-ZAPYTANIE",
  "PVGIS-TIMEOUT": "UI-BLAD-PVGIS-TIMEOUT",
  "PVGIS-NIEDOSTEPNY": "UI-BLAD-PVGIS-NIEDOSTEPNY",
  "PVGIS-NIEOCZEKIWANY-FORMAT": "UI-BLAD-PVGIS-NIEOCZEKIWANY-FORMAT",
  SIEC: "UI-BLAD-PVGIS-SIEC",
}

/** Odpowiedź `/api/pvgis/tmy` → dane albo kod błędu (kształt z route.ts). */
export function odczytajOdpowiedzProxy(json: unknown): { ok: true; dane: DaneTmy } | { ok: false; kod: KodBleduPvgis } {
  const o = json as { ok?: unknown; dane?: DaneTmy; kod?: KodBleduPvgis }
  if (o && o.ok === true && o.dane && Array.isArray(o.dane.rekordy)) return { ok: true, dane: o.dane }
  const kod = o && typeof o.kod === "string" && o.kod in KOMUNIKAT_PVGIS ? o.kod : "PVGIS-NIEOCZEKIWANY-FORMAT"
  return { ok: false, kod }
}
