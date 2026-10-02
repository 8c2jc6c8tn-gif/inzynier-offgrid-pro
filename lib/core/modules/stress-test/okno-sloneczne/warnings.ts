import type { Warning } from "@/lib/core/calc-result"

/** Form validation: a negative number. */
export function wartoscUjemnaOkno(pole: string, wartosc: number): Warning {
  return {
    code: "OKNO-WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "OKNO-WARTOSC-UJEMNA",
    technicalMessage: `${pole} = ${wartosc}, oczekiwano >= 0`,
    field: pole,
  }
}

/** Form validation: SoC outside 0–100%. */
export function socPozaZakresem(soc: number): Warning {
  return {
    code: "OKNO-SOC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "OKNO-SOC-POZA-ZAKRESEM",
    technicalMessage: `socStartPct = ${soc}, oczekiwano [0, 100]`,
    field: "socStartPct",
  }
}

/** The window does not even cover the house's consumption — nothing goes to storage. */
export function oknoNiePokrywaZuzycia(brak: number): Warning {
  return {
    code: "OKNO-NIE-POKRYWA-ZUZYCIA",
    level: "warning",
    i18nKey: "OKNO-NIE-POKRYWA-ZUZYCIA",
    params: { brak: Math.round(brak * 100) / 100 },
    technicalMessage: `zuzycieWOknieKwh - energiaOknaKwh = ${brak} kWh > 0`,
    field: "energiaOknaKwh",
  }
}

/** Source example „Pralkę włącz dopiero jutro”: no surplus left for the surplus loads. */
export function brakNadwyzki(): Warning {
  return {
    code: "OKNO-BRAK-NADWYZKI",
    level: "info",
    i18nKey: "OKNO-BRAK-NADWYZKI",
    technicalMessage: "nadwyzkaKwh = 0 — odbiorniki nadwyżkowe (pralka, zmywarka) przesunąć",
    field: "energiaOknaKwh",
  }
}

/** Source alert: do not heat water at night — the boiler did not reach its target in the window. */
export function bojlerNiedogrzany(tKoniec: number, tCel: number): Warning {
  return {
    code: "OKNO-BOJLER-NIEDOGRZANY",
    level: "info",
    i18nKey: "OKNO-BOJLER-NIEDOGRZANY",
    params: { tKoniec: Math.round(tKoniec * 10) / 10, tCel },
    technicalMessage: `bojler ${tKoniec} °C < cel ${tCel} °C po oknie`,
    field: "bojlerTCelC",
  }
}
