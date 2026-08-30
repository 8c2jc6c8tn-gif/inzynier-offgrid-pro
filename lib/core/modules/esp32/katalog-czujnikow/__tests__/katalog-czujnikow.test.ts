import { describe, expect, it } from "vitest"
import { calculateKatalogCzujnikow } from "../calculator"

describe("calculateKatalogCzujnikow", () => {
  it("pusty katalog -> INCOMPLETE, 0 instancji", () => {
    const result = calculateKatalogCzujnikow({ instances: [] })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value).toEqual({ liczbaInstancji: 0, liczbaTypowUzytych: 0 })
  })

  it("kilka instancji tego samego typu -> liczba instancji > liczba typów", () => {
    const result = calculateKatalogCzujnikow({
      instances: [
        { id: "1", typeId: "temp-baterii", etykieta: "Ogniwo 1", lokalizacja: "Pakiet A" },
        { id: "2", typeId: "temp-baterii", etykieta: "Ogniwo 2", lokalizacja: "Pakiet A" },
        { id: "3", typeId: "dym-gaz", etykieta: "Czujnik dymu", lokalizacja: "Garaż" },
      ],
    })
    expect(result.status).toBe("VALID")
    expect(result.value).toEqual({ liczbaInstancji: 3, liczbaTypowUzytych: 2 })
  })

  it("każda instancja innego typu -> liczba instancji == liczba typów", () => {
    const result = calculateKatalogCzujnikow({
      instances: [
        { id: "1", typeId: "temp-baterii", etykieta: "a", lokalizacja: "b" },
        { id: "2", typeId: "wiatr", etykieta: "a", lokalizacja: "b" },
      ],
    })
    expect(result.value.liczbaTypowUzytych).toBe(2)
  })
})
