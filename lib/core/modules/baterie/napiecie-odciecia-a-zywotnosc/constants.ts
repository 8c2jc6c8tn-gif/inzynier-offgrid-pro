/**
 * Kalibracja modelu liniowego — dwa punkty wprost ze źródła (Ekran 31, dawne 3.35), pakiet
 * LiFePO4 16S/48V: 42,0V (2,625V/ogniwo) => 100% DoD => 2000 cykli;
 * 44,0V (2,750V/ogniwo) => 80% DoD => 5000 cykli. Poza tym zakresem napięcia ogniwa model jest
 * ekstrapolacją, nie zweryfikowaną kalibracją — patrz warnings.ts.
 */
export const KALIBRACJA_NAPIECIE_OGNIWO_MIN_V = 2.625
export const KALIBRACJA_NAPIECIE_OGNIWO_MAX_V = 2.75
export const KALIBRACJA_DOD_PRZY_NAPIECIU_MIN_PCT = 100
export const KALIBRACJA_DOD_PRZY_NAPIECIU_MAX_PCT = 80
export const KALIBRACJA_CYKLE_PRZY_DOD_100 = 2000
export const KALIBRACJA_CYKLE_PRZY_DOD_80 = 5000

export const LICZBA_OGNIW_SUGEROWANA = 16
