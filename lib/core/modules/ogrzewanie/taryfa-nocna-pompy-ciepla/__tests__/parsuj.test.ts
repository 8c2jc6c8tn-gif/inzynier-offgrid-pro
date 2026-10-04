import { describe, expect, it } from "vitest"
import { parsujGodzinyStrefy, parsujProfil } from "../parsuj"

describe("taryfa nocna — parsowanie wklejanych pól", () => {
  it("profil: separatory spacja, średnik, nowa linia; przecinek dziesiętny", () => {
    expect(parsujProfil("1 2;3\n4,5")).toEqual({ wartosci: [1, 2, 3, 4.5], blad: false })
    expect(parsujProfil("1 abc").blad).toBe(true)
    expect(parsujProfil("")).toEqual({ wartosci: [], blad: false })
  })

  it("godziny strefy: zakresy przez północ, pojedyncze godziny, kilka zakresów", () => {
    expect(parsujGodzinyStrefy("22-6; 13-15")).toEqual({ godziny: [22, 23, 0, 1, 2, 3, 4, 5, 13, 14], blad: false })
    expect(parsujGodzinyStrefy("22-24, 7")).toEqual({ godziny: [22, 23, 7], blad: false })
    expect(parsujGodzinyStrefy("0-24").blad).toBe(true) // a = b modulo 24 — ambiguous, rejected
    expect(parsujGodzinyStrefy("25").blad).toBe(true)
    expect(parsujGodzinyStrefy("noc").blad).toBe(true)
  })
})
