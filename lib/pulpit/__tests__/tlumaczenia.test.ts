import { describe, expect, it } from "vitest"
import { en, pl, ru } from "@/lib/i18n/ui/pulpit-rejestr"
import { KAFLE } from "../registry"
import { kluczEkranu, kluczKafelNazwa, kluczKafelOpis, tekstRejestru } from "../tlumaczenia"

const LANGS: Record<string, Record<string, string>> = { pl, en, ru }

describe("registry translations (lib/i18n/ui/pulpit-rejestr.ts)", () => {
  it("every tile name/description and every screen has a non-empty pl/en/ru text", () => {
    for (const kafel of KAFLE) {
      const klucze = [
        kluczKafelNazwa(kafel.id),
        kluczKafelOpis(kafel.id),
        ...kafel.ekrany.map((e) => kluczEkranu(kafel.id, e.href)),
      ]
      for (const [lang, slownik] of Object.entries(LANGS)) {
        for (const k of klucze) expect(slownik[k]?.trim(), `${lang} ${k}`).toBeTruthy()
      }
    }
  })

  it("the Polish text equals the registry text (registry stays the source of truth)", () => {
    for (const kafel of KAFLE) {
      expect(LANGS.pl![kluczKafelNazwa(kafel.id)]).toBe(kafel.nazwa)
      expect(LANGS.pl![kluczKafelOpis(kafel.id)]).toBe(kafel.opis)
      for (const e of kafel.ekrany) expect(LANGS.pl![kluczEkranu(kafel.id, e.href)]).toBe(e.label)
    }
  })

  it("has no keys beyond the registry, and screen keys are unique within a tile", () => {
    const oczekiwane = new Set<string>()
    for (const kafel of KAFLE) {
      oczekiwane.add(kluczKafelNazwa(kafel.id))
      oczekiwane.add(kluczKafelOpis(kafel.id))
      for (const e of kafel.ekrany) {
        const k = kluczEkranu(kafel.id, e.href)
        expect(oczekiwane.has(k), `duplicate ${k}`).toBe(false)
        oczekiwane.add(k)
      }
    }
    for (const slownik of Object.values(LANGS)) expect(new Set(Object.keys(slownik))).toEqual(oczekiwane)
  })

  it("tekstRejestru falls back to the Polish registry text for an unknown key", () => {
    expect(tekstRejestru("en", "UI-EKRAN-999-BRAK", "Tekst z rejestru")).toBe("Tekst z rejestru")
  })
})
