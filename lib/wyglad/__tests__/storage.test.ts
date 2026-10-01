import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { zapiszTryb } from "@/lib/theme/storage"
import { getSnapshot, ustawKolor, ustawPokazUkryteStyle, ustawStyl } from "../storage"

const KLUCZ = "offgrid.wyglad.v1"

function wyczysc() {
  window.localStorage.clear()
  const root = document.documentElement
  root.removeAttribute("style")
  root.removeAttribute("data-styl")
  root.removeAttribute("data-schemat-stylu")
  root.classList.remove("light", "dark", "czcionka-pogrubiona")
}

describe("appearance style in the saved look (lib/wyglad/storage)", () => {
  beforeEach(wyczysc)
  afterEach(wyczysc)

  it("old saved state without a style reads as the default look", () => {
    window.localStorage.setItem(KLUCZ, JSON.stringify({ kolory: {}, czcionka: "inter", waga: "normalna" }))
    expect(getSnapshot().styl).toBeNull()
    expect(getSnapshot().pokazUkryteStyle).toBe(false)
  })

  it("an unknown style id falls back to the default look", () => {
    window.localStorage.setItem(KLUCZ, JSON.stringify({ styl: "beton-mosiadz" }))
    expect(getSnapshot().styl).toBeNull()
  })

  it("choosing a style saves it, marks <html> and forces the style's scheme over the theme mode", () => {
    zapiszTryb("light")
    ustawStyl("grafit-zloto")
    const root = document.documentElement
    expect(JSON.parse(window.localStorage.getItem(KLUCZ)!).styl).toBe("grafit-zloto")
    expect(root.dataset.styl).toBe("grafit-zloto")
    expect(root.classList.contains("dark")).toBe(true)
    expect(root.classList.contains("light")).toBe(false)

    // The theme toggle does not break the style while it is active…
    zapiszTryb("light")
    expect(root.classList.contains("dark")).toBe(true)

    // …and the saved mode comes back with the default look.
    ustawStyl(null)
    expect(root.dataset.styl).toBeUndefined()
    expect(root.classList.contains("light")).toBe(true)
    expect(root.classList.contains("dark")).toBe(false)
  })

  it("a user colour override stays inline on <html>, so it wins over the style", () => {
    ustawStyl("jasny-architektoniczny")
    ustawKolor("akcent", "#123456")
    const root = document.documentElement
    expect(root.dataset.styl).toBe("jasny-architektoniczny")
    expect(root.style.getPropertyValue("--primary")).toBe("#123456")
  })

  it("the hidden-group toggle is saved", () => {
    ustawPokazUkryteStyle(true)
    expect(getSnapshot().pokazUkryteStyle).toBe(true)
    expect(JSON.parse(window.localStorage.getItem(KLUCZ)!).pokazUkryteStyle).toBe(true)
  })
})
