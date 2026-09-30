import { describe, expect, it } from "vitest"
import { calculateKatalogKomponentow } from "../calculator"
import { KATALOGI_ESP32 } from "../constants"

const inst = (id: string, typeId: string) => ({ id, typeId, etykieta: `E${id}`, lokalizacja: "" })

describe("calculateKatalogKomponentow (M9, Katalogi 1–4)", () => {
  it("pusty katalog → INCOMPLETE", () => {
    expect(calculateKatalogKomponentow({ instances: [] })).toMatchObject({ status: "INCOMPLETE", value: { liczbaInstancji: 0 } })
  })

  it("kilka instancji jednego typu liczy się jako jeden typ", () => {
    const w = calculateKatalogKomponentow({ instances: [inst("1", "ssr"), inst("2", "ssr"), inst("3", "stycznik")] })
    expect(w).toMatchObject({ status: "VALID", value: { liczbaInstancji: 3, liczbaTypowUzytych: 2 } })
  })

  it("katalogi mają liczbę pozycji ze źródła: 6 aktuatorów, 6 protokołów, 4 elementy interfejsu", () => {
    expect([KATALOGI_ESP32.aktuatory.length, KATALOGI_ESP32.protokoly.length, KATALOGI_ESP32["interfejs-lokalny"].length]).toEqual([6, 6, 4])
  })
})
