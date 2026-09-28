/**
 * Moduł 7 "Stress-test zimowy" — Ekran 22 "Ryzyko zamarznięcia — instalacje wodne i grunt" (dawne
 * 6.15, 6.27, 6.31, 6.35, 6.37; docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md). Zbudowany tryb
 * "Grunt / instalacje zewnętrzne" (dawne 6.35) + twardy stop z sekcji wspólnej rozmrażania (6.37).
 * Tryby rur wewnętrznych/strychu/szamba wymagają modelu cieplnego (czas do 0°C) — nie w tym silniku.
 */

/** Co leży w gruncie (Biblia v2.0, rozdz. o strefie przemarzania: przewody, uziomy, wodociąg). */
export type TypInstalacjiGruntowej = "kabel" | "rura-wodna" | "uziom" | "inne"

export type InstalacjaGruntowa = {
  id: string
  nazwa: string
  typ: TypInstalacjiGruntowej
  /** Głębokość ułożenia, liczona do wierzchu elementu [cm]. null = nie wpisano. */
  glebokoscCm: number | null
}

/** Sposób rozmrażania zamarzniętej rury (sekcja wspólna, dawne 6.37). */
export type MetodaRozmrazania = "nie-dotyczy" | "kabel-grzewczy" | "otwarty-ogien"

export type RyzykoZamarznieciaInput = {
  /** Głębokość przemarzania gruntu w lokalizacji [cm] — z mapy stref / projektu. null = nie wpisano. */
  glebokoscPrzemarzaniaCm: number | null
  instalacje: InstalacjaGruntowa[]
  metodaRozmrazania: MetodaRozmrazania
}
