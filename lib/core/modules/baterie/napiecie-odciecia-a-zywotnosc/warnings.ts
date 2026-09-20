import type { Warning } from "@/lib/core/calc-result"

export function napiecieOdcieciaNiedodatnie(value: number): Warning {
  return {
    code: "NAPIECIE-ODCIECIA-NIEDODATNIE",
    level: "critical",
    i18nKey: "NAPIECIE-ODCIECIA-NIEDODATNIE",
    technicalMessage: `napiecieOdcieciaV = ${value}, oczekiwano > 0`,
    field: "napiecieOdcieciaV",
  }
}

export function liczbaOgniwNiepoprawna(value: number): Warning {
  return {
    code: "LICZBA-OGNIW-NIEPOPRAWNA",
    level: "critical",
    i18nKey: "LICZBA-OGNIW-NIEPOPRAWNA",
    technicalMessage: `liczbaOgniwSzeregowo = ${value}, oczekiwano liczby całkowitej >= 1`,
    field: "liczbaOgniwSzeregowo",
  }
}

export function ekstrapolacjaPozaKalibracje(napiecieOgniwaV: number): Warning {
  return {
    code: "EKSTRAPOLACJA-POZA-KALIBRACJA",
    level: "warning",
    i18nKey: "EKSTRAPOLACJA-POZA-KALIBRACJA",
    technicalMessage: `napiecieOgniwaV = ${napiecieOgniwaV.toFixed(3)}, kalibracja modelu obejmuje tylko 2,625–2,750V`,
  }
}
