import type { Warning } from "@/lib/core/calc-result"

/** 🟡 Without sun the battery lasts shorter than the stay (Biblia §12.5: "czy przy braku słońca bateria wystarczy"). */
export function brakNaPochmurnyPobyt(dniAkumulatora: number, dni: number): Warning {
  return {
    code: "WK-BRAK-NA-POCHMURNY-POBYT",
    level: "warning",
    i18nKey: "WK-BRAK-NA-POCHMURNY-POBYT",
    params: { dniAkum: Math.round(dniAkumulatora * 10) / 10, dni },
    technicalMessage: `energia akumulatora starcza na ${dniAkumulatora.toFixed(2)} doby < ${dni}`,
  }
}

/** 🟡 Even with the panel's average production the energy runs out before the end of the stay. */
export function brakNawetZPanelem(brakujeWh: number): Warning {
  return {
    code: "WK-BRAK-NAWET-Z-PANELEM",
    level: "warning",
    i18nKey: "WK-BRAK-NAWET-Z-PANELEM",
    params: { wh: Math.round(brakujeWh) },
    technicalMessage: `akumulator + panel × dni < zapotrzebowanie pobytu o ${brakujeWh.toFixed(0)} Wh`,
  }
}
