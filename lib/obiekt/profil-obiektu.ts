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
  /**
   * Nominal DC system voltage of the micro-installation, chosen once for the site (owner decision 11.10.2026). Empty = not chosen;
   * screens only suggest it next to their own voltage field (never fill it silently). Absent in drafts saved before this field existed.
   */
  napiecieUkladuV?: NapiecieUkladuV | ""
}

export const NAPIECIA_UKLADU_V = [12, 24, 48] as const
export type NapiecieUkladuV = (typeof NAPIECIA_UKLADU_V)[number]

export const PROFIL_OBIEKTU_POCZATKOWY: ProfilObiektu = { rodzaj: "", miesiaceUzytkowania: Array(12).fill(false), napiecieUkladuV: "" }

/** The system voltage to suggest on a micro-installation screen; `null` when the site is not a micro-installation or no voltage is chosen. */
export function napiecieUkladuDoPodpowiedzi(profil: ProfilObiektu | null | undefined): NapiecieUkladuV | null {
  if (!profil || !czyMikroinstalacja(profil.rodzaj)) return null
  const v = profil.napiecieUkladuV
  return NAPIECIA_UKLADU_V.find((x) => x === v) ?? null
}

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

/**
 * Jak `zuzycieMiesieczneKwh`, ale z osobnym dobowym zużyciem [Wh/dobę] każdego z 12 miesięcy (odbiorniki sezonowe: woda latem,
 * ogrzewanie postojowe zimą). `null`, gdy nie ma miesięcy użytkowania albo w miesiącach użytkowania nic nie pracuje.
 */
export function zuzycieMiesieczneZDobowychKwh(whNaDobe: readonly number[], miesiaceUzytkowania: readonly boolean[]): number[] | null {
  if (whNaDobe.length !== 12 || miesiaceUzytkowania.length !== 12 || !miesiaceUzytkowania.some(Boolean)) return null
  const zuzycie = DNI_W_MIESIACU.map((dni, i) => (miesiaceUzytkowania[i] ? (whNaDobe[i]! * dni) / 1000 : 0))
  return zuzycie.some((x) => x > 0) ? zuzycie : null
}

/** Klucze `t()` nazw rodzajów obiektu (`lib/i18n/ui/obiekt.ts`). */
export const KLUCZ_NAZWY_OBIEKTU: Record<RodzajObiektu, string> = {
  budynek: "UI-OBIEKT-R-BUDYNEK",
  kamper: "UI-OBIEKT-R-KAMPER",
  "altana-rod": "UI-OBIEKT-R-ALTANA-ROD",
  garaz: "UI-OBIEKT-R-GARAZ",
}
