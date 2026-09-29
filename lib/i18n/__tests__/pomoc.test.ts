import { describe, expect, it } from "vitest"
import { czesciPomocy, pomoc } from "../pomoc"
import { SUPPORTED_LANGUAGES } from "../language"
import { checkFile } from "../../../scripts/check-pomoc-guard.mjs"

function liscie(obj: unknown, sciezka = ""): [string, unknown][] {
  if (typeof obj !== "object" || obj === null) return [[sciezka, obj]]
  return Object.entries(obj).flatMap(([k, v]) => liscie(v, sciezka ? `${sciezka}.${k}` : k))
}

describe("help content (8.4, D34/D51)", () => {
  it("no screen id is defined in two module files (a spread would silently overwrite it)", () => {
    const ids = czesciPomocy.flatMap((c) => Object.keys(c))
    expect(ids.length).toBe(new Set(ids).size)
  })

  it.each(SUPPORTED_LANGUAGES)("every text in %s is a non-empty string", (lang) => {
    for (const [sciezka, wartosc] of liscie(pomoc[lang])) {
      expect(typeof wartosc, sciezka).toBe("string")
      expect((wartosc as string).trim().length, sciezka).toBeGreaterThan(0)
    }
  })

  it("EN and RU have exactly the Polish keys", () => {
    const klucze = (lang: (typeof SUPPORTED_LANGUAGES)[number]) => liscie(pomoc[lang]).map(([k]) => k).sort()
    expect(klucze("en")).toEqual(klucze("pl"))
    expect(klucze("ru")).toEqual(klucze("pl"))
  })
})

describe("check-pomoc-guard (D51)", () => {
  const plik = "app/kalkulatory/przyklad/page.tsx"

  it("passes a complete screen", () => {
    const src = `
      const [s, setS] = usePersistedDraft("x", {})
      export default () => (<main>
        <NaglowekEkranu tytul="T" ekran="e" />
        <Pole label="A" pomoc={<PomocPola ekran="e" pole="a" />} />
        <label><PomocPola ekran="e" pole="b" /><input type="number" /></label>
      </main>)`
    expect(checkFile(plik, src)).toEqual([])
  })

  it("reports every missing piece", () => {
    const src = `export default () => (<main>
        <NaglowekEkranu tytul="T" />
        <Pole label="A" hint="h" />
        <div><input type="number" /></div>
      </main>)`
    const problemy = checkFile(plik, src).join("\n")
    expect(problemy).toMatch(/bez pomoc=/)
    expect(problemy).toMatch(/ma hint=/)
    expect(problemy).toMatch(/surowe <input> bez <PomocPola>/)
    expect(problemy).toMatch(/<NaglowekEkranu> bez ekran=/)
    expect(problemy).toMatch(/bez usePersistedDraft/)
  })

  it("accepts a documented reason for no autosave", () => {
    const src = `// autosave: nie dotyczy — read-only demo
      export default () => <PoleCheckbox id="x" label="L" />`
    expect(checkFile(plik, src)).toEqual([])
  })
})
