import { readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { formatujDate, formatujLiczbe } from "../liczby"

describe("formatujLiczbe", () => {
  it("uses the decimal separator of the UI language", () => {
    expect(formatujLiczbe(1.5, "pl")).toBe("1,5")
    expect(formatujLiczbe(1.5, "en")).toBe("1.5")
    expect(formatujLiczbe(1.5, "ru")).toBe("1,5")
  })

  it("passes Intl options through", () => {
    expect(formatujLiczbe(2, "en", { minimumFractionDigits: 2 })).toBe("2.00")
    expect(formatujLiczbe(1234.5678, "pl", { maximumFractionDigits: 1 })).toBe("1234,6")
  })
})

describe("formatujDate", () => {
  it("orders the date parts by the UI language", () => {
    const d = new Date(2026, 9, 18)
    expect(formatujDate(d, "pl")).toBe("18.10.2026")
    expect(formatujDate(d, "en")).toBe("18/10/2026")
  })
})

describe("no hardcoded pl-PL number formatting in screens", () => {
  // Polish-only checklist text (the torque range is part of a Polish data string) and the comment describing the hook.
  const DOZWOLONE = ["lib/core/modules/baterie/moment-dokrecania-srub/constants.ts", "lib/i18n/language-context.tsx"]
  const root = path.resolve(import.meta.dirname, "../../..")
  const pliki = (dir: string): string[] =>
    readdirSync(dir).flatMap((n) => {
      const p = path.join(dir, n)
      if (statSync(p).isDirectory()) return n === "__tests__" || n === "node_modules" ? [] : pliki(p)
      return /\.tsx?$/.test(n) && !/\.test\./.test(n) ? [p] : []
    })

  it('does not call toLocaleString("pl-PL") / toLocaleDateString("pl-PL") outside the allow-list (use useFormatLiczby / formatujDate)', () => {
    const trafienia = ["lib", "app", "components"]
      .flatMap((d) => pliki(path.join(root, d)))
      .filter((p) => !DOZWOLONE.includes(path.relative(root, p)))
      .filter((p) => /toLocale(?:Date)?String\(\s*["']pl-PL["']/.test(readFileSync(p, "utf8")))
      .map((p) => path.relative(root, p))
    expect(trafienia).toEqual([])
  })
})
