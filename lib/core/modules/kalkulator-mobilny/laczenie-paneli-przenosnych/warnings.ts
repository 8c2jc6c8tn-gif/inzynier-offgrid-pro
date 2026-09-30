import type { Warning } from "@/lib/core/calc-result"

function ostrzezenie(code: string, level: Warning["level"], technicalMessage: string, field?: string): Warning {
  return { code, level, i18nKey: code, technicalMessage, ...(field ? { field } : {}) }
}

/** 🔴 Biblia §12.12: solar power banks have a built-in controller and cannot be combined with other panels. */
export function powerbankNieLaczyc(): Warning {
  return ostrzezenie("LPP-POWERBANK-NIE-LACZYC", "critical", "typ=powerbank-solarny, liczbaPaneli > 1 (Biblia §12.12)", "typ")
}

/** 🔴 USB outputs come after a built-in converter — they cannot be put in series or parallel. */
export function usbNieLaczyc(): Warning {
  return ostrzezenie("LPP-USB-NIE-LACZYC", "critical", "zlaczePaneli=usb, liczbaPaneli > 1", "zlaczePaneli")
}

/** 🔴 Tresc_Modul_12 E10: connectors do not match and there is no adapter. */
export function zlaczaNiezgodne(): Warning {
  return ostrzezenie("LPP-ZLACZA-NIEZGODNE", "critical", "zlaczePaneli != zlaczeWejscia, maAdapter=false", "maAdapter")
}

/** 🟡 Adapter between different connectors: polarity and current rating of the adapter must be checked. */
export function adapterSprawdz(): Warning {
  return ostrzezenie("LPP-ADAPTER-SPRAWDZ", "warning", "zlaczePaneli != zlaczeWejscia, maAdapter=true", "maAdapter")
}

/** 🟡 Different panels: series is limited by the lowest current, parallel by the lowest voltage. */
export function roznePanele(): Warning {
  return ostrzezenie("LPP-ROZNE-PANELE", "warning", "takieSame=false, liczbaPaneli > 1", "takieSame")
}

/** ℹ️ Always: check voltage and current against the input limits on E39. */
export function sprawdzNapiecie(): Warning {
  return ostrzezenie("LPP-SPRAWDZ-NAPIECIE", "info", "always shown — odsyłacz do E39")
}
