import type { Warning } from "@/lib/core/calc-result"
import { MIN_ODSTEP_OD_SZYN_CM } from "./constants"

/** Źródło: "minimum 2 cm odstępu od szyn prądowych" — bez 🔴 w źródle, więc 🟡 (✅🤖 poziom do potwierdzenia). */
export function odstepOdSzynZaMaly(odstepCm: number): Warning {
  return {
    code: "ESP-ODSTEP-OD-SZYN",
    level: "warning",
    i18nKey: "ESP-ODSTEP-OD-SZYN",
    params: { odstep: odstepCm, min: MIN_ODSTEP_OD_SZYN_CM },
    technicalMessage: `odstepOdSzynCm = ${odstepCm} < ${MIN_ODSTEP_OD_SZYN_CM} (Tresc_Modul_9, Ekran 3)`,
    field: "odstepOdSzynCm",
  }
}

/** Źródło: "wymagana wentylacja"; Biblia §9.3 "wentylacja i odprowadzanie ciepła". */
export function brakWentylacji(): Warning {
  return {
    code: "ESP-OBUDOWA-BEZ-WENTYLACJI",
    level: "warning",
    i18nKey: "ESP-OBUDOWA-BEZ-WENTYLACJI",
    technicalMessage: "wentylacja = false (Tresc_Modul_9, Ekran 3: wymagana wentylacja)",
    field: "wentylacja",
  }
}

/** Źródło: "izolacja od elementów pod napięciem"; Biblia §9.3 "przypomina o izolacji". */
export function brakIzolacji(): Warning {
  return {
    code: "ESP-OBUDOWA-BEZ-IZOLACJI",
    // 🔴 D68 (owner decision 01.10.2026): no barrier between the ESP32 and live parts in the same enclosure =
    // risk of electric shock and of the board being destroyed by a flashover.
    level: "critical",
    i18nKey: "ESP-OBUDOWA-BEZ-IZOLACJI",
    technicalMessage: "izolacjaOdCzesciPodNapieciem = false (Tresc_Modul_9, Ekran 3)",
    field: "izolacjaOdCzesciPodNapieciem",
  }
}

/** Biblia §9.3 "zaleca montaż na szynie DIN lub płycie montażowej" — zalecenie, nie wymóg. */
export function montazZalecanyDin(): Warning {
  return {
    code: "ESP-MONTAZ-ZALECANY-DIN",
    level: "info",
    i18nKey: "ESP-MONTAZ-ZALECANY-DIN",
    technicalMessage: "montaz = inny (Biblia §9.3: zalecany DIN lub płyta montażowa)",
    field: "montaz",
  }
}
