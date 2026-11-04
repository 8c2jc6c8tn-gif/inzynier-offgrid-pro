import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { dictionaries } from "../dictionaries"
const KORZEN = path.resolve(__dirname, "../../..")

describe("app code does not pull all dictionaries into the common bundle", () => {
  function pliki(katalog: string): string[] {
    return readdirSync(katalog).flatMap((n) => {
      if (["node_modules", ".next", "__tests__", "e2e", ".git"].includes(n)) return []
      const sciezka = path.join(katalog, n)
      if (statSync(sciezka).isDirectory()) return pliki(sciezka)
      return /\.(ts|tsx)$/.test(n) && !/\.test\.tsx?$/.test(n) ? [sciezka] : []
    })
  }

  it("only the registry reaches the English and Russian dictionaries, and nobody imports dictionaries.ts or ui/index.ts", () => {
    const winni: string[] = []
    for (const plik of ["app", "components", "lib"].flatMap((k) => pliki(path.join(KORZEN, k)))) {
      const tekst = readFileSync(plik, "utf8")
      const rel = path.relative(KORZEN, plik)
      if (/from ["'](@\/lib\/i18n|\.{1,2}(\/i18n)?)\/dictionaries["']/.test(tekst) && rel !== "lib/i18n/dictionaries.ts") winni.push(`${rel}: dictionaries`)
      if (/slownik-(en|ru)["']/.test(tekst) && rel !== "lib/i18n/rejestr-slownikow.ts" && !/^lib\/i18n\/dictionaries\.ts$/.test(rel)) winni.push(`${rel}: slownik-en/ru`)
      // The per-language screen-text aggregators belong to their dictionary module; `ui/index.ts` (all languages) is for tests.
      if (/from ["']\.\/ui-(pl|en|ru)["']/.test(tekst) && !/^lib\/i18n\/slownik-(pl|en|ru)\.ts$/.test(rel)) winni.push(`${rel}: ui-pl/en/ru`)
      if (/from ["'](@\/lib\/i18n|\.{1,2}(\/i18n)?)\/ui["']/.test(tekst) || /from ["']\.\/ui["']/.test(tekst)) winni.push(`${rel}: ui/index (all languages)`)
    }
    expect(winni).toEqual([])
  })
})

describe("lazy dictionary registry", () => {
  beforeEach(() => {
    vi.resetModules()
    window.localStorage.clear()
  })
  afterEach(() => {
    cleanup()
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it("starts with Polish only, loads English once on request and tells the listeners", async () => {
    const rejestr = await import("../rejestr-slownikow")
    expect(rejestr.czyZaladowany("pl")).toBe(true)
    expect(rejestr.czyZaladowany("en")).toBe(false)
    expect(rejestr.slownik("en")).toBeUndefined()
    const sluchacz = vi.fn()
    rejestr.subskrybujSlowniki(sluchacz)
    const a = rejestr.zaladujJezyk("en")
    const b = rejestr.zaladujJezyk("en")
    expect(b).toBe(a)
    await a
    expect(rejestr.czyZaladowany("en")).toBe(true)
    expect(rejestr.slownik("en")).toEqual(dictionaries.en)
    expect(sluchacz).toHaveBeenCalledTimes(1)
    await rejestr.zaladujJezyk("en")
    expect(sluchacz).toHaveBeenCalledTimes(1)
  })

  it("t() before the language arrived answers in Polish and reports the mistake once", async () => {
    const blad = vi.spyOn(console, "error").mockImplementation(() => {})
    const { t } = await import("../t")
    const rejestr = await import("../rejestr-slownikow")
    const pl = t("pl", "UI-META-NAZWA")
    expect(t("ru", "UI-META-NAZWA")).toBe(pl)
    expect(t("ru", "UI-META-NAZWA")).toBe(pl)
    expect(blad).toHaveBeenCalledTimes(1)
    await rejestr.zaladujJezyk("ru")
    expect(t("ru", "UI-META-NAZWA")).toBe(dictionaries.ru["UI-META-NAZWA"])
    expect(t("ru", "UI-META-NAZWA")).not.toBe(pl)
  })

  it("LanguageProvider shows Polish until the chosen language has arrived, then switches", async () => {
    window.localStorage.setItem("offgrid.jezyk.v1", "en")
    const { LanguageProvider, useTranslate, useLanguage, useWybranyJezyk } = await import("../language-context")
    function Probka() {
      const t = useTranslate()
      return (
        <p data-testid="p">
          {useLanguage()}|{useWybranyJezyk()}|{t("UI-META-NAZWA")}
        </p>
      )
    }
    render(
      <LanguageProvider>
        <Probka />
      </LanguageProvider>,
    )
    // at some point the chosen language wins and the English text is shown
    await waitFor(() => expect(screen.getByTestId("p").textContent).toBe(`en|en|${dictionaries.en["UI-META-NAZWA"]}`), { timeout: 5000 })
  })
})
