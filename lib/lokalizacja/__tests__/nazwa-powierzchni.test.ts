import { describe, expect, it } from "vitest"
import { etykietaPowierzchni } from "../nazwa-powierzchni"

const t = (klucz: string, params?: Record<string, string | number>) => `${klucz}|${params?.kierunek ?? ""}`

describe("etykietaPowierzchni", () => {
  it("tłumaczy nazwy generowane, nazwy użytkownika zostawia bez zmian", () => {
    expect(etykietaPowierzchni("Dach wg obrysu budynku", t)).toBe("UI-NAZWAPOW-DACH-OBRYS|")
    expect(etykietaPowierzchni("Elewacja SW", t)).toBe("UI-NAZWAPOW-ELEWACJA|SW")
    expect(etykietaPowierzchni("Elewacja garażu", t)).toBe("Elewacja garażu")
    expect(etykietaPowierzchni("Połać S", t)).toBe("Połać S")
  })
})
