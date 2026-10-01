import type { Warning } from "@/lib/core/calc-result"

/** ℹ️ Biblia §12.9: "Do zasilania routera 12V z akumulatora 12V nie potrzebujesz przetwornicy." */
export function bezPrzetwornicy(napiecieV: number): Warning {
  return {
    code: "PRZ-BEZ-PRZETWORNICY",
    level: "info",
    i18nKey: "PRZ-BEZ-PRZETWORNICY",
    params: { napiecie: napiecieV },
    technicalMessage: `napiecieUrzadzeniaV == napiecieAkumulatoraV == ${napiecieV}`,
    field: "napiecieUrzadzeniaV",
  }
}

/** 🟡 Biblia §12.9: "Ostrzega przed przeciążeniem" — converter rated current below the device current. */
export function przetwornicaZaSlaba(pradPrzetwornicyA: number, pradWymaganyA: number): Warning {
  return {
    code: "PRZ-PRZETWORNICA-ZA-SLABA",
    level: "warning",
    i18nKey: "PRZ-PRZETWORNICA-ZA-SLABA",
    params: { posiadany: pradPrzetwornicyA, wymagany: Math.round(pradWymaganyA * 10) / 10 },
    technicalMessage: `pradPrzetwornicyA=${pradPrzetwornicyA} < ${pradWymaganyA}`,
    field: "pradPrzetwornicyA",
  }
}

/** ℹ️ Biblia §12.30: frequent use of 24 V devices — a 24 V system from two 12 V batteries may be better. */
export function rozwazSystemWyzszegoNapiecia(): Warning {
  return {
    code: "PRZ-ROZWAZ-SYSTEM-24V",
    level: "info",
    i18nKey: "PRZ-ROZWAZ-SYSTEM-24V",
    technicalMessage: "napiecieUrzadzeniaV > napiecieAkumulatoraV (step-up, Biblia §12.30)",
  }
}

/** 🟡 Inverter continuous power below the sum × margin. */
export function falownikZaSlaby(mocFalownikaW: number, minimalnaW: number): Warning {
  return {
    code: "PRZ-FALOWNIK-ZA-SLABY",
    level: "warning",
    i18nKey: "PRZ-FALOWNIK-ZA-SLABY",
    params: { posiadany: mocFalownikaW, minimalna: Math.ceil(minimalnaW) },
    technicalMessage: `mocFalownikaW=${mocFalownikaW} < ${minimalnaW}`,
    field: "mocFalownikaW",
  }
}

/** 🟡 Inverter surge power below the starting peak — the device will not start, the inverter trips. */
export function szczytZaMaly(mocSzczytowaW: number, szczytWymaganyW: number): Warning {
  return {
    code: "PRZ-SZCZYT-ZA-MALY",
    level: "warning",
    i18nKey: "PRZ-SZCZYT-ZA-MALY",
    params: { posiadana: mocSzczytowaW, wymagana: Math.ceil(szczytWymaganyW) },
    technicalMessage: `mocSzczytowaFalownikaW=${mocSzczytowaW} < ${szczytWymaganyW}`,
    field: "mocSzczytowaFalownikaW",
  }
}

/** ℹ️ The surge rating was not entered — tell the user what to look for on the datasheet. */
export function sprawdzSzczyt(szczytWymaganyW: number): Warning {
  return {
    code: "PRZ-SPRAWDZ-SZCZYT",
    level: "info",
    i18nKey: "PRZ-SPRAWDZ-SZCZYT",
    params: { wymagana: Math.ceil(szczytWymaganyW) },
    technicalMessage: "mocSzczytowaFalownikaW not entered",
    field: "mocSzczytowaFalownikaW",
  }
}

/** ℹ️ Biblia §12.29: "Przetwornica 2000W przy 12V pobiera 166A – sprawdź kable i bezpieczniki." */
export function sprawdzKable(pradA: number): Warning {
  return {
    code: "PRZ-SPRAWDZ-KABLE",
    level: "info",
    i18nKey: "PRZ-SPRAWDZ-KABLE",
    params: { prad: Math.round(pradA) },
    technicalMessage: `battery-side current ${pradA.toFixed(1)} A`,
  }
}
