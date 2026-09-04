/** Stałe wzoru Magnusa-Tetensa (woda ciekła) — standardowy wzór meteorologiczny na punkt rosy. */
export const MAGNUS_A = 17.27
export const MAGNUS_B = 237.7

/** Minimalny wymagany kod IP dla obudowy w środowisku wilgotnym — 1:1 ze źródła. */
export const MIN_IP_KOD_WILGOTNE = 55

export type OpcjaIp = { kod: number; label: string }

export const OPCJE_IP: OpcjaIp[] = [
  { kod: 20, label: "IP20 — podstawowa, wnętrze suche" },
  { kod: 54, label: "IP54 — pył ograniczony, bryzgi wody" },
  { kod: 55, label: "IP55 — pył ograniczony, strugi wody" },
  { kod: 65, label: "IP65 — pyłoszczelna, strugi wody" },
  { kod: 66, label: "IP66 — pyłoszczelna, silne strugi wody" },
]
