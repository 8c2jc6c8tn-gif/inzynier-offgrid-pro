import { describe, expect, it } from "vitest"
import { SAMPLE_PROGNOZA_24H } from "@/lib/core/modules/ai/prognozy/constants"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { przesuwanieZadanTool } from "../przesuwanie-zadan-tool"
import { doborZrodelZasilaniaTool } from "../dobor-zrodel-zasilania-tool"

// Control examples are the engines' own (__tests__ next to each engine) — the tools only echo.
describe("przesuwanieZadanTool (M10/E5, dawne 12.10)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia, opis z „Użyj, gdy”", () => {
    expect(przesuwanieZadanTool.operationType).toBe("read")
    expect(przesuwanieZadanTool.requiresConfirmation).toBe(false)
    expect(przesuwanieZadanTool.description).toContain("Użyj, gdy ")
    expect(() => validateAiToolDefinition(przesuwanieZadanTool)).not.toThrow()
  })

  it("pranie 2 kW × 1,5 h do 18:00 → 12:00, całe z PV; zadanie poza oknem → tekst PL", async () => {
    const w = await przesuwanieZadanTool.handler({
      prognoza: SAMPLE_PROGNOZA_24H,
      zadania: [
        { id: "a", nazwa: "Pranie", mocKw: 2, czasTrwaniaH: 1.5, najwczesniejOdH: 8, gotoweDoH: 18 },
        { id: "b", nazwa: "Piec", mocKw: 2, czasTrwaniaH: 3, najwczesniejOdH: 10, gotoweDoH: 12 },
      ],
    })
    expect(w.zadania[0]!.startH).toBe(12)
    expect(w.zadania[0]!.zPvKwh).toBeCloseTo(3, 9)
    expect(w.ostrzezenia).toContain(t("pl", "PRZES-ZADANIE-POZA-OKNEM", { nazwa: "Piec", czas: 3, od: "10:00", do: "12:00" }))
  })
})

describe("doborZrodelZasilaniaTool (M10/E4, dawne 12.7 + 12.8)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(doborZrodelZasilaniaTool.operationType).toBe("read")
    expect(doborZrodelZasilaniaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(doborZrodelZasilaniaTool)).not.toThrow()
  })

  it("PV przy −5 °C, 100 Ah, możliwe 30 A → 10 A, tekst PL ograniczenia", async () => {
    const w = await doborZrodelZasilaniaTool.handler({
      produkcjaPvDostepnaTeraz: true,
      socAktualnyPct: 50,
      socProguKrytycznegoPct: 20,
      prognozaSloncaJutro: false,
      agregatDostepny: false,
      siecDostepna: false,
      taniaTaryfaNocna: false,
      temperaturaOgniwaC: -5,
      pojemnoscAh: 100,
      pradMozliwyA: 30,
    })
    expect(w.zrodlo).toBe("PV")
    expect(w.pradLadowaniaA).toBeCloseTo(10, 9)
    expect(w.ostrzezenia).toContain(t("pl", "AIZR-PRAD-OGRANICZONY", { mozliwy: 30, max: 10, t: -5 }))
  })
})
