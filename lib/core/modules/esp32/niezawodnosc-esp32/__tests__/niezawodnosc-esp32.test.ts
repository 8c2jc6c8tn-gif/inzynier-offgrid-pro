import { describe, expect, it } from "vitest"
import { calculateNiezawodnoscEsp32 } from "../calculator"
import type { NiezawodnoscEsp32Input } from "../input"

const WYLACZONE: NiezawodnoscEsp32Input = {
  kartaSd: false,
  rtc: false,
  podtrzymanieZasilania: false,
  watchdog: false,
  izolacjaGalwaniczna: false,
  ochronaPrzepieciowa: false,
  ota: false,
  redundancjaMasterSlave: false,
  otaPodpis: false,
  otaSumaKontrolna: false,
  otaRollback: false,
}

describe("calculateNiezawodnoscEsp32 (M9/E6, dawne 11.29–11.50)", () => {
  it("nic nie włączone → VALID, 0 funkcji (przełączniki bez oceny obowiązkowości)", () => {
    expect(calculateNiezawodnoscEsp32(WYLACZONE)).toMatchObject({ status: "VALID", value: { liczbaWlaczonych: 0 }, warnings: [] })
  })

  it("OTA bez podpisu → 🔴; bez sumy i rollbacku → 🟡", () => {
    const w = calculateNiezawodnoscEsp32({ ...WYLACZONE, ota: true, watchdog: true })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([
      ["OTA-BEZ-PODPISU", "critical"],
      ["OTA-BEZ-SUMY-KONTROLNEJ", "warning"],
      ["OTA-BEZ-ROLLBACKU", "warning"],
    ])
    expect(w.value.liczbaWlaczonych).toBe(2)
  })

  it("OTA z podpisem, sumą i rollbackiem → VALID; flagi OTA bez włączonego OTA nic nie zmieniają", () => {
    expect(calculateNiezawodnoscEsp32({ ...WYLACZONE, ota: true, otaPodpis: true, otaSumaKontrolna: true, otaRollback: true }).status).toBe("VALID")
    expect(calculateNiezawodnoscEsp32({ ...WYLACZONE, otaPodpis: true }).value.liczbaWlaczonych).toBe(0)
  })
})
