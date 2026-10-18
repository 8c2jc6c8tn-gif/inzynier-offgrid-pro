import { describe, expect, it } from "vitest"
import { OBCIAZENIA_PUSTE, PANEL_PUSTY, obciazenieRecznePanelu, panelDoSilnika, warunkiObciazenZFormularza } from "../stan"

describe("warunkiObciazenZFormularza", () => {
  it("nic nie wpisano (albo szkic sprzed tej funkcji) = null; ekspozycja „normalny” sama nie otwiera oceny", () => {
    expect(warunkiObciazenZFormularza(undefined, "rownolegly")).toBeNull()
    expect(warunkiObciazenZFormularza(OBCIAZENIA_PUSTE, "rownolegly")).toBeNull()
  })

  it("teksty z pól stają się liczbami i typami; puste pola to null (nic nie jest uzupełniane)", () => {
    const w = warunkiObciazenZFormularza({ ...OBCIAZENIA_PUSTE, strefaSniegowa: "3", wysokoscNpm: "300", kategoriaTerenu: "II", wysokoscKonstrukcji: "5,5" }, "pochylony-na-konstrukcji")
    expect(w).toEqual({
      strefaSniegowa: 3,
      strefaWiatrowa: null,
      wysokoscNpmM: 300,
      kategoriaTerenu: "II",
      wysokoscKonstrukcjiM: 5.5,
      ekspozycjaSniegu: "normalny",
      montaz: "pochylony-na-konstrukcji",
      typDachu: null,
    })
  })

  it("rodzaj połaci z formularza: tylko dwie znane wartości, reszta to brak wyboru", () => {
    const seed = { ...OBCIAZENIA_PUSTE, strefaWiatrowa: "2" }
    expect(warunkiObciazenZFormularza({ ...seed, typDachu: "dwuspadowy" }, "rownolegly")!.typDachu).toBe("dwuspadowy")
    expect(warunkiObciazenZFormularza({ ...seed, typDachu: "jednospadowy" }, "rownolegly")!.typDachu).toBe("jednospadowy")
    expect(warunkiObciazenZFormularza({ ...seed, typDachu: "czterospadowy" }, "rownolegly")!.typDachu).toBe("czterospadowy")
    expect(warunkiObciazenZFormularza({ ...seed, typDachu: "sciana" }, "rownolegly")!.typDachu).toBe("sciana")
    expect(warunkiObciazenZFormularza({ ...seed, typDachu: "" }, "rownolegly")!.typDachu).toBeNull()
    expect(warunkiObciazenZFormularza({ ...seed, typDachu: "kopulasty" as never }, "rownolegly")!.typDachu).toBeNull()
  })
})

describe("obciążenie panelu ręcznego", () => {
  it("wymaga liczby od przodu; od tyłu opcjonalnie; rodzaj domyślnie testowy", () => {
    expect(obciazenieRecznePanelu({ ...PANEL_PUSTY("p1") })).toBeNull()
    expect(obciazenieRecznePanelu({ ...PANEL_PUSTY("p1"), obcPrzod: "5400" })).toEqual({ przodPa: 5400, tylPa: null, rodzaj: "testowe" })
    expect(obciazenieRecznePanelu({ ...PANEL_PUSTY("p1"), obcPrzod: "3600", obcTyl: "1600", obcRodzaj: "obliczeniowe" })).toEqual({ przodPa: 3600, tylPa: 1600, rodzaj: "obliczeniowe" })
  })

  it("panel z katalogu bierze nośność z katalogu, a ręcznie edytowany (bez katalogId) z pól; nigdy nie miesza", () => {
    const zKatalogu = panelDoSilnika({ ...PANEL_PUSTY("p1"), katalogId: "ja-solar-jam60d41-lb-500", moc: "500", obcPrzod: "1" }, "Panel")!
    expect(zKatalogu.obciazenie).toEqual({ przodPa: 5400, tylPa: 2400, rodzaj: "testowe" })
    const reczny = panelDoSilnika({ ...PANEL_PUSTY("p2"), moc: "400", obcPrzod: "2400" }, "Panel")!
    expect(reczny.obciazenie).toEqual({ przodPa: 2400, tylPa: null, rodzaj: "testowe" })
  })
})
