import { describe, expect, it } from "vitest"
import { calculateZamkiDrzwiEwakuacyjnych } from "../calculator"
import type { ZamkiDrzwiEwakuacyjnychInput } from "../input"

const PELNY: ZamkiDrzwiEwakuacyjnychInput = {
  typZamka: "elektromagnetyczny",
  zachowaniePrzyZanikuZasilania: "otwiera",
  maZasilanieAwaryjne: true,
  maPrzyciskEwakuacyjny: true,
  zwalnianiePoAlarmiePozarowym: true,
  maKontaktron: true,
}
const kody = (i: ZamkiDrzwiEwakuacyjnychInput) => calculateZamkiDrzwiEwakuacyjnych(i).warnings.map((w) => w.code)

describe("calculateZamkiDrzwiEwakuacyjnych (M8/E3, dawne 11.51)", () => {
  it("fail-safe + UPS + przycisk + zwolnienie po alarmie + kontaktron → VALID, bez ostrzeżeń", () => {
    const w = calculateZamkiDrzwiEwakuacyjnych(PELNY)
    expect(w.status).toBe("VALID")
    expect(w.value).toEqual({ failSafe: true, liczbaBrakow: 0 })
    expect(w.warnings).toEqual([])
  })

  it("twardy stop źródła: blokuje przy zaniku i brak zasilania awaryjnego → 🔴", () => {
    const w = calculateZamkiDrzwiEwakuacyjnych({ ...PELNY, zachowaniePrzyZanikuZasilania: "blokuje", maZasilanieAwaryjne: false })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings.find((x) => x.code === "ZAMEK-BLOKUJE-BEZ-ZASILANIA-AWARYJNEGO")!.level).toBe("critical")
  })

  it("fail-secure z UPS → tylko 🟡 (zasada fail-safe z sekcji D)", () => {
    const w = calculateZamkiDrzwiEwakuacyjnych({ ...PELNY, zachowaniePrzyZanikuZasilania: "blokuje" })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["ZAMEK-FAIL-SECURE", "warning"]])
  })

  it("fail-safe bez UPS → bez 🔴 (drzwi i tak otwarte przy zaniku)", () => {
    expect(kody({ ...PELNY, maZasilanieAwaryjne: false })).toEqual([])
  })

  it("„nie wiem” liczone jak fail-secure — bez UPS → 🔴 + info", () => {
    expect(kody({ ...PELNY, zachowaniePrzyZanikuZasilania: "nie-wiem", maZasilanieAwaryjne: false })).toEqual([
      "ZAMEK-ZACHOWANIE-NIEZNANE",
      "ZAMEK-BLOKUJE-BEZ-ZASILANIA-AWARYJNEGO",
    ])
  })

  it("brak zwolnienia po alarmie i przycisku → 2× 🟡; brak kontaktronu → info (nie liczony jako brak)", () => {
    const w = calculateZamkiDrzwiEwakuacyjnych({
      ...PELNY,
      zwalnianiePoAlarmiePozarowym: false,
      maPrzyciskEwakuacyjny: false,
      maKontaktron: false,
    })
    expect(w.warnings.map((x) => x.code)).toEqual(["ZAMEK-BRAK-ZWALNIANIA-PO-ALARMIE", "ZAMEK-BRAK-PRZYCISKU", "ZAMEK-BRAK-KONTAKTRONU"])
    expect(w.value.liczbaBrakow).toBe(2)
  })

  it("brak typu zamka albo zachowania → INCOMPLETE", () => {
    expect(calculateZamkiDrzwiEwakuacyjnych({ ...PELNY, typZamka: null }).status).toBe("INCOMPLETE")
    expect(calculateZamkiDrzwiEwakuacyjnych({ ...PELNY, zachowaniePrzyZanikuZasilania: null }).status).toBe("INCOMPLETE")
  })
})
