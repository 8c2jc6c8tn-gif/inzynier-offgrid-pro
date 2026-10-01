import type { Warning } from "@/lib/core/calc-result"

/** 🟡 Owner decision 30.09.2026: the owned battery covers less than the 2-day medical minimum. */
export function ponizejMinimumDob(dobyPosiadany: number, minimalnyAh: number, minimumDob: number): Warning {
  return {
    code: "MED-PONIZEJ-MINIMUM-DOB",
    level: "warning",
    i18nKey: "MED-PONIZEJ-MINIMUM-DOB",
    params: { doby: Math.round(dobyPosiadany * 10) / 10, minimum: minimumDob, ah: Math.ceil(minimalnyAh) },
    technicalMessage: `autonomia ${dobyPosiadany} doby < ${minimumDob}`,
    field: "posiadanyAh",
  }
}

/** 🟡 Biblia §12.39: "zawsze miej zapasowe źródło energii" — no (or unknown) independent backup source. */
export function brakZapasowegoZrodla(): Warning {
  return {
    code: "MED-BRAK-ZAPASOWEGO-ZRODLA",
    level: "warning",
    i18nKey: "MED-BRAK-ZAPASOWEGO-ZRODLA",
    technicalMessage: "maZapasoweZrodlo != true (Biblia §12.39)",
    field: "maZapasoweZrodlo",
  }
}

/** ℹ️ Always: confirm the allowed supply with the device manufacturer (DC input, pure sine wave). */
export function sprawdzZasilanieZProducentem(): Warning {
  return {
    code: "MED-SPRAWDZ-Z-PRODUCENTEM",
    level: "info",
    i18nKey: "MED-SPRAWDZ-Z-PRODUCENTEM",
    technicalMessage: "always shown",
  }
}

/** ℹ️ Biblia §12.39: check whether direct 12 V supply is better than an inverter. */
export function rozwazZasilanieDc(): Warning {
  return {
    code: "MED-ROZWAZ-ZASILANIE-DC",
    level: "info",
    i18nKey: "MED-ROZWAZ-ZASILANIE-DC",
    technicalMessage: "przezFalownik=true",
    field: "przezFalownik",
  }
}
