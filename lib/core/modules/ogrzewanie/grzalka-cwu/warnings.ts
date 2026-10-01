import type { Warning } from "@/lib/core/calc-result"

/** Source 🟡 (Ekran 18, cross-ref M5/E7): the heater is a large load — can the inverter carry it? */
export function grzalkaPonadFalownik(mocGrzalkiKw: number, mocFalownikaKw: number): Warning {
  return {
    code: "GRZ-PONAD-FALOWNIK",
    level: "warning",
    i18nKey: "GRZ-PONAD-FALOWNIK",
    params: { grzalka: mocGrzalkiKw, falownik: mocFalownikaKw },
    technicalMessage: `mocGrzalkiKw = ${mocGrzalkiKw} > mocFalownikaKw = ${mocFalownikaKw}`,
    field: "mocGrzalkiKw",
  }
}

/** A fixed-power heater with a PV surplus smaller than its power takes the rest from the battery (source D). */
export function czescZBaterii(kwh: number): Warning {
  return {
    code: "GRZ-Z-BATERII",
    level: "info",
    i18nKey: "GRZ-Z-BATERII",
    params: { kwh },
    technicalMessage: `sterowanie = stala, mocPvKw < mocGrzalkiKw — ${kwh} kWh z baterii`,
    field: "sterowanie",
  }
}

/** The PV surplus is taken as constant during the whole heating time (✅🤖). */
export function pvStala(): Warning {
  return {
    code: "GRZ-PV-STALA",
    level: "info",
    i18nKey: "GRZ-PV-STALA",
    technicalMessage: "mocPvKw przyjęta jako stała przez cały czas grzania",
    field: "mocPvKw",
  }
}
