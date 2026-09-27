/**
 * Moduł 5, Ekran 2 "Ochrona przeciwprzepięciowa (SPD)" — section "Czy SPD jest wymagany" (since 27.09.2026):
 * HD 60364-4-443:2016, 443.4 + 443.5 risk assessment (`docs/zrodla/norma-HD-60364-4-443/`). Line lengths are those of
 * the supply network feeding the installation (Rysunek 443.1). `null` = not entered.
 */
export type SrodowiskoCrl = "wiejskie" | "miejskie"

export type OcenaRyzykaCrlInput = {
  /** 443.4 a)–z1): consequences for human life, public services/cultural heritage, commercial or industrial activity, many people. */
  skutkiKrytyczne: boolean
  /** Tablica 443.1: rural/suburban or urban environment. */
  srodowisko: SrodowiskoCrl | null
  /** Lightning ground flash density N_g [flashes/km²/year] of the site. */
  gestoscWyladowanNg: number | null
  /** Thunderstorm days per year T_d — used only when N_g is not entered (N_g = 0,1·T_d, 443.5 Uwaga 2). */
  dniBurzoweTd: number | null
  /** L_PAL — LV overhead line [km]. */
  napowietrznaNnKm: number
  /** L_PCL — LV underground cable [km]. */
  kablowaNnKm: number
  /** L_PAH — HV overhead line [km]. */
  napowietrznaSnKm: number
  /** L_PCH — HV underground cable [km]. */
  kablowaSnKm: number
  /** Lengths of the network wholly or partly unknown → L_PAL takes the rest up to the limit (443.5). */
  dlugosciNiepelne: boolean
  /** Distance to the first SPD installed in the supply network [km]; `null` = none/unknown (limit 1 km). */
  odlegloscDoSpdWSieciKm: number | null
}
