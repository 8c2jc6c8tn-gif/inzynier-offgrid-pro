import type { Warning } from "@/lib/core/calc-result"

const r2 = (x: number) => Math.round(x * 100) / 100

/** 🟡 Source 5.59: „Nocna praca pompy z baterii off-grid to nie to samo, co z sieci – licz się z rozładowaniem.” */
export function nocZBaterii(pradNocKwh: number, mocNocKw: number): Warning {
  return {
    code: "TAN-NOC-Z-BATERII",
    level: "warning",
    params: { kwh: r2(pradNocKwh), kw: r2(mocNocKw) },
    technicalMessage: `zasilanieNocy = bateria: ${pradNocKwh} kWh w nocy (śr. ${mocNocKw} kW)`,
    field: "zasilanieNocy",
  }
}

/** 🟡 Shifting heat to the night zone does not lower the cost (night price and COP are not better than the day's). */
export function brakOszczednosci(oszczednoscZl: number): Warning {
  return {
    code: "TAN-BRAK-OSZCZEDNOSCI",
    level: "warning",
    params: { zl: r2(oszczednoscZl) },
    technicalMessage: `oszczędność ${oszczednoscZl} zł/dobę <= 0 przy przesunięciu`,
    field: "cenaNocZlKwh",
  }
}

/** ℹ️ No buffer entered — heat cannot be stored at night, so nothing is shifted. */
export function bezBufora(): Warning {
  return {
    code: "TAN-BEZ-BUFORA",
    level: "info",
    technicalMessage: "pojemnoscBuforaL = 0 lub deltaTBuforaK = 0 — brak przesunięcia",
    field: "pojemnoscBuforaL",
  }
}

/** ℹ️ The buffer holds only part of the daytime heat demand. */
export function buforNiePokrywaDnia(pojemnoscKwh: number, cieploDzienKwh: number, pokrycieDniaPct: number): Warning {
  return {
    code: "TAN-BUFOR-NIE-POKRYWA-DNIA",
    level: "info",
    params: { bufor: r2(pojemnoscKwh), dzien: r2(cieploDzienKwh), pct: r2(pokrycieDniaPct) },
    technicalMessage: `bufor ${pojemnoscKwh} kWh < ciepło strefy dziennej ${cieploDzienKwh} kWh`,
    field: "pojemnoscBuforaL",
  }
}

/** ℹ️ A generator at night — the entered „night price” must be the user's real cost of a kWh from it. */
export function nocZAgregatu(): Warning {
  return {
    code: "TAN-NOC-Z-AGREGATU",
    level: "info",
    technicalMessage: "zasilanieNocy = agregat: cena nocna = koszt 1 kWh z agregatu wpisany przez użytkownika",
    field: "cenaNocZlKwh",
  }
}

/**
 * ℹ️ Night COP not entered, so the day COP is used (owner decision 04.10.2026, point 3 → C). Night air is usually
 * colder, so an air-source pump's COP is lower and the saving shown is too high — no number is assumed for it.
 */
export function copNocNiePodany(): Warning {
  return {
    code: "TAN-COP-NOC-NIE-PODANY",
    level: "info",
    technicalMessage: "copNoc = 0 — przyjęto COP dzienny; oszczędność może być zawyżona",
    field: "copNoc",
  }
}
