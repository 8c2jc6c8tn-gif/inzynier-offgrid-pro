import { describe, expect, it } from "vitest"
import { calculateAudytZimowy } from "../calculator"
import type { AudytZimowyInput } from "../input"

const wszystkoGotowe: AudytZimowyInput = {
  pozycje: {
    "test-generatora": "gotowe",
    "test-webasto": "gotowe",
    "przeglad-grzewczej": "gotowe",
    "zapas-paliwa": "gotowe",
    "grzalki-bms": "gotowe",
  },
  zapasPaliwaL: null,
  wymaganyZapasL: null,
}

describe("generalny audyt zimowy (M10/E12, dawne 12.36)", () => {
  it("wszystko gotowe → 5/5, VALID", () => {
    const r = calculateAudytZimowy(wszystkoGotowe)
    expect(r.status).toBe("VALID")
    expect(r.value.gotowe).toBe(5)
    expect(r.value.liczbaPozycji).toBe(5)
  })

  it("przykład źródła: webasto zaplanowany, ale nie wykonany + paliwo poniżej minimum → 3/5, dwa braki", () => {
    const r = calculateAudytZimowy({
      ...wszystkoGotowe,
      pozycje: { ...wszystkoGotowe.pozycje, "test-webasto": "zaplanowane" },
      zapasPaliwaL: 40,
      wymaganyZapasL: 100,
    })
    expect(r.value.gotowe).toBe(3)
    expect(r.value.braki).toEqual(["test-webasto", "zapas-paliwa"])
    expect(r.value.brakPaliwaL).toBe(60)
    expect(r.warnings.map((w) => w.code)).toEqual(["AZIM-TEST-WEBASTO", "AZIM-PALIWA-BRAKUJE"])
    expect(r.status).toBe("VALID_WITH_WARNINGS")
  })

  it("liczby paliwa wygrywają z ręcznym stanem pozycji; „nie dotyczy” nie liczy się do mianownika", () => {
    const r = calculateAudytZimowy({
      ...wszystkoGotowe,
      pozycje: { ...wszystkoGotowe.pozycje, "test-webasto": "nie-dotyczy", "zapas-paliwa": null },
      zapasPaliwaL: 120,
      wymaganyZapasL: 100,
    })
    expect(r.value.liczbaPozycji).toBe(4)
    expect(r.value.gotowe).toBe(4)
    expect(r.value.pozycje.find((p) => p.id === "zapas-paliwa")).toEqual({ id: "zapas-paliwa", stan: "gotowe", zLiczb: true })
    expect(r.value.brakPaliwaL).toBe(0)
  })

  it("pozycja nieoceniona → INCOMPLETE; ujemny zapas → INVALID_INPUT", () => {
    expect(calculateAudytZimowy({ ...wszystkoGotowe, pozycje: { ...wszystkoGotowe.pozycje, "grzalki-bms": null } }).status).toBe(
      "INCOMPLETE",
    )
    expect(calculateAudytZimowy({ ...wszystkoGotowe, zapasPaliwaL: -1 }).status).toBe("INVALID_INPUT")
  })
})
