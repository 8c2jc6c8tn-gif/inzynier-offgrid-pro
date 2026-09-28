import { describe, expect, it } from "vitest"
import { calculateArchitekturaKomunikacji } from "../calculator"
import type { PolaczenieEsp32 } from "../input"

const falownik: PolaczenieEsp32 = { nazwa: "Falownik", protokol: "rs485", maTransceiver: true, adres: 1, predkoscBps: 9600 }
const bms: PolaczenieEsp32 = { nazwa: "BMS", protokol: "can", maTransceiver: true, adres: null, predkoscBps: 500000 }
const app: PolaczenieEsp32 = { nazwa: "Aplikacja", protokol: "wifi", maTransceiver: false, adres: null, predkoscBps: null }

describe("calculateArchitekturaKomunikacji (M9/E4, dawne 11.4)", () => {
  it("przykład źródła: RS485 → falownik, CAN → BMS, Wi-Fi → aplikacja, z transceiverami → VALID", () => {
    const w = calculateArchitekturaKomunikacji({ polaczenia: [falownik, bms, app] })
    expect(w.status).toBe("VALID")
    expect(w.value).toEqual({ liczbaPolaczen: 3, liczbaProblemow: 0 })
  })

  it("RS485 bez transceivera → 🔴; CAN bez transceivera → 🟡", () => {
    const w = calculateArchitekturaKomunikacji({ polaczenia: [{ ...falownik, maTransceiver: false }, { ...bms, maTransceiver: false }] })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([
      ["KOM-RS485-BEZ-TRANSCEIVERA", "critical"],
      ["KOM-CAN-BEZ-TRANSCEIVERA", "warning"],
    ])
  })

  it("dwa urządzenia RS485 z adresem 1 i różnymi prędkościami → konflikt adresu + prędkości", () => {
    const w = calculateArchitekturaKomunikacji({ polaczenia: [falownik, { ...falownik, nazwa: "Licznik", predkoscBps: 19200 }] })
    expect(w.warnings.map((x) => x.code)).toEqual(["KOM-KONFLIKT-ADRESU", "KOM-ROZNE-PREDKOSCI"])
    expect(w.warnings[0]!.params).toEqual({ adres: 1, nazwy: "Falownik, Licznik" })
    expect(w.warnings[1]!.params).toEqual({ protokol: "RS485", predkosci: "9600 / 19200" })
  })

  it("Wi-Fi bez transceivera — nie dotyczy; pusta lista → INCOMPLETE; adres 0 → INVALID_INPUT", () => {
    expect(calculateArchitekturaKomunikacji({ polaczenia: [app] }).warnings).toEqual([])
    expect(calculateArchitekturaKomunikacji({ polaczenia: [] }).status).toBe("INCOMPLETE")
    expect(calculateArchitekturaKomunikacji({ polaczenia: [{ ...falownik, adres: 0 }] }).status).toBe("INVALID_INPUT")
  })
})
