import { describe, expect, it } from "vitest"
import { scalSzkic } from "../use-persisted-draft"

describe("scalSzkic (standard 5.5 — stary szkic bez nowego pola)", () => {
  it("nowe pole, którego nie ma w starym szkicu, dostaje wartość początkową, nie undefined", () => {
    const poczatkowy = { moc: "", napiecie: "12", nowePole: "" }
    const staryDraft = { moc: "500", napiecie: "24" } as typeof poczatkowy
    expect(scalSzkic(poczatkowy, staryDraft)).toEqual({ moc: "500", napiecie: "24", nowePole: "" })
  })

  it("wartości zapisane w szkicu mają pierwszeństwo przed początkowymi", () => {
    expect(scalSzkic({ a: "1", b: false }, { a: "2", b: true })).toEqual({ a: "2", b: true })
  })

  it("tablice i wartości proste nie są scalane", () => {
    expect(scalSzkic([1, 2, 3], [4])).toEqual([4])
    expect(scalSzkic("x", "y")).toBe("y")
  })
})
