import type { Warning } from "@/lib/core/calc-result"

/** Form validation: a negative number. */
export function wartoscUjemnaNp(pole: string, wartosc: number): Warning {
  return {
    code: "NP-WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "NP-WARTOSC-UJEMNA",
    technicalMessage: `${pole} = ${wartosc}, oczekiwano >= 0`,
    field: pole,
  }
}

/** D28: a fuel-fired air heater makes exhaust with CO; vehicle devices are not made for dwellings. */
export function nagrzewnicaSpalinyNp(): Warning {
  return {
    code: "NP-SPALINY-CO",
    level: "warning",
    i18nKey: "NP-SPALINY-CO",
    technicalMessage: "spaliny/CO, szczelność wydechu przez przegrodę, montaż w budynku — konsultacja z kominiarzem (D28)",
  }
}

/** D28 / source: diesel thickens in frost (the −20 °C of the source is a message, not a threshold of this calculation). */
export function olejGestniejeNp(temperatura: number): Warning {
  return {
    code: "NP-OLEJ-GESTNIEJE",
    level: "warning",
    i18nKey: "NP-OLEJ-GESTNIEJE",
    params: { temperatura },
    technicalMessage: `źródło: przy ${temperatura}°C olej napędowy gęstnieje — paliwo arktyczne`,
  }
}

/** 🟡 The heater's own electricity per day is more than the usable battery (a physical limit, 100%). */
export function poborPonadBaterie(whDoba: number, pojemnoscKwh: number): Warning {
  return {
    code: "NP-POBOR-PONAD-BATERIE",
    level: "warning",
    i18nKey: "NP-POBOR-PONAD-BATERIE",
    params: { wh: Math.round(whDoba), pojemnosc: Math.round(pojemnoscKwh * 100) / 100 },
    technicalMessage: `pobór pomocniczy ${whDoba} Wh/dobę > pojemność użyteczna ${pojemnoscKwh} kWh`,
    field: "pojemnoscBateriiKwh",
  }
}

/** 🟡 More running hours per day than a day has — the heater at this output cannot cover the daily demand. */
export function godzinyPonadDobe(godziny: number): Warning {
  return {
    code: "NP-GODZINY-PONAD-DOBE",
    level: "warning",
    i18nKey: "NP-GODZINY-PONAD-DOBE",
    params: { godziny: Math.round(godziny * 10) / 10 },
    technicalMessage: `${godziny} h pracy na dobę > 24 h przy wpisanej mocy cieplnej`,
    field: "zapotrzebowanieCieplaDobaKwh",
  }
}

/** ℹ️ Electricity is cheaper than the heater at the entered price — said plainly, no spin. */
export function pradTanszy(): Warning {
  return {
    code: "NP-PRAD-TANSZY",
    level: "info",
    i18nKey: "NP-PRAD-TANSZY",
    technicalMessage: "przy wpisanej cenie prądu i COP ogrzewanie elektryczne wychodzi taniej niż nagrzewnica",
    field: "cenaPraduZlKwh",
  }
}

/** ℹ️ No electricity price entered: the heater's own draw is not priced and no comparison is made. */
export function brakCenyPradu(): Warning {
  return {
    code: "NP-BRAK-CENY-PRADU",
    level: "info",
    i18nKey: "NP-BRAK-CENY-PRADU",
    technicalMessage: "cena prądu nie wpisana — koszt prądu pomocniczego nie liczony, bez porównania z ogrzewaniem elektrycznym",
    field: "cenaPraduZlKwh",
  }
}
