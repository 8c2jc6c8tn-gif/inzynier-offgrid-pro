import { OPCJE_IP, type OpcjaIp } from "@/lib/core/modules/baterie/ochrona-wilgoc/constants"

/**
 * Lista zalecanych osłon — 1:1 z Biblii §12.34 ("Jak działa logika": obudowy, puszki, peszle i uszczelki
 * o odpowiednim stopniu IP; osuszacze lub pochłaniacze wilgoci w pomieszczeniach). Bez własnych dodatków.
 */
export const ZALECENIA_WILGOC = ["obudowy-ip", "puszki-z-uszczelka", "przewody-w-peszlu", "osuszacz-pochlaniacz"] as const
export type ZalecenieWilgoc = (typeof ZALECENIA_WILGOC)[number]

/**
 * Przykład źródła (Biblia §12.34, "Efekt na ekranie"): "W garażu wilgotnym użyj obudów IP65…". Poniżej — ostrzeżenie
 * (warning), nie twardy stop: próg twardy zostaje IP55 z M4/E10. Od D44 (decyzja właściciela 28.09.2026) zalecenie
 * obowiązuje w każdym miejscu z zaznaczoną wilgocią, nie tylko w garażu.
 */
export const IP_ZALECANE_WILGOC = 65

/**
 * Namiot i jacht: minimum IP65 — twardy stop, zawsze (bez względu na odpowiedź o wilgoci); zalecane IP67–IP68, poniżej
 * ostrzeżenie (D44, decyzja właściciela 28.09.2026: "większe ryzyko"). Źródło (§12.34) nie podaje tu stopnia IP; to
 * praktyka właściciela, nie norma.
 */
export const MIN_IP_NAMIOT_JACHT = 65
export const IP_ZALECANE_NAMIOT_JACHT = 67
export const MIEJSCA_PODWYZSZONE_RYZYKO = ["namiot", "jacht"] as const

/**
 * Opcje IP jak M4/E10 plus IP67/IP68 — bez nich zalecenie dla namiotu/jachtu (D44) byłoby nieosiągalne. Opisy drugiej
 * cyfry wg IEC 60529 (`docs/zrodla/Opracowanie_Tasmy_LED_Oswietlenie_DC_DRAFT.md` §2.4: 7 — czasowe zanurzenie,
 * 8 — ciągłe zanurzenie).
 */
export const OPCJE_IP_MALE_INSTALACJE: OpcjaIp[] = [
  ...OPCJE_IP,
  { kod: 67, label: "IP67 — pyłoszczelna, czasowe zanurzenie" },
  { kod: 68, label: "IP68 — pyłoszczelna, ciągłe zanurzenie" },
]
