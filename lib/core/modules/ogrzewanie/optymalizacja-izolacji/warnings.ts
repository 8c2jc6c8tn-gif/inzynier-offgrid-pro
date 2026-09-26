import type { Warning } from "@/lib/core/calc-result"

export { miesiaceZeSrednich, wartoscNiedodatnia, wartoscPozaZakresem, wartoscUjemna } from "../obciazenie-cieplne/warnings"

/** Source (🟡): "Przy zbyt grubej izolacji koszt dodatkowego centymetra przestaje się zwracać." Judged against the user's heat price. */
export function gruboscNieZwracaSie(nazwa: string, gruboscCm: number, krancowyZlKwh: number, cenaZlKwh: number): Warning {
  return {
    code: "IZOL-GRUBOSC-NIE-ZWRACA-SIE",
    level: "warning",
    i18nKey: "IZOL-GRUBOSC-NIE-ZWRACA-SIE",
    params: { nazwa, grubosc: gruboscCm, krancowy: krancowyZlKwh.toFixed(2), cena: cenaZlKwh },
    technicalMessage: `${nazwa} ${gruboscCm} cm: Δkoszt/(Δoszczędność·lata) = ${krancowyZlKwh} > cena ciepła ${cenaZlKwh}`,
  }
}

/** Every monthly mean is at or above θi — no heating season in this model, nothing to save. */
export function brakSezonuGrzewczego(): Warning {
  return {
    code: "IZOL-BRAK-SEZONU-GRZEWCZEGO",
    level: "info",
    i18nKey: "IZOL-BRAK-SEZONU-GRZEWCZEGO",
    technicalMessage: "Σ max(0, θi − θm)·24·d = 0",
  }
}
