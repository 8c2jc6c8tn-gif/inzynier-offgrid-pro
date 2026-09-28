import { describe, expect, it } from "vitest"
import { calculatePowiadomieniaAlarmowe } from "../calculator"
import type { PowiadomieniaAlarmoweInput } from "../input"

const OK: PowiadomieniaAlarmoweInput = {
  maSyrene: true,
  liczbaKontaktow: 2,
  maKamery: true,
  autoWezwanieSluzb: true,
  zgodaNaWezwanieSluzb: true,
}

describe("calculatePowiadomieniaAlarmowe (M8/E10, dawne 12.55)", () => {
  it("syrena, kontakty, kamery, auto-wezwanie ze zgodą → VALID, wezwanie aktywne", () => {
    const w = calculatePowiadomieniaAlarmowe(OK)
    expect(w.status).toBe("VALID")
    expect(w.value).toEqual({ autoWezwanieAktywne: true, liczbaBrakow: 0 })
  })

  it("auto-wezwanie bez zgody → 🔴 i wezwanie NIEaktywne", () => {
    const w = calculatePowiadomieniaAlarmowe({ ...OK, zgodaNaWezwanieSluzb: false })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["ALARM-WEZWANIE-BEZ-ZGODY", "critical"]])
    expect(w.value.autoWezwanieAktywne).toBe(false)
  })

  it("zgoda bez włączonego auto-wezwania → bez ostrzeżenia, nieaktywne", () => {
    const w = calculatePowiadomieniaAlarmowe({ ...OK, autoWezwanieSluzb: false })
    expect(w.warnings).toEqual([])
    expect(w.value.autoWezwanieAktywne).toBe(false)
  })

  it("brak syreny i 0 kontaktów → 2× 🟡; brak kamer → info", () => {
    const w = calculatePowiadomieniaAlarmowe({ ...OK, maSyrene: false, liczbaKontaktow: 0, maKamery: false })
    expect(w.warnings.map((x) => x.level)).toEqual(["warning", "warning", "info"])
    expect(w.value.liczbaBrakow).toBe(2)
  })

  it("brak liczby kontaktów → INCOMPLETE; −1 albo 1,5 → INVALID_INPUT", () => {
    expect(calculatePowiadomieniaAlarmowe({ ...OK, liczbaKontaktow: null }).status).toBe("INCOMPLETE")
    expect(calculatePowiadomieniaAlarmowe({ ...OK, liczbaKontaktow: -1 }).status).toBe("INVALID_INPUT")
    expect(calculatePowiadomieniaAlarmowe({ ...OK, liczbaKontaktow: 1.5 }).status).toBe("INVALID_INPUT")
  })
})
