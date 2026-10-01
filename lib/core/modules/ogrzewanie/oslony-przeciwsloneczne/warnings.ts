import type { Warning } from "@/lib/core/calc-result"

/** Source 🟡 (Ekran 19): a fixed overhang also takes away free winter gains — consider a movable shade. */
export function okapZacieniaZima(zacienieniePct: number): Warning {
  return {
    code: "OSL-OKAP-ZIMA",
    level: "warning",
    i18nKey: "OSL-OKAP-ZIMA",
    params: { pct: zacienieniePct },
    technicalMessage: `zacienienie okna w południe przesilenia zimowego ${zacienieniePct}% > 0`,
    field: "wysiegM",
  }
}

/** Only the noon geometry of a south window is computed; gains in kWh need the E11 model (deferred). */
export function tylkoGeometria(): Warning {
  return {
    code: "OSL-TYLKO-GEOMETRIA",
    level: "info",
    i18nKey: "OSL-TYLKO-GEOMETRIA",
    technicalMessage: "geometria w południe słoneczne, okno południowe, okap nieskończenie szeroki; zyski kWh nie liczone (model E11 odłożony)",
  }
}

/** Latitude outside the range where the noon sun is south of the zenith all year and above the horizon at the winter solstice. */
export function szerokoscPozaModelem(szerokoscDeg: number, min: number, max: number): Warning {
  return {
    code: "OSL-SZEROKOSC-POZA-MODELEM",
    level: "critical",
    i18nKey: "OSL-SZEROKOSC-POZA-MODELEM",
    params: { min, max },
    technicalMessage: `szerokoscDeg = ${szerokoscDeg} poza (${min}; ${max}) — słońce w południe nie zawsze na południu albo pod horyzontem`,
    field: "szerokoscDeg",
  }
}
