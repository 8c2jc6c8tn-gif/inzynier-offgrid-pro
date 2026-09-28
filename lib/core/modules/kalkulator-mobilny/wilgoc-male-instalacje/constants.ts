/**
 * Lista zalecanych osłon — 1:1 z Biblii §12.34 ("Jak działa logika": obudowy, puszki, peszle i uszczelki
 * o odpowiednim stopniu IP; osuszacze lub pochłaniacze wilgoci w pomieszczeniach). Bez własnych dodatków.
 */
export const ZALECENIA_WILGOC = ["obudowy-ip", "puszki-z-uszczelka", "przewody-w-peszlu", "osuszacz-pochlaniacz"] as const
export type ZalecenieWilgoc = (typeof ZALECENIA_WILGOC)[number]

/**
 * Przykład źródła (Biblia §12.34, "Efekt na ekranie"): "W garażu wilgotnym użyj obudów IP65…". Poniżej — ostrzeżenie
 * (warning), nie twardy stop: próg twardy w garażu zostaje IP55 z M4/E10 (D44, decyzja właściciela 28.09.2026).
 */
export const IP_ZALECANE_WILGOTNY_GARAZ = 65

/**
 * Namiot i jacht narażone na wilgoć: minimum IP65 — twardy stop (D44, decyzja właściciela 28.09.2026: "większe
 * ryzyko"). Źródło (§12.34) nie podaje tu stopnia IP; to praktyka właściciela, nie norma.
 */
export const MIN_IP_NAMIOT_JACHT = 65
export const MIEJSCA_PODWYZSZONE_RYZYKO = ["namiot", "jacht"] as const
