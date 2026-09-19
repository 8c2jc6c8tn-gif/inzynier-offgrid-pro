import { describe, expect, it } from "vitest"
import { calculateReguRatorPwmMppt } from "../calculator"

describe("calculateReguRatorPwmMppt", () => {
  it("panel 24V do akumulatora 12V -> niezgodność napięć, wymuszony MPPT (dokładnie przykład źródła)", () => {
    const result = calculateReguRatorPwmMppt({
      mocPaneliW: 100,
      napiecieNominalnePaneluV: 24,
      napiecieAkumulatoraV: 12,
    })
    expect(result.value.regulator).toBe("MPPT")
    expect(result.value.niezgodnoscNapiec).toBe(true)
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    const w = result.warnings[0]
    expect(w.code).toBe("NIEZGODNOSC-NAPIEC-PWM")
    expect(w.params).toEqual({ panel: "24", akumulator: "12" })
    expect(w.message).toBeUndefined()
  })

  it("panel 12V, akumulator 12V, moc 100W (poniżej progu 250W) -> PWM wystarczy (przykład źródła)", () => {
    const result = calculateReguRatorPwmMppt({
      mocPaneliW: 100,
      napiecieNominalnePaneluV: 12,
      napiecieAkumulatoraV: 12,
    })
    expect(result.value.regulator).toBe("PWM")
    expect(result.value.niezgodnoscNapiec).toBe(false)
    expect(result.warnings[0].code).toBe("PWM-WYSTARCZY")
  })

  it("panel 24V, akumulator 24V, moc 400W (powyżej progu) -> MPPT opłacalny (przykład źródła: '15% energii')", () => {
    const result = calculateReguRatorPwmMppt({
      mocPaneliW: 400,
      napiecieNominalnePaneluV: 24,
      napiecieAkumulatoraV: 24,
    })
    expect(result.value.regulator).toBe("MPPT")
    expect(result.warnings[0].code).toBe("MPPT-OPLACALNY-PRZY-MOCY")
  })

  it("moc dokładnie na progu (250W) -> MPPT (próg włączny)", () => {
    const result = calculateReguRatorPwmMppt({
      mocPaneliW: 250,
      napiecieNominalnePaneluV: 12,
      napiecieAkumulatoraV: 12,
    })
    expect(result.value.regulator).toBe("MPPT")
  })

  it("napięcie panelu równe napięciu akumulatora -> nie jest to niezgodność", () => {
    const result = calculateReguRatorPwmMppt({
      mocPaneliW: 100,
      napiecieNominalnePaneluV: 48,
      napiecieAkumulatoraV: 48,
    })
    expect(result.value.niezgodnoscNapiec).toBe(false)
  })

  it("moc paneli ujemna -> INVALID_INPUT, bez message", () => {
    const result = calculateReguRatorPwmMppt({
      mocPaneliW: -50,
      napiecieNominalnePaneluV: 12,
      napiecieAkumulatoraV: 12,
    })
    expect(result.status).toBe("INVALID_INPUT")
    const w = result.warnings[0]
    expect(w.i18nKey).toBe("WARTOSC-NIEDODATNIA")
    expect(w.message).toBeUndefined()
  })

  it("napięcie akumulatora=0 (jeszcze nie wpisano) -> INCOMPLETE", () => {
    const result = calculateReguRatorPwmMppt({ mocPaneliW: 100, napiecieNominalnePaneluV: 12, napiecieAkumulatoraV: 0 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("assumptions — PROG-MOC-MPPT-OPLACALNOSC-DOPOWIEDZIANY, bez params, bez message", () => {
    const result = calculateReguRatorPwmMppt({ mocPaneliW: 100, napiecieNominalnePaneluV: 12, napiecieAkumulatoraV: 12 })
    expect(result.assumptions).toEqual([{ kod: "PROG-MOC-MPPT-OPLACALNOSC-DOPOWIEDZIANY" }])
  })
})
