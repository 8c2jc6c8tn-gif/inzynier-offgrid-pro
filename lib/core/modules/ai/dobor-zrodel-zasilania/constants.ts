/**
 * Screen 4 of M10 has no constants of its own — the hierarchy is Moduł 4 Ekran 32 (`hierarchia-ladowania`) and the
 * temperature limits are Moduł 4 Ekran 12 (`cold-c-rate/constants.ts`). The source says so itself: „system nie
 * wymyśla nowej hierarchii, tylko realizuje ją inteligentnie” (Sekcja D). Re-exported for the screen's help text.
 */
export {
  LIMIT_C_RATE_CHLODNO,
  LIMIT_C_RATE_ZIMNO,
  PROG_BLOKADY_C,
  PROG_LIMITU_02C,
  PROG_LUKI_GORNY_C,
  PROG_PELNEGO_PRADU_C,
} from "../../baterie/cold-c-rate/constants"
