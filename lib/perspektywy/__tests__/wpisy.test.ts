import { existsSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { dictionaries } from "@/lib/i18n/dictionaries"
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/language"
import { WPISY_PERSPEKTYW, kluczeWpisu, znajdzWpisPerspektywy } from "../wpisy"

const korzen = path.resolve(__dirname, "../../..")

describe("perspektywy — wpisy", () => {
  it("ids are unique and each entry has its page", () => {
    const ids = WPISY_PERSPEKTYW.map((w) => w.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(existsSync(path.join(korzen, "app/perspektywy", id, "page.tsx")), id).toBe(true)
  })

  it("every key of every entry is translated in every language", () => {
    for (const wpis of WPISY_PERSPEKTYW) {
      for (const jezyk of SUPPORTED_LANGUAGES) {
        for (const klucz of kluczeWpisu(wpis)) {
          expect(dictionaries[jezyk][klucz], `${jezyk} ${klucz}`).toBeTruthy()
        }
      }
    }
  })

  it("an entry has sources with absolute https links, and an ISO date", () => {
    for (const wpis of WPISY_PERSPEKTYW) {
      expect(wpis.data).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(wpis.zrodla.length).toBeGreaterThan(0)
      for (const zrodlo of wpis.zrodla) expect(zrodlo.href).toMatch(/^https:\/\//)
    }
  })

  it("finds an entry by id", () => {
    expect(znajdzWpisPerspektywy("aircela")?.numerWDokumencie).toBe("P-001")
    expect(znajdzWpisPerspektywy("nie-ma")).toBeUndefined()
  })
})
