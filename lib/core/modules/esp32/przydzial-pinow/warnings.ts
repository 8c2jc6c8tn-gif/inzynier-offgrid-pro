import type { Warning } from "@/lib/core/calc-result"

export function gpioNiepoprawny(indeks: number, value: number): Warning {
  return {
    code: "PIN-GPIO-NIEPOPRAWNY",
    level: "critical",
    i18nKey: "PIN-GPIO-NIEPOPRAWNY",
    technicalMessage: `piny[${indeks}].gpio = ${value}, oczekiwano liczby całkowitej >= 0`,
    field: `piny.${indeks}`,
  }
}

export function konfliktPinu(gpio: number, opisy: string): Warning {
  return {
    code: "PIN-KONFLIKT",
    level: "critical",
    i18nKey: "PIN-KONFLIKT",
    params: { gpio, opisy },
    technicalMessage: `GPIO${gpio} przypisany do kilku funkcji: ${opisy} (Tresc_Modul_9, Ekran 5, 🔴)`,
  }
}

export function adcPrzyWifi(): Warning {
  return {
    code: "PIN-ADC-WIFI",
    level: "info",
    i18nKey: "PIN-ADC-WIFI",
    technicalMessage: "funkcja adc && wifiAktywne — ADC2 niedostępny przy Wi-Fi (Biblia §9.5)",
  }
}
