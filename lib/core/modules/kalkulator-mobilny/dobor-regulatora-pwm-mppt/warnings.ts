import type { Warning } from "@/lib/core/calc-result"
import { PROG_MOC_MPPT_OPLACALNY_W } from "./constants"

export function wartoscNiedodatnia(pole: string, etykieta: string, value: number): Warning {
  return {
    code: "WARTOSC-NIEDODATNIA",
    level: "critical",
    i18nKey: "WARTOSC-NIEDODATNIA",
    params: { label: etykieta },
    technicalMessage: `${pole} = ${value}, oczekiwano > 0`,
    field: pole,
  }
}

export function niezgodnoscNapiecPwm(panelV: number, akumulatorV: number): Warning {
  return {
    code: "NIEZGODNOSC-NAPIEC-PWM",
    level: "critical",
    i18nKey: "NIEZGODNOSC-NAPIEC-PWM",
    params: { panel: panelV.toFixed(0), akumulator: akumulatorV.toFixed(0) },
    technicalMessage: `napiecieNominalnePaneluV=${panelV} > napiecieAkumulatoraV=${akumulatorV} — PWM nie obniża napięcia`,
  }
}

export function mpptOplacalnyPrzyMocy(mocW: number): Warning {
  return {
    code: "MPPT-OPLACALNY-PRZY-MOCY",
    level: "info",
    i18nKey: "MPPT-OPLACALNY-PRZY-MOCY",
    params: { moc: mocW.toFixed(0), prog: PROG_MOC_MPPT_OPLACALNY_W.toFixed(0) },
    technicalMessage: `mocPaneliW=${mocW} >= PROG_MOC_MPPT_OPLACALNY_W=${PROG_MOC_MPPT_OPLACALNY_W}`,
  }
}

export function pwmWystarczy(mocW: number): Warning {
  return {
    code: "PWM-WYSTARCZY",
    level: "info",
    i18nKey: "PWM-WYSTARCZY",
    params: { moc: mocW.toFixed(0) },
    technicalMessage: `napięcia zgodne, mocPaneliW=${mocW} < PROG_MOC_MPPT_OPLACALNY_W`,
  }
}
