import type { Warning } from "@/lib/core/calc-result"
import { PARAMETRY_GRZEJNIKOW_NISKOTEMPERATUROWYCH, PARAMETRY_GRZEJNIKOW_STANDARDOWYCH } from "./constants"

/** Source 🔴 (Ekran 13, tryb grzejników): ordinary high-temperature radiators on a heat pump. */
export function grzejnikiWysokotemperaturoweZPompa(): Warning {
  return {
    code: "DYS-GRZEJNIKI-WYSOKOTEMP-POMPA",
    level: "critical",
    i18nKey: "DYS-GRZEJNIKI-WYSOKOTEMP-POMPA",
    params: { standard: PARAMETRY_GRZEJNIKOW_STANDARDOWYCH, nisko: PARAMETRY_GRZEJNIKOW_NISKOTEMPERATUROWYCH },
    technicalMessage: `zrodloCiepla = pompa-ciepla, system = grzejniki-standardowe (${PARAMETRY_GRZEJNIKOW_STANDARDOWYCH}) — wysoka temperatura zasilania obniża COP`,
    field: "system",
  }
}

/** Biblia §6.13: floor heating has a large thermal inertia; source 🟡 about low-inertia houses has no threshold. */
export function podlogowkaBezwladnosc(): Warning {
  return {
    code: "DYS-PODLOGOWE-BEZWLADNOSC",
    level: "info",
    i18nKey: "DYS-PODLOGOWE-BEZWLADNOSC",
    technicalMessage: "system = podlogowe — duża bezwładność (Biblia §6.13); 🟡 źródła o przegrzewaniu bez progu liczbowego, nie wyzwalane",
    field: "system",
  }
}

/** The COP comparison of the source applies to a heat pump only. */
export function porownanieTylkoDlaPompy(): Warning {
  return {
    code: "DYS-COP-TYLKO-POMPA",
    level: "info",
    i18nKey: "DYS-COP-TYLKO-POMPA",
    technicalMessage: "zrodloCiepla = inne — porównanie COP nie dotyczy",
    field: "zrodloCiepla",
  }
}

/** A lower supply temperature gives a higher COP of the same pump — reversed values mean a data mix-up. */
export function copNieWyzszy(copSystemu: number, copOdniesienia: number): Warning {
  return {
    code: "DYS-COP-NIE-WYZSZY",
    level: "warning",
    i18nKey: "DYS-COP-NIE-WYZSZY",
    params: { cop: copSystemu, copOdn: copOdniesienia },
    technicalMessage: `copSystemu = ${copSystemu} <= copOdniesienia = ${copOdniesienia} — przy niższej temperaturze zasilania COP powinien być wyższy`,
    field: "copSystemu",
  }
}
