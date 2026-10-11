import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { NapiecieZProfilu } from "@/components/napiecie-z-profilu"
import type { ProfilObiektu } from "../profil-obiektu"

let profil: ProfilObiektu | null = null
vi.mock("@/lib/adapters/use-persisted-draft", () => ({ useOdczytDraftu: () => ({ dane: profil, wczytano: true }) }))

afterEach(cleanup)

const kamper24: ProfilObiektu = { rodzaj: "kamper", miesiaceUzytkowania: [], napiecieUkladuV: 24 }

describe("NapiecieZProfilu", () => {
  it("offers the voltage from the site profile and enters it only on click", () => {
    profil = kamper24
    const uzyj = vi.fn()
    render(<NapiecieZProfilu aktualne="" onUzyj={uzyj} />)
    expect(screen.getByText(/napięcie układu 24 V/)).toBeTruthy()
    expect(uzyj).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole("button", { name: "Wpisz 24 V" }))
    expect(uzyj).toHaveBeenCalledWith("24")
  })

  it("renders nothing when the field already holds that value (also typed with a comma)", () => {
    profil = kamper24
    const { container } = render(<NapiecieZProfilu aktualne="24,0" onUzyj={() => {}} />)
    expect(container.textContent).toBe("")
  })

  it("renders nothing for a building, without a chosen voltage or without a profile", () => {
    for (const p of [{ ...kamper24, rodzaj: "budynek" as const }, { ...kamper24, napiecieUkladuV: "" as const }, null]) {
      profil = p
      const { container } = render(<NapiecieZProfilu aktualne="" onUzyj={() => {}} />)
      expect(container.textContent).toBe("")
      cleanup()
    }
  })
})
