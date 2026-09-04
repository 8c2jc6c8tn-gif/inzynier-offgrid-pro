/**
 * Optymalne obciążenie agregatu — źródło podaje zakres "ok. 70-80% mocy" (Biblia, funkcja 2.19).
 * Użyta górna granica zakresu (80%) — jedyna wartość, przy której własny przykład źródła
 * (deficyt 80 kWh, agregat 5 kW → 20 godzin pracy) odtwarza się dokładnie (80 / (5×0,8) = 20).
 */
export const OPTYMALNE_OBCIAZENIE_PCT = 80
