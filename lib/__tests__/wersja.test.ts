import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { wersjaZeZnacznikiem } from "../wersja"

const korzen = path.resolve(__dirname, "../..")
const wersjaPakietu = (JSON.parse(readFileSync(path.join(korzen, "package.json"), "utf8")) as { version: string }).version

describe("wersja programu", () => {
  it("is a three-part number", () => {
    expect(wersjaPakietu).toMatch(/^\d+\.\d+\.\d+$/)
  })

  it("matches the newest entry of the version history (a bump without a history entry, or the other way round, fails here)", () => {
    const historia = readFileSync(path.join(korzen, "docs/historia-wersji.md"), "utf8")
    const najnowszy = /^## \[(\d+\.\d+\.\d+)\]/m.exec(historia)?.[1]
    expect(najnowszy).toBe(wersjaPakietu)
  })

  it("every history entry states its impact on the numbers", () => {
    const historia = readFileSync(path.join(korzen, "docs/historia-wersji.md"), "utf8")
    const wpisy = historia.split(/^## \[/m).slice(1)
    expect(wpisy.length).toBeGreaterThan(0)
    for (const wpis of wpisy) expect(wpis).toContain("Wpływ na liczby:")
  })

  it("the stamp shows the version, with the build id in brackets when there is one", () => {
    expect(wersjaZeZnacznikiem()).toMatch(/^[\w.-]+( \([0-9a-f]{7}\))?$/)
  })
})
