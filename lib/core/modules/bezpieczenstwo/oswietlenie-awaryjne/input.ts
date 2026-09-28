/**
 * Moduł 8 "Bezpieczeństwo i sytuacje awaryjne" — Ekran 7 "Oświetlenie awaryjne — sprzęt i adaptacyjna ewakuacja AI"
 * (scala dawne 11.55 + 12.52; docs/zrodla/Tresc_Modul_8_Bezpieczenstwo_Ekrany.md, Biblia v2.0 §8.7, §8.10). Wzorzec D.
 * Zbudowana warstwa sprzętowa: lista lamp na drogach ewakuacji z wynikiem ostatniego testu. Adaptacyjna trasa AI
 * wymaga mapy budynku (M1) i czujników live — poza zakresem.
 */

/** Zasilanie lamp — sekcja A: z UPS lub własne akumulatory. */
export type ZasilanieLamp = "ups" | "wlasne-akumulatory"

export type StanLampy = "sprawna" | "niesprawna" | "nietestowana"

export type LampaAwaryjna = {
  nazwa: string
  stan: StanLampy
}

export type OswietlenieAwaryjneInput = {
  zasilanie: ZasilanieLamp | null
  lampy: LampaAwaryjna[]
  /** Oświetlenie zewnętrzne dla służb włączane po alarmie (sekcja B.1). */
  oswietlenieZewnetrzne: boolean
}
