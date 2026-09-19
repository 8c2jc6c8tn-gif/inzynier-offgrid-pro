/**
 * Wzór wiatru chłodzącego (Wind Chill) — standardowy wzór NWS/Environment Canada (2001),
 * metryczny (°C, km/h). Źródło projektu (Ekran 17, Moduł 7) opisuje zjawisko narracyjnie, bez
 * podania wzoru — ten sam wzorzec co Magnus-Tetens w `ochrona-wilgoc` (Moduł 4) i deklinacja
 * Coopera w `profil-astronomiczny` (Moduł 2): uniwersalna, publicznie znana fizyka/meteorologia,
 * nie wymyślona. Zweryfikowane niezależnie przed implementacją: dla przykładu źródła (-10°C,
 * 40 km/h) wzór daje ≈-20,8°C — zgodne z "-20°C" z przykładu źródła.
 */
export const WIND_CHILL_MAX_TEMP_C = 10
export const WIND_CHILL_MIN_PREDKOSC_KMH = 4.8
