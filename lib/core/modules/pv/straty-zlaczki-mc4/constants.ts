/**
 * Zakres rezystancji złączki MC4 w dobrym stanie [mΩ] — 1:1 ze źródła. Górna granica (2 mΩ)
 * użyta jako próg bucketowania (dobry/zły stan), analogicznie do progu różnicy mocy paneli
 * w `niedopasowanie-paneli` — granica zakresu podanego przez źródło, nie wymyślona liczba.
 */
export const REZYSTANCJA_DOBRY_STAN_MIN_MOHM = 0.5
export const REZYSTANCJA_DOBRY_STAN_MAX_MOHM = 2

/** "Nawet 10× więcej" dla złączki luźnej/zaśniedziałej — mnożnik 1:1 ze źródła. */
export const MNOZNIK_ZLY_STYK = 10
