import type { Warning } from "@/lib/core/calc-result"

/** Biblia §12.48: rest voltage at or below the discard threshold of a lead-acid battery. */
export function ponizejProguWyrzucenia(napiecieV: number, progV: number): Warning {
  return {
    code: "TA-PONIZEJ-PROGU-WYRZUCENIA",
    level: "warning",
    i18nKey: "TA-PONIZEJ-PROGU-WYRZUCENIA",
    params: { napiecie: napiecieV, prog: progV },
    technicalMessage: `napiecieSpoczynkoweV = ${napiecieV} <= ${progV} (ołów)`,
    field: "napiecieSpoczynkoweV",
  }
}

/** Internal resistance grew by at least the M4 threshold over the datasheet value. */
export function rezystancjaWzrosla(rMOhm: number, kartaMOhm: number, wzrostPct: number, progPct: number): Warning {
  return {
    code: "TA-REZYSTANCJA-WZROSLA",
    level: "warning",
    i18nKey: "TA-REZYSTANCJA-WZROSLA",
    params: { r: rMOhm, karta: kartaMOhm, wzrost: wzrostPct, prog: progPct },
    technicalMessage: `R = ${rMOhm} mΩ vs karta ${kartaMOhm} mΩ → +${wzrostPct}% >= ${progPct}%`,
    field: "napiecieObciazenieV",
  }
}

/** No datasheet resistance — the measured value has nothing to compare with. */
export function brakRezystancjiKarty(): Warning {
  return {
    code: "TA-BRAK-ODNIESIENIA",
    level: "info",
    i18nKey: "TA-BRAK-ODNIESIENIA",
    technicalMessage: "rezystancjaKartaMOhm = 0 albo brak testu obciążeniowego — wynik niejasny, test pojemności",
  }
}

/** LiFePO4: flat voltage curve — the rest voltage says little about the state (expert ✅🤖). */
export function lifepo4PlaskaKrzywa(): Warning {
  return {
    code: "TA-LIFEPO4-PLASKA-KRZYWA",
    level: "info",
    i18nKey: "TA-LIFEPO4-PLASKA-KRZYWA",
    technicalMessage: "LiFePO4 — płaska krzywa napięcia, napięcie spoczynkowe nie ocenia stanu",
  }
}
