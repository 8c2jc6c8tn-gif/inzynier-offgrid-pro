import type { Warning } from "@/lib/core/calc-result"

function ostrzezenie(code: string, technicalMessage: string, field?: string): Warning {
  return { code, level: "warning", i18nKey: code, technicalMessage, field }
}

export const brakIec61701 = () =>
  ostrzezenie("NADMORSKA-BRAK-IEC-61701", "typLokalizacji=nadmorska && certyfikatIec61701=false", "certyfikatIec61701")

export const brakRamyAnodowanej = () =>
  ostrzezenie("NADMORSKA-BRAK-RAMY-ANODOWANEJ", "typLokalizacji=nadmorska && ramaAnodowana=false", "ramaAnodowana")

export const zlaczkiNiemorskie = () =>
  ostrzezenie("NADMORSKA-ZLACZKI-MC4", "typLokalizacji=nadmorska && zlaczkiMorskie=false", "zlaczkiMorskie")

export const brakAntyPid = () =>
  ostrzezenie("WARUNKI-BRAK-ANTY-PID", "(nadmorska || wilgotnoscWysoka) && certyfikatAntyPid=false", "certyfikatAntyPid")

export function pylistaRysowanieSzkla(): Warning {
  return {
    code: "PYLISTA-RYSOWANIE-SZKLA",
    level: "info",
    i18nKey: "PYLISTA-RYSOWANIE-SZKLA",
    technicalMessage: "typLokalizacji=pylista — reguła źródła (ryzyko rysowania szkła, częstsze czyszczenie)",
  }
}

export function warunkiSpelnione(): Warning {
  return {
    code: "WARUNKI-SRODOWISKOWE-SPELNIONE",
    level: "info",
    i18nKey: "WARUNKI-SRODOWISKOWE-SPELNIONE",
    technicalMessage: "brak niespełnionych reguł doboru dla podanej lokalizacji",
  }
}
