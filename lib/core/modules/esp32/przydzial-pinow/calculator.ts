import type { CalcResult, Status, Warning } from "@/lib/core/calc-result"
import type { FunkcjaPinu, PrzydzialPinowInput } from "./input"
import { adcPrzyWifi, gpioNiepoprawny, konfliktPinu } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "\\forall\\ GPIO:\\ jedna\\ funkcja"

/**
 * Linie magistral wspólnych — kilka urządzeń legalnie dzieli ten sam pin (I2C, 1-Wire, linie danych SPI). Każdy układ
 * SPI potrzebuje własnego CS, więc CS do tej grupy nie należy.
 */
const FUNKCJE_WSPOLDZIELONE: readonly FunkcjaPinu[] = ["i2c-sda", "i2c-scl", "1-wire", "spi-mosi", "spi-miso", "spi-sck"]

export type PrzydzialPinowResult = {
  liczbaPrzypisan: number
  liczbaKonfliktow: number
}

/**
 * Ekran 5, Moduł 9 — "Konfiguracja GPIO/ADC/I2C/SPI/UART" (dawne 11.5). 🔴 konflikt: jeden pin z dwiema różnymi
 * funkcjami albo dwa razy ta sama funkcja niewspółdzielona (np. dwa wejścia ADC na jednym pinie). Linie magistral
 * (I2C, 1-Wire, SPI MOSI/MISO/SCK) wolno dzielić. ADC przy aktywnym Wi-Fi — info o ograniczeniu ADC2 (źródło nie
 * podaje mapy pinów, więc aplikacja nie rozstrzyga, który pin to ADC2).
 */
export function calculatePrzydzialPinow(input: PrzydzialPinowInput): CalcResult<PrzydzialPinowResult> {
  const przypisane = input.piny.map((p, i) => ({ ...p, i })).filter((p) => p.gpio !== null)
  const value: PrzydzialPinowResult = { liczbaPrzypisan: przypisane.length, liczbaKonfliktow: 0 }
  const wynik = (status: Status, warnings: Warning[]): CalcResult<PrzydzialPinowResult> => ({
    value,
    unit: "",
    status,
    formula: FORMULA, formulaKey: "UI-FORMULA-ESP32-PRZYDZIAL-PINOW",
    inputs: { liczbaPrzypisan: value.liczbaPrzypisan, wifiAktywne: input.wifiAktywne ? 1 : 0 },
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  const errors = przypisane.flatMap((p) => (!Number.isInteger(p.gpio) || p.gpio! < 0 ? [gpioNiepoprawny(p.i, p.gpio!)] : []))
  if (errors.length > 0) return wynik("INVALID_INPUT", errors)
  if (przypisane.length === 0) return wynik("INCOMPLETE", [])

  const warnings: Warning[] = []
  const poPinie = new Map<number, typeof przypisane>()
  for (const p of przypisane) poPinie.set(p.gpio!, [...(poPinie.get(p.gpio!) ?? []), p])
  for (const [gpio, lista] of poPinie) {
    if (lista.length < 2) continue
    const funkcje = new Set(lista.map((p) => p.funkcja))
    const wspolna = funkcje.size === 1 && FUNKCJE_WSPOLDZIELONE.includes(lista[0]!.funkcja)
    if (!wspolna) warnings.push(konfliktPinu(gpio, lista.map((p) => `${p.funkcja}${p.opis.trim() ? ` (${p.opis.trim()})` : ""}`).join(", ")))
  }
  value.liczbaKonfliktow = warnings.length
  if (input.wifiAktywne && przypisane.some((p) => p.funkcja === "adc")) warnings.push(adcPrzyWifi())

  return wynik(value.liczbaKonfliktow > 0 ? "VALID_WITH_WARNINGS" : "VALID", warnings)
}
