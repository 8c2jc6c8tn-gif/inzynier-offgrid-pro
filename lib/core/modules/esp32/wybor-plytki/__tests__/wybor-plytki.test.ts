import { describe, expect, it } from "vitest"
import { calculateWyborPlytki } from "../calculator"
import type { WyborPlytkiInput } from "../input"

const BAZA: WyborPlytkiInput = {
  zasilanie: "stale",
  duzoGpio: false,
  antenaZewnetrzna: false,
  mocObliczeniowa: false,
  szybkieAdc: false,
}

describe("calculateWyborPlytki (M9/E1, dawne 11.1)", () => {
  it("bez wybranego zasilania → INCOMPLETE", () => {
    expect(calculateWyborPlytki({ ...BAZA, zasilanie: null }).status).toBe("INCOMPLETE")
  })

  it("praca na baterii → C3 (przykład C źródła)", () => {
    const w = calculateWyborPlytki({ ...BAZA, zasilanie: "bateria" })
    expect(w).toMatchObject({ status: "VALID", value: { rekomendacja: ["c3"] }, warnings: [] })
  })

  it("dużo GPIO przy zasilaniu stałym → DevKit V1 (przykład C źródła)", () => {
    expect(calculateWyborPlytki({ ...BAZA, duzoGpio: true }).value.rekomendacja).toEqual(["devkit-v1"])
  })

  it("zasilanie przez Ethernet → POE; szybsze ADC → S3; antena zewnętrzna → WROOM-32U", () => {
    expect(calculateWyborPlytki({ ...BAZA, zasilanie: "poe" }).value.rekomendacja).toEqual(["poe"])
    expect(calculateWyborPlytki({ ...BAZA, szybkieAdc: true, mocObliczeniowa: true }).value.rekomendacja).toEqual(["s3"])
    expect(calculateWyborPlytki({ ...BAZA, antenaZewnetrzna: true }).value.rekomendacja).toEqual(["wroom-32u"])
  })

  it("bateria + dużo GPIO → remis C3 / DevKit V1 i info: żadna płytka ze źródła nie ma obu cech (status bez zmian)", () => {
    const w = calculateWyborPlytki({ ...BAZA, zasilanie: "bateria", duzoGpio: true })
    expect(w.value.rekomendacja).toEqual(["devkit-v1", "c3"])
    expect(w.status).toBe("VALID")
    expect(w.warnings).toEqual([expect.objectContaining({ code: "ESP-PLYTKA-BRAK-JEDNEJ", level: "info", params: { liczba: 2, pokryte: 1 } })])
  })

  it("zasilanie stałe bez potrzeb → bez rekomendacji, info (źródło nie wskazuje płytki domyślnej)", () => {
    const w = calculateWyborPlytki(BAZA)
    expect(w.value.rekomendacja).toEqual([])
    expect(w.warnings.map((x) => x.code)).toEqual(["ESP-PLYTKA-BEZ-WYMAGAN"])
  })
})
