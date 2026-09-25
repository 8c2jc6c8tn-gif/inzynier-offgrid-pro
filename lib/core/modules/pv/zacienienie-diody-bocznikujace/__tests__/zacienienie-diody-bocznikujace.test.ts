import { describe, expect, it } from "vitest"
import { calculateZacienienieDiodyBocznikujace, obliczStrataPaneluPct } from "../calculator"

describe("calculateZacienienieDiodyBocznikujace", () => {
  it("brak zacienienia -> 0% straty, VALID, info", () => {
    const result = calculateZacienienieDiodyBocznikujace({
      mocPaneluNominalnaW: 400,
      liczbaZacienionychSekcji: 0,
      liczbaPaneliWStringu: 6,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.strataPaneluPct).toBe(0)
    expect(result.value.mocPaneluRzeczywistaW).toBe(400)
    expect(result.warnings[0].code).toBe("BRAK-ZACIENIENIA")
  })

  it("przykład źródła: 1 zacieniona sekcja -> strata panelu ok. 33% (dokładnie 33,3%), warning", () => {
    const result = calculateZacienienieDiodyBocznikujace({
      mocPaneluNominalnaW: 400,
      liczbaZacienionychSekcji: 1,
      liczbaPaneliWStringu: 6,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.strataPaneluPct).toBeCloseTo(33.333333333, 6)
    expect(result.value.mocPaneluRzeczywistaW).toBeCloseTo(266.666666667, 6)
    expect(result.warnings[0].code).toBe("ZACIENIENIE-1-SEKCJA")
    expect(result.warnings[0].level).toBe("warning")
  })

  it("przykład źródła: 2 zacienione sekcje -> strata panelu ok. 66% (dokładnie 66,7%), critical", () => {
    const result = calculateZacienienieDiodyBocznikujace({
      mocPaneluNominalnaW: 400,
      liczbaZacienionychSekcji: 2,
      liczbaPaneliWStringu: 6,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.strataPaneluPct).toBeCloseTo(66.666666667, 6)
    expect(result.value.mocPaneluRzeczywistaW).toBeCloseTo(133.333333333, 6)
    expect(result.warnings[0].code).toBe("ZACIENIENIE-2-SEKCJE")
    expect(result.warnings[0].level).toBe("critical")
  })

  it("wszystkie 3 sekcje zacienione -> panel praktycznie zerowy, critical", () => {
    const result = calculateZacienienieDiodyBocznikujace({
      mocPaneluNominalnaW: 400,
      liczbaZacienionychSekcji: 3,
      liczbaPaneliWStringu: 6,
    })
    expect(result.value.strataPaneluPct).toBe(100)
    expect(result.value.mocPaneluRzeczywistaW).toBe(0)
    expect(result.warnings[0].code).toBe("ZACIENIENIE-PELNY-PANEL")
    expect(result.warnings[0].level).toBe("critical")
  })

  it("INCOMPLETE — liczba paneli w stringu jeszcze nie wpisana", () => {
    const result = calculateZacienienieDiodyBocznikujace({
      mocPaneluNominalnaW: 400,
      liczbaZacienionychSekcji: 1,
      liczbaPaneliWStringu: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — liczba zacienionych sekcji poza zakresem (0-3)", () => {
    const result = calculateZacienienieDiodyBocznikujace({
      mocPaneluNominalnaW: 400,
      liczbaZacienionychSekcji: 4,
      liczbaPaneliWStringu: 6,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("INVALID_INPUT — ujemna moc panelu", () => {
    const result = calculateZacienienieDiodyBocznikujace({
      mocPaneluNominalnaW: -400,
      liczbaZacienionychSekcji: 1,
      liczbaPaneliWStringu: 6,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): ZACIENIENIE-1-SEKCJA ma i18nKey+params, assumptions to {kod}", () => {
    const result = calculateZacienienieDiodyBocznikujace({
      mocPaneluNominalnaW: 400,
      liczbaZacienionychSekcji: 1,
      liczbaPaneliWStringu: 6,
    })
    expect(result.warnings[0].i18nKey).toBe("ZACIENIENIE-1-SEKCJA")
    expect(result.warnings[0].params).toEqual({ strata: "33" })
    expect(result.warnings[0].message).toBeUndefined()
    expect(result.assumptions).toEqual([
      { kod: "STRATA-PANELU-3-SEKCJE-FAKT" },
      { kod: "STRATA-STRINGU-NIE-LICZONA", params: { liczbaPaneli: 6 } },
    ])
  })
})

describe("obliczStrataPaneluPct (echo dla M3/E12)", () => {
  it("K5: 0/1/2/3 sekcje → 0 / 33,3 / 66,7 / 100% — ta sama wartość co w wyniku Ekranu 13", () => {
    expect(obliczStrataPaneluPct(0)).toBe(0)
    expect(obliczStrataPaneluPct(1)).toBeCloseTo(33.333, 3)
    expect(obliczStrataPaneluPct(2)).toBeCloseTo(66.667, 3)
    expect(obliczStrataPaneluPct(3)).toBe(100)
    const e13 = calculateZacienienieDiodyBocznikujace({
      mocPaneluNominalnaW: 400,
      liczbaZacienionychSekcji: 1,
      liczbaPaneliWStringu: 6,
    })
    expect(e13.value.strataPaneluPct).toBe(obliczStrataPaneluPct(1))
  })
})
