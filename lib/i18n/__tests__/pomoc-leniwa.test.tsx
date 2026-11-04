import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, beforeAll, describe, expect, it } from "vitest"
import { PomocPola } from "@/components/ui/pomoc"
import { pomoc } from "@/lib/i18n/pomoc"

describe("PomocPola loads its help lazily", () => {
  beforeAll(() => {
    // jsdom has no matchMedia; the popup picks its layout from it
    window.matchMedia = ((q: string) => ({
      matches: false, media: q, onchange: null,
      addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
    })) as typeof window.matchMedia
  })
  afterEach(cleanup)

  it("shows a trigger at once and the labelled field help after the module file arrived", async () => {
    render(<PomocPola ekran="mixing-rownolegle" pole="chemia" />)
    // the trigger is there immediately (no layout shift)
    expect(screen.getAllByRole("button").length).toBeGreaterThan(0)
    const nazwa = (pomoc.pl["mixing-rownolegle"].pola as Record<string, { nazwa: string }>).chemia.nazwa
    // after the module resolves the accessible label carries the field name
    const przycisk = await screen.findByRole("button", { name: new RegExp(nazwa.slice(0, 12)) }, { timeout: 5000 })
    expect(przycisk).toBeTruthy()
  })
})
