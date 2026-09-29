import type { Warning } from "@/lib/core/calc-result"

function w(code: string, level: Warning["level"], technicalMessage: string, params?: Warning["params"], field?: string): Warning {
  return { code, level, i18nKey: code, technicalMessage, ...(params ? { params } : {}), ...(field ? { field } : {}) }
}

/** 🔴 Hard stop 4 (`03_M14` „Twarde stopy”): scenario D with a negative balance and no generator. */
export function dBezAgregatu(kwh: number): Warning {
  return w("SIEC-TCO-D-BEZ-AGREGATU", "critical", `D: niedobór ${kwh.toFixed(0)} kWh/rok, mocAgregatuKw = 0`, { kwh: Math.round(kwh) }, "agregat.mocKw")
}

/** 🔴 Hard stop 5: scenario D with people depending on powered medical equipment and no redundant reserve (R4). */
export function dZalezniMedycznie(): Warning {
  return w("SIEC-TCO-D-ZALEZNI-MEDYCZNIE", "critical", "D: osobyZalezneOdZasilania = true, zapasRedundantny = false (R4)", undefined, "kontrola.zapasRedundantny")
}

/** Generator above the user's own monthly threshold → „D ryzykowne” (`03_M14` §4). */
export function dRyzykowne(godziny: number, prog: number): Warning {
  return w("SIEC-TCO-D-RYZYKOWNE", "warning", `godziny agregatu max ${godziny.toFixed(0)} h/mies. > próg ${prog}`, {
    godziny: Math.round(godziny),
    prog,
  })
}

/** R1: full disconnection is practically irreversible — return means a new connection. */
export function dNieodwracalne(): Warning {
  return w("SIEC-TCO-D-NIEODWRACALNE", "warning", "D: umowa rozwiązana, licznik zdjęty — powrót = nowe przyłączenie (R1)")
}

/** R9: leaving the settlement loses the prosumer deposit / discounts; subsidy may have to be returned. */
export function utrataRozliczen(): Warning {
  return w("SIEC-TCO-UTRATA-ROZLICZEN", "warning", "C/D: brak oddawania energii — utrata depozytu/opustów; ryzyko zwrotu dotacji (R9)")
}

/** Parallel operation (A, B) requires notifying the DSO and an NC RfG certificate (🔎A). */
export function pracaRownolegla(): Warning {
  return w("SIEC-TCO-PRACA-ROWNOLEGLA", "info", "A/B: praca równoległa — zgłoszenie mikroinstalacji do OSD, certyfikat NC RfG (🔎A)")
}

/** Scenario C needs a grid/0/island changeover switch (D11). */
export function cPrzelacznik(): Warning {
  return w("SIEC-TCO-C-PRZELACZNIK", "warning", "C: wymagany przełącznik sieć–0–wyspa z blokadą (D11)")
}

/** C/D: the monthly balance is not the M7 winter stress test — necessary condition of D (`03_M14` §4). */
export function warunekM7(): Warning {
  return w("SIEC-TCO-WARUNEK-M7", "info", "C/D: warunek konieczny — stress-test zimowy M7 (seria pochmurnych dni, DoD, temperatura)")
}

/** Export value exceeded the variable cost — the annual balance was capped at the fixed part. */
export function saldoObciete(scenariusz: string): Warning {
  return w("SIEC-TCO-SALDO-OBCIETE", "info", `${scenariusz}: wartość nadwyżki > koszt zmienny, saldo obcięte do opłat stałych`, { scenariusz })
}

/** RF1 (firma): acceptable outage time vs the energy a redundant reserve must deliver (lower bound). */
export function ciagloscFirmy(h: number, kwh: number, maZapas: boolean): Warning {
  return w(
    maZapas ? "SIEC-TCO-RF1-INFO" : "SIEC-TCO-RF1",
    maZapas ? "info" : "warning",
    `RF1: dopuszczalny czas ${h} h, średni pobór × czas = ${kwh.toFixed(0)} kWh (dolne oszacowanie)`,
    { h, kwh: Math.round(kwh) },
  )
}

export function brakScenariuszy(): Warning {
  return w("SIEC-TCO-BRAK-SCENARIUSZY", "warning", "żaden scenariusz nie ma wpisanej inwestycji", undefined, "scenariusze")
}
