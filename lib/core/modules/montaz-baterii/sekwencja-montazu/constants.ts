/**
 * Presety liczby ogniw w szeregu, na wyraźną prośbę właściciela projektu — 4S/8S/16S
 * (12,8V / 25,6V / 51,2V, standardowe napięcia systemowe off-grid, `napiecie-systemowe`
 * M4/E2, `OCZEKIWANA_LICZBA_OGNIW` w M11/A1). Generator obsługuje dowolną parzystą liczbę
 * ogniw ≥4, nie tylko te trzy presety — 4/8/16 to tylko skróty w UI.
 */
export const PRESETY_LICZBY_OGNIW = [4, 8, 16] as const

/** Poniżej tej liczby układ dwurzędowy (opisany w źródle) nie ma sensu — jeden rząd wystarcza. */
export const MIN_OGNIW = 4

/** Górna granica rozsądności — źródło opisuje wyłącznie do 16S, powyżej nie zgadujemy, że wzorzec się utrzymuje. */
export const MAX_OGNIW = 32
