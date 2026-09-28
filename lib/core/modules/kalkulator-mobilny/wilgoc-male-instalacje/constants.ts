/**
 * Lista zalecanych osłon — 1:1 z Biblii §12.34 ("Jak działa logika": obudowy, puszki, peszle i uszczelki
 * o odpowiednim stopniu IP; osuszacze lub pochłaniacze wilgoci w pomieszczeniach). Bez własnych dodatków.
 */
export const ZALECENIA_WILGOC = ["obudowy-ip", "puszki-z-uszczelka", "przewody-w-peszlu", "osuszacz-pochlaniacz"] as const
export type ZalecenieWilgoc = (typeof ZALECENIA_WILGOC)[number]

/** Przykład źródła (Biblia §12.34, "Efekt na ekranie"): "W garażu wilgotnym użyj obudów IP65…". Tylko zalecenie (info), nie próg. */
export const IP_ZALECANE_WILGOTNY_GARAZ = 65
