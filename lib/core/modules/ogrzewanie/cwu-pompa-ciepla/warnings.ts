import type { Warning } from "@/lib/core/calc-result"

/** Source 5.30: heating water above the pump's temperature is left to the heater (anti-legionella only). */
export function przegrzewGrzalka(tMaxC: number, kwh: number): Warning {
  return {
    code: "CWP-PRZEGRZEW-GRZALKA",
    level: "info",
    i18nKey: "CWP-PRZEGRZEW-GRZALKA",
    params: { tmax: tMaxC, kwh },
    technicalMessage: `tKoniecC > tMaxPompyC = ${tMaxC} — ${kwh} kWh z grzałki`,
    field: "tMaxPompyC",
  }
}

/** Source 5.58 warning: without a PV surplus the pump heating the water takes energy from the battery. */
export function pompaZBaterii(kwh: number): Warning {
  return {
    code: "CWP-Z-BATERII",
    level: "warning",
    i18nKey: "CWP-Z-BATERII",
    params: { kwh },
    technicalMessage: `mocPvKw < moc elektryczna pompy — ${kwh} kWh z baterii`,
    field: "mocPvKw",
  }
}
