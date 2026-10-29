import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { ListaEkranowModulu } from "@/components/lista-ekranow-modulu"
import { PolaBudynkuUkryteInfo } from "@/components/pola-budynku-ukryte-info"
import type { ProfilObiektu } from "../profil-obiektu"

let profil: ProfilObiektu | null = null
vi.mock("@/lib/adapters/use-persisted-draft", () => ({ useOdczytDraftu: () => ({ dane: profil, wczytano: true }) }))

afterEach(cleanup)

const profilRodzaju = (rodzaj: ProfilObiektu["rodzaj"]): ProfilObiektu => ({ rodzaj, miesiaceUzytkowania: [] })

describe("ListaEkranowModulu", () => {
  it("for a camper leaves out the fire-vent, escape-door and emergency-light screens and says so", () => {
    profil = profilRodzaju("kamper")
    render(<ListaEkranowModulu kafelId={8} />)
    const adresy = screen.getAllByRole("link").map((a) => a.getAttribute("href"))
    expect(adresy).not.toContain("/kalkulatory/klapy-pozarowe")
    expect(adresy).not.toContain("/kalkulatory/zamki-drzwi-ewakuacyjnych")
    expect(adresy).not.toContain("/kalkulatory/oswietlenie-awaryjne")
    expect(adresy).toContain("/kalkulatory/audyt-pozarowy")
    expect(screen.getByText(/rodzaj obiektu to kamper/)).toBeTruthy()
    expect(adresy).toContain("/ustawienia")
  })

  it("for a shed, a building or no choice lists every screen with no note", () => {
    for (const rodzaj of ["altana-rod", "budynek", ""] as const) {
      profil = profilRodzaju(rodzaj)
      const { unmount } = render(<ListaEkranowModulu kafelId={8} />)
      expect(screen.getAllByRole("link").map((a) => a.getAttribute("href"))).toContain("/kalkulatory/klapy-pozarowe")
      expect(screen.queryByText(/rodzaj obiektu to kamper/)).toBeNull()
      unmount()
    }
  })

  it("hides the building-shell screen of module 1 for a camper", () => {
    profil = profilRodzaju("kamper")
    render(<ListaEkranowModulu kafelId={1} />)
    expect(screen.getAllByRole("link").map((a) => a.getAttribute("href"))).not.toContain("/kalkulatory/orientacja-powierzchni")
  })
})

describe("PolaBudynkuUkryteInfo", () => {
  it("explains why the fields are missing and points to Settings", () => {
    render(<PolaBudynkuUkryteInfo />)
    expect(screen.getByText(/Pola dotyczące budynku są ukryte/)).toBeTruthy()
    expect(screen.getByRole("link").getAttribute("href")).toBe("/ustawienia")
  })
})
