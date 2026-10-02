import { describe, expect, it } from "vitest"
import { calculateMontazObudowa } from "../calculator"
import type { MontazObudowaInput } from "../input"

/** Przykład Biblii §9.3: "Obudowa DIN 3-modułowa, IP20. Zachowaj 2 cm odstępu od szyn prądowych." */
const PRZYKLAD: MontazObudowaInput = {
  miejsce: "suche",
  ipKod: 20,
  montaz: "din",
  odstepOdSzynCm: 2,
  wentylacja: true,
  izolacjaOdCzesciPodNapieciem: true,
}

describe("calculateMontazObudowa (M9/E3, dawne 11.3)", () => {
  it("przykład źródła: sucha rozdzielnia, IP20, DIN, 2 cm → VALID, zalecane IP20", () => {
    expect(calculateMontazObudowa(PRZYKLAD)).toMatchObject({ status: "VALID", value: { zalecaneIp: 20, minimalneIp: 20 }, warnings: [] })
  })

  it("brak odpowiedzi → INCOMPLETE (nigdy OK)", () => {
    expect(calculateMontazObudowa({ ...PRZYKLAD, wentylacja: null }).status).toBe("INCOMPLETE")
  })

  it("wilgotne miejsce: IP54 → twardy stop M4/E10 (echo), IP55 → 🟡 zalecane IP65 (echo M12/E23), IP65 → OK", () => {
    const ip54 = calculateMontazObudowa({ ...PRZYKLAD, miejsce: "wilgotne", ipKod: 54 })
    expect(ip54.warnings.map((w) => [w.code, w.level])).toEqual([["IP-PONIZEJ-WYMAGANEGO", "critical"]])
    const ip55 = calculateMontazObudowa({ ...PRZYKLAD, miejsce: "wilgotne", ipKod: 55 })
    expect(ip55.warnings.map((w) => [w.code, w.level])).toEqual([["WMI-WILGOC-ZALECANE-IP65", "warning"]])
    expect(calculateMontazObudowa({ ...PRZYKLAD, miejsce: "wilgotne", ipKod: 65 })).toMatchObject({
      status: "VALID",
      value: { zalecaneIp: 65, minimalneIp: 55 },
    })
  })

  it("odstęp < 2 cm, brak wentylacji → 🟡; brak izolacji → 🔴 (D68); inny montaż → info", () => {
    const w = calculateMontazObudowa({ ...PRZYKLAD, odstepOdSzynCm: 1.5, wentylacja: false, izolacjaOdCzesciPodNapieciem: false, montaz: "inny" })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([
      ["ESP-ODSTEP-OD-SZYN", "warning"],
      ["ESP-OBUDOWA-BEZ-WENTYLACJI", "warning"],
      ["ESP-OBUDOWA-BEZ-IZOLACJI", "critical"],
      ["ESP-MONTAZ-ZALECANY-DIN", "info"],
    ])
  })

  it("tylko info (inny montaż) nie podnosi statusu (Dyrektywa #6); ujemny odstęp → INVALID_INPUT", () => {
    expect(calculateMontazObudowa({ ...PRZYKLAD, montaz: "inny" }).status).toBe("VALID")
    expect(calculateMontazObudowa({ ...PRZYKLAD, odstepOdSzynCm: -1 }).status).toBe("INVALID_INPUT")
  })
})
