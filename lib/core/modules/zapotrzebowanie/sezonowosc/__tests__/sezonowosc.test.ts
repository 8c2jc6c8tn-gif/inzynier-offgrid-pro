import { describe, expect, it } from "vitest"
import { calculateSezonowosc } from "../calculator"

describe("calculateSezonowosc", () => {
  it("całoroczny — zawsze aktywne", () => {
    const result = calculateSezonowosc({
      zapotrzebowanieKwhDoba: 2,
      typ: "caloroczny",
      miesiacOd: 0,
      miesiacDo: 0,
      aktualnyMiesiac: 0,
      czyWeekend: false,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.aktywne).toBe(true)
    expect(result.value.zapotrzebowanieWliczoneKwhDoba).toBe(2)
  })

  it("weekendowy — aktywne gdy czyWeekend=true", () => {
    const result = calculateSezonowosc({
      zapotrzebowanieKwhDoba: 1.5,
      typ: "weekendowy",
      miesiacOd: 0,
      miesiacDo: 0,
      aktualnyMiesiac: 0,
      czyWeekend: true,
    })
    expect(result.value.aktywne).toBe(true)
    expect(result.value.zapotrzebowanieWliczoneKwhDoba).toBe(1.5)
  })

  it("weekendowy — nieaktywne w tygodniu", () => {
    const result = calculateSezonowosc({
      zapotrzebowanieKwhDoba: 1.5,
      typ: "weekendowy",
      miesiacOd: 0,
      miesiacDo: 0,
      aktualnyMiesiac: 0,
      czyWeekend: false,
    })
    expect(result.value.aktywne).toBe(false)
    expect(result.value.zapotrzebowanieWliczoneKwhDoba).toBe(0)
  })

  it("sezonowy — przykład źródła: klimatyzacja czerwiec(6)-wrzesień(9), lipiec(7) aktywne", () => {
    const result = calculateSezonowosc({
      zapotrzebowanieKwhDoba: 3,
      typ: "sezonowy",
      miesiacOd: 6,
      miesiacDo: 9,
      aktualnyMiesiac: 7,
      czyWeekend: false,
    })
    expect(result.value.aktywne).toBe(true)
    expect(result.value.zapotrzebowanieWliczoneKwhDoba).toBe(3)
  })

  it("sezonowy — poza oknem (grudzień), nieaktywne", () => {
    const result = calculateSezonowosc({
      zapotrzebowanieKwhDoba: 3,
      typ: "sezonowy",
      miesiacOd: 6,
      miesiacDo: 9,
      aktualnyMiesiac: 12,
      czyWeekend: false,
    })
    expect(result.value.aktywne).toBe(false)
    expect(result.value.zapotrzebowanieWliczoneKwhDoba).toBe(0)
  })

  it("sezonowy — okno przez przełom roku (grudzień(12)-luty(2)), styczeń(1) aktywne", () => {
    const result = calculateSezonowosc({
      zapotrzebowanieKwhDoba: 4,
      typ: "sezonowy",
      miesiacOd: 12,
      miesiacDo: 2,
      aktualnyMiesiac: 1,
      czyWeekend: false,
    })
    expect(result.value.aktywne).toBe(true)
  })

  it("sezonowy — okno przez przełom roku, lipiec nieaktywne", () => {
    const result = calculateSezonowosc({
      zapotrzebowanieKwhDoba: 4,
      typ: "sezonowy",
      miesiacOd: 12,
      miesiacDo: 2,
      aktualnyMiesiac: 7,
      czyWeekend: false,
    })
    expect(result.value.aktywne).toBe(false)
  })

  it("INCOMPLETE — sezonowy bez wpisanych miesięcy", () => {
    const result = calculateSezonowosc({
      zapotrzebowanieKwhDoba: 3,
      typ: "sezonowy",
      miesiacOd: 0,
      miesiacDo: 9,
      aktualnyMiesiac: 7,
      czyWeekend: false,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — miesiąc poza zakresem", () => {
    const result = calculateSezonowosc({
      zapotrzebowanieKwhDoba: 3,
      typ: "sezonowy",
      miesiacOd: 13,
      miesiacDo: 9,
      aktualnyMiesiac: 7,
      czyWeekend: false,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
