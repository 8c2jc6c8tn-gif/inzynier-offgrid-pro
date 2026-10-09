/**
 * Rodzaj obiektu projektu (decyzja właściciela 09.10.2026, karta „Rodzaj obiektu”): jeden wspólny wybór dla całej aplikacji —
 * budynek, kamper, altana lub domek ROD albo garaż. Mikroinstalacja (kamper, altana/ROD, garaż) liczy zapotrzebowanie z listy odbiorników
 * i miesięcy użytkowania, nie ze strat ciepła budynku. Seed zapisywany jako draft (`usePersistedDraft`), ekrany go tylko czytają.
 * Brak wyboru (`""`) = zachowanie sprzed tej zmiany (zużycie z M14), nic nie jest zgadywane.
 */
export const RODZAJE_OBIEKTU = ["budynek", "kamper", "altana-rod", "garaz"] as const
export type RodzajObiektu = (typeof RODZAJE_OBIEKTU)[number]

export const KLUCZ_PROFILU_OBIEKTU = "profil-obiektu"

export type ProfilObiektu = {
  /** Pusty = jeszcze nie wybrano. */
  rodzaj: RodzajObiektu | ""
  /** 12 znaczników od stycznia: w których miesiącach obiekt jest używany. Pusta tablica = nie wybrano żadnego. */
  miesiaceUzytkowania: boolean[]
}

export const PROFIL_OBIEKTU_POCZATKOWY: ProfilObiektu = { rodzaj: "", miesiaceUzytkowania: Array(12).fill(false) }

/** Mikroinstalacja: zasilanie liczone z odbiorników, bez strat ciepła i bez zużycia z rachunku za prąd. */
export function czyMikroinstalacja(rodzaj: RodzajObiektu | "" | undefined): boolean {
  return rodzaj === "kamper" || rodzaj === "altana-rod" || rodzaj === "garaz"
}

/** Liczba dni w miesiącach roku zwykłego (luty 28 — kalendarz, nie założenie inżynierskie). */
export const DNI_W_MIESIACU: readonly number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

/**
 * Zużycie w 12 miesiącach [kWh] z dobowego zużycia odbiorników [Wh/dobę] i miesięcy użytkowania: miesiąc użytkowany = dobowe × dni,
 * pozostałe = 0. `null`, gdy brak odbiorników albo żadnego miesiąca użytkowania — wtedy nic nie zgadujemy.
 */
export function zuzycieMiesieczneKwh(sumaWhNaDobe: number, miesiaceUzytkowania: readonly boolean[]): number[] | null {
  if (!(sumaWhNaDobe > 0) || miesiaceUzytkowania.length !== 12 || !miesiaceUzytkowania.some(Boolean)) return null
  return DNI_W_MIESIACU.map((dni, i) => (miesiaceUzytkowania[i] ? (sumaWhNaDobe * dni) / 1000 : 0))
}

/** Klucze `t()` nazw rodzajów obiektu (`lib/i18n/ui/obiekt.ts`). */
export const KLUCZ_NAZWY_OBIEKTU: Record<RodzajObiektu, string> = {
  budynek: "UI-OBIEKT-R-BUDYNEK",
  kamper: "UI-OBIEKT-R-KAMPER",
  "altana-rod": "UI-OBIEKT-R-ALTANA-ROD",
  garaz: "UI-OBIEKT-R-GARAZ",
}
