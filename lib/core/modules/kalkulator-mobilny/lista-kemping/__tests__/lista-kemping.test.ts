import { describe, expect, it } from "vitest"
import { calculateListaKemping } from "../calculator"
import type { ListaKempingInput } from "../input"

const BAZA: ListaKempingInput = {
  osoby: 2,
  sezon: "przejsciowy",
  telefony: 3,
  maPanel: false,
  maUrzadzenia230: false,
  maLodowke: false,
  maOswietlenie: false,
  maRadio: false,
  zaznaczoneIds: [],
}

const KONIECZNE_BAZOWE = ["akumulator", "kable", "bezpieczniki-zapasowe", "ladowarki-usb", "miernik", "gasnica", "tasma-izolacyjna"]

describe("calculateListaKemping (M12/E24, dawne 8.47)", () => {
  it("lista bazowa: konieczne z Biblii §12.35, ładowarki = liczba telefonów, latarki = liczba osób", () => {
    const w = calculateListaKemping(BAZA)
    expect(w.value.pozycje.filter((p) => p.kategoria === "konieczne").map((p) => p.id)).toEqual(KONIECZNE_BAZOWE)
    expect(w.value.pozycje.find((p) => p.id === "ladowarki-usb")!.ilosc).toBe(3)
    expect(w.value.pozycje.find((p) => p.id === "latarki-czolowe")!.ilosc).toBe(2)
    expect(w.warnings.map((x) => x.code)).toEqual(["LKK-GASNICA-MIERNIK"])
  })

  it("profil i sezon dodają pozycje: panel + regulator, przetwornica, lodówka, osłona zimowa", () => {
    const w = calculateListaKemping({ ...BAZA, sezon: "zima", maPanel: true, maUrzadzenia230: true, maLodowke: true })
    const ids = w.value.pozycje.map((p) => p.id)
    expect(ids).toEqual(expect.arrayContaining(["panel", "regulator", "przetwornica", "lodowka", "oslona-zima"]))
    expect(ids).not.toContain("oslona-lato")
    expect(w.value.pozycje.find((p) => p.id === "przetwornica")!.link).toBe("/kalkulatory/przetwornice")
  })

  it("wszystkie konieczne odhaczone → VALID bez ostrzeżeń; bez telefonów brak ładowarek", () => {
    const w = calculateListaKemping({ ...BAZA, telefony: 0, zaznaczoneIds: KONIECZNE_BAZOWE })
    expect(w.value.pozycje.map((p) => p.id)).not.toContain("ladowarki-usb")
    expect(w.value.konieczneZaznaczone).toBe(w.value.konieczneRazem)
    expect(w.status).toBe("VALID")
  })

  it("brak osób lub sezonu → INCOMPLETE; ujemne → INVALID_INPUT", () => {
    expect(calculateListaKemping({ ...BAZA, sezon: null }).status).toBe("INCOMPLETE")
    expect(calculateListaKemping({ ...BAZA, osoby: -1 }).status).toBe("INVALID_INPUT")
  })
})
